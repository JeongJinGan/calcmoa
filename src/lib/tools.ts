export type ToolCategory = "급여/세금" | "대출/금융" | "생활" | "건강" | "사업/창업" | "미니게임";

export interface ToolMeta {
  slug: string;
  title: string;
  shortTitle: string;
  category: ToolCategory;
  description: string;
  keywords: string[];
  emoji: string;
}

export const tools: ToolMeta[] = [
  {
    slug: "salary",
    title: "연봉 실수령액 계산기",
    shortTitle: "연봉 실수령액",
    category: "급여/세금",
    description: "연봉을 입력하면 4대보험료와 소득세를 제외한 세후 실수령액(월급)을 바로 확인할 수 있습니다.",
    keywords: ["연봉 실수령액", "연봉계산기", "실수령액 계산", "세후 월급"],
    emoji: "💰",
  },
  {
    slug: "severance",
    title: "퇴직금 계산기",
    shortTitle: "퇴직금",
    category: "급여/세금",
    description: "입사일과 퇴사일, 평균임금을 입력하면 근로기준법 기준 예상 퇴직금을 계산합니다.",
    keywords: ["퇴직금 계산기", "퇴직금 계산", "평균임금", "퇴직금 지급기준"],
    emoji: "📦",
  },
  {
    slug: "income-tax",
    title: "종합소득세 계산기",
    shortTitle: "종합소득세",
    category: "급여/세금",
    description: "종합소득금액과 소득공제액을 입력하면 누진세율표 기준 예상 종합소득세와 지방소득세를 계산합니다.",
    keywords: ["종합소득세 계산기", "종합소득세율", "소득세 계산", "누진공제"],
    emoji: "🧾",
  },
  {
    slug: "vat",
    title: "부가세 계산기",
    shortTitle: "부가세",
    category: "급여/세금",
    description: "공급가액 또는 합계금액을 입력하면 부가가치세(10%)를 자동으로 계산해줍니다.",
    keywords: ["부가세 계산기", "부가세 계산", "공급가액 계산", "부가가치세"],
    emoji: "🧮",
  },
  {
    slug: "loan",
    title: "대출 원리금 상환 계산기",
    shortTitle: "대출 상환금",
    category: "대출/금융",
    description: "대출 원금, 금리, 기간을 입력하면 원리금균등·원금균등·만기일시 상환 방식별 월 상환액을 비교할 수 있습니다.",
    keywords: ["대출 계산기", "원리금균등상환", "원금균등상환", "대출이자 계산기"],
    emoji: "🏦",
  },
  {
    slug: "age",
    title: "만나이 계산기",
    shortTitle: "만나이",
    category: "생활",
    description: "생년월일을 입력하면 만 나이, 연 나이(세는 나이)를 한 번에 계산합니다.",
    keywords: ["만나이 계산기", "만 나이 계산", "나이 계산기", "연나이"],
    emoji: "🎂",
  },
  {
    slug: "savings-interest",
    title: "예금·적금 이자 계산기",
    shortTitle: "예금·적금 이자",
    category: "대출/금융",
    description: "예금 또는 적금의 원금, 금리, 기간을 입력하면 세전·세후 이자와 만기수령액을 계산합니다.",
    keywords: ["예금 이자 계산기", "적금 이자 계산기", "적금 만기 계산기", "이자소득세"],
    emoji: "🏛️",
  },
  {
    slug: "unemployment-benefit",
    title: "실업급여 계산기",
    shortTitle: "실업급여",
    category: "생활",
    description: "평균임금과 나이, 고용보험 가입기간을 입력하면 예상 구직급여(실업급여) 총액을 계산합니다.",
    keywords: ["실업급여 계산기", "구직급여 계산기", "실업급여 조건", "소정급여일수"],
    emoji: "📋",
  },
  {
    slug: "bmi",
    title: "BMI 계산기",
    shortTitle: "BMI",
    category: "건강",
    description: "키와 몸무게를 입력하면 체질량지수(BMI)와 비만도 단계, 표준체중을 계산합니다.",
    keywords: ["BMI 계산기", "체질량지수 계산기", "표준체중 계산기", "비만도 측정"],
    emoji: "⚖️",
  },
  {
    slug: "cost-price",
    title: "원가 계산기 (마진율 계산기)",
    shortTitle: "원가·마진율",
    category: "사업/창업",
    description: "원가와 판매수수료율을 입력하면 목표 마진율에 맞는 판매가를, 판매가를 입력하면 마진율과 원가율을 계산합니다.",
    keywords: ["원가 계산기", "마진율 계산기", "판매가 계산기", "마진 계산기"],
    emoji: "🏷️",
  },
  {
    slug: "break-even",
    title: "손익분기점(BEP) 계산기",
    shortTitle: "손익분기점",
    category: "사업/창업",
    description: "고정비, 변동비, 판매단가를 입력하면 손익분기 판매량과 매출액, 공헌이익률을 계산합니다.",
    keywords: ["손익분기점 계산기", "BEP 계산기", "손익분기점 매출액", "공헌이익률"],
    emoji: "📈",
  },
  {
    slug: "hourly-wage",
    title: "알바 시급·주휴수당 계산기",
    shortTitle: "알바 시급",
    category: "급여/세금",
    description: "시급과 주 근무시간을 입력하면 주휴수당 포함 주급과 예상 월급을 계산합니다.",
    keywords: ["알바 시급 계산기", "주휴수당 계산기", "알바 월급 계산기", "시급 계산기"],
    emoji: "⏰",
  },
  {
    slug: "overtime-pay",
    title: "야근수당 계산기",
    shortTitle: "야근수당",
    category: "급여/세금",
    description: "시급 또는 월급, 연장근로시간, 야간근로시간을 입력하면 연장·야간근로수당을 근로기준법 가산율 기준으로 계산합니다.",
    keywords: ["야근수당 계산기", "연장근로수당 계산기", "야간근로수당 계산기", "초과근무수당"],
    emoji: "🌙",
  },
  {
    slug: "household-budget",
    title: "가계부",
    shortTitle: "가계부",
    category: "생활",
    description: "수입과 지출 내역을 기록하면 이번 달 총수입, 총지출, 잔액과 카테고리별 지출 비중을 자동으로 정리합니다.",
    keywords: ["가계부", "가계부 작성", "무료 가계부", "지출 관리"],
    emoji: "📒",
  },
  {
    slug: "jeonwolse",
    title: "전월세 전환 계산기",
    shortTitle: "전월세 전환",
    category: "대출/금융",
    description: "전세보증금을 월세로, 또는 월세를 전세로 전환 시 예상 금액을 전환율 기준으로 계산합니다.",
    keywords: ["전월세 전환 계산기", "전월세 전환율", "전세 월세 전환", "반전세 계산기"],
    emoji: "🏠",
  },
  {
    slug: "split-bill",
    title: "더치페이 정산 계산기",
    shortTitle: "더치페이",
    category: "생활",
    description: "인원수와 각자 결제한 금액을 입력하면 1인당 부담금과 정산 방법(누가 누구에게 얼마)을 계산합니다.",
    keywords: ["더치페이 계산기", "정산 계산기", "N분의 1 계산기", "모임비 정산"],
    emoji: "💸",
  },
  {
    slug: "ladder",
    title: "사다리타기 게임",
    shortTitle: "사다리타기",
    category: "미니게임",
    description: "참가자와 결과를 입력하고 사다리를 타면 무작위로 당첨자나 벌칙자를 정할 수 있습니다.",
    keywords: ["사다리타기", "사다리타기 게임", "온라인 사다리타기", "벌칙 정하기"],
    emoji: "🪜",
  },
  {
    slug: "roulette",
    title: "랜덤 룰렛 (뽑기)",
    shortTitle: "랜덤 룰렛",
    category: "미니게임",
    description: "선택지를 입력하고 돌림판을 돌리면 무작위로 하나를 뽑아줍니다. 메뉴 고르기, 당첨자 뽑기에 활용하세요.",
    keywords: ["랜덤 룰렛", "돌림판", "랜덤 뽑기", "메뉴 추천 룰렛"],
    emoji: "🎡",
  },
  {
    slug: "claw-machine",
    title: "실시간 인형뽑기",
    shortTitle: "인형뽑기",
    category: "미니게임",
    description: "친구들과 같은 방에 모여 각자 집게를 움직이며 실시간으로 즐기는 온라인 인형뽑기 게임입니다.",
    keywords: ["인형뽑기", "온라인 인형뽑기", "실시간 게임", "멀티플레이 게임"],
    emoji: "🧸",
  },
];

export const categories: ToolCategory[] = ["급여/세금", "대출/금융", "생활", "건강", "사업/창업", "미니게임"];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return tools.filter((t) => t.category === category);
}

export function getRelatedTools(slug: string, limit = 3): ToolMeta[] {
  const current = getToolBySlug(slug);
  if (!current) return tools.slice(0, limit);
  const sameCategory = tools.filter((t) => t.slug !== slug && t.category === current.category);
  const others = tools.filter((t) => t.slug !== slug && t.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export const siteConfig = {
  name: "계산모아",
  description: "연봉, 퇴직금, 대출, 세금까지 한 번에 계산하는 생활 금융 계산기 모음",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://calcmoa.vercel.app",
  cafeUrl: "https://cafe.naver.com/calcmoa",
  blogUrl: "https://blog.naver.com/PostList.naver?blogId=calcmoa",
  contactEmail: "rkswjdwls@gmail.com",
};
