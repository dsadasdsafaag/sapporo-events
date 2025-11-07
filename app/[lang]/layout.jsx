import "../globals.css";

export const dynamicParams = false;
export const locales = ["ja", "en", "zh-hant", "ko", "es"];

export async function generateStaticParams() {
  return locales.map((l) => ({ lang: l }));
}

export async function generateMetadata({ params }) {
  const { lang } = params;
  const base = typeof window === "undefined" ? process.env.NEXT_PUBLIC_SITE_ORIGIN || "" : window.location.origin;
  const alternates = {};
  alternates.languages = Object.fromEntries(
    locales.map((l) => [l === "ja" ? "ja-JP" : l, `${(base || "")}/${l}/`])
  );
  return {
    title: "Today in Sapporo | Things To Do",
    description: "Find things to do in Sapporo today, this weekend, and next week with a synchronized map.",
    alternates: { languages: alternates.languages },
  };
}

export default function LangLayout({ children, params }) {
  const { lang } = params;
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
