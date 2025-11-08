---
title: "웹 성능 최적화 실전 가이드"
description: "실제 프로젝트에서 적용한 웹 성능 최적화 기법들을 소개합니다. Core Web Vitals 개선부터 번들 크기 최적화까지."
pubDate: 2024-10-15
heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop"
category: "튜토리얼"
tags: ["성능최적화", "웹개발", "lighthouse", "번들링"]
author: "Admin"
draft: false
---

## 성능 측정부터 시작하기

최적화를 시작하기 전에 현재 상태를 정확히 측정해야 합니다.

### Lighthouse 활용

Chrome DevTools의 Lighthouse를 사용하면 쉽게 성능을 측정할 수 있습니다:

```bash
# CLI로 실행
npm install -g lighthouse
lighthouse https://example.com --view
```

주요 지표:
- **FCP** (First Contentful Paint): 첫 콘텐츠가 표시되는 시간
- **LCP** (Largest Contentful Paint): 가장 큰 콘텐츠가 표시되는 시간
- **CLS** (Cumulative Layout Shift): 레이아웃 변경 누적 값
- **FID** (First Input Delay): 첫 상호작용 응답 시간

## 이미지 최적화

### 1. 적절한 포맷 선택

```html
<!-- ❌ 기존: 큰 PNG 사용 -->
<img src="hero.png" alt="Hero" width="1200" height="600" />

<!-- ✅ 개선: WebP + fallback -->
<picture>
  <source srcset="hero.webp" type="image/webp" />
  <source srcset="hero.jpg" type="image/jpeg" />
  <img src="hero.jpg" alt="Hero" width="1200" height="600" />
</picture>
```

### 2. 반응형 이미지

```html
<img
  srcset="
    small.jpg 400w,
    medium.jpg 800w,
    large.jpg 1200w
  "
  sizes="(max-width: 600px) 400px,
         (max-width: 1200px) 800px,
         1200px"
  src="large.jpg"
  alt="Responsive image"
/>
```

### 3. Lazy Loading

```html
<!-- 네이티브 lazy loading -->
<img src="image.jpg" loading="lazy" alt="Lazy loaded" />
```

```javascript
// Intersection Observer를 사용한 커스텀 구현
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});
```

## JavaScript 최적화

### 1. 코드 분할

```javascript
// ❌ 모든 코드를 한 번에 로드
import { Chart } from 'chart.js';
import { DataTable } from 'datatables';

// ✅ 필요할 때만 로드
const loadChart = async () => {
  const { Chart } = await import('chart.js');
  return new Chart(ctx, config);
};

const loadTable = async () => {
  const { DataTable } = await import('datatables');
  return new DataTable(element);
};
```

### 2. Tree Shaking

```javascript
// ❌ 전체 라이브러리 import
import _ from 'lodash';
const unique = _.uniq(array);

// ✅ 필요한 함수만 import
import uniq from 'lodash/uniq';
const unique = uniq(array);
```

### 3. 번들 분석

```bash
# Webpack Bundle Analyzer 설치
npm install --save-dev webpack-bundle-analyzer

# webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

## CSS 최적화

### 1. Critical CSS

```html
<head>
  <!-- Critical CSS 인라인 -->
  <style>
    /* Above-the-fold 스타일 */
    .header { ... }
    .hero { ... }
  </style>
  
  <!-- 나머지 CSS는 비동기 로드 -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
</head>
```

### 2. CSS 최소화

```javascript
// PostCSS + cssnano
module.exports = {
  plugins: [
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
```

### 3. 사용하지 않는 CSS 제거

```bash
# PurgeCSS 사용
npm install --save-dev @fullhuman/postcss-purgecss

# postcss.config.js
module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.html', './src/**/*.js'],
    }),
  ],
};
```

## 폰트 최적화

### 1. FOUT/FOIT 방지

```css
/* font-display 사용 */
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* 또는 optional */
}
```

### 2. Preload

```html
<link
  rel="preload"
  href="/fonts/main.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

### 3. Subsetting

```bash
# pyftsubset 사용 (한글 폰트 최적화)
pyftsubset font.ttf \
  --output-file=font-subset.woff2 \
  --flavor=woff2 \
  --text-file=characters.txt
```

## 네트워크 최적화

### 1. HTTP/2 Push

```
Link: </styles.css>; rel=preload; as=style
Link: </script.js>; rel=preload; as=script
```

### 2. 리소스 힌트

```html
<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="https://api.example.com" />

<!-- Preconnect -->
<link rel="preconnect" href="https://cdn.example.com" />

<!-- Prefetch (낮은 우선순위) -->
<link rel="prefetch" href="/next-page.html" />

<!-- Preload (높은 우선순위) -->
<link rel="preload" href="/critical.js" as="script" />
```

### 3. 캐싱 전략

```javascript
// Service Worker를 이용한 캐싱
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 캐시에 있으면 반환, 없으면 네트워크 요청
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open('v1').then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});
```

## 렌더링 최적화

### 1. Virtual Scrolling

```javascript
// React Virtualized 예시
import { List } from 'react-virtualized';

function VirtualList({ items }) {
  return (
    <List
      width={300}
      height={600}
      rowCount={items.length}
      rowHeight={50}
      rowRenderer={({ index, key, style }) => (
        <div key={key} style={style}>
          {items[index]}
        </div>
      )}
    />
  );
}
```

### 2. Debounce & Throttle

```javascript
// Debounce (마지막 호출만 실행)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle (일정 간격으로 실행)
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 사용 예시
const handleSearch = debounce((query) => {
  // 검색 로직
}, 300);

const handleScroll = throttle(() => {
  // 스크롤 로직
}, 100);
```

### 3. RequestAnimationFrame

```javascript
// ❌ 성능이 좋지 않은 방법
function animate() {
  element.style.transform = `translateX(${position}px)`;
  setTimeout(animate, 16);
}

// ✅ requestAnimationFrame 사용
function animate() {
  element.style.transform = `translateX(${position}px)`;
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

## 측정과 모니터링

### 1. Performance API

```javascript
// Navigation Timing
const perfData = performance.getEntriesByType('navigation')[0];
console.log('DOM 로딩 시간:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
console.log('페이지 로딩 시간:', perfData.loadEventEnd - perfData.loadEventStart);

// Resource Timing
const resources = performance.getEntriesByType('resource');
resources.forEach(resource => {
  console.log(`${resource.name}: ${resource.duration}ms`);
});

// User Timing
performance.mark('myTask-start');
// 작업 수행
performance.mark('myTask-end');
performance.measure('myTask', 'myTask-start', 'myTask-end');
```

### 2. Web Vitals

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 실전 체크리스트

### 빌드 시

- [ ] 프로덕션 빌드 사용
- [ ] 코드 미니파이
- [ ] Tree shaking 활성화
- [ ] Source map 제거 (또는 별도 저장)
- [ ] 번들 크기 분석

### 리소스 로딩

- [ ] 이미지 최적화 (WebP, 압축)
- [ ] Lazy loading 적용
- [ ] Critical CSS 인라인
- [ ] 폰트 최적화
- [ ] 리소스 힌트 사용

### 렌더링

- [ ] Virtual scrolling (긴 리스트)
- [ ] Debounce/Throttle (이벤트 핸들러)
- [ ] RequestAnimationFrame (애니메이션)
- [ ] Layout shift 최소화

### 네트워크

- [ ] HTTP/2 사용
- [ ] Gzip/Brotli 압축
- [ ] CDN 사용
- [ ] 캐싱 전략 수립

## 결과

위 최적화를 적용한 결과:

| 지표 | 최적화 전 | 최적화 후 | 개선율 |
|------|-----------|-----------|--------|
| FCP | 2.1s | 0.8s | 62% ↓ |
| LCP | 4.5s | 1.5s | 67% ↓ |
| TTI | 5.2s | 2.1s | 60% ↓ |
| 번들 크기 | 850KB | 320KB | 62% ↓ |

## 마치며

성능 최적화는 한 번에 끝나는 작업이 아닙니다. 지속적인 측정과 개선이 필요합니다. 

작은 개선부터 시작하되, 항상 측정하고 검증하세요. 숫자로 증명할 수 없는 최적화는 의미가 없습니다! 📊
