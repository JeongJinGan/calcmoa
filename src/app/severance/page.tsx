import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import SeveranceCalculator from "@/components/calculators/SeveranceCalculator";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("severance")!;

export const metadata: Metadata = {
  title: "퇴직금 계산기 - 평균임금 기준 예상 퇴직금 계산",
  description: "입사일, 퇴사일, 최근 3개월 급여를 입력하면 근로기준법 평균임금 기준 예상 퇴직금을 계산해드립니다.",
  alternates: { canonical: "/severance" },
};

const faqs = [
  {
    question: "퇴직금은 누구나 받을 수 있나요?",
    answer:
      "계속근로기간이 1년 이상이고, 4주 평균 1주 소정근로시간이 15시간 이상인 근로자라면 정규직, 계약직, 아르바이트 구분 없이 퇴직금을 받을 수 있습니다.",
  },
  {
    question: "평균임금은 어떻게 계산되나요?",
    answer:
      "퇴직 직전 3개월간 지급된 임금 총액에 최근 1년간 상여금과 연차수당의 3/12에 해당하는 금액을 더한 뒤, 그 3개월간의 총 일수로 나누어 계산합니다.",
  },
  {
    question: "퇴직금 지급 기한이 있나요?",
    answer: "근로기준법에 따라 퇴직일로부터 14일 이내에 퇴직금을 지급해야 하며, 당사자 간 합의 시 연장할 수 있습니다.",
  },
  {
    question: "상여금이나 연차수당이 없다면 0으로 입력해도 되나요?",
    answer: "네, 해당 항목이 없다면 0을 입력하면 되고, 최근 3개월 급여만으로 평균임금이 계산됩니다.",
  },
];

export default function SeverancePage() {
  return (
    <ToolPageShell
      slug="severance"
      title={tool.title}
      description={tool.description}
      calculator={<SeveranceCalculator />}
      faqs={faqs}
      infoContent={
        <>
          <h2>퇴직금 계산 방법</h2>
          <p>
            퇴직금은 근로기준법 제34조 및 근로자퇴직급여 보장법에 따라 &ldquo;평균임금 × 30일 × (재직일수 / 365)&rdquo;
            공식으로 산정됩니다. 평균임금은 퇴직 직전 3개월 동안 지급된 임금 총액에 최근 1년간 지급된 상여금과
            미사용 연차수당의 3/12에 해당하는 금액을 더한 후, 그 산정 기간의 총 일수로 나누어 계산합니다.
            계속근로기간이 1년 미만이거나 4주 평균 1주 소정근로시간이 15시간 미만인 경우에는 퇴직금 지급 대상에서
            제외됩니다. 실제 지급액은 회사의 급여 규정, 평균임금 산정 기준일, 통상임금과의 비교 등에 따라 달라질 수
            있으므로 정확한 금액은 고용노동부 또는 사업장 인사담당 부서에 문의하시기 바랍니다.
          </p>
        </>
      }
    />
  );
}
