# Images 폴더

프로젝트 이미지들이 저장되는 폴더입니다.

## 📁 폴더 구조

```
images/
├── project1/          # 프로젝트1 이미지들
│   ├── thumbnail.jpg  # 썸네일 이미지
│   ├── image1.jpg    # 메인 이미지1
│   ├── image2.jpg    # 메인 이미지2
│   └── image3.jpg    # 메인 이미지3
├── project2/          # 프로젝트2 이미지들
│   ├── thumbnail.jpg
│   ├── image1.jpg
│   ├── image2.jpg
│   └── image3.jpg
└── ...
```

## 🎨 이미지 규격

- **썸네일**: 400x300px (16:9 비율)
- **메인 이미지**: 800x600px (4:3 비율)
- **형식**: JPG, PNG, WebP 지원
- **최적화**: 웹용으로 압축된 이미지 권장

## 📝 사용법

1. 각 프로젝트별로 폴더 생성
2. 썸네일 이미지는 `thumbnail.jpg`로 명명
3. 메인 이미지는 `image1.jpg`, `image2.jpg` 순서로 명명
4. JSON 파일에서 경로 참조: `images/project1/thumbnail.jpg`
