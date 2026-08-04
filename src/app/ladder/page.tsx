import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import LadderGameLoader from "@/components/games/LadderGameLoader";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("ladder")!;

export const metadata: Metadata = {
  title: "사다리타기 게임 - 온라인 무료 사다리타기",
  description:
    "참가자와 결과를 자유롭게 입력하고 사다리를 타면 무작위로 당첨자, 벌칙자, 순서를 정할 수 있는 무료 온라인 사다리타기 게임입니다.",
  alternates: { canonical: "/ladder" },
};

const faqs = [
  {
    question: "사다리타기 결과는 정말 무작위인가요?",
    answer:
      "네, 사다리를 새로 섞을 때마다 가로줄(사다리 칸)의 위치가 매번 무작위로 다시 생성되며, 한 번 생성된 사다리 안에서는 각 참가자가 정확히 하나의 결과와 연결되는 정상적인 사다리 구조를 보장합니다.",
  },
  {
    question: "인원수는 최대 몇 명까지 가능한가요?",
    answer: "2명부터 15명까지 설정할 수 있습니다. 인원수를 바꾸면 사다리가 자동으로 새로 만들어집니다.",
  },
  {
    question: "결과를 다시 뽑고 싶으면 어떻게 하나요?",
    answer:
      "화면 상단의 '사다리 새로 섞기' 버튼을 누르면 공개된 결과가 모두 초기화되고 완전히 새로운 사다리가 생성됩니다.",
  },
  {
    question: "이름과 결과 항목을 자유롭게 바꿀 수 있나요?",
    answer:
      "네, 참가자 이름과 하단 결과 칸 모두 직접 입력한 텍스트로 바꿀 수 있습니다. '당첨/꽝' 대신 순서 정하기, 청소 당번 정하기 등 원하는 용도로 자유롭게 활용해보세요.",
  },
];

export default function LadderPage() {
  return (
    <ToolPageShell
      slug="ladder"
      title={tool.title}
      description={tool.description}
      calculator={<LadderGameLoader />}
      faqs={faqs}
      infoBlocks={[
        {
          heading: "사다리타기 하는 방법",
          body: "참가자 이름과 결과(당첨, 벌칙, 순서 등)를 원하는 내용으로 입력한 뒤, 각 참가자 이름 아래 손가락 버튼을 눌러보세요. 선을 따라 내려가는 애니메이션과 함께 해당 참가자가 어떤 결과와 연결되는지 바로 공개됩니다.",
        },
        {
          heading: "공정성은 어떻게 보장되나요",
          body: "사다리타기는 세로줄 사이에 무작위로 가로줄(사다리 칸)을 배치해 각 참가자가 정확히 하나의 결과로만 연결되도록 만드는 게임입니다. 가로줄의 위치가 매번 새롭게 무작위로 생성되기 때문에 특정 결과가 나올 확률이 참가자마다 동일하게 유지됩니다.",
        },
        {
          heading: "활용 예시",
          body: "회식이나 점심 자리에서 계산할 사람을 정하거나, 여행 방 배정, 발표 순서 정하기, 청소 당번 뽑기 등 여러 사람이 모였을 때 공정하게 하나를 정해야 하는 모든 상황에 활용할 수 있습니다. 결과 칸에 '1번 방', '2번 방'처럼 순서나 그룹을 적어두면 순서 정하기 용도로도 사용할 수 있습니다.",
        },
      ]}
    />
  );
}
