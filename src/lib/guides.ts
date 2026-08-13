import { calculateSalary } from "@/lib/calculators/salary";
import { getToolBySlug } from "@/lib/tools";

export type GuideBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "note"; text: string };

export interface GuideMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  summary: string;
  updatedLabel: string;
  relatedTool: string;
  emoji: string;
  blocks: GuideBlock[];
}

function formatWon(amount: number): string {
  return `${Math.round(amount).toLocaleString("ko-KR")}원`;
}

const SALARY_TABLE_ANNUAL_MAN = [2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 7000, 8000, 9000, 10000];

const salaryTableRows = SALARY_TABLE_ANNUAL_MAN.map((man) => {
  const annualSalary = man * 10_000;
  const result = calculateSalary({
    annualSalary,
    monthlyNonTaxable: 200_000,
    dependents: 1,
    childrenUnder20: 0,
  });
  return [`${man.toLocaleString("ko-KR")}만원`, formatWon(result.monthlyNet), formatWon(result.annualNet)];
});

const minimumWageHistoryRows = [
  ["2023년", "9,620원", "-"],
  ["2024년", "9,860원", "+2.5%"],
  ["2025년", "10,030원", "+1.7%"],
  ["2026년", "10,320원", "+2.9%"],
];

export const guides: GuideMeta[] = [
  {
    slug: "salary-net-pay-table-2026",
    title: "2026년 연봉 실수령액표 (연봉별 세후 월급 총정리)",
    shortTitle: "연봉 실수령액표",
    description:
      "연봉 2,500만원부터 1억원까지, 4대보험료와 소득세를 반영한 2026년 기준 세후 실수령액을 연봉 구간별 표로 정리했습니다.",
    summary: "연봉별 세후 실수령액을 표 하나로 바로 확인하세요.",
    updatedLabel: "2026년 8월 기준",
    relatedTool: "salary",
    emoji: "📊",
    blocks: [
      {
        type: "paragraph",
        text: "연봉 실수령액은 세전 연봉에서 국민연금·건강보험·장기요양보험·고용보험(4대보험) 본인 부담분과 근로소득세, 지방소득세를 뺀 금액입니다. 같은 연봉이라도 비과세액, 부양가족 수에 따라 실수령액이 달라지기 때문에, 아래 표는 월 비과세액 20만원(식대), 부양가족 1명(본인만 공제) 기준으로 계산한 참고용 예시입니다.",
      },
      {
        type: "table",
        headers: ["세전 연봉", "월 실수령액(예상)", "연 실수령액(예상)"],
        rows: salaryTableRows,
      },
      {
        type: "note",
        text: "위 표는 2026년 기준 국민연금·건강보험 요율과 근로소득세 간이세액표를 반영한 추정치이며, 실제 급여명세서 금액은 회사의 비과세 항목 처리, 부양가족·자녀 세액공제 신고 내역, 연말정산 정산 시점에 따라 달라질 수 있습니다.",
      },
      {
        type: "heading",
        text: "표에 없는 연봉이거나 비과세액·부양가족 수가 다르다면",
      },
      {
        type: "paragraph",
        text: "위 표는 대표적인 연봉 구간을 20만원 비과세, 부양가족 1명 기준으로 단순화한 것입니다. 실제 본인의 비과세액(식대, 자가운전보조금 등)과 부양가족·자녀 수를 입력해 정확한 예상 실수령액을 계산하려면 연봉 실수령액 계산기를 이용해보세요.",
      },
      {
        type: "heading",
        text: "실수령액이 표보다 적게 나온다면 확인할 점",
      },
      {
        type: "list",
        items: [
          "비과세액을 실제보다 적게 입력하지 않았는지 (식대 월 최대 20만원, 자가운전보조금 등)",
          "부양가족 수에 본인을 포함했는지 (본인만 있어도 최소 1명으로 계산)",
          "상여금·성과급을 연봉 총액에 합산해서 입력했는지",
          "회사의 실제 원천징수는 국세청 근로소득 간이세액표를 기준으로 하며, 연말정산에서 최종 정산된다는 점",
        ],
      },
    ],
  },
  {
    slug: "minimum-wage-2026",
    title: "2026년 최저임금 10,320원 총정리 (월급 환산·연도별 비교)",
    shortTitle: "2026년 최저임금",
    description:
      "2026년 최저임금(최저시급)은 10,320원으로 확정되었습니다. 주 40시간 기준 월급 환산액과 연도별 최저임금 추이, 주휴수당·야간수당 계산 방법을 정리했습니다.",
    summary: "2026년 최저시급 10,320원, 월급으로는 얼마인지 확인하세요.",
    updatedLabel: "2026년 8월 기준",
    relatedTool: "hourly-wage",
    emoji: "🕒",
    blocks: [
      {
        type: "paragraph",
        text: "고용노동부 고시에 따라 2026년 적용 최저임금은 시간급 10,320원으로 확정되었습니다. 2025년 10,030원 대비 290원(2.9%) 인상된 금액이며, 노사가 합의로 결정한 것이 17년 만이라는 점에서도 주목받았습니다.",
      },
      {
        type: "heading",
        text: "연도별 최저임금 추이",
      },
      {
        type: "table",
        headers: ["연도", "시간급", "전년 대비 인상률"],
        rows: minimumWageHistoryRows,
      },
      {
        type: "heading",
        text: "월급으로 환산하면 얼마?",
      },
      {
        type: "paragraph",
        text: "주 40시간(하루 8시간, 주 5일) 근무를 기준으로 주휴시간(8시간)까지 포함한 월 소정근로시간은 209시간입니다. 따라서 2026년 최저임금을 월급으로 환산하면 10,320원 × 209시간 = 2,156,880원이 세전 월 최저임금입니다. 여기서 4대보험료와 소득세를 제외한 세후 실수령액은 부양가족 수에 따라 다르지만 대략 192만원 안팎입니다.",
      },
      {
        type: "heading",
        text: "최저임금에 포함되는 항목, 안 되는 항목",
      },
      {
        type: "list",
        items: [
          "포함: 매월 정기적으로 지급되는 기본급과 각종 수당(직책수당, 근속수당 등 매월 1회 이상 지급되는 임금)",
          "제외: 연장·야간·휴일근로수당처럼 소정근로시간을 초과해 지급되는 수당",
          "제외: 상여금·복리후생비 중 일부 항목(연도별 산입 비율에 대한 세부 기준은 최저임금법 시행규칙에 따라 다를 수 있음)",
        ],
      },
      {
        type: "heading",
        text: "내 급여가 최저임금 위반인지 확인하려면",
      },
      {
        type: "paragraph",
        text: "시급이 아니라 주급·월급으로 급여를 받는 아르바이트나 단시간 근로자는 주휴수당을 포함해 실제 시급을 역산해봐야 최저임금 위반 여부를 정확히 알 수 있습니다. 시급·주간 근무시간을 입력하면 주휴수당을 포함한 예상 급여를 계산해주는 시급 계산기로 확인해보세요. 연장·야간근로가 있다면 야근수당 계산기로 가산수당까지 함께 확인할 수 있습니다.",
      },
    ],
  },
  {
    slug: "severance-pay-not-paid",
    title: "퇴직금 못 받았을 때 대처법 (지급기한·지연이자·진정 신고)",
    shortTitle: "퇴직금 미지급 대처법",
    description:
      "퇴직금 지급기한(14일)이 지났는데도 못 받았다면 연 20% 지연이자와 함께 고용노동부 진정 절차를 통해 받을 수 있습니다. 신고 방법과 절차를 단계별로 정리했습니다.",
    summary: "지급기한이 지났다면 지연이자와 진정 신고 절차부터 확인하세요.",
    updatedLabel: "2026년 8월 기준",
    relatedTool: "severance",
    emoji: "⚖️",
    blocks: [
      {
        type: "heading",
        text: "퇴직금 지급기한은 퇴직일로부터 14일",
      },
      {
        type: "paragraph",
        text: "근로기준법 제36조에 따라 사용자는 근로자가 퇴직한 날로부터 14일 이내에 퇴직금을 포함한 모든 임금을 지급해야 합니다. 다만 천재지변이나 그 밖에 특별한 사정이 있는 경우에는 당사자 사이의 합의로 지급기일을 연장할 수 있습니다.",
      },
      {
        type: "heading",
        text: "기한을 넘기면 연 20% 지연이자",
      },
      {
        type: "paragraph",
        text: "정당한 사유 없이 14일이 지나도록 퇴직금을 지급하지 않으면, 근로기준법 제37조에 따라 15일째 되는 날부터 실제 지급일까지의 기간에 대해 연 20%의 지연이자가 발생합니다. 이는 일반 법정이율(연 5~6%)보다 훨씬 높은 수준으로, 사업주에게 신속한 지급을 강제하기 위한 규정입니다.",
      },
      {
        type: "heading",
        text: "받지 못했다면 단계별 대처법",
      },
      {
        type: "list",
        items: [
          "1단계 - 회사에 서면(문자, 이메일, 내용증명)으로 미지급 사실과 지급 요청 날짜를 명확히 남겨 요청합니다.",
          "2단계 - 그래도 지급되지 않으면 고용노동부 고용노동민원마당(온라인) 또는 사업장 관할 지방고용노동청에 '임금체불 진정서'를 제출합니다. 근로계약서, 급여명세서, 재직증명서 등 재직 사실과 급여를 증명할 자료를 함께 준비하면 처리가 빨라집니다.",
          "3단계 - 근로감독관의 조사에도 사업주가 지급을 거부하면 사업주는 근로기준법 제109조에 따라 형사처벌 대상이 될 수 있고, 근로자는 별도로 민사소송(지급명령, 소액사건심판 등)을 통해 청구할 수 있습니다.",
          "4단계 - 회사가 도산했거나 지급 능력이 없는 경우에는 국가가 대신 지급해주는 대지급금(구 체당금) 제도를 근로복지공단에 신청할 수 있습니다.",
        ],
      },
      {
        type: "note",
        text: "본 내용은 일반적인 절차 안내이며, 개별 사안의 구체적인 법적 조언은 고용노동부 상담센터(국번없이 1350) 또는 공인노무사·변호사 등 전문가를 통해 확인하시기 바랍니다.",
      },
      {
        type: "heading",
        text: "받아야 할 정확한 퇴직금 금액이 궁금하다면",
      },
      {
        type: "paragraph",
        text: "진정을 넣거나 지연이자를 계산하려면 먼저 원래 받았어야 할 퇴직금이 얼마인지부터 알아야 합니다. 입사일·퇴사일과 최근 3개월 급여를 입력하면 근로기준법 평균임금 기준 예상 퇴직금을 바로 계산해주는 퇴직금 계산기를 먼저 확인해보세요.",
      },
    ],
  },
];

export function getGuideBySlug(slug: string): GuideMeta | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getGuideRelatedTool(guide: GuideMeta) {
  return getToolBySlug(guide.relatedTool);
}
