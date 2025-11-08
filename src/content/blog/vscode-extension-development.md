---
title: "VS Code 확장 프로그램 개발 후기"
description: "나만의 VS Code 확장 프로그램을 개발하며 얻은 경험과 교훈을 공유합니다. 개발 과정부터 배포까지의 여정을 담았습니다."
pubDate: 2024-10-20
heroImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop"
category: "후기"
tags: ["vscode", "확장프로그램", "개발후기", "오픈소스"]
author: "Admin"
draft: false
---

## 시작하게 된 계기

개발하면서 반복적으로 하는 작업들이 있었습니다. 특히 코드 스니펫을 정리하고, 템플릿을 적용하는 작업이 번거로웠죠. "이걸 자동화할 수 있지 않을까?"라는 생각에서 VS Code 확장 프로그램 개발을 시작했습니다.

## 개발 과정

### 1단계: 아이디어 구체화

먼저 확장 프로그램이 해결할 문제를 명확히 정의했습니다:

- 자주 사용하는 코드 패턴을 빠르게 생성
- 프로젝트 구조 자동 설정
- 코드 컨벤션 자동 체크

### 2단계: 개발 환경 설정

VS Code Extension 개발을 위한 기본 설정:

```bash
# Yeoman과 VS Code Extension generator 설치
npm install -g yo generator-code

# 새 프로젝트 생성
yo code
```

선택사항:
- TypeScript 사용 ✅
- Git 초기화 ✅
- Webpack 번들링 ✅

### 3단계: 핵심 기능 구현

**Command 등록**

```typescript
// extension.ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'myextension.generateComponent',
    async () => {
      const componentName = await vscode.window.showInputBox({
        prompt: '컴포넌트 이름을 입력하세요',
        placeHolder: 'MyComponent'
      });
      
      if (componentName) {
        await generateComponent(componentName);
        vscode.window.showInformationMessage(
          `${componentName} 생성 완료!`
        );
      }
    }
  );
  
  context.subscriptions.push(disposable);
}
```

**파일 시스템 작업**

```typescript
async function generateComponent(name: string) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('워크스페이스를 열어주세요');
    return;
  }
  
  const componentPath = vscode.Uri.joinPath(
    workspaceFolder.uri,
    'src',
    'components',
    `${name}.tsx`
  );
  
  const content = `
import React from 'react';

interface ${name}Props {
  // props 정의
}

export const ${name}: React.FC<${name}Props> = (props) => {
  return (
    <div>
      {/* ${name} 내용 */}
    </div>
  );
};
`.trim();
  
  await vscode.workspace.fs.writeFile(
    componentPath,
    Buffer.from(content, 'utf8')
  );
  
  // 생성된 파일 열기
  const doc = await vscode.workspace.openTextDocument(componentPath);
  await vscode.window.showTextDocument(doc);
}
```

### 4단계: UI/UX 개선

**TreeView 구현**

```typescript
class ComponentTreeProvider implements vscode.TreeDataProvider<ComponentItem> {
  getTreeItem(element: ComponentItem): vscode.TreeItem {
    return element;
  }
  
  getChildren(element?: ComponentItem): Thenable<ComponentItem[]> {
    if (!element) {
      return Promise.resolve(this.getComponentsList());
    }
    return Promise.resolve([]);
  }
  
  private getComponentsList(): ComponentItem[] {
    // 컴포넌트 목록 반환
    return [
      new ComponentItem('Button', vscode.TreeItemCollapsibleState.None),
      new ComponentItem('Input', vscode.TreeItemCollapsibleState.None),
    ];
  }
}
```

## 겪었던 어려움들

### 1. API 학습 곡선

VS Code API는 방대합니다. 처음에는 어떤 API를 사용해야 할지 막막했습니다.

**해결책**: 
- 공식 문서를 꼼꼼히 읽기
- 유사한 확장 프로그램의 소스 코드 참고
- VS Code 샘플 저장소 활용

### 2. 비동기 처리

파일 시스템 작업이 모두 비동기여서 복잡했습니다.

```typescript
// ❌ 초기 시도 - 동기적으로 생각함
function createFiles() {
  createFile('file1.ts');
  createFile('file2.ts');
  openFile('file1.ts');
}

// ✅ 개선 - 비동기 처리
async function createFiles() {
  await createFile('file1.ts');
  await createFile('file2.ts');
  await openFile('file1.ts');
}
```

### 3. 성능 최적화

초기 버전은 파일이 많을 때 느렸습니다.

**개선 사항**:
- 캐싱 도입
- lazy loading
- 작업을 백그라운드로 이동

```typescript
// 캐싱 예시
class FileCache {
  private cache = new Map<string, FileData>();
  
  async get(path: string): Promise<FileData> {
    if (this.cache.has(path)) {
      return this.cache.get(path)!;
    }
    
    const data = await loadFile(path);
    this.cache.set(path, data);
    return data;
  }
  
  clear() {
    this.cache.clear();
  }
}
```

## 테스트하기

### 단위 테스트

```typescript
// test/suite/extension.test.ts
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('테스트 시작!');
  
  test('컴포넌트 생성 테스트', async () => {
    await vscode.commands.executeCommand(
      'myextension.generateComponent'
    );
    
    // 파일이 생성되었는지 확인
    const files = await vscode.workspace.findFiles(
      '**/components/*.tsx'
    );
    
    assert.ok(files.length > 0);
  });
});
```

## 배포하기

### 1. 패키징

```bash
# vsce 설치
npm install -g @vscode/vsce

# 패키지 생성
vsce package
```

### 2. 마켓플레이스 등록

1. [Visual Studio Marketplace](https://marketplace.visualstudio.com/) 접속
2. Publisher 계정 생성
3. Personal Access Token 발급
4. 확장 프로그램 업로드

```bash
vsce publish
```

### 3. README 작성

좋은 README는 사용자 확보에 중요합니다:

```markdown
# My Extension

## 기능
- ✨ 컴포넌트 자동 생성
- 🎨 커스터마이징 가능한 템플릿
- ⚡ 빠른 코드 스니펫

## 사용법
1. `Ctrl+Shift+P` (또는 `Cmd+Shift+P`)
2. "Generate Component" 입력
3. 컴포넌트 이름 입력

## 설정
...
```

## 배운 점

### 기술적 측면

1. **VS Code API 깊이 이해**
   - Extension Activation
   - Commands와 Events
   - Workspace 관리

2. **TypeScript 활용**
   - 타입 시스템의 중요성
   - 제네릭 활용

3. **비동기 프로그래밍**
   - Promise와 async/await
   - 에러 핸들링

### 비기술적 측면

1. **사용자 피드백의 중요성**
   - GitHub Issues를 통한 소통
   - 사용자 요구사항 반영

2. **문서화의 중요성**
   - 명확한 README
   - 코드 주석
   - 사용 예시

3. **지속적인 유지보수**
   - VS Code 업데이트 대응
   - 버그 수정
   - 기능 개선

## 성과

- **다운로드**: 1,000+ 회
- **평점**: ⭐⭐⭐⭐⭐ 4.5/5.0
- **기여자**: 5명

## 앞으로의 계획

1. 더 많은 템플릿 추가
2. AI 기반 코드 제안 기능
3. 다국어 지원
4. 성능 최적화

## 마치며

확장 프로그램 개발은 생각보다 어렵지 않았습니다. VS Code는 훌륭한 API와 문서를 제공하며, 커뮤니티도 활발합니다.

여러분도 반복적인 작업이 있다면, 확장 프로그램으로 자동화해보세요. 나뿐만 아니라 다른 개발자들에게도 도움이 될 수 있습니다! 🎉

---

**관련 링크**
- [GitHub Repository](https://github.com/yourusername/extension)
- [Marketplace Page](https://marketplace.visualstudio.com/items?itemName=publisher.extension)
- [Documentation](https://code.visualstudio.com/api)
