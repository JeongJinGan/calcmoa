import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import RouletteGame from "@/components/games/RouletteGame";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("roulette")!;

export const metadata: Metadata = {
  title: "랜덤 룰렛 - 돌림판으로 무작위 뽑기",
  description:
    "메뉴, 이름, 순서 등 선택지를 자유롭게 입력하고 돌림판을 돌리면 무작위로 하나를 뽑아주는 무료 온라인 랜덤 룰렛입니다.",
  alternates: { canonical: "/roulette" },
};

const faqs = [
  {
    question: "모든 선택지가 뽑힐 확률이 같나요?",
    answer:
      "네, 돌림판은 선택지 개수만큼 동일한 각도로 나뉘며, 최종적으로 어느 칸에 멈출지는 균등한 확률로 무작위 결정됩니다. 특정 항목이 더 잘 뽑히도록 가중치를 두지 않습니다.",
  },
  {
    question: "선택지는 몇 개까지 넣을 수 있나요?",
    answer: "최소 2개부터 최대 10개까지 자유롭게 추가하거나 삭제할 수 있습니다.",
  },
  {
    question: "같은 결과가 연속으로 나올 수도 있나요?",
    answer:
      "네, 매번 독립적으로 무작위 추첨하기 때문에 이전 결과와 상관없이 같은 항목이 연속으로 나올 수도 있습니다. 실제 돌림판을 여러 번 돌리는 것과 동일한 확률 구조입니다.",
  },
  {
    question: "어떤 용도로 쓰면 좋을까요?",
    answer:
      "점심 메뉴 정하기, 여행지 후보 중 하나 고르기, 발표자·당첨자 뽑기, 미니 게임의 순서 정하기 등 여러 선택지 중 하나를 공정하게 무작위로 골라야 할 때 활용할 수 있습니다.",
  },
];

export default function RoulettePage() {
  return (
    <ToolPageShell
      slug="roulette"
      title={tool.title}
      description={tool.description}
      calculator={<RouletteGame />}
      faqs={faqs}
      infoBlocks={[
        {
          heading: "랜덤 룰렛 사용 방법",
          body: "하단의 '선택지 편집'에서 원하는 항목을 입력하고 '돌리기' 버튼을 누르면, 돌림판이 빠르게 회전하다가 점점 느려지며 하나의 칸에 멈춥니다. 멈춘 칸이 화면 상단 포인터가 가리키는 항목이 이번 추첨의 결과입니다.",
        },
        {
          heading: "결과가 무작위로 결정되는 원리",
          body: "돌림판은 선택지 개수(N)만큼 360도를 N등분해 각 항목에 동일한 면적을 배정합니다. '돌리기'를 누르면 여러 바퀴를 추가로 회전한 뒤, 그중 무작위로 고른 한 칸이 정확히 포인터 위치에 오도록 회전 각도를 계산합니다. 즉 도는 모습은 볼거리이고, 실제 당첨 항목은 회전이 시작되는 순간 이미 무작위로 정해집니다.",
        },
        {
          heading: "활용 예시",
          body: "점심 메뉴 4~5개를 입력해두고 매일 점심시간에 돌려서 메뉴를 정하거나, 여행 후보지·발표 순서·청소 당번을 무작위로 정할 때 사용할 수 있습니다. 항목 수가 적을수록 각 항목이 뽑힐 확률이 높아지므로, 공정한 추첨을 원한다면 후보를 미리 추려서 입력하는 것이 좋습니다.",
        },
      ]}
    />
  );
}
