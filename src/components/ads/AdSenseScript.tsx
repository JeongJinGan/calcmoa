const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * 애드센스 승인 후 Vercel 환경변수에 NEXT_PUBLIC_ADSENSE_CLIENT(ca-pub-...)를 등록하면
 * 전역 스크립트가 자동으로 삽입된다. 승인 전에는 아무것도 렌더링하지 않는다.
 *
 * next/script는 beforeInteractive 전략에서도 실제 <script> 태그 대신 로더 데이터로
 * 삽입되어 JS를 실행하지 않는 크롤러(애드센스 사이트 소유권 확인 등)가 태그를 읽지
 * 못한다. 이 태그는 반드시 서버 HTML에 원문 그대로 존재해야 하므로 네이티브
 * <script> 엘리먼트를 직접 렌더링한다.
 */
export default function AdSenseScript() {
  if (!ADSENSE_CLIENT) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
