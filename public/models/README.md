# Gắn model cá koi của bạn

Thả một file `.glb` vào đúng thư mục này và đặt tên `koi.glb`:

```
public/models/koi.glb
```

Trang tự nhận file, không cần sửa code. Không có file thì nó dùng con cá
dựng bằng shader trong `src/three/Koi.tsx`.

## Model được xử lý sẵn những gì

Model tải trên mạng mỗi cái một hướng, một cỡ, và thường là khối cứng
không có xương. Code trong `src/three/KoiModel.tsx` tự lo:

- Xoay lại cho chiều dài nằm dọc trục Z
- Dời tâm về gốc toạ độ và thu phóng về đúng cỡ
- Chèn công thức sóng vào shader có sẵn của model, nên dù model tĩnh
  nó vẫn uốn mình bơi thay vì trôi như khúc gỗ

## Chỗ tải model miễn phí

- Sketchfab — lọc theo giấy phép **CC-BY** hoặc **CC0**, tải bản `glTF`
- Poly Pizza — phần lớn là CC0
- Quaternius — bộ model low-poly, CC0

Nhớ đọc giấy phép. CC-BY bắt buộc ghi tên tác giả ở đâu đó trên trang.

## Nếu model quá nặng

File `.glb` trên 5MB nên nén lại trước khi dùng:

```
npx gltf-transform optimize koi-goc.glb koi.glb --compress draco
```
