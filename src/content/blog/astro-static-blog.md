---
title: "Astro로 정적 블로그 만들기"
description: "Astro를 사용하여 빠르고 효율적인 정적 블로그를 구축하는 방법을 알아봅니다. SEO 최적화와 성능 향상을 위한 모범 사례를 소개합니다."
pubDate: 2024-11-01
heroImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop"
category: "기술"
tags: ["astro", "웹개발", "정적사이트", "seo"]
author: "Admin"
draft: false
---

## Astro란?

Astro는 콘텐츠 중심의 웹사이트를 구축하기 위한 현대적인 웹 프레임워크입니다. 정적 사이트 생성을 기본으로 하며, 필요한 경우에만 JavaScript를 전송하는 독특한 접근 방식을 사용합니다.

### 주요 특징

1. **Zero JavaScript by Default**: 기본적으로 클라이언트에 JavaScript를 전송하지 않습니다
2. **Component Islands**: 필요한 곳에만 interactivity를 추가할 수 있습니다
3. **Framework Agnostic**: React, Vue, Svelte 등 다양한 프레임워크를 함께 사용할 수 있습니다

## 블로그 시작하기

Astro로 블로그를 시작하는 것은 매우 간단합니다:

```bash
# 새 프로젝트 생성
npm create astro@latest

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 콘텐츠 컬렉션 설정

Astro의 Content Collections는 타입 안전한 방식으로 마크다운 콘텐츠를 관리할 수 있게 해줍니다:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

## SEO 최적화

Astro는 SEO에 매우 유리합니다:

- 정적 HTML 생성으로 빠른 페이지 로드
- 자동 sitemap 생성
- RSS 피드 지원
- Open Graph 메타 태그 쉽게 추가

```astro
---
// 컴포넌트에서 SEO 태그 추가
const { title, description } = Astro.props;
---

<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
</head>
```

## 성능 최적화

### 이미지 최적화

Astro의 `<Image>` 컴포넌트를 사용하면 자동으로 이미지를 최적화할 수 있습니다:

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/image.jpg';
---

<Image src={myImage} alt="Description" />
```

### 코드 분할

Astro는 자동으로 코드를 분할하여 필요한 JavaScript만 로드합니다.

## 결론

Astro는 블로그를 구축하기에 완벽한 선택입니다. 빠른 성능, 뛰어난 개발자 경험, 그리고 강력한 SEO를 제공합니다.

다음 프로젝트에 Astro를 사용해보세요! 🚀
