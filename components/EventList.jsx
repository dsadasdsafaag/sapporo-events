"use client";

import { useEffect, useRef } from "react";

export default function EventList({ items, onSelect, selectedId, categoryLabel }) {
  const refs = useRef({});

  useEffect(() => {
    if (!selectedId) return;
    const el = refs.current[selectedId];
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedId]);

  return (
    <div style={{ overflowY: "auto", height: "calc(100% - 48px)" }}>
      {items.map((it) => (
        <div
          className={`card ${selectedId === it.id ? "active" : ""}`}
          key={it.id}
          ref={(el) => (refs.current[it.id] = el)}
          onClick={() => onSelect(it.id)}
        >
          <div className="card-title">{it.title}</div>
          <div className="card-meta">
            <span>{it.start_date}〜{it.end_date}</span>
            <span>{it.venue_name}</span>
            <span className={`badge ${it.category}`}>{categoryLabel[it.category] || "その他"}</span>
            {it.price_min === 0 ? <span className="badge">無料</span> : null}
          </div>
          {it.url_official ? (
            <div style={{ marginTop: 6 }}>
              <a href={it.url_official} target="_blank" rel="noreferrer">公式サイトを見る</a>
            </div>
          ) : null}
        </div>
      ))}
      {items.length === 0 && (
        <div style={{ padding: 16, color: "#94a3b8" }}>
          条件に合うイベントが見つかりませんでした。条件を変更してください。
        </div>
      )}
    </div>
  );
}
