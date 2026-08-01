import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import BmiCalculator from "@/components/calculators/BmiCalculator";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("bmi")!;

export const metadata: Metadata = {
  title: "BMI 계산기 - 체질량지수, 비만도, 표준체중 계산",
  description: "키와 몸무게를 입력하면 체질량지수(BMI)와 대한비만학회 기준 비만도 단계, 표준체중을 바로 계산합니다.",
  alternates: { canonical: "/bmi" },
};

const faqs = [
  {
    question: "BMI는 어떻게 계산되나요?",
    answer: "BMI는 \"몸무게(kg) ÷ 키(m)의 제곱\"으로 계산되는 체질량지수로, 체지방률을 직접 측정하지 않고 키와 몸무게만으로 비만도를 간단히 추정하는 지표입니다.",
  },
  {
    question: "BMI 수치별 비만도 기준은 어떻게 되나요?",
    answer: "대한비만학회 기준으로 18.5 미만은 저체중, 18.5~22.9는 정상, 23~24.9는 비만전단계(과체중), 25~29.9는 1단계 비만, 30~34.9는 2단계 비만, 35 이상은 3단계(고도) 비만으로 분류됩니다.",
  },
  {
    question: "BMI가 정상이면 건강한 것인가요?",
    answer: "BMI는 근육량과 체지방을 구분하지 못하는 한계가 있어 참고 지표로만 활용해야 합니다. 정확한 체성분 평가는 인바디 측정이나 전문의 상담을 통해 확인하는 것이 좋습니다.",
  },
  {
    question: "표준체중은 어떤 의미인가요?",
    answer: "표준체중은 \"키(m)의 제곱 × 22\"로 계산되는, BMI 22를 기준으로 한 이상적인 체중 참고치입니다.",
  },
];

export default function BmiPage() {
  return (
    <ToolPageShell
      slug="bmi"
      title={tool.title}
      description={tool.description}
      calculator={<BmiCalculator />}
      faqs={faqs}
      infoBlocks={[
        {
          heading: "BMI 계산 방법",
          body: "체질량지수(BMI, Body Mass Index)는 “몸무게(kg) ÷ 키(m)²” 공식으로 계산하며, 대한비만학회는 이 수치를 기준으로 저체중, 정상, 비만전단계, 1~3단계 비만으로 분류합니다. 표준체중은 BMI 22를 기준으로 “키(m)² × 22”로 계산한 참고 체중이며, 현재 체중과의 차이를 통해 감량 또는 증량 목표를 가늠할 수 있습니다.",
        },
        {
          heading: "관련 기준",
          body: "BMI 분류 기준은 국제 표준인 세계보건기구(WHO) 기준과 한국인 체형에 맞춘 대한비만학회 기준이 다릅니다. WHO 기준은 25 이상을 비만으로 분류하지만, 아시아인은 같은 BMI라도 체지방률이 더 높게 나타나는 경향이 있어 대한비만학회는 23 이상을 비만전단계(과체중), 25 이상을 비만으로 더 엄격하게 분류합니다. 국민건강보험공단 일반건강검진의 비만 판정 기준도 대한비만학회 기준을 따릅니다.",
        },
        {
          heading: "계산 예시",
          body: "키 175cm, 몸무게 80kg인 경우 BMI는 80 ÷ 1.75² = 80 ÷ 3.0625 ≈ 26.1로 계산되어 대한비만학회 기준 “1단계 비만”에 해당합니다. 이때 표준체중은 1.75² × 22 ≈ 67.4kg이므로, 현재 체중과의 차이는 약 +12.6kg입니다. 반대로 키 160cm, 몸무게 45kg이라면 BMI는 45 ÷ 1.6² ≈ 17.6으로 “저체중”에 해당하며, 표준체중 56.3kg 대비 약 -11.3kg 적은 상태입니다.",
        },
        {
          heading: "자주 하는 실수",
          body: "키를 cm 단위 그대로 제곱해 계산하거나(m가 아닌 cm 단위 실수), 미터 환산을 잊고 계산해 결과가 비정상적으로 작거나 크게 나오는 경우가 흔합니다. 또한 근력 운동을 꾸준히 해 근육량이 많은 사람은 체지방률이 낮음에도 BMI만으로는 과체중·비만으로 분류될 수 있으므로, BMI 수치 하나만으로 체형이나 건강 상태를 단정짓지 않는 것이 중요합니다. 성장기 어린이·청소년은 성인 기준 BMI 분류표를 그대로 적용할 수 없고 소아청소년 성장도표의 연령별 백분위수를 따로 확인해야 합니다.",
        },
      ]}
    />
  );
}
