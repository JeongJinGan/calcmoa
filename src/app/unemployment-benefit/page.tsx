import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import UnemploymentBenefitCalculator from "@/components/calculators/UnemploymentBenefitCalculator";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("unemployment-benefit")!;

export const metadata: Metadata = {
  title: "실업급여 계산기 - 구직급여 예상 지급총액 계산",
  description: "평균임금, 나이, 고용보험 가입기간을 입력하면 소정급여일수와 예상 실업급여(구직급여) 총액을 계산합니다.",
  alternates: { canonical: "/unemployment-benefit" },
};

const faqs = [
  {
    question: "실업급여는 자발적 퇴사자도 받을 수 있나요?",
    answer:
      "원칙적으로 비자발적 이직(권고사직, 계약만료, 정리해고 등)만 대상이며, 단순 자발적 퇴사는 제외됩니다. 다만 계약 갱신 거절, 임금체불, 괴롭힘 등 정당한 사유가 인정되면 자발적 퇴사도 대상이 될 수 있습니다.",
  },
  {
    question: "소정급여일수는 어떻게 정해지나요?",
    answer:
      "이직 당시 나이(50세 기준)와 고용보험 가입기간에 따라 120일부터 270일까지 차등 적용됩니다. 가입기간이 길고 50세 이상일수록 더 많은 일수를 받습니다.",
  },
  {
    question: "1일 구직급여 상한액과 하한액은 얼마인가요?",
    answer:
      "상한액은 1일 66,000원이며, 하한액은 최저임금의 80%를 기준으로 산정됩니다. 두 금액 모두 매년 변경되므로 정확한 금액은 고용노동부 고용24를 통해 확인하시기 바랍니다.",
  },
  {
    question: "실제 수급 자격은 어디서 확인하나요?",
    answer:
      "수급 자격 인정 여부와 정확한 지급액은 관할 고용센터 방문 또는 고용24(work24.go.kr)에서 확인할 수 있습니다. 본 계산기는 참고용 추정치입니다.",
  },
];

export default function UnemploymentBenefitPage() {
  return (
    <ToolPageShell
      slug="unemployment-benefit"
      title={tool.title}
      description={tool.description}
      calculator={<UnemploymentBenefitCalculator />}
      faqs={faqs}
      infoBlocks={[
        {
          heading: "실업급여(구직급여) 계산 방법",
          body: "구직급여 지급액은 “1일 평균임금 × 60% × 소정급여일수”로 계산됩니다. 1일 평균임금은 이직 전 3개월간 지급된 임금 총액을 그 기간의 총 일수로 나누어 산정하며, 계산된 1일 구직급여액이 상한액(66,000원)을 넘으면 상한액으로, 하한액(64,192원)보다 낮으면 하한액으로 조정됩니다.",
        },
        {
          heading: "관련 법령",
          body: "구직급여는 고용보험법 제4장(제37~64조)에 근거하며, 이직일 이전 18개월간 피보험단위기간이 통산 180일 이상이고 근로 의사와 능력이 있음에도 취업하지 못한 비자발적 이직자에게 지급됩니다. 소정급여일수는 고용보험법 제50조 및 별표1에 따라 이직 당시 만 나이(50세 기준)와 피보험기간에 따라 120일~270일로 정해지며, 1일 상한액·하한액은 고용보험법 시행령 제68조에 따라 매년 고용노동부 장관이 고시합니다.",
        },
        {
          heading: "계산 예시",
          body: "1990년 5월 15일생(이직 시 만 36세)이 2026년 7월 24일 이직하고, 고용보험 가입기간 1~3년, 이직 전 3개월 총 급여 900만원인 경우 1일 평균임금은 900만원 ÷ 91일 ≈ 9만 8,901원이고, 그 60%인 5만 9,340원은 하한액 6만 4,192원보다 낮으므로 하한액이 적용됩니다. 만 50세 미만·가입기간 1~3년의 소정급여일수는 150일이므로, 예상 구직급여 총액은 6만 4,192원 × 150일 = 962만 8,800원입니다. 평균임금이 높아 60%가 상한액(66,000원)을 넘는 경우에는 상한액이 그대로 적용됩니다.",
        },
        {
          heading: "자주 하는 실수",
          body: "자발적 퇴사는 원칙적으로 실업급여 대상이 아닌데도 이를 모르고 신청을 준비하거나, 반대로 계약만료·권고사직처럼 정당한 비자발적 사유인데도 대상이 아니라고 오해하는 경우가 많습니다. 소정급여일수를 계산할 때 “재직 연수”가 아니라 “고용보험 가입기간” 전체(이전 직장 포함, 단 재취업 시 기존 가입기간이 합산되지 않는 경우도 있음)를 기준으로 해야 하는데 현재 직장 근속연수만으로 판단하는 실수도 흔합니다. 정확한 수급자격 인정 여부와 지급액은 반드시 관할 고용센터 또는 고용24(work24.go.kr)에서 확인해야 합니다.",
        },
      ]}
    />
  );
}
