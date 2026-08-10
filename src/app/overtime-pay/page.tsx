import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import OvertimePayCalculator from "@/components/calculators/OvertimePayCalculator";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("overtime-pay")!;

export const metadata: Metadata = {
  title: "야근수당 계산기 - 연장·야간근로수당 자동 계산",
  description:
    "시급 또는 월급과 연장근로시간, 야간근로시간(22시~06시)을 입력하면 근로기준법 가산율 기준 연장·야간근로수당을 계산합니다.",
  alternates: { canonical: "/overtime-pay" },
};

const faqs = [
  {
    question: "연장근로수당과 야간근로수당은 어떻게 계산하나요?",
    answer:
      "연장근로수당은 통상시급의 1.5배(시급×1.5×연장근로시간), 야간근로수당은 밤 10시부터 다음날 오전 6시 사이 근무에 대해 통상시급의 0.5배가 추가로 가산됩니다(시급×0.5×야간근로시간). 연장근로가 야간 시간대에 겹치면 두 수당을 모두 받을 수 있습니다.",
  },
  {
    question: "5인 미만 사업장도 가산수당을 받을 수 있나요?",
    answer:
      "아니요. 연장·야간·휴일근로 가산수당은 상시근로자 5인 이상 사업장에만 적용됩니다. 5인 미만 사업장은 근로기준법상 가산수당 지급 의무가 없어 실제 근로시간만큼만 지급해도 위법이 아닙니다.",
  },
  {
    question: "월급제인데 통상시급은 어떻게 구하나요?",
    answer:
      "월 소정근로시간을 209시간(주 40시간+유급주휴 8시간 기준)으로 가정해 '월 기본급 ÷ 209'로 통상시급을 계산합니다. 회사마다 소정근로시간이 다를 수 있어 정확한 값은 근로계약서나 취업규칙을 확인하는 것이 좋습니다.",
  },
  {
    question: "휴일에 근무한 시간도 이 계산기에 포함되나요?",
    answer:
      "아니요, 이 계산기는 평일 연장근로와 야간근로만 계산합니다. 휴일근로수당은 8시간 이내 1.5배, 8시간 초과분은 2배로 가산율이 달라 별도로 계산해야 합니다.",
  },
];

export default function OvertimePayPage() {
  return (
    <ToolPageShell
      slug="overtime-pay"
      title={tool.title}
      description={tool.description}
      calculator={<OvertimePayCalculator />}
      faqs={faqs}
      infoBlocks={[
        {
          heading: "야근수당(가산수당) 계산 방법",
          body: "근로기준법 제56조는 연장·야간·휴일근로에 대해 통상임금의 일정 비율을 가산해 지급하도록 규정합니다. 연장근로(1일 8시간 또는 1주 40시간 초과)는 통상시급의 50%를, 야간근로(22시~06시)는 통상시급의 50%를 추가로 가산합니다. 두 조건이 겹치는 시간(예: 야근이 길어져 22시를 넘긴 연장근로)에는 두 가산이 동시에 적용됩니다.",
        },
        {
          heading: "계산 예시",
          body: "통상시급 12,000원인 근로자가 이번 달 연장근로 10시간, 이 중 22시 이후 야간근로가 3시간 포함되어 있다면, 연장근로수당은 12,000×1.5×10 = 180,000원이고 야간근로수당은 12,000×0.5×3 = 18,000원이 추가로 더해져 총 198,000원의 가산수당이 발생합니다.",
        },
        {
          heading: "주의할 점",
          body: "이 계산기는 통상시급에 이미 기본 근로시간에 대한 임금이 포함되어 있다고 가정하고, 가산되는 추가 수당만 계산합니다. 즉 연장근로 10시간에 대한 기본급(시급×10)은 별도로 지급되어야 하며, 여기서 계산된 금액은 그 위에 추가로 더해지는 가산분입니다. 포괄임금제 계약이라면 실제 근로시간과 무관하게 일정액의 연장·야간수당이 급여에 포함되어 있을 수 있으니 근로계약서를 함께 확인하세요.",
        },
      ]}
    />
  );
}
