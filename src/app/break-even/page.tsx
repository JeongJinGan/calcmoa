import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import BreakEvenCalculator from "@/components/calculators/BreakEvenCalculator";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("break-even")!;

export const metadata: Metadata = {
  title: "손익분기점 계산기 - BEP 판매량, 매출액, 공헌이익률 계산",
  description:
    "월 고정비, 개당 변동비, 판매단가를 입력하면 손익분기점(BEP) 판매량과 매출액, 공헌이익률을 자동으로 계산합니다.",
  alternates: { canonical: "/break-even" },
};

const faqs = [
  {
    question: "손익분기점이란 무엇인가요?",
    answer:
      "손익분기점(BEP, Break-Even Point)은 매출액과 총비용(고정비+변동비)이 정확히 같아져 이익도 손실도 발생하지 않는 판매량 또는 매출액을 말합니다. 이 지점을 넘어서는 판매부터 실질적인 이익이 발생합니다.",
  },
  {
    question: "고정비와 변동비는 어떻게 구분하나요?",
    answer:
      "고정비는 판매량과 무관하게 매달 일정하게 나가는 비용(임대료, 정규직 인건비, 보험료 등)이고, 변동비는 판매량에 비례해서 늘어나는 비용(재료비, 개당 포장비, 판매수수료 등)입니다. 인건비도 알바비처럼 판매량에 따라 근무시간이 달라진다면 변동비로 볼 수 있습니다.",
  },
  {
    question: "공헌이익률은 무엇을 의미하나요?",
    answer:
      "공헌이익률은 판매단가에서 변동비를 뺀 공헌이익이 판매단가에서 차지하는 비율입니다. 공헌이익률이 높을수록 매출 1원이 늘어날 때 고정비를 회수하고 이익을 내는 데 더 크게 기여합니다.",
  },
  {
    question: "실제로는 판매단가가 일정하지 않은데 어떻게 활용하나요?",
    answer:
      "여러 상품을 판매한다면 평균 판매단가와 평균 변동비로 대입해 전체 사업의 손익분기점을 대략적으로 파악하는 용도로 활용할 수 있습니다. 품목별로 마진 구조가 크게 다르다면 원가 계산기로 품목별 마진율을 먼저 확인한 뒤 대표값을 입력하는 것을 권장합니다.",
  },
];

export default function BreakEvenPage() {
  return (
    <ToolPageShell
      slug="break-even"
      title={tool.title}
      description={tool.description}
      calculator={<BreakEvenCalculator />}
      faqs={faqs}
      infoBlocks={[
        {
          heading: "손익분기점 계산 방법",
          body: "손익분기 판매량은 “고정비 ÷ (판매단가 - 개당 변동비)”로 계산합니다. 여기서 판매단가에서 개당 변동비를 뺀 값을 공헌이익이라고 하며, 판매 한 개당 고정비 회수 및 이익 창출에 기여하는 금액을 의미합니다. 손익분기 매출액은 손익분기 판매량에 판매단가를 곱해 구합니다.",
        },
        {
          heading: "손익분기점 분석의 활용",
          body: "손익분기점을 알면 이번 달 목표 매출을 얼마로 잡아야 적자를 면할 수 있는지, 가격을 얼마나 올리거나 내려야 손익분기 판매량이 어떻게 바뀌는지 시뮬레이션할 수 있습니다. 특히 카페, 음식점, 온라인 쇼핑몰처럼 고정비 비중이 큰 사업일수록 손익분기점 파악이 초기 사업계획 수립에 필수적입니다.",
        },
        {
          heading: "계산 예시",
          body: "월 고정비 300만원, 개당 변동비 4,000원, 판매단가 10,000원인 카페 음료 사업이라면 공헌이익은 10,000 - 4,000 = 6,000원이고, 손익분기 판매량은 3,000,000 ÷ 6,000 = 500잔입니다. 이 경우 손익분기 매출액은 500잔 × 10,000원 = 500만원이며, 월 500잔을 초과해 판매해야 이익이 발생합니다.",
        },
        {
          heading: "자주 하는 실수",
          body: "변동비에 고정비 성격의 항목(정규직 급여, 고정 임대료 등)을 섞어 넣으면 손익분기 판매량이 실제보다 낮게 계산되는 오류가 흔합니다. 또한 판매단가를 부가세 포함 금액으로, 변동비는 부가세 별도 금액으로 섞어서 입력하면 공헌이익이 왜곡되므로 두 금액의 부가세 포함 여부를 반드시 통일해서 입력해야 합니다.",
        },
      ]}
    />
  );
}
