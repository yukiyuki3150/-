import React, { useState, useContext } from "react";

import { Link } from "react-router-dom";
import {
  CalendarDays,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Plus,
  Download,
  Share2,
  Upload,
} from "../../icons";
import { days } from "../../data/mock";
import { CampusContext } from "../../lib/context";
import { Title } from "../../components/Display";
import { Grid } from "../../components/Grid";
import { Filters } from "../../components/Filters";
import { download } from "../../lib/download";
import { parseCSV, csvCell } from "../../lib/csv";
import { weekDate } from "../../lib/dates";
import { createTimetableICS } from "../../lib/ics";

export function Timetable() {
  const {
    catalog,
    setCatalog,
    registered,
    setRegistered,
    setDraft,
    reg,
    tell,
    openCourse,
    setModal,
  } = useContext(CampusContext);
  const [results, setResults] = useState(catalog),
    [searched, setSearched] = useState(false),
    [view, setView] = useState("week"),
    [offset, setOffset] = useState(0);
  const monthDate = new Date(Date.UTC(2026, 9 + Math.floor(offset / 4), 1));
  const monthStart = new Date(monthDate);
  monthStart.setUTCDate(1 - ((monthDate.getUTCDay() + 6) % 7));
  const monthWeeks = Math.ceil(
    (((monthDate.getUTCDay() + 6) % 7) +
      new Date(
        Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth() + 1, 0),
      ).getUTCDate()) /
      7,
  );
  const exportCSV = () =>
    download(
      "campus-hub-timetable.csv",
      "\uFEFF" +
        [
          [
            "id",
            "科目名",
            "曜日",
            "時限",
            "教員",
            "教室",
            "単位",
            "区分",
            "種別",
          ],
          ...reg.map((c) => [
            c.id,
            c.name,
            days[c.day],
            c.period,
            c.teacher,
            c.room,
            c.credits,
            c.category,
            c.type,
          ]),
        ]
          .map((r) => r.map(csvCell).join(","))
          .join("\r\n"),
      "text/csv;charset=utf-8",
    );
  const exportICS = () =>
    download(
      "campus-hub.ics",
      createTimetableICS(reg),
      "text/calendar;charset=utf-8",
    );
  async function importCSV(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = parseCSV(await file.text());
      if (rows[0]?.[0] !== "id" || rows[0]?.[1] !== "科目名")
        throw Error(
          "Campus Hubの書き出し形式（id,科目名,曜日,時限…）を使用してください",
        );
      const imported = rows.slice(1).map((r) => {
        const existing = catalog.find((c) => c.id === r[0]);
        const day = days.indexOf(r[2]),
          period = Number(r[3]),
          credits = Number(r[6]);
        if (
          !r[0] ||
          !r[1] ||
          day < 0 ||
          period < 1 ||
          period > 6 ||
          !Number.isInteger(period) ||
          !Number.isFinite(credits) ||
          credits <= 0
        )
          throw Error("曜日・時限・単位に不正な値があります");
        return {
          ...existing,
          id: r[0],
          name: r[1],
          day,
          period,
          teacher: r[4],
          room: r[5],
          credits,
          category: r[7] || "自由選択",
          type: r[8] || "選択",
          color: existing?.color ?? 0,
          faculty: "経済学部",
          summary: existing?.summary || "CSVから取り込んだ科目です。",
        };
      });
      if (new Set(imported.map((c) => c.id)).size !== imported.length)
        throw Error("科目IDが重複しています");
      setCatalog((a) => [
        ...a.filter((c) => !imported.some((i) => i.id === c.id)),
        ...imported,
      ]);
      setRegistered(imported.map((c) => c.id));
      setDraft(imported.map((c) => c.id));
      tell(`${imported.length}科目を取り込みました`);
    } catch (err) {
      tell(`取り込み失敗：${err.message}`);
    }
    e.target.value = "";
  }
  return (
    <>
      <section className="panel syllabus">
        <h3>
          <BookOpen />
          シラバス検索
        </h3>
        <Filters
          syllabus
          onChange={(r) => {
            setResults(r);
          }}
        />
        <button className="text-button" onClick={() => setSearched(!searched)}>
          {searched
            ? "検索結果を閉じる"
            : `検索結果を表示 (${results.length}件)`}
        </button>
        {searched && (
          <div className="search-results">
            {results.map((c) => (
              <button key={c.id} onClick={() => openCourse(c)}>
                {c.name}
                <small>
                  {days[c.day]}
                  {c.period}限 · {c.teacher}
                </small>
              </button>
            ))}
            {!results.length && <p>該当する科目がありません。</p>}
          </div>
        )}
      </section>
      <Title title="時間割" subtitle="2026年度 後期">
        <Link
          className="primary"
          to="/student/registration"
          onClick={() => setDraft(registered)}
        >
          <Plus size={18} />
          履修登録
        </Link>
      </Title>
      <div className="timetable-layout">
        <section className="panel">
          <div className="week-controls">
            <div>
              <button
                aria-label="前へ"
                onClick={() => setOffset((o) => o - (view === "month" ? 4 : 1))}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                aria-label="次へ"
                onClick={() => setOffset((o) => o + (view === "month" ? 4 : 1))}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <b>
              {view === "month"
                ? `${monthDate.getUTCFullYear()}年 ${monthDate.getUTCMonth() + 1}月`
                : `2026年 ${weekDate(offset)}〜${weekDate(offset, 4)}`}
            </b>
            <button onClick={() => setOffset(0)}>今週</button>
            <div className="segmented">
              <button
                className={view === "week" ? "active" : ""}
                onClick={() => setView("week")}
              >
                週
              </button>
              <button
                className={view === "month" ? "active" : ""}
                onClick={() => setView("month")}
              >
                月
              </button>
            </div>
          </div>
          {view === "week" ? (
            <Grid items={reg} offset={offset} />
          ) : (
            <div className="month-grid">
              {days.map((d) => (
                <b key={d}>{d}</b>
              ))}
              {Array.from({ length: monthWeeks * 5 }, (_, i) => (
                <div key={i}>
                  <b>
                    {(() => {
                      const d = new Date(monthStart);
                      d.setUTCDate(
                        d.getUTCDate() + (i % 5) + Math.floor(i / 5) * 7,
                      );
                      return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
                    })()}
                  </b>
                  {reg
                    .filter((c) => c.day === i % 5)
                    .map((c) => (
                      <button
                        key={c.id}
                        onClick={() => openCourse(c)}
                        className={`color${c.color}`}
                      >
                        {c.period}限 {c.name}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          )}
        </section>
        <aside>
          <section className="panel">
            <h3>登録科目一覧（今学期）</h3>
            {reg.map((c) => (
              <button
                className="registered-row"
                key={c.id}
                onClick={() => openCourse(c)}
              >
                <i className={`dot color${c.color}`} />
                <b>{c.name}</b>
                <small>
                  {days[c.day]}
                  {c.period}限 · {c.room}
                </small>
                <ChevronRight size={14} />
              </button>
            ))}
            {!reg.length && (
              <p className="empty">履修登録から科目を追加してください。</p>
            )}
          </section>
          <section className="panel">
            <h3>クイックアクション</h3>
            <div className="quick-actions">
              <button onClick={exportICS}>
                <CalendarDays />
                <b>個人カレンダー連携</b>
                <small>Googleカレンダー用 .ics</small>
              </button>
              <button onClick={() => window.print()}>
                <Download />
                <b>時間割をダウンロード</b>
                <small>印刷・PDF保存</small>
              </button>
              <button
                onClick={() =>
                  setModal({
                    title: "時間割を友達に共有",
                    body: (
                      <>
                        <p>共有リンク（プレビュー用）</p>
                        <input
                          readOnly
                          value={`${location.href.split("#")[0]}#/student/timetable?share=preview`}
                        />
                        <p className="muted">
                          このリンクには個人の時間割データは含まれません。
                        </p>
                        <button
                          onClick={() =>
                            tell(
                              "画像出力のデモです。印刷機能でPDFを保存できます。",
                            )
                          }
                        >
                          画像出力（デモ）
                        </button>
                      </>
                    ),
                  })
                }
              >
                <Share2 />
                <b>時間割の共有</b>
                <small>共有リンク・画像出力</small>
              </button>
              <button onClick={exportCSV}>
                <Download />
                <b>CSV書き出し</b>
                <small>登録科目を一括保存</small>
              </button>
              <label className="upload">
                <Upload />
                <b>CSV取り込み</b>
                <small>書き出したCSVで一括登録</small>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={importCSV}
                />
              </label>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
