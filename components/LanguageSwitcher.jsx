"use client";

import { usePathname } from "next/navigation";
import { LOCALES } from "../lib/i18n";

export default function LanguageSwitcher({ current }) {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/").filter(Boolean);
  const curLang = parts[0] && LOCALES.includes(parts[0]) ? parts[0] : "ja";

  function hrefFor(lang) {
    if (!parts.length) return `/${lang}/`;
    const rest = parts.slice(1).join("/");
    return `/${lang}/${rest ? rest + "/" : ""}`;
  }

  return (
    <select
      className="select"
      aria-label="Language"
      value={curLang}
      onChange={(e) => {
        window.location.href = hrefFor(e.target.value);
      }}
    >
      <option value="ja">日本語</option>
      <option value="en">English</option>
      <option value="zh-hant">繁體中文</option>
      <option value="ko">한국어</option>
      <option value="es">Español</option>
    </select>
  );
}
