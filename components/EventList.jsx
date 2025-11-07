"use client";

import { useEffect, useRef } from "react";
import { getCategoryLabel, t } from "../lib/i18n";

export default function EventList({ items, onSelect, selectedId, lang }) {
  const refs = useRef({});

  useEffect(() => {
    if (!selectedId) return;
    const el = refs.current[selectedId];
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedId]);

  function displayTitle(it) {
    // 多言語優先：title_xx があれば使う
    const key = `title_${lang.replace("-", "_")}`;
    return (it[key] || it.title_en || it.title);
  }

  return (
    <div style={{ overflowY: "auto", height: "calc(100% - 48px)" }}>
      {items.map((it) => (
        <div
          className={`card ${selectedId === it.id ? "active" : ""}`}
          key={it.id}
          ref={(el) => (refs.current[it.id] = el)}
          onClick={() => onSelect(it.id)}
        >
          <div className="card-title">{displayTitle(it)}</div>
          <div className="card-meta">
            <span>{it.start_date}〜{it.end_date}</span>
            <span>{it.venue_name}</span>
            <span className={`badge ${it.category}`}>{getCategoryLabel(it.category, lang)}</span>
            {it.price_min === 0 ? <span className="badge">{t("common.free", lang)}</span> : null}
          </div>
          {it.url_official ? (
            <div style={{ marginTop: 6 }}>
              <a href={it.url_official} target="_blank" rel="noreferrer">{t("common.officialSite", lang)}</a>
            </div>
          ) : null}
        </div>
      ))}
      {items.length === 0 && (
        <div style={{ padding: 16, color: "#94a3b8" }}>
          {t("list.empty", lang)}
        </div>
      )}
    </div>
  );
}
