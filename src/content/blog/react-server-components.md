---
title: "React Server Components 심층 분석"
description: "React Server Components가 무엇이고, 어떻게 작동하며, 왜 웹 개발의 미래를 바꿀 수 있는지 알아봅니다."
pubDate: 2024-10-25
heroImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop"
category: "기술"
tags: ["react", "rsc", "웹개발", "성능"]
author: "Admin"
draft: false
---

## React Server Components 소개

React Server Components(RSC)는 React 팀이 개발한 새로운 패러다임으로, 서버에서 렌더링되고 클라이언트로 전송되는 컴포넌트입니다.

### 기존 방식과의 차이점

**전통적인 SSR**
- 서버에서 HTML 생성
- 클라이언트에서 hydration 필요
- 모든 JavaScript를 클라이언트로 전송

**Server Components**
- 서버에서만 실행
- hydration 불필요
- JavaScript가 클라이언트로 전송되지 않음

## 핵심 개념

### Server Components

```jsx
// ServerComponent.server.jsx
async function UserProfile({ userId }) {
  // 서버에서만 실행됨
  const user = await db.users.findById(userId);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

특징:
- 비동기 가능
- 데이터베이스 직접 접근 가능
- 번들 크기에 포함되지 않음
- 이벤트 핸들러 사용 불가

### Client Components

```jsx
// Counter.client.jsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

특징:
- 상태 관리 가능
- 이벤트 핸들러 사용 가능
- 브라우저 API 접근 가능
- 번들에 포함됨

## 실전 예제

### 데이터 페칭

```jsx
// app/page.jsx (Server Component)
async function HomePage() {
  // 병렬로 데이터 페칭
  const [posts, users] = await Promise.all([
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/users').then(r => r.json())
  ]);
  
  return (
    <main>
      <PostList posts={posts} />
      <UserList users={users} />
    </main>
  );
}
```

### 중첩된 레이아웃

```jsx
// app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/dashboard/layout.jsx
async function DashboardLayout({ children }) {
  const user = await getUser();
  
  return (
    <div>
      <Sidebar user={user} />
      <div>{children}</div>
    </div>
  );
}
```

## 성능 이점

### 1. 번들 크기 감소

Server Components는 클라이언트 번들에 포함되지 않습니다:

```jsx
// ❌ 기존: 큰 라이브러리가 클라이언트로 전송됨
import marked from 'marked'; // 50KB

function Article({ content }) {
  return <div dangerouslySetInnerHTML={{ __html: marked(content) }} />;
}

// ✅ RSC: 라이브러리가 서버에서만 실행
import marked from 'marked';

async function Article({ id }) {
  const article = await db.articles.findById(id);
  const html = marked(article.content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

### 2. 빠른 초기 로드

```
전통적 방식:
1. HTML 다운로드
2. JavaScript 다운로드
3. JavaScript 파싱/실행
4. Hydration
5. 인터랙션 가능

RSC:
1. RSC Payload 다운로드
2. 렌더링
3. 인터랙션 가능 (Client Components만)
```

### 3. 자동 코드 분할

```jsx
// Server Component는 자동으로 분할됨
function ProductPage({ productId }) {
  return (
    <>
      <ProductDetails productId={productId} />
      <Reviews productId={productId} />
      <RelatedProducts productId={productId} />
    </>
  );
}
```

## 데이터 페칭 패턴

### 워터폴 방지

```jsx
// ❌ 나쁜 예: 순차적 페칭
async function BadExample() {
  const user = await getUser();
  const posts = await getPosts(user.id);
  const comments = await getComments(posts.map(p => p.id));
  
  return <Content user={user} posts={posts} comments={comments} />;
}

// ✅ 좋은 예: 병렬 페칭
async function GoodExample() {
  const userPromise = getUser();
  const postsPromise = getPosts();
  
  const [user, posts] = await Promise.all([userPromise, postsPromise]);
  
  return <Content user={user} posts={posts} />;
}
```

### Suspense 활용

```jsx
import { Suspense } from 'react';

function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />
      </Suspense>
      <FastComponent />
    </div>
  );
}
```

## 주의사항

### 1. Context 제한

Server Components에서는 Context를 사용할 수 없습니다:

```jsx
// ❌ 작동하지 않음
function ServerComponent() {
  const theme = useContext(ThemeContext); // Error!
  return <div />;
}

// ✅ Client Component에서 사용
'use client';
function ClientComponent() {
  const theme = useContext(ThemeContext); // OK
  return <div />;
}
```

### 2. Props Serialization

Server에서 Client로 전달되는 props는 직렬화 가능해야 합니다:

```jsx
// ❌ 함수는 직렬화 불가능
<ClientComponent onClick={() => {}} />

// ✅ 직렬화 가능한 데이터
<ClientComponent data={{ id: 1, name: "Test" }} />
```

## 마이그레이션 전략

1. **점진적 도입**: 새 페이지부터 RSC로 작성
2. **Client Components 최소화**: 필요한 곳만 'use client' 지시어 사용
3. **데이터 페칭 재구성**: Server Components로 이동
4. **성능 측정**: 번들 크기와 로딩 시간 비교

## 결론

React Server Components는 웹 개발에 혁신을 가져올 기술입니다:

- 더 작은 번들 크기
- 더 빠른 초기 로드
- 더 나은 SEO
- 간단한 데이터 페칭

Next.js 13+에서 이미 사용 가능하며, 다른 프레임워크들도 곧 지원할 예정입니다. 지금이 학습하고 적용할 최적의 시기입니다! 🚀
