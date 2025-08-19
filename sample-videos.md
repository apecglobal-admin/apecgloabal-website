# Danh sách các URL video mẫu

Dưới đây là danh sách các URL video mẫu mà bạn có thể sử dụng để thay thế trong component `hero-carousel.tsx`:

## Video từ Google Cloud Storage (đáng tin cậy)

```
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4
```

## Video từ Pexels (cần kiểm tra lại URL)

```
https://www.pexels.com/video/digital-animation-of-a-city-at-night-3129957/
https://www.pexels.com/video/digital-animation-of-a-futuristic-city-3129958/
https://www.pexels.com/video/digital-animation-of-a-futuristic-city-3129959/
```

## Cách sử dụng

Để thay đổi video, hãy cập nhật giá trị của `heroData.videoUrl` trong file `components/hero-carousel.tsx`:

```javascript
const heroData = {
  title: "TẬP ĐOÀN KINH TẾ APEC GLOBAL",
  subtitle: "Thống nhất hệ sinh thái công nghệ, tạo ra tương lai số cho Việt Nam và khu vực",
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Thay đổi URL này
  // ...
}
```

## Lưu ý

- Đảm bảo rằng video có định dạng MP4 để tương thích với hầu hết các trình duyệt
- Nếu bạn muốn sử dụng video của riêng mình, hãy tải lên một dịch vụ lưu trữ video như Cloudinary, AWS S3, hoặc Google Cloud Storage
- Nên sử dụng video có kích thước nhỏ để tránh ảnh hưởng đến hiệu suất trang web