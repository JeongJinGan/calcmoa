import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/tools";

export const alt = `${siteConfig.name} - 무료 생활·금융 계산기 모음`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data for opengraph-image");
}

export default async function Image() {
  const title = siteConfig.name;
  const subtitle = "연봉 · 퇴직금 · 대출 · 세금 계산기 모음";
  const domain = "calcmoa.vercel.app";

  const fontData = await loadGoogleFont("Noto+Sans+KR:wght@700", title + subtitle + domain);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 55%, #1e3a8a 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: 14,
            borderRadius: 26,
            background: "rgba(255,255,255,0.16)",
            marginBottom: 40,
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.95)" }} />
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.95)" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.95)" }} />
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.95)" }} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 34,
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 26,
            fontWeight: 700,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {domain}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Noto Sans KR", data: fontData, style: "normal", weight: 700 }],
    }
  );
}
