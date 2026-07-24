import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import SavingsInterestCalculator from "@/components/calculators/SavingsInterestCalculator";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("savings-interest")!;

export const metadata: Metadata = {
  title: "예금·적금 이자 계산기 - 세전/세후 이자, 만기수령액 계산",
  description: "예금(거치식)과 적금(적립식)의 원금, 금리, 기간을 입력하면 이자소득세를 반영한 세후 이자와 만기수령액을 계산합니다.",
  alternates: { canonical: "/savings-interest" },
};

const faqs = [
  {
    question: "예금과 적금의 이자 계산 방식이 다른가요?",
    answer:
      "예금(거치식)은 한 번에 넣은 원금에 대해 \"원금 × 연이율 × (개월/12)\"로 이자를 계산합니다. 적금(적립식)은 매월 납입하는 금액마다 남은 기간이 다르므로 \"월납입액 × n(n+1)/2 × (연이율/12)\" 공식으로 계산합니다.",
  },
  {
    question: "이자소득세는 왜 15.4%인가요?",
    answer: "이자소득세 14%와 지방소득세 1.4%(이자소득세의 10%)를 합산한 일반과세 세율입니다. 세금우대 상품은 9.5%, 비과세종합저축 등은 0%가 적용됩니다.",
  },
  {
    question: "적금은 단리와 복리 중 어떤 방식을 쓰나요?",
    answer: "국내 시중은행 적금 상품은 대부분 단리 방식을 사용하며, 본 계산기도 단리 기준으로 계산합니다.",
  },
  {
    question: "실제 은행 만기 금액과 차이가 날 수 있나요?",
    answer: "네, 은행별 이자 지급 기준일, 우대금리 조건, 중도해지 여부에 따라 실제 수령액이 달라질 수 있으므로 정확한 금액은 가입한 금융기관에 확인하시기 바랍니다.",
  },
];

export default function SavingsInterestPage() {
  return (
    <ToolPageShell
      slug="savings-interest"
      title={tool.title}
      description={tool.description}
      calculator={<SavingsInterestCalculator />}
      faqs={faqs}
      infoContent={
        <>
          <h2>예금·적금 이자 계산 방법</h2>
          <p>
            예금(거치식)은 예치한 원금에 연이율과 예치 기간을 곱해 세전 이자를 계산하는 단리 방식이 일반적입니다.
            적금(적립식)은 매월 납입한 금액마다 만기까지 남은 기간이 달라지므로, &ldquo;월납입액 × 납입회차의 합 ×
            (연이율/12)&rdquo; 공식을 사용합니다. 계산된 세전 이자에서 이자소득세(일반과세 15.4%, 세금우대 9.5%,
            비과세 0%)를 차감하면 실제로 받는 세후 이자가 되며, 원금과 세후 이자를 더한 금액이 만기 수령액입니다.
            실제 상품은 우대금리, 중도해지 이율, 이자 지급 주기에 따라 결과가 달라질 수 있습니다.
          </p>
        </>
      }
    />
  );
}
