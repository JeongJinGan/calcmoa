import type { Metadata } from "next";
import { siteConfig } from "@/lib/tools";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${siteConfig.name}의 개인정보처리방침 및 쿠키, 광고 정책 안내`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">개인정보처리방침</h1>
      <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert prose-sm">
        <p>
          {siteConfig.name}(이하 &ldquo;사이트&rdquo;)은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등
          관련 법규를 준수하고 있습니다. 본 방침은 사이트가 어떤 정보를 수집하고 어떻게 이용하는지 안내합니다.
        </p>

        <h2>1. 수집하는 정보</h2>
        <p>
          사이트의 모든 계산기는 서버로 데이터를 전송하지 않는 클라이언트 사이드 계산 방식으로 동작하며, 입력하신
          연봉, 생년월일 등의 정보는 이용자의 브라우저 내에서만 처리되고 서버에 저장되지 않습니다. 다만 방문
          통계 분석 및 광고 서비스 제공을 위해 아래와 같은 자동 수집 정보가 활용될 수 있습니다.
        </p>

        <h2>2. Google Analytics 사용</h2>
        <p>
          사이트는 방문자 통계 분석을 위해 Google Analytics를 사용하며, 이 과정에서 쿠키를 통해 IP 주소, 방문
          페이지, 접속 기기 정보 등이 비식별 형태로 수집될 수 있습니다. 수집된 정보는 Google의{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            개인정보처리방침
          </a>
          에 따라 처리됩니다.
        </p>

        <h2>3. 광고 서비스(Google 애드센스) 사용</h2>
        <p>
          사이트는 Google 애드센스를 통해 광고를 게재할 수 있습니다. Google 및 제3자 공급업체는 쿠키를 사용하여
          이용자의 사이트 방문 이력을 기반으로 맞춤 광고를 제공할 수 있습니다. 이용자는{" "}
          <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
            Google 광고 설정
          </a>
          에서 맞춤 광고를 거부할 수 있습니다.
        </p>

        <h2>4. 쿠키의 거부</h2>
        <p>
          이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. 다만 쿠키 저장을 거부할 경우 일부
          서비스 이용에 어려움이 있을 수 있습니다.
        </p>

        <h2>5. 문의</h2>
        <p>
          개인정보처리방침에 대한 문의사항은{" "}
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>로 연락해 주시기 바랍니다.
        </p>

        <h2>6. 방침 변경</h2>
        <p>본 방침은 법령 및 서비스 변경에 따라 개정될 수 있으며, 변경 시 본 페이지를 통해 공지합니다.</p>

        <p className="text-xs text-neutral-500">시행일: 2026년 7월 24일</p>
      </div>
    </div>
  );
}
