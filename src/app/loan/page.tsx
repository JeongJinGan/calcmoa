import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import LoanCalculator from "@/components/calculators/LoanCalculator";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("loan")!;

export const metadata: Metadata = {
  title: "대출 원리금 상환 계산기 - 원리금균등/원금균등/만기일시 비교",
  description: "대출 원금, 금리, 기간을 입력하면 원리금균등상환, 원금균등상환, 만기일시상환 방식별 월 상환액과 총 이자를 계산합니다.",
  alternates: { canonical: "/loan" },
};

const faqs = [
  {
    question: "원리금균등상환과 원금균등상환의 차이는 무엇인가요?",
    answer:
      "원리금균등상환은 매월 원금과 이자를 합한 총 상환액이 동일하며 초기에는 이자 비중이 높습니다. 원금균등상환은 매월 갚는 원금이 동일하고 이자는 잔액에 따라 줄어들어, 초기 상환액이 크지만 총 이자는 더 적습니다.",
  },
  {
    question: "만기일시상환은 어떤 방식인가요?",
    answer:
      "대출 기간 동안 매월 이자만 납부하다가 만기일에 원금 전액을 한 번에 상환하는 방식입니다. 매월 부담은 가장 적지만 총 이자 부담은 가장 큽니다.",
  },
  {
    question: "총 이자는 어떻게 계산되나요?",
    answer: "전체 상환 기간 동안 매월 납부한 이자를 모두 합산한 금액이며, 상환 방식에 따라 크게 달라질 수 있습니다.",
  },
  {
    question: "변동금리 대출도 계산할 수 있나요?",
    answer:
      "본 계산기는 입력한 연 이자율이 대출 기간 내내 고정된다고 가정합니다. 변동금리 상품은 금리 변경 시점마다 다시 계산해보시기 바랍니다.",
  },
];

export default function LoanPage() {
  return (
    <ToolPageShell
      slug="loan"
      title={tool.title}
      description={tool.description}
      calculator={<LoanCalculator />}
      faqs={faqs}
      infoContent={
        <>
          <h2>대출 원리금 상환 계산 방법</h2>
          <p>
            원리금균등상환은 &ldquo;대출원금 × 월이자율 / (1 - (1+월이자율)^-개월수)&rdquo; 공식으로 매월 동일한
            상환액을 계산하며, 회차가 지날수록 이자 비중은 줄고 원금 비중이 늘어납니다. 원금균등상환은 대출원금을
            상환 개월수로 나눈 금액을 매월 고정적으로 갚고, 남은 잔액에 대한 이자를 더해 상환액을 계산하므로 회차가
            지날수록 상환액이 줄어듭니다. 만기일시상환은 상환 기간 동안 이자만 납부하다가 마지막 회차에 원금 전액을
            상환합니다. 실제 대출 상품은 중도상환수수료, 거치기간, 변동금리 여부에 따라 결과가 달라질 수 있으므로
            정확한 상환 계획은 거래 금융기관과 상담하시기 바랍니다.
          </p>
        </>
      }
    />
  );
}
