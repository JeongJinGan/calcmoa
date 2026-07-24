import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import SalaryCalculator from "@/components/calculators/SalaryCalculator";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("salary")!;

export const metadata: Metadata = {
  title: "연봉 실수령액 계산기 - 4대보험, 소득세 자동 계산",
  description:
    "2025년 기준 4대보험료(국민연금, 건강보험, 장기요양보험, 고용보험)와 소득세를 반영한 연봉 실수령액을 즉시 계산해보세요.",
  alternates: { canonical: "/salary" },
};

const faqs = [
  {
    question: "실수령액 계산 결과가 실제 급여명세서와 다른 이유는 무엇인가요?",
    answer:
      "실제 원천징수는 국세청 근로소득 간이세액표를 기준으로 하며, 회사별 비과세 항목, 4대보험 정산 시점, 부양가족 공제 신고 내역에 따라 차이가 발생할 수 있습니다. 본 계산기는 연간 예상세액을 기준으로 한 추정치입니다.",
  },
  {
    question: "비과세액은 어떻게 입력해야 하나요?",
    answer:
      "식대(월 최대 20만원), 자가운전보조금 등 비과세 항목의 월 합계액을 입력하세요. 비과세 항목이 없다면 0을 입력하면 됩니다.",
  },
  {
    question: "4대보험료는 매년 바뀌나요?",
    answer:
      "네, 국민연금 기준소득월액 상한액과 건강보험료율은 매년 변경됩니다. 본 계산기는 최신 공표 요율을 기준으로 하며, 실제 고지 금액은 국민건강보험공단, 국민연금공단 자료를 확인하시기 바랍니다.",
  },
  {
    question: "연봉에 상여금과 성과급도 포함해야 하나요?",
    answer:
      "네, 세전 연봉에는 매월 고정급여뿐 아니라 정기 상여금, 성과급 등 과세대상 소득 총액을 포함하여 입력하는 것이 실제와 가장 가깝습니다.",
  },
];

export default function SalaryPage() {
  return (
    <ToolPageShell
      slug="salary"
      title={tool.title}
      description={tool.description}
      calculator={<SalaryCalculator />}
      faqs={faqs}
      infoContent={
        <>
          <h2>연봉 실수령액 계산 방법</h2>
          <p>
            연봉 실수령액은 세전 연봉에서 4대보험(국민연금, 건강보험, 장기요양보험, 고용보험) 본인 부담분과
            근로소득세, 지방소득세를 공제한 금액입니다. 4대보험료는 비과세액을 제외한 월 급여를 기준으로 산정되며,
            국민연금은 기준소득월액 상한선이 적용됩니다. 소득세는 근로소득공제, 인적공제, 4대보험료 공제를 반영한
            과세표준에 종합소득세 누진세율을 적용하고, 근로소득세액공제와 자녀세액공제를 차감하여 산출한 연간
            예상세액을 12개월로 나눈 값입니다. 실제 매월 원천징수액은 국세청이 고시하는 간이세액표를 기준으로 하며
            연말정산을 통해 최종 정산되므로, 이 계산기의 결과와 실제 급여명세서 금액은 다소 차이가 있을 수 있습니다.
          </p>
        </>
      }
    />
  );
}
