# Web36-QLab

<p align="center">
  <img alt="메인 베너" src="https://github.com/user-attachments/assets/d5035970-1271-4989-8894-676bc9c40971">
</p>

<br>

<p align="center">
  <a href="https://www.figma.com/design/HrkHyatNVUWIYhraMrAe7K/Q-Lab-Figma?node-id=0-1&node-type=canvas&t=cqtexfcbQGGHaNiE-0">
    <img src="https://github.com/user-attachments/assets/9513a6ed-d7c2-4473-a3de-e962cda661a0" alt="Group 5" width="200" style="margin-right: 20px;"/>
  </a>
  <a href="https://spiffy-centipede-875.notion.site/Q-Lab-13062570e7c4800289aedbd54ddd23b1?pvs=4">
    <img src="https://github.com/user-attachments/assets/47cae543-4cca-4298-9231-57f1119108ea" alt="Group 6" width="200" style="margin-right: 20px;"/>
  </a>
  <a href="https://docs.google.com/spreadsheets/d/1nS4Tt7UpcixYkp1yjo8RCPS8zYcq20dWPrLYSbetenk/edit?usp=sharing">
    <img src="https://github.com/user-attachments/assets/7473ba79-e838-450b-aadc-b9bcfbdc87c0" alt="Group 4" width="200"/>
  </a>
  <a href="[https://docs.google.com/spreadsheets/d/1nS4Tt7UpcixYkp1yjo8RCPS8zYcq20dWPrLYSbetenk/edit?usp=sharing](http://223.130.155.9)">
    <img src="https://github.com/user-attachments/assets/8c39c3f7-4d85-4707-8e45-c4e5d1d9e2d0" alt="Group 8" width="200"/>
  </a>
</p>

<br>
<br>

## 문제의식
```
쉽고 빠르게 쿼리를 연습할 수 없을까? 🤔
Query를 연습하고 싶은데, DB 환경세팅이 너무 어렵고 많은 시간이 소요되네...
```
- 조건에 맞는 300만건의 데이터는 어떻게 생성하지? (복잡한 프로시저 작성, js코드 구현하여 작업)
- 쿼리만 빠르데 실행하고 싶은데 복잡한 DB 환경세팅에 너무 많은 시간이 소요됨
- 이전에 실행한 쿼리들의 시간을 비교하는게 어려움

<br>
<br>

## 핵심 기능

### 환경세팅 없이 빠르고 편하게 쿼리를 실행해보세요.
> 클라우드 상에서 사용자에게 DB 환경을 제공하고 관리해요.
- 쉘 단위로 쿼리를 작성하고 실행해서 결과를 볼 수 있어요.
- 생성된 테이블은 우측 창에서 정보를 실시간으로 확인할 수 있어요.

![쿼리 실행 : 테이블 보기](https://github.com/user-attachments/assets/1c87bdfb-ecf9-43c6-84b5-28cd6365393b)



<br>
<br>

### 테이블 생성/수정 쿼리를 간편하게 만들어보세요.
> 테이블을 GUI를 통해 조작해 손쉽게 테이블 생성/수정 쿼리를 만들 수 있어요.

![테이블 생성 수정 쿼리 만들기](https://github.com/user-attachments/assets/c18e9631-90a1-4295-b32c-c0a74eadcfff)


<br>
<br>

### 랜덤 레코드를 쉽게 추가해보세요.
> 레코드 조건을 설정하면, 해당 설정에 맞는 대량의 레코드를 간편하게 추가할 수 있어요.

![랜덤 데이터 추가](https://github.com/user-attachments/assets/219b7fe9-6daa-45e1-b493-2fa53be9411a)


<br>
<br>

### 예시 쿼리를 추가할 수 있어요.
> 쿼리를 잘 몰라도, 간편하게 예시 쿼리를 추가할 수 있어요.

![예시 쿼리 넣기](https://github.com/user-attachments/assets/2c1a2eae-fec5-4e17-ac07-3ada90800044)


<br>
<br>

## 핵심경험 (FE)
> 안녕하세요, Q-Lab 프로젝트의 유일한 프론트엔드 개발자 김다영입니다! 핵심 경험은 아래 랑크에서 상세하게 확인 가능합니다.  
> [FE 프로젝트 핵심 경험(김다영)](https://github.com/boostcampwm-2024/web36-QLab/wiki/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%ED%95%B5%EC%8B%AC-%EA%B2%BD%ED%97%98-%E2%80%90-%EA%B9%80%EB%8B%A4%EC%98%81(FE))

<br>
<br>

### 점멸하는 쉘 
> 부모에서 포커스 상태를 관리하자 자식 컴포넌트 전체가 리렌더링되어 깜빡이는 현상 발생  
> [상태는 대체 어디에…](https://github.com/boostcampwm-2024/web36-QLab/wiki/%EC%83%81%ED%83%9C%EB%8A%94-%EB%8C%80%EC%B2%B4-%EC%96%B4%EB%94%94%EC%97%90%E2%80%A6)

리액트를 처음 사용하면서 가장 어려웠던 점은 상태를 어디에 배치해야하는지 고민하는 것이었습니다.  
처음에는 상태에 접근하기 쉽게 부모에 상태를 주는 경우가 많았는데요.  
그중에 대표적인 사례는 각 쉘 즉 인풋 컴포넌트의 포커스 여부를부모 컴포넌트에 줬던 경험이었습니다.  
이 경우 부모 상태가 변경되면 모든 자식 쉘이 리랜더링되면서 깜빡이는 현상이 발생했습니다.   
이에 해당 상태를 각 쉘에게 부여하는 방식으로 수정했습니다.  

<img width="883" alt="스크린샷 2024-12-05 오후 1 41 20" src="https://github.com/user-attachments/assets/ea46dcd4-4962-4534-8eee-2b08b0b8c240">

<br>
<br>

### 수많은 입력 관리
> 저희 서비스 기능에는 입력이 많습니다. 이 많은 입력을 어떻게 받아올 것인가 고민이 많았습니다.

![스크린샷 2024-12-04 오후 11 12 28](https://github.com/user-attachments/assets/8ff9db64-b7a4-4e16-af12-74ccd914fd57)

<br>
<br>

서버에서 받아온 정보를 기반으로 입력창이 바뀌어야 했기에,  
먼저 서버로부터 받은 테이블 데이터를 가공해서 response 형식에 맞는 데이터로 변경해 줬습니다.  

<img width="857" alt="스크린샷 2024-12-05 오후 1 45 37" src="https://github.com/user-attachments/assets/a2a71f7c-c2eb-4b8b-a65a-345346fe7779">

<br>
<br>

그리고 변경한 response 형식의 객체를 기반으로 입력폼을 만들었습니다. 

```tsx
{fields?.map((fieldData, rowIdx) => (
  <TableRow key={fieldData.id}>
    <TableCell>{fieldData.name}</TableCell>
    <TableCell className="flex items-center">
      <Controller
        name={`columns.${rowIdx}.blank`}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            placeholder="0"
            className="mr-2 h-8 w-12 p-1"
            value={field.value || ''}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />
      <span>%</span>
    </TableCell>
  </TableRow>
))}

```

이후에 hook form과 zod를 같이 사용하여 백엔드와 스키마를 공유하고 유저 입력을 검증했는데요.
검증을 생각하지 않고 다 구현하고 스키마랑 연동했더니 무수히 많은 타입에러가 발생했습니다.
입력이 있으면 무조건 검증 로직을 고려해야한다는 것을 깨달았습니다.



<br>
<br>

## 핵심경험 (BE)
[BE 프로젝트 핵심 경험(성유진)](https://github.com/boostcampwm-2024/web36-QLab/wiki/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%ED%95%B5%EC%8B%AC-%EA%B2%BD%ED%97%98-%E2%80%90-%EC%84%B1%EC%9C%A0%EC%A7%84(BE))

[BE 프로젝트 핵심 경험(오민택)](https://github.com/boostcampwm-2024/web36-QLab/wiki/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%ED%95%B5%EC%8B%AC-%EA%B2%BD%ED%97%98%E2%80%90%EC%98%A4%EB%AF%BC%ED%83%9D(BE))

[BE 프로젝트 핵심 경험(장승훈)](https://github.com/boostcampwm-2024/web36-QLab/wiki/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%ED%95%B5%EC%8B%AC-%EA%B2%BD%ED%97%98%E2%80%90%EC%9E%A5%EC%8A%B9%ED%9B%88(BE))

### 주요 기능 구현 방법
[사용자의 쿼리 실행 환경은 어떻게 관리되나요?](https://github.com/boostcampwm-2024/web36-QLab/wiki/%EC%82%AC%EC%9A%A9%EC%9E%90%EC%9D%98-%EC%BF%BC%EB%A6%AC-%EC%8B%A4%ED%96%89%ED%99%98%EA%B2%BD%EC%9D%80-%EC%96%B4%EB%96%BB%EA%B2%8C-%EA%B4%80%EB%A6%AC%EB%90%98%EB%82%98%EC%9A%94%3F)

> 세션을 통한 DB Connection 관리하는 법  
> 응답되는 쿼리 실행 시간 측정 방법
  
[유저의 무한한 데이터삽입은 어떻게 제한시키나요?](https://github.com/boostcampwm-2024/web36-QLab/wiki/%EC%9C%A0%EC%A0%80%EC%9D%98-%EB%AC%B4%ED%95%9C%ED%95%9C-%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%82%BD%EC%9E%85%EC%9D%80-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%A0%9C%ED%95%9C%EC%8B%9C%ED%82%A4%EB%82%98%EC%9A%94%3F)

> 한정된 스토리지 속 유저 데이터 삽입 제한 방법  
> Redis pub/sub 이용하기

  
[대용량 랜덤 데이터는 어떻게 삽입되나요?](https://github.com/boostcampwm-2024/web36-QLab/wiki/%EB%8C%80%EC%9A%A9%EB%9F%89-%EB%9E%9C%EB%8D%A4-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%82%BD%EC%9E%85%EB%90%98%EB%82%98%EC%9A%94%3F)

> 대용량 데이터를 빠르게 삽입하는 방법



### 트러블 슈팅

[인프라는 어떻게 관리 했나요?](https://github.com/boostcampwm-2024/web36-QLab/wiki/%EC%9D%B8%ED%94%84%EB%9D%BC%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EA%B4%80%EB%A6%AC%ED%96%88%EB%82%98%EC%9A%94%3F)

> 원활한 서비스를 위한 인프라 관리방법

[유저에게 더 좋은 쿼리 실행 환경을 제공할 수 있도록 with 부하테스트](https://github.com/boostcampwm-2024/web36-QLab/wiki/%EC%9C%A0%EC%A0%80%EC%97%90%EA%B2%8C-%EB%8D%94-%EC%A2%8B%EC%9D%80-%EC%BF%BC%EB%A6%AC-%EC%8B%A4%ED%96%89-%ED%99%98%EA%B2%BD%EC%9D%84-%EC%A0%9C%EA%B3%B5%ED%95%A0-%EC%88%98-%EC%9E%88%EB%8F%84%EB%A1%9D-with-%EB%B6%80%ED%95%98%ED%85%8C%EC%8A%A4%ED%8A%B8)

> 제한된 서버 환경에서도 최대한 독립적인 실행 환경을 제공하기 위한 개선 과정

[인터셉터로 관심사 분리하기](https://github.com/boostcampwm-2024/web36-QLab/wiki/%EC%9D%B8%ED%84%B0%EC%85%89%ED%84%B0%EB%A1%9C-%EA%B4%80%EC%8B%AC%EC%82%AC-%EB%B6%84%EB%A6%AC%ED%95%98%EA%B8%B0)

> 인터셉터를 이용하여 유저 DB 커넥션 관리 코드 개선

[세션을 관리하기 위해서 Redis 활용하기](https://github.com/boostcampwm-2024/web36-QLab/wiki/%EC%84%B8%EC%85%98%EC%9D%84-%EA%B4%80%EB%A6%AC%ED%95%98%EA%B8%B0-%EC%9C%84%ED%95%B4%EC%84%9C-Redis-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0)

> Redis를 이용하여 체계적으로 세션 관리하기

[jest로 도전한 NestJS 인터셉터 통합테스트](https://github.com/boostcampwm-2024/web36-QLab/wiki/jest%EB%A1%9C-%EB%8F%84%EC%A0%84%ED%95%9C-NestJS-%EC%9D%B8%ED%84%B0%EC%85%89%ED%84%B0-%ED%86%B5%ED%95%A9%ED%85%8C%EC%8A%A4%ED%8A%B8)

> 의미있게 통합테스트 작성하기


## 기술 스택

| **분류**        | **기술 스택**                                                                                                                                                                                                                                                                                                                                                                   |
|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **공통**         | <img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"/>                                                                                                                                                                                                                                                                |
| **프론트 엔드**  | <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=Tailwind CSS&logoColor=white"/> <img src="https://img.shields.io/badge/React%20Query-FF4154?style=flat-square&logo=React%20Query&logoColor=white"/> <br> <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=white"/> <img src="https://img.shields.io/badge/Shadcdn-FF6F61?style=flat-square&logo=Cloudflare&logoColor=white"/> |
| **백엔드**       | <img src="https://img.shields.io/badge/Nest.js-E0234E?style=flat-square&logo=NestJS&logoColor=white"/> <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white"/> <img src="https://img.shields.io/badge/TypeORM-FF5847?style=flat-square&logo=TypeORM&logoColor=white"/> <br> <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white"/> <img src="https://img.shields.io/badge/Jenkins-D24939?style=flat-square&logo=Jenkins&logoColor=white"/> <br> <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/> <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=Redis&logoColor=white"/> <img src="https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=Swagger&logoColor=black"/> |


<br>
<br>

## 아키텍처 구조
<img width="2304" alt="QLab architecture" src="https://github.com/user-attachments/assets/dc1e1a29-b9fa-47ad-8c58-df591ed922b7">

<br>
<br>

## 팀원소개 (Query Squard)

<div align="center">

| <img src="https://github.com/user-attachments/assets/60c981a9-26ca-4cf0-b812-968a8608ed92" width="150"> | <img src="https://github.com/user-attachments/assets/23b7d31f-6a21-4f48-9c95-8141f3a4d293" width="150"> | <img src="https://github.com/user-attachments/assets/320144f5-b71c-481c-8932-f0ab1fc94a42" width="150"> | <img src="https://github.com/user-attachments/assets/f591796d-d210-4069-b8df-b4d73314519d" width="150"> |
| :---: | :---: | :---: | :---: |
| [J027\_김다영](https://www.notion.so/J027_-f94bbd9fb8ce41119334d5b7229690b2?pvs=21) | [J157\_오민택](https://www.notion.so/J157_-5e9746aa49cd4095967ff44a73cebf48?pvs=21) | [J214\_장승훈](https://www.notion.so/J214_-955d4d79a2c84f17a51a38907bdf4b99?pvs=21) | [J136\_성유진](https://www.notion.so/J136_-5fa4cdd0695046bbb972d4c0d10d65c6?pvs=21) |
| FE | BE | BE | BE |

</div>

<br>
<br>
