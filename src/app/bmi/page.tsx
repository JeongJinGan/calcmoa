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
      infoContent={
        <>
          <h2>BMI 계산 방법</h2>
          <p>
            체질량지수(BMI, Body Mass Index)는 &ldquo;몸무게(kg) ÷ 키(m)²&rdquo; 공식으로 계산하며, 대한비만학회는
            이 수치를 기준으로 저체중, 정상, 비만전단계, 1~3단계 비만으로 분류합니다. 표준체중은 BMI 22를 기준으로
            &ldquo;키(m)² × 22&rdquo;로 계산한 참고 체중이며, 현재 체중과의 차이를 통해 감량 또는 증량 목표를 가늠할
            수 있습니다. BMI는 근육량이 많은 사람에게는 실제 체지방률보다 높게 나타날 수 있어 절대적인 건강 지표로
            보기보다는 참고용으로 활용하는 것이 좋습니다.
          </p>
        </>
      }
    />
  );
}
