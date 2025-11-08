# 블로그 포스트 작성 가이드

이 폴더에 마크다운(`.md`) 파일을 생성하여 블로그 포스트를 작성하세요.

## 📝 포스트 작성 예시

파일명: `my-first-post.md`

```markdown
---
title: "블로그 포스트 제목"
description: "포스트에 대한 간단한 설명 (SEO에 사용됩니다)"
pubDate: 2025-11-08
heroImage: "/images/hero.jpg"  # 선택사항
category: "카테고리명"
tags: ["태그1", "태그2", "태그3"]
author: "작성자명"
draft: false  # true로 설정하면 게시되지 않습니다
---

## 소제목

여기에 본문 내용을 작성하세요.

### 코드 블록 예시

\`\`\`typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

### 이미지

![이미지 설명](/images/example.jpg)

### 리스트

- 항목 1
- 항목 2
- 항목 3
```

## 📋 프론트매터 필드 설명

### 필수 필드
- **title**: 포스트 제목
- **description**: 포스트 요약 (150자 이내 권장)
- **pubDate**: 발행일 (YYYY-MM-DD 형식)
- **category**: 카테고리 (하나만 선택)
- **tags**: 태그 배열 (여러 개 가능)

### 선택 필드
- **heroImage**: 대표 이미지 URL (없으면 기본 이미지 사용)
- **updatedDate**: 수정일 (YYYY-MM-DD 형식)
- **author**: 작성자명 (기본값: "Admin")
- **draft**: 초안 여부 (true면 게시되지 않음, 기본값: false)

## 💡 카테고리 예시
- "기술"
- "튜토리얼"
- "후기"
- "일상"
- "개발"
- "디자인"

## 🏷️ 태그 예시
- "javascript"
- "typescript"
- "react"
- "astro"
- "웹개발"
- "프로그래밍"
- "튜토리얼"
- "성능최적화"

## 📁 이미지 사용

이미지는 `public/images/` 폴더에 저장하고 다음과 같이 사용하세요:

```markdown
![이미지 설명](/images/your-image.jpg)
```

## 🎨 마크다운 문법

### 강조
- **굵게**: `**텍스트**`
- *기울임*: `*텍스트*`
- ~~취소선~~: `~~텍스트~~`

### 링크
`[링크 텍스트](https://example.com)`

### 인용구
```markdown
> 인용문 내용
```

### 코드
- 인라인: \`code\`
- 블록: \`\`\`언어\n코드\n\`\`\`

---

새 포스트를 작성한 후 `npm run dev`로 확인하고,
`npm run build`로 빌드하세요!
