import React, { useState, useEffect, useContext } from "react";

import { Search } from "../icons";
import { days, periods } from "../data/mock";
import { CampusContext } from "../lib/context";

export function Filters({ onChange, syllabus = false }) {
  const { catalog } = useContext(CampusContext);
  const [q, setQ] = useState(""),
    [faculty, setFaculty] = useState(""),
    [day, setDay] = useState(""),
    [period, setPeriod] = useState("");
  const filter = (query = q, f = faculty, d = day, p = period) =>
    onChange(
      catalog.filter(
        (c) =>
          (!query || `${c.name}${c.teacher}${c.category}`.includes(query)) &&
          (!f || c.faculty === f) &&
          (!d || c.day === Number(d)) &&
          (!p || c.period === Number(p)),
      ),
    );
  useEffect(() => {
    filter();
  }, [q, faculty, day, period, catalog]);
  return (
    <>
      <div className="search-row">
        <Search size={18} />
        <input
          aria-label="科目検索"
          placeholder="科目名・教員名・キーワードで検索"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {syllabus && (
          <button className="primary" onClick={() => filter()}>
            検索
          </button>
        )}
      </div>
      <div className="filters">
        {syllabus && (
          <label>
            開講年度
            <select>
              <option>2026年度（後期）</option>
            </select>
          </label>
        )}
        <label>
          学部・学科
          <select value={faculty} onChange={(e) => setFaculty(e.target.value)}>
            <option value="">すべての学部・学科</option>
            <option>経済学部</option>
            <option>工学部</option>
          </select>
        </label>
        <label>
          曜日
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            <option value="">すべての曜日</option>
            {days.map((d, i) => (
              <option key={d} value={i}>
                {d}曜日
              </option>
            ))}
          </select>
        </label>
        <label>
          開講時限
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="">すべての時限</option>
            {periods.map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}限
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="chips">
        {[
          "",
          "ミクロ",
          "マクロ",
          "会計",
          "データサイエンス",
          "英語",
          "統計",
        ].map((k) => (
          <button
            key={k}
            className={q === k ? "active" : ""}
            onClick={() => setQ(k)}
          >
            {k || "すべて"}
          </button>
        ))}
        <button
          onClick={() => {
            setQ("");
            setFaculty("");
            setDay("");
            setPeriod("");
          }}
        >
          条件クリア
        </button>
      </div>
    </>
  );
}
