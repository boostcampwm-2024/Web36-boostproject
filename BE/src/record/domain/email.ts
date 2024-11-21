/* eslint-disable prettier/prettier */
import { RandomValueGenerator } from './random-value-generator.interface';


const emailNames: string[] = [
    // 일반적인 이름
    "john", "jane", "alex", "emily", "michael", "sarah", "david", "laura",
    "chris", "anna", "james", "kate", "robert", "emma", "daniel", "olivia",
    "mark", "sophia", "paul", "isabella", "steve", "mia", "lucas", "amelia",

    // 별명
    "coolguy", "sunshine", "rockstar", "happyfeet", "dreamer", "starrysky",
    "nightowl", "booklover", "foodie", "wanderlust",

    // 랜덤 단어
    "bluefox", "reddragon", "greentree", "yellowbird", "pinkcloud",
    "blackcat", "whitedove", "goldenlion", "silverwolf", "purplefish",

    // 추가 숫자와 별명 조합
    "fastcar2023", "happyday365", "lucky7", "supernova99", "chillzone21",
    "adventure101", "freedom4u", "powerplay50", "nextgen8", "brightfuture"
];


const emailDomains: string[] = [
    // 일반 이메일 서비스 제공자
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
    "icloud.com", "mail.com", "protonmail.com", "live.com", "gmx.com",

    // 대기업 도메인
    "apple.com", "amazon.com", "microsoft.com", "facebook.com", "google.com",

    // 교육 기관 (edu)
    "harvard.edu", "mit.edu", "stanford.edu", "oxford.ac.uk", "cam.ac.uk",

    // 정부 기관 (gov)
    "gov.uk", "usa.gov", "europa.eu", "gov.in", "gov.au",

    // 기술 관련 도메인
    "tech.com", "dev.com", "code.com", "ai.com", "it.com", "webdev.com",

    // 글로벌 도메인
    "yandex.ru", "qq.com", "naver.com", "daum.net", "163.com", "sina.com.cn",
    "rediffmail.com", "zoho.com", "mail.ru", "seznam.cz", "orange.fr",

    // 지역 도메인
    "co.uk", "co.kr", "co.in", "co.jp", "com.au", "com.br", "com.mx",
    "com.sg", "com.tw", "com.sa",

    // 기타 인기 도메인
    "fastmail.com", "hushmail.com", "tutanota.com", "posteo.net", "runbox.com",
    "lavabit.com", "disroot.org", "startmail.com", "pm.me", "openmailbox.org"
];

export class EmailGenerator extends RandomValueGenerator<string> {
  getRandomValue(): string {
    const domainIdx = Math.floor(Math.random() * emailDomains.length);
    const nameIdx = Math.floor(Math.random() * emailNames.length);
    const suffix =
      Math.random() > 0.5 ? '' : Math.floor(Math.random() * 1000) + 1;
    return emailNames[nameIdx] + suffix + '@' + emailDomains[domainIdx];
  }
}
