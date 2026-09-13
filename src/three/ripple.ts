/**
 * Mô phỏng sóng nước trên GPU bằng phương trình sóng rời rạc.
 *
 * Kết cấu lưu trạng thái trong hai kênh: .r là độ cao mặt nước tại điểm đó,
 * .g là vận tốc theo phương đứng. Mỗi khung hình đọc kết cấu cũ, tính gia tốc
 * từ toán tử Laplace của bốn điểm lân cận rồi ghi sang kết cấu mới.
 * Hai kết cấu đổi vai trò liên tục (ping-pong) vì GPU không cho vừa đọc
 * vừa ghi trên cùng một kết cấu.
 */
export const RIPPLE_SIM = /* glsl */ `
precision highp float;

uniform sampler2D uPrev;
uniform vec2 uTexel;
uniform vec2 uMouse;
uniform vec2 uMousePrev;
uniform float uStrength;
uniform float uRadius;
uniform float uDamping;
uniform float uAspect;
uniform float uTime;

varying vec2 vUv;

// Khoảng cách từ điểm tới đoạn thẳng chuột vừa đi qua.
// Dùng đoạn thẳng thay vì một điểm để lúc rê nhanh vệt sóng vẫn liền,
// không bị đứt thành từng chấm rời.
float distToSegment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float len2 = dot(ab, ab);
  if (len2 < 1e-8) return distance(p, a);
  float h = clamp(dot(p - a, ab) / len2, 0.0, 1.0);
  return distance(p, a + ab * h);
}

void main() {
  vec4 state = texture2D(uPrev, vUv);
  float height = state.r;
  float velocity = state.g;

  float sum =
      texture2D(uPrev, vUv + vec2(uTexel.x, 0.0)).r
    + texture2D(uPrev, vUv - vec2(uTexel.x, 0.0)).r
    + texture2D(uPrev, vUv + vec2(0.0, uTexel.y)).r
    + texture2D(uPrev, vUv - vec2(0.0, uTexel.y)).r;

  // Trung bình lân cận trừ đi chính nó: điểm nào thấp hơn xung quanh
  // thì bị kéo lên, cao hơn thì bị kéo xuống — sóng lan ra từ đó.
  float laplacian = sum * 0.25 - height;

  velocity += laplacian * 0.62;
  velocity *= uDamping;
  height += velocity;

  // Nhân theo tỉ lệ khung hình để vệt chuột tròn chứ không bị kéo dẹt
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  vec2 a = vec2(uMousePrev.x * uAspect, uMousePrev.y);
  vec2 b = vec2(uMouse.x * uAspect, uMouse.y);

  float d = distToSegment(p, a, b);
  height += uStrength * smoothstep(uRadius, 0.0, d);

  // Gợn nền rất nhẹ để mặt nước không bao giờ phẳng lì
  height += sin(vUv.x * 22.0 + uTime * 0.7) * sin(vUv.y * 18.0 - uTime * 0.5) * 0.00035;

  // Ghì biên về 0, nếu không sóng dội lại ở mép trông như trong bể kính
  float edge = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x)
             * smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.94, vUv.y);
  height *= edge;
  velocity *= edge;

  gl_FragColor = vec4(height, velocity, 0.0, 1.0);
}
`

/**
 * Ghép ảnh: lấy ảnh cảnh dưới nước rồi bẻ toạ độ lấy mẫu theo độ dốc
 * của mặt nước — đó chính là hiện tượng khúc xạ. Dốc càng gắt, ảnh
 * bên dưới xê dịch càng nhiều, nên con cá méo đi đúng chỗ có gợn sóng.
 */
export const RIPPLE_COMPOSITE = /* glsl */ `
precision highp float;

uniform sampler2D uScene;
uniform sampler2D uRipple;
uniform vec2 uTexel;
uniform float uRefract;
uniform float uSpecular;
uniform vec3 uTint;

varying vec2 vUv;

void main() {
  float hL = texture2D(uRipple, vUv - vec2(uTexel.x, 0.0)).r;
  float hR = texture2D(uRipple, vUv + vec2(uTexel.x, 0.0)).r;
  float hD = texture2D(uRipple, vUv - vec2(0.0, uTexel.y)).r;
  float hU = texture2D(uRipple, vUv + vec2(0.0, uTexel.y)).r;

  vec2 grad = vec2(hR - hL, hU - hD);

  // Tách kênh màu lệch nhau một chút: nước thật cũng tán sắc nhẹ
  vec2 uv = vUv + grad * uRefract;
  float r = texture2D(uScene, uv + grad * uRefract * 0.14).r;
  vec4 g = texture2D(uScene, uv);
  float b = texture2D(uScene, uv - grad * uRefract * 0.14).b;

  vec3 color = vec3(r, g.g, b);

  // Pháp tuyến mặt nước suy từ độ dốc, dùng để bắt sáng
  vec3 N = normalize(vec3(-grad * 90.0, 1.0));
  vec3 L = normalize(vec3(0.35, 0.65, 0.68));
  float spec = pow(max(dot(N, L), 0.0), 55.0) * uSpecular;

  // Mép sóng ánh lên nhẹ để thấy được vệt tay ngay cả trên vùng nước trống
  float sheen = clamp(length(grad) * 26.0, 0.0, 1.0);

  color += spec;
  color += uTint * sheen * 0.5;

  // Vùng trống vẫn phải trong suốt để nội dung trang phía sau đọc được
  float alpha = clamp(g.a + spec * 0.9 + sheen * 0.22, 0.0, 1.0);

  gl_FragColor = vec4(color, alpha);
}
`

export const FULLSCREEN_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`
