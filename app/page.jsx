"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import eventsData from "../data/events.json";
import MapView from "../components/MapView";
import EventList from "../components/EventList";

const CATEGORY_LABEL = {
  festival: "祭り",
  indoor: "屋内",
  learn: "学び",
  other: "その他",
};

function isTodayInRange(start, end) {
  const now = new Date();
  const d = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const s = new Date(start + "T00:00:00+09:00");
  const e = new Date(end + "T23:59:59+09:00");
  return d >= s && d <= e;
}

function isThisWeekend(start, end) {
  const now = new Date();
  const tzNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const day = tzNow.getDay(); // 0:Sun..6:Sat
  const diffToSat = (6 - day + 7) % 7;
  const sat = new Date(tzNow); sat.setDate(tzNow.getDate() + diffToSat);
  const sun = new Date(sat); sun.setDate(sat.getDate() + 1);

  const s = new Date(start + "T00:00:00+09:00");
  const e = new Date(end + "T23:59:59+09:00");
  // 範囲が土日と交差すればOK
  return e >= sat && s <= sun;
}

function isNextWeek(start, end) {
  const now = new Date();
  const tzNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const day = tzNow.getDay();
  const diffToMon = (8 - day) % 7; // 次の月曜
  const mon = new Date(tzNow); mon.setDate(tzNow.getDate() + diffToMon);
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  const s = new Date(start + "T00:00:00+09:00");
  const e = new Date(end + "T23:59:59+09:00");
  return e >= mon && s <= sun;
}

export default function Page() {
  const [category, setCategory] = useState("all");
  const [when, setWhen] = useState("today"); // today | weekend | nextweek | all
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => {
    return eventsData
      .filter((ev) => (category === "all" ? true : ev.category === category))
      .filter((ev) => {
        if (when === "today") return isTodayInRange(ev.start_date, ev.end_date);
        if (when === "weekend") return isThisWeekend(ev.start_date, ev.end_date);
        if (when === "nextweek") return isNextWeek(ev.start_date, ev.end_date);
        return true;
      })
      .filter((ev) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          ev.title.toLowerCase().includes(q) ||
          (ev.title_en || "").toLowerCase().includes(q) ||
          (ev.venue_name || "").toLowerCase().includes(q)
        );
      });
  }, [category, when, search]);

  // 選択イベントがフィルタで消えたら選択解除
  useEffect(() => {
    if (selectedId && !filtered.some((e) => e.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  return (
    <div className="wrapper">
      <header className="header">
        <div className="brand">Today in Sapporo</div>
        <div className="legend">
          <span className="legend-item"><span className="legend-dot" style={{background:"var(--pin-festival)"}}></span>祭り</span>
          <span className="legend-item"><span className="legend-dot" style={{background:"var(--pin-indoor)"}}></span>屋内</span>
          <span className="legend-item"><span className="legend-dot" style={{background:"var(--pin-learn)"}}></span>学び</span>
          <span className="legend-item"><span className="legend-dot" style={{background:"var(--pin-other)"}}></span>その他</span>
        </div>
        <div className="controls">
          <button className={`btn ${when==="today"?"active":""}`} onClick={()=>setWhen("today")}>今日</button>
          <button className={`btn ${when==="weekend"?"active":""}`} onClick={()=>setWhen("weekend")}>今週末</button>
          <button className={`btn ${when==="nextweek"?"active":""}`} onClick={()=>setWhen("nextweek")}>来週</button>
          <button className={`btn ${when==="all"?"active":""}`} onClick={()=>setWhen("all")}>すべて</button>

          <select className="select" value={category} onChange={(e)=>setCategory(e.target.value)}>
            <option value="all">全カテゴリ</option>
            <option value="festival">祭り</option>
            <option value="indoor">屋内</option>
            <option value="learn">学び</option>
            <option value="other">その他</option>
          </select>
        </div>
      </header>

      <div className="list">
        <div className="list-header">
          <input
            className="search"
            placeholder="キーワード（例：beer, museum, market）"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
          <a href="https://www.openstreetmap.org/copyright" target="_blank" className="btn" rel="noreferrer">OSM Attribution</a>
        </div>
        <EventList
          items={filtered}
          onSelect={(id)=>setSelectedId(id)}
          selectedId={selectedId}
          categoryLabel={CATEGORY_LABEL}
        />
      </div>

      <div className="map">
        <MapView
          items={filtered}
          selectedId={selectedId}
          onSelect={(id)=>setSelectedId(id)}
        />
      </div>
    </div>
  );
}
