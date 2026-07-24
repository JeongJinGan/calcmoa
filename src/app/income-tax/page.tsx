import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import IncomeTaxCalculator from "@/components/calculators/IncomeTaxCalculator";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("income-tax")!;

export const metadata: Metadata = {
  title: "종합소득세 계산기 - 누진세율표 기준 자동 계산",
  description: "종합소득금액과 소득공제액을 입력하면 8단계 누진세율표를 적용한 예상 종합소득세와 지방소득세를 계산합니다.",
  alternates: { canonical: "/income-tax" },
};

const faqs = [
  {
    question: "종합소득금액은 매출액과 같은 개념인가요?",
    answer:
      "아닙니다. 종합소득금액은 사업소득, 근로소득, 이자·배당소득 등을 합산한 후 필요경비를 차감한 금액입니다. 사업자의 경우 매출액에서 필요경비를 뺀 금액을 의미합니다.",
  },
  {
    question: "누진세율은 어떻게 적용되나요?",
    answer:
      "과세표준 구간별로 6%부터 45%까지 8단계 세율이 적용되며, 각 구간의 누진공제액을 차감하는 방식으로 전체 구간에 동일한 세율을 곱하지 않고도 누진 효과를 계산할 수 있습니다.",
  },
  {
    question: "지방소득세는 별도로 신고해야 하나요?",
    answer:
      "종합소득세 신고 시 지방소득세(소득세의 10%)도 함께 신고되며, 국세인 종합소득세와 별도로 지방자치단체에 납부됩니다.",
  },
  {
    question: "세액공제나 세액감면은 반영되나요?",
    answer:
      "본 계산기는 소득공제 반영 후 산출세액까지만 계산하며, 자녀세액공제, 연금계좌세액공제 등 세액공제 항목은 반영되지 않은 추정치입니다. 정확한 금액은 홈택스 종합소득세 신고 화면에서 확인하시기 바랍니다.",
  },
];

export default function IncomeTaxPage() {
  return (
    <ToolPageShell
      slug="income-tax"
      title={tool.title}
      description={tool.description}
      calculator={<IncomeTaxCalculator />}
      faqs={faqs}
      infoContent={
        <>
          <h2>종합소득세 계산 방법</h2>
          <p>
            종합소득세는 &ldquo;과세표준 × 세율 - 누진공제액&rdquo; 공식으로 계산합니다. 과세표준은 종합소득금액에서
            인적공제, 각종 소득공제를 차감한 금액이며, 2025년 기준 세율은 1,400만원 이하 6%부터 10억원 초과 45%까지
            8단계 누진세율 구조로 되어 있습니다. 산출된 종합소득세의 10%에 해당하는 지방소득세를 더하면 실제 총
            납부세액이 됩니다. 본 계산기는 세액공제 및 감면 항목을 반영하지 않은 산출세액 기준 추정치이므로, 정확한
            신고 금액은 국세청 홈택스를 통해 확인하시기 바랍니다.
          </p>
        </>
      }
    />
  );
}
