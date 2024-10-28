# Web36-boostproject

## 팀원소개

### 팀원 info

| **이름** | FE/BE | **번호** | **렛미 인트로듀스**                                                                 | **github**                   |
| -------- | ----- | -------- | ----------------------------------------------------------------------------------- | ---------------------------- |
| 김다영   | FE    | J027     | [J027\_김다영](https://www.notion.so/J027_-f94bbd9fb8ce41119334d5b7229690b2?pvs=21) | https://github.com/znero1022 |
| 성유진   | BE    | J136     | [J136\_성유진](https://www.notion.so/J136_-5fa4cdd0695046bbb972d4c0d10d65c6?pvs=21) | https://github.com/jin20fd   |
| 오민택   | BE    | J157     | [J157\_오민택](https://www.notion.so/J157_-5e9746aa49cd4095967ff44a73cebf48?pvs=21) | https://github.com/mintaek22 |
| 장승훈   | BE    | J214     | [J214\_장승훈](https://www.notion.so/J214_-955d4d79a2c84f17a51a38907bdf4b99?pvs=21) | https://github.com/Hoons97   |

<br>

### 이 프로젝트로 꼭 해보고 싶은 경험

- 민택: 데이터로 보여줄수있는 최적화 경험(기승전결이 존재하는 성능 개선)
- 승훈: 클라우드의 다양한 서비스들을 통합해서 구현 - 인프라, CI/CD
- 다영: 리액트를 사용한 프로젝트 완성 경험
- 유진: 한번 하고 다시 안보지 않는 프로젝트 → 테스트코드 작성?

<br>

### 역할분담

- 팀장 : 승훈
- 문서화 담당 : 다영

<br>

## 룰

<details>
<summary>그라운드룰</summary>

### 에티튜드

- 솔직하게 말하기
  - 못 하겠으면 못 하겠다고 말하기
- 약속시간 잘 지키기
  - 지각한 사람이 커피 쏘기
- 슬렉 전체 멘션에는 반드시 답장하기
  - 코어타임 시 30분 내 확인하기
- **10 to 7** 코어타임 엄수!

<br>

### 결정 방법

1. 의견이 갈리면 선 토론
2. 토론 후 투표하기
3. 투표가 동점이 나오는 경우 팀장 or 멘토님 의견에 따르기

<br>

### 스크럼 규칙

- 매일 스크럼 30분
- 스크럼은 짧게 핵심만 말하기

<br>

### 온라인 규칙

- 코어타임 내 줌으로 화면공유

<br>

### 오프라인 규칙

> 오프라인 위치 : https://naver.me/FrllvpCa

- 1주차는 주 4회 만남
- 이후 주 2회 오프라인 → 화, 목

<br>

</details>

<details>
<summary>깃허브 컨벤션</summary>

## 깃허브 컨벤션

### 브랜치 전략

> gitflow 전략을 따른다.

<aside>
✔️

- **master** : 제품으로 출시될 수 있는 브랜치
- **develop** : 다음 출시 버전을 개발하는 브랜치
- **feature** : 기능을 개발하는 브랜치
</aside>

**브렌치 명 컨벤션**

<aside>
✔️

main
dev
dev-be
dev-fe
feature-[be/fe]-[#이슈번호]

</aside>

- 예시
  ```mermaid
  gitGraph
      commit
      branch dev
      checkout dev
      branch dev-be
      branch dev-fe
      checkout dev-be
      branch "feature-be-#1"
      commit
      commit
      checkout dev-be
      merge "feature-be-#1"
      checkout dev
      merge dev-be
      checkout dev-fe
      branch "feature-fe-#2"
      commit
      commit
      checkout dev-fe
      merge "feature-fe-#2"
      checkout dev
      merge dev-fe
      checkout main
      merge dev
  ```

### Commit 네이밍 - Conventional Commits

### 기본 형식

```arduino
<type>[optional scope]: <description>
[optional body]
[optional footer]
```

### 요소 설명

1. **type**: 커밋의 종류를 나타내며, 일반적으로 다음과 같은 타입 사용
   - `feat`: 새로운 기능 추가
   - `fix`: 버그 수정
   - `docs`: 문서 수정
   - `style`: 코드 포맷팅, 세미콜론 누락 등 (로직 변화 없음)
   - `refactor`: 코드 리팩토링 (기능 변화 없음)
   - `test`: 테스트 추가 또는 수정
   - `chore`: 빌드 프로세스 또는 보조 도구 변경
2. **optional scope**: 변경 사항의 범위를 나타냄. (ex. 특정 모듈이나 컴포넌트를 지칭)
3. **description**: 변경 내용을 간결하게 설명. 명령형으로 작성
4. **optional body**: 변경 사항에 대한 자세한 설명을 추가. 복잡한 변경 사항이나 이유 등을 설명
5. **optional footer**: 이곳에는 관련된 이슈 번호나 브레이킹 체인지에 대한 정보를 추가

### PR 형식

- **제목 (필수)**: 변경/추가 사항의 요약
  - `[이슈번호] 제목`
- **설명 (필수)**: 변경/추가 내역 및 설명, 주요 변경 사항, 관련된 Issue 번호
- **스크린샷 또는 데모** (선택 사항)

### 이슈 / PR

**이슈 / PR 단위**

> 이슈 단위로 PR 작성

- PR이 100줄 넘지 않게
- 이슈 단위는 작업시간 기준 6시간

**이슈태그**

- `FE`
- `BE`
- `INFRA`
- `PLAN`
- `BUG`
- `TEST`
- `REFACTOR`
- `DESIGN`

### 코드 리뷰

- 팀원전체가 `승인` 또는 `리뷰`해야 머지가 가능함
  - 기본 : `승인`
  - 필요시 : `리뷰` 진행
- 승인 / 리뷰 제한시간 **24시간**
  - 하루에 한번은 꼭 확인해보기

</details>
