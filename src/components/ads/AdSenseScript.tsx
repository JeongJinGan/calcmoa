import Script from "next/script";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * 애드센스 승인 후 Vercel 환경변수에 NEXT_PUBLIC_ADSENSE_CLIENT(ca-pub-...)를 등록하면
 * 전역 스크립트가 자동으로 삽입된다. 승인 전에는 아무것도 렌더링하지 않는다.
 */
export default function AdSenseScript() {
  if (!ADSENSE_CLIENT) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
