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
</p>

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

## 문제의식
```
쉽고 빠르게 쿼리를 연습할 수 없을까? 🤔
Query를 연습하고 싶은데, DB 환경세팅이 너무 어렵고 많은 시간이 소요되네...
```

_예시 시나리오: 호눅스님이 300만건의 유저데이터를 넣어 검색 쿼리의 성능을 비교해보라고 하셨다._
- 조건에 맞는 300만건의 데이터는 어떻게 생성하지?
  - 복잡한 프로시저 작성..
    - js코드 구현하여 작업..
- 쿼리만 빠르데 실행하고 싶은데 복잡한 DB 환경세팅에 너무 많은 시간이 소요
- 이전에 실행한 쿼리들의 시간을 비교하는게 어려움

<br>


## 아키텍처 구조
<img width="2304" alt="QLab architecture" src="https://github.com/user-attachments/assets/dc1e1a29-b9fa-47ad-8c58-df591ed922b7">

<br>

## 기능

### 핵심 기능
- `DB 환경제공` : 클라우드 상에서 사용자에게 DB 환경을 제공하고 관리한다.
- `쿼리 실행` : 쉘 단위로 쿼리를 작성하고 실행해서 결과를 출력할 수 있다.
- `쿼리 결과` : 쿼리 작성 결과를 보여준다.

<div align="center">
  <img width="600" alt="main page" src="https://github.com/user-attachments/assets/2a780c94-d824-4e5c-a501-a7c2a953d7e6">
</div>

### 서브 기능 (도구)
- `ERD 보기` : 현 ERD를 보여준다.
- `Table 추가` : 테이블을 GUI를 통해 만들고 추가할 수 있음
- `Table 수정` : 테이블을 GUI를 통해 수정할 수 있음
- `Data 추가` : 조건에 따른 대량의 레코드 데이터 추가

<div align="center">
  <img width="600" alt="erd page" src="https://github.com/user-attachments/assets/4f850189-74c9-45f7-9a81-4b8eb8a680cf">
</div>

<div align="center">
  <img width="600" alt="table tool page" src="https://github.com/user-attachments/assets/aa5d131a-29ea-417e-a267-8057e1feaab0">
</div>

<div align="center">
  <img width="600" alt="data tool page" src="https://github.com/user-attachments/assets/67453191-62c2-4283-9ca6-315de3a8ff01">
</div>