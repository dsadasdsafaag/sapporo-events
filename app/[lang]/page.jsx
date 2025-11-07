"use client";

import { useEffect, useMemo, useState } from "react";
import eventsData from "../../data/events.json";
import MapView from "../../components/MapView";
import EventList from "../../components/EventList";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { getCategoryLabel, t } from "../../lib/i18n";

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

export default function Page({ params }) {
  const lang = params.lang || "ja";

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
        const key = `title_${lang.replace("-", "_")}`;
        const alt = (ev[key] || ev.title_en || ev.title || "").toLowerCase();
        return (
          alt.includes(q) ||
          (ev.venue_name || "").toLowerCase().includes(q)
        );
      });
  }, [category, when, search, lang]);

  useEffect(() => {
    if (selectedId && !filtered.some((e) => e.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  return (
    <div className="wrapper">
      <header className="header">
        <div className="brand">{t("brand", lang)}</div>
        <div className="legend">
          <span className="legend-item"><span className="legend-dot" style={{background:"var(--pin-festival)"}}></span>{t("legend.festival", lang)}</span>
          <span className="legend-item"><span className="legend-dot" style={{background:"var(--pin-indoor)"}}></span>{t("legend.indoor", lang)}</span>
          <span className="legend-item"><span className="legend-dot" style={{background:"var(--pin-learn)"}}></span>{t("legend.learn", lang)}</span>
          <span className="legend-item"><span className="legend-dot" style={{background:"var(--pin-other)"}}></span>{t("legend.other", lang)}</span>
        </div>
        <div className="controls">
          <button className={`btn ${when==="today"?"active":""}`} onClick={()=>setWhen("today")}>{t("filter.today", lang)}</button>
          <button className={`btn ${when==="weekend"?"active":""}`} onClick={()=>setWhen("weekend")}>{t("filter.weekend", lang)}</button>
          <button className={`btn ${when==="nextweek"?"active":""}`} onClick={()=>setWhen("nextweek")}>{t("filter.nextweek", lang)}</button>
          <button className={`btn ${when==="all"?"active":""}`} onClick={()=>setWhen("all")}>{t("filter.all", lang)}</button>

          <select className="select" value={category} onChange={(e)=>setCategory(e.target.value)}>
            <option value="all">{t("filter.allCategories", lang)}</option>
            <option value="festival">{getCategoryLabel("festival", lang)}</option>
            <option value="indoor">{getCategoryLabel("indoor", lang)}</option>
            <option value="learn">{getCategoryLabel("learn", lang)}</option>
            <option value="other">{getCategoryLabel("other", lang)}</option>
          </select>

          <LanguageSwitcher current={lang} />
        </div>
      </header>

      <div className="list">
        <div className="list-header">
          <input
            className="search"
            placeholder={t("common.searchPlaceholder", lang)}
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
          <a href="https://www.openstreetmap.org/copyright" target="_blank" className="btn" rel="noreferrer">{t("common.osm", lang)}</a>
        </div>
        <EventList
          items={filtered}
          onSelect={(id)=>setSelectedId(id)}
          selectedId={selectedId}
          lang={lang}
        />
      </div>

      <div className="map">
        <MapView
          items={filtered}
          selectedId={selectedId}
          onSelect={(id)=>setSelectedId(id)}
          lang={lang}
        />
      </div>
    </div>
  );
}
