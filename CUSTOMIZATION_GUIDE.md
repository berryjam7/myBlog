# 블로그 커스터마이징 가이드

블로그의 모든 텍스트와 설정을 쉽게 수정할 수 있습니다!

## 🎯 주요 설정 파일

### `src/config.ts` - 전체 블로그 설정

이 파일에서 블로그의 모든 텍스트를 한 번에 관리할 수 있습니다:

```typescript
export const SITE_CONFIG = {
  siteName: "Planetary Pulsar",          // 🔧 블로그 이름
  siteDescription: "기술과 생각을...",   // 🔧 블로그 설명
  
  author: {
    name: "Admin",                        // 🔧 작성자 이름
    email: "your-email@example.com",      // 🔧 이메일
  },
  
  social: {
    github: "https://github.com",         // 🔧 GitHub 링크
    twitter: "https://twitter.com",       // 🔧 Twitter 링크
  },
  
  hero: {
    title: "안녕하세요! 👋",              // 🔧 홈 페이지 제목
    description: "기술과 생각을...",      // 🔧 홈 페이지 설명
    primaryButton: "블로그 둘러보기",     // 🔧 버튼 텍스트
  },
  
  // ... 더 많은 설정
};
```

**수정 방법**: `src/config.ts` 파일을 열고 원하는 값을 변경하세요!

---

## 📝 블로그 포스트 작성

### 1. 새 포스트 만들기

`src/content/blog/` 폴더에 새 `.md` 파일을 생성하세요.

### 2. 템플릿 사용

`example-template.md` 파일을 복사해서 시작하세요:

```bash
cp src/content/blog/example-template.md src/content/blog/my-new-post.md
```

### 3. 포스트 작성

```markdown
---
title: "내 첫 포스트"
description: "포스트 설명"
pubDate: 2025-11-08
category: "기술"
tags: ["astro", "블로그"]
draft: false  # true면 게시 안됨
---

# 제목

여기에 내용을 작성하세요!
```

자세한 내용은 `src/content/blog/README.md`를 참고하세요.

---

## 🎨 페이지별 수정 가이드

### 홈페이지 (`src/pages/index.astro`)
- Hero 섹션 텍스트는 `src/config.ts`에서 수정
- 레이아웃을 변경하려면 파일 직접 수정

### 소개 페이지 (`src/pages/about.astro`)
```astro
<h2>이 블로그는...</h2>
<p>
  여기에 블로그 소개 내용을 작성하세요.
</p>
```

### 네비게이션 메뉴 (`src/config.ts`)
```typescript
export const NAV_ITEMS = [
  { href: "/", label: "홈" },      // 🔧 메뉴 항목 추가/제거
  { href: "/blog", label: "블로그" },
  // ... 더 추가
];
```

---

## 🎨 디자인 변경

### 색상 테마 (`src/styles/global.css`)

```css
:root {
  --primary: #87CEEB;        /* 🔧 메인 색상 */
  --primary-dark: #4682B4;   /* 🔧 진한 색상 */
  /* ... */
}
```

### 다크 모드 색상
```css
[data-theme="dark"] {
  --primary: #5DADE2;        /* 🔧 다크모드 색상 */
  /* ... */
}
```

---

## 📁 주요 폴더 구조

```
src/
├── config.ts              ⭐ 전체 설정 (여기서 텍스트 수정!)
├── content/
│   └── blog/              ⭐ 블로그 포스트 작성
│       ├── README.md      ⭐ 포스트 작성 가이드
│       └── example-template.md
├── pages/
│   ├── index.astro        📄 홈페이지
│   ├── about.astro        📄 소개 페이지 (여기 직접 수정!)
│   └── ...
├── components/            🧩 재사용 컴포넌트
└── styles/
    └── global.css         🎨 스타일 (색상 변경)
```

---

## 🚀 빠른 수정 체크리스트

- [ ] `src/config.ts` - 블로그 이름, 설명, 작성자 정보
- [ ] `src/config.ts` - 소셜 링크 (GitHub, Twitter)
- [ ] `src/config.ts` - 홈페이지 Hero 텍스트
- [ ] `src/pages/about.astro` - 소개 페이지 내용
- [ ] `src/styles/global.css` - 색상 테마 (선택사항)
- [ ] `src/content/blog/` - 샘플 포스트 삭제하고 실제 포스트 작성

---

## 💡 팁

### 텍스트 변경
대부분의 텍스트는 `src/config.ts`에서 관리됩니다. 
여기를 먼저 확인하세요!

### 개발 서버
```bash
npm run dev
```
변경사항을 실시간으로 확인할 수 있습니다.

### 빌드 테스트
```bash
npm run build
```
배포 전에 오류가 없는지 확인하세요.

---

## 🔍 자주 묻는 질문

### Q: 블로그 이름을 변경하려면?
A: `src/config.ts`에서 `siteName`을 수정하세요.

### Q: 메뉴 항목을 추가하려면?
A: `src/config.ts`의 `NAV_ITEMS` 배열에 항목을 추가하세요.

### Q: 소셜 링크를 추가하려면?
A: `src/config.ts`의 `social` 객체에 링크를 추가하고,
   `src/components/Footer.astro`에 아이콘을 추가하세요.

### Q: 포스트가 보이지 않아요
A: `draft: false`로 설정되어 있는지 확인하세요.

---

더 자세한 내용은 프로젝트의 다른 문서를 참고하세요:
- `SETUP_SUMMARY.md` - 전체 프로젝트 구조
- `src/content/blog/README.md` - 포스트 작성 가이드
