import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import HourlyWageCalculator from "@/components/calculators/HourlyWageCalculator";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("hourly-wage")!;

export const metadata: Metadata = {
  title: "알바 시급 계산기 - 주휴수당 포함 주급, 월급 자동 계산",
  description:
    "시급과 주 소정근로시간을 입력하면 주휴수당 발생 여부와 금액, 주급, 예상 월급을 근로기준법 기준으로 계산합니다.",
  alternates: { canonical: "/hourly-wage" },
};

const faqs = [
  {
    question: "주휴수당은 누구나 받을 수 있나요?",
    answer:
      "1주 소정근로시간이 15시간 이상이고, 그 주에 정해진 근로일에 결근 없이 모두 출근(개근)한 경우에 발생합니다. 주 15시간 미만 근무자는 근로기준법상 주휴수당 지급 대상이 아닙니다.",
  },
  {
    question: "주휴수당은 어떻게 계산하나요?",
    answer:
      "주 40시간을 기준으로 “(주 소정근로시간 ÷ 40) × 8시간 × 시급”으로 비례 계산합니다. 주 40시간을 초과해 근무해도 주휴수당은 최대 8시간분(시급×8)까지만 인정됩니다.",
  },
  {
    question: "월급은 왜 주급에 4.345를 곱하나요?",
    answer:
      "1년은 약 52.14주이고 12개월로 나누면 한 달은 평균 약 4.345주에 해당합니다. 주급에 이 값을 곱하면 매달 근무일수가 달라도 평균적인 월 예상 급여를 구할 수 있습니다.",
  },
  {
    question: "최저임금 미만으로 계약해도 되나요?",
    answer:
      "안 됩니다. 시급은 매년 결정되는 최저임금 이상이어야 하며, 최신 최저임금은 고용노동부 공고를 통해 반드시 확인해야 합니다. 수습 기간에는 일부 예외적으로 최저임금의 90%까지 감액이 가능한 경우가 있습니다.",
  },
];

export default function HourlyWagePage() {
  return (
    <ToolPageShell
      slug="hourly-wage"
      title={tool.title}
      description={tool.description}
      calculator={<HourlyWageCalculator />}
      faqs={faqs}
      infoBlocks={[
        {
          heading: "주휴수당 계산 방법",
          body: "주휴수당은 근로기준법 제55조와 같은 법 시행령 제30조에 근거해, 1주 소정근로시간이 15시간 이상이고 개근한 근로자에게 유급휴일을 부여하기 위해 지급됩니다. 계산식은 “(주 소정근로시간 ÷ 40) × 8 × 시급”이며, 주 40시간을 초과하는 근로시간은 계산에서 40시간으로 제한됩니다.",
        },
        {
          heading: "관련 법령",
          body: "근로기준법 제55조는 사용자가 근로자에게 1주에 평균 1회 이상의 유급휴일을 주어야 한다고 규정하며, 시행령 제30조는 이를 구체화해 소정근로일을 개근한 근로자에게 적용됨을 명시합니다. 최저임금법에 따라 시급은 매년 고시되는 최저임금 이상이어야 하며, 이를 위반한 근로계약은 무효입니다.",
        },
        {
          heading: "계산 예시",
          body: "시급 10,030원, 주 20시간 근무하는 아르바이트생의 경우 주휴수당은 (20 ÷ 40) × 8 × 10,030원 = 40,120원입니다. 주급은 기본급 200,600원에 주휴수당을 더한 240,720원이며, 이를 4.345주로 환산한 예상 월급은 약 1,045,928원입니다.",
        },
        {
          heading: "자주 하는 실수",
          body: "사업주와 근로자 모두 “주 15시간 미만이면 주휴수당이 없다”는 조건과 “결근 없이 개근해야 한다”는 조건을 동시에 놓치는 경우가 많습니다. 또한 시급제 아르바이트의 월급을 단순히 “시급 × 하루 근무시간 × 한 달 근무일수”로만 계산해 주휴수당을 누락하는 실수가 흔하므로, 근로계약서에 주휴수당 포함 여부를 명확히 기재해야 분쟁을 예방할 수 있습니다.",
        },
      ]}
    />
  );
}
