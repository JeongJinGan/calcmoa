import type { Metadata } from "next";
import ToolPageShell from "@/components/tool/ToolPageShell";
import ClawMachineLanding from "@/components/games/ClawMachineLanding";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("claw-machine")!;

export const metadata: Metadata = {
  title: "실시간 인형뽑기 - 친구들과 함께하는 온라인 뽑기 게임",
  description:
    "닉네임을 입력하고 방을 만들면 링크 하나로 친구들을 초대해 실시간으로 함께 즐기는 온라인 인형뽑기 게임입니다. 최대 6명까지 참여할 수 있습니다.",
  alternates: { canonical: "/claw-machine" },
};

const faqs = [
  {
    question: "여러 명이서 정말 실시간으로 같이 할 수 있나요?",
    answer:
      "네, 한 방에 모인 모든 사람의 집게가 서로의 화면에 실시간으로 함께 표시됩니다. 누군가 집게를 움직이거나 캡슐을 뽑으면 그 결과가 방에 있는 모든 사람에게 바로 보여집니다.",
  },
  {
    question: "PC와 스마트폰 중 어디서 사용할 수 있나요?",
    answer:
      "둘 다 가능합니다. PC에서는 마우스로 레일을 드래그해 집게를 움직이고, 스마트폰이나 태블릿에서는 손가락으로 터치해 드래그하면 동일하게 동작합니다.",
  },
  {
    question: "한 방에 몇 명까지 들어올 수 있나요?",
    answer: "최대 6명까지 함께 플레이할 수 있습니다. 인원이 가득 찬 방에는 새로 입장할 수 없으니, 새 방을 만들어 링크를 다시 공유해주세요.",
  },
  {
    question: "당첨 확률은 어떻게 되나요?",
    answer:
      "쌓여있는 캡슐 12개 중 3개가 당첨으로 미리 정해져 있습니다. 꽝을 뽑으면 그 자리는 잠시 후 다시 무작위로 채워지지만, 당첨 캡슐은 누군가 뽑는 순간 바로 사라지고 게임이 끝납니다. 결과는 서버에서 공정하게 판정되어 조작이 불가능합니다.",
  },
  {
    question: "잡기를 눌러도 매번 캡슐이 잡히나요?",
    answer:
      "아니요. 실제 인형뽑기처럼 집게 힘이 약하게 설정되어 있어서, 캡슐 바로 위에서 잡기를 눌러도 절반 정도는 아예 못 잡고 놓칩니다. 이 경우 캡슐은 그 자리에 그대로 남아 있어 다시 시도할 수 있습니다.",
  },
  {
    question: "당첨자가 나오면 게임이 끝나나요?",
    answer:
      "네, 방 안의 누구든 처음으로 당첨 캡슐을 뽑으면 그 사람이 당첨자로 화면에 공개되고 게임이 즉시 종료됩니다. 그 뒤로는 집게를 움직이거나 다시 뽑을 수 없으며, 같이 놀던 친구들과 다시 하고 싶다면 '새 방 만들기'로 새 게임을 시작하면 됩니다.",
  },
  {
    question: "방은 언제까지 유지되나요?",
    answer: "마지막 활동으로부터 약 10분간 아무도 움직이거나 뽑지 않으면 방이 자동으로 사라집니다. 다시 접속하고 싶다면 같은 링크로 새로 들어오면 됩니다.",
  },
];

export default function ClawMachinePage() {
  return (
    <ToolPageShell
      slug="claw-machine"
      title={tool.title}
      description={tool.description}
      calculator={<ClawMachineLanding />}
      hideShareButton
      faqs={faqs}
      infoBlocks={[
        {
          heading: "실시간 인형뽑기 이용 방법",
          body: "닉네임을 입력하고 '방 만들기'를 누르면 나만의 방이 만들어집니다. 방 안에서 상단의 공유 버튼으로 링크를 친구에게 보내면, 링크를 받은 친구도 닉네임만 입력하고 바로 같은 방에 합류할 수 있습니다.",
        },
        {
          heading: "집게 조작 방법",
          body: "화면 위쪽 레일을 마우스나 손가락으로 좌우로 드래그하거나, 좌우 버튼을 짧게 누르면 살짝, 꾹 누르고 있으면 계속 이동합니다. 원하는 캡슐 더미 위에 집게를 두고 '잡기' 버튼을 누르면 집게가 수직으로 내려가 가장 가까운 캡슐을 붙잡으려 시도합니다. 실제 인형뽑기처럼 힘이 약해 잡았다가 놓치는 경우도 있고, 성공해도 당첨이 아니면 올라오는 도중에 떨어뜨립니다.",
        },
        {
          heading: "공정한 결과 판정",
          body: "캡슐의 당첨 여부는 클라이언트가 아닌 서버에서 미리 정해두고 판정하기 때문에, 특정 참가자에게 유리하게 조작될 수 없습니다. 꽝이 나온 자리는 일정 시간이 지나면 새로운 캡슐로 다시 채워지지만, 당첨 캡슐이 나오는 순간 그 사람이 당첨자로 공개되며 게임이 종료됩니다.",
        },
      ]}
    />
  );
}
