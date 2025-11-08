---
title: "TypeScript 제네릭 완벽 가이드"
description: "TypeScript의 제네릭을 마스터하여 재사용 가능하고 타입 안전한 코드를 작성하는 방법을 배워봅시다."
pubDate: 2024-10-28
heroImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=600&fit=crop"
category: "튜토리얼"
tags: ["typescript", "제네릭", "타입안전성", "프로그래밍"]
author: "Admin"
draft: false
---

## 제네릭이란?

제네릭(Generics)은 TypeScript에서 재사용 가능한 컴포넌트를 만들 때 사용하는 강력한 도구입니다. 제네릭을 사용하면 다양한 타입에서 작동하는 컴포넌트를 만들 수 있습니다.

## 기본 문법

가장 간단한 제네릭 함수부터 시작해봅시다:

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// 사용 예시
const result1 = identity<string>("hello"); // string
const result2 = identity<number>(42);      // number
const result3 = identity("auto");          // 타입 추론
```

### 타입 변수

`T`는 타입 변수로, 함수를 호출할 때 실제 타입으로 대체됩니다.

## 제네릭 인터페이스

인터페이스에도 제네릭을 사용할 수 있습니다:

```typescript
interface Box<T> {
  value: T;
  getValue: () => T;
}

const numberBox: Box<number> = {
  value: 42,
  getValue: () => 42
};

const stringBox: Box<string> = {
  value: "hello",
  getValue: () => "hello"
};
```

## 제네릭 클래스

클래스에서 제네릭을 사용하면 더욱 강력합니다:

```typescript
class DataStore<T> {
  private data: T[] = [];
  
  add(item: T): void {
    this.data.push(item);
  }
  
  get(index: number): T | undefined {
    return this.data[index];
  }
  
  getAll(): T[] {
    return [...this.data];
  }
}

// 사용 예시
const numberStore = new DataStore<number>();
numberStore.add(1);
numberStore.add(2);
console.log(numberStore.getAll()); // [1, 2]

const userStore = new DataStore<{ name: string; age: number }>();
userStore.add({ name: "Alice", age: 30 });
```

## 제네릭 제약조건

특정 속성을 가진 타입으로만 제한하고 싶을 때 제약조건을 사용합니다:

```typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): void {
  console.log(arg.length);
}

logLength("hello");        // ✅ OK
logLength([1, 2, 3]);      // ✅ OK
logLength({ length: 10 }); // ✅ OK
// logLength(42);          // ❌ Error: number에는 length가 없음
```

## 고급 패턴

### keyof와 함께 사용

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

const name = getProperty(person, "name");   // string
const age = getProperty(person, "age");     // number
// const invalid = getProperty(person, "invalid"); // ❌ Error
```

### 유틸리티 타입 만들기

```typescript
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

interface User {
  id: number;
  name: string;
  email: string;
}

type NullableUser = Nullable<User>;
// {
//   id: number | null;
//   name: string | null;
//   email: string | null;
// }
```

## 실전 예제: API 응답 핸들러

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  const json = await response.json();
  
  return {
    data: json as T,
    status: response.status,
    message: response.statusText
  };
}

// 사용
interface User {
  id: number;
  name: string;
}

const userResponse = await fetchData<User>("/api/user/1");
console.log(userResponse.data.name); // 타입 안전!
```

## 베스트 프랙티스

1. **명확한 타입 변수 이름 사용**
   - `T` (Type), `K` (Key), `V` (Value) 등 관례 따르기

2. **제약조건 적절히 사용**
   - 너무 넓지도, 너무 좁지도 않게

3. **타입 추론 활용**
   - 가능한 경우 명시적 타입 지정 생략

4. **복잡도 관리**
   - 제네릭이 너무 복잡해지면 타입 별칭 사용

## 결론

제네릭은 TypeScript의 핵심 기능입니다. 재사용 가능하고 타입 안전한 코드를 작성하는 데 필수적이며, 마스터하면 코드의 품질과 유지보수성이 크게 향상됩니다.

연습을 통해 제네릭을 자유자재로 다룰 수 있게 되세요! 💪
