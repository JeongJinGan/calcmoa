import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import VatCalculator from "@/components/calculators/VatCalculator";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("vat")!;

export const metadata: Metadata = {
  title: "부가세 계산기 - 공급가액, 부가세, 합계금액 자동 계산",
  description: "공급가액 또는 부가세 포함 합계금액을 입력하면 부가가치세 10%를 즉시 계산하고 세금계산서 발행에 필요한 금액을 확인할 수 있습니다.",
  alternates: { canonical: "/vat" },
};

const faqs = [
  {
    question: "부가세율은 항상 10%인가요?",
    answer: "일반과세자의 부가가치세율은 원칙적으로 10%이며, 수출 등 일부 재화·용역에는 영세율(0%)이 적용됩니다.",
  },
  {
    question: "공급가액과 합계금액의 차이는 무엇인가요?",
    answer:
      "공급가액은 부가세를 제외한 순수 재화·용역의 가격이고, 합계금액은 공급가액에 부가세 10%를 더한 실제 결제 금액입니다.",
  },
  {
    question: "간이과세자도 이 계산기를 사용할 수 있나요?",
    answer:
      "간이과세자는 업종별 부가가치율에 따라 실제 납부세액이 달라지므로, 이 계산기는 일반과세자 기준 부가세 계산에 적합합니다.",
  },
  {
    question: "합계금액만 알고 있을 때 공급가액을 역산할 수 있나요?",
    answer: "네, '합계금액으로 계산' 탭을 선택하고 합계금액을 입력하면 공급가액과 부가세를 자동으로 역산해줍니다.",
  },
];

export default function VatPage() {
  return (
    <ToolPageShell
      slug="vat"
      title={tool.title}
      description={tool.description}
      calculator={<VatCalculator />}
      faqs={faqs}
      infoContent={
        <>
          <h2>부가세 계산 방법</h2>
          <p>
            공급가액을 기준으로 계산할 때는 &ldquo;공급가액 × 10%&rdquo;로 부가세를 구하고, 공급가액에 부가세를 더해
            합계금액을 산출합니다. 반대로 부가세가 포함된 합계금액만 아는 경우에는 &ldquo;합계금액 ÷ 1.1&rdquo;로
            공급가액을 역산한 뒤, 합계금액에서 공급가액을 차감하여 부가세를 계산합니다. 세금계산서를 발행하거나
            매입·매출 장부를 정리할 때 공급가액과 부가세를 구분해서 기재해야 하므로 이 계산기를 활용하면 편리합니다.
          </p>
        </>
      }
    />
  );
}
