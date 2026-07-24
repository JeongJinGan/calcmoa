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
      infoContent={
        <>
          <h2>실업급여(구직급여) 계산 방법</h2>
          <p>
            구직급여 지급액은 &ldquo;1일 평균임금 × 60% × 소정급여일수&rdquo;로 계산됩니다. 1일 평균임금은 이직 전
            3개월간 지급된 임금 총액을 그 기간의 총 일수로 나누어 산정하며, 계산된 1일 구직급여액이 상한액(66,000원)을
            넘으면 상한액으로, 하한액(64,192원)보다 낮으면 하한액으로 조정됩니다. 소정급여일수는 이직 당시 만 나이와
            고용보험 총 가입기간에 따라 120일에서 270일까지 차등 적용됩니다. 실제 수급 여부와 정확한 금액은 이직
            사유 심사 결과와 고용노동부 고시 금액에 따라 달라질 수 있습니다.
          </p>
        </>
      }
    />
  );
}
