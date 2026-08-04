import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import SplitBillCalculator from "@/components/calculators/SplitBillCalculator";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("split-bill")!;

export const metadata: Metadata = {
  title: "더치페이 계산기 - N분의 1 정산, 결제자별 정산 금액 계산",
  description:
    "총 금액과 인원 수만 입력하면 1인당 부담금을, 각자 결제한 금액을 입력하면 누가 누구에게 얼마를 보내야 하는지 최소 횟수로 정산해줍니다.",
  alternates: { canonical: "/split-bill" },
};

const faqs = [
  {
    question: "단순 N분의 1과 결제자별 정산은 어떻게 다른가요?",
    answer:
      "단순 N분의 1은 총 금액을 인원 수로 나눈 1인당 부담금만 보여줍니다. 결제자별 정산은 모임에서 각자 실제로 결제한 금액이 다를 때, 최종적으로 누가 누구에게 얼마를 보내야 정산이 끝나는지 이체 내역까지 계산해줍니다.",
  },
  {
    question: "정산 결과의 이체 횟수는 왜 최소로 나오나요?",
    answer:
      "이 계산기는 가장 많이 낸 사람과 가장 적게 낸 사람부터 순서대로 매칭해 정산하는 방식을 사용해, 1:1로 모두 정산하는 것보다 실제 이체해야 할 건수를 줄여줍니다. 예를 들어 3명이 정산할 때도 상황에 따라 단 1~2번의 이체로 끝날 수 있습니다.",
  },
  {
    question: "결제 금액을 잘못 입력하면 어떻게 되나요?",
    answer:
      "이름이나 결제 금액은 언제든 수정할 수 있으며, 수정 즉시 1인당 부담금과 정산 내역이 다시 계산됩니다. 입력한 결제 금액의 합계가 실제 영수증 총액과 일치하는지 확인하는 것이 정확한 정산의 핵심입니다.",
  },
  {
    question: "인원을 몇 명까지 추가할 수 있나요?",
    answer:
      "'인원 추가' 버튼으로 필요한 만큼 인원을 늘릴 수 있으며, 최소 2명 이상이어야 정산 계산이 가능합니다.",
  },
];

export default function SplitBillPage() {
  return (
    <ToolPageShell
      slug="split-bill"
      title={tool.title}
      description={tool.description}
      calculator={<SplitBillCalculator />}
      faqs={faqs}
      infoBlocks={[
        {
          heading: "더치페이 정산 계산 방법",
          body: "1인당 부담금은 전체 결제 금액의 합을 인원 수로 나누어 계산합니다. 결제자별 정산에서는 각자의 결제 금액에서 1인당 부담금을 뺀 차액(더 낸 사람은 양수, 덜 낸 사람은 음수)을 구한 뒤, 가장 많이 낸 사람과 가장 적게 낸 사람부터 순서대로 매칭해 이체 금액을 계산하는 방식으로 실제 송금 횟수를 최소화합니다.",
        },
        {
          heading: "계산 예시",
          body: "세 명이 저녁 식사 후 A가 60,000원을 전액 결제했다면, 1인당 부담금은 20,000원이므로 B와 C가 각각 A에게 20,000원씩 보내면 정산이 끝납니다. 만약 A가 60,000원, B가 30,000원을 결제하고 C는 결제하지 않았다면 1인당 부담금은 30,000원이며, C는 A에게 30,000원을 보내는 것으로 정산이 완료됩니다.",
        },
        {
          heading: "자주 하는 실수",
          body: "각자 결제한 금액의 합계가 실제 영수증 총액과 다르면 정산 결과도 실제 지출과 어긋나게 됩니다. 더치페이 전에 결제 내역(카드 영수증, 현금 지출 등)을 먼저 모두 취합한 뒤 입력하는 것이 정확합니다. 또한 특정 인원만 더 많이 주문했다면 단순 N분의 1보다는 실제 주문 금액을 반영해 나누는 것이 형평성 있는 정산 방법입니다.",
        },
      ]}
    />
  );
}
