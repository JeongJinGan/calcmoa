export type ToolCategory = "급여/세금" | "대출/금융" | "생활" | "건강";

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
];

export const categories: ToolCategory[] = ["급여/세금", "대출/금융", "생활", "건강"];

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
};
