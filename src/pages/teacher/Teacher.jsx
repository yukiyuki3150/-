import React, { useState, useContext } from "react";

import { Link } from "react-router-dom";
import { BookOpen, Upload } from "../../icons";
import { courses as seed, students as seedStudents } from "../../data/mock";
import { CampusContext } from "../../lib/context";
import { Title } from "../../components/Display";

import { download } from "../../lib/download";
import { parseCSV } from "../../lib/csv";

import { Broadcast } from "../../components/Broadcast";

export function Teacher({ page }) {
  const { catalog, notices, rosters, setRosters, tell } =
    useContext(CampusContext);
  const [cid, setCid] = useState(seed[0].id),
    [tab, setTab] = useState(
      page === "grades"
        ? "成績入力"
        : page === "notices"
          ? "お知らせ"
          : "受講者一覧",
    ),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("");
  const course = catalog.find((c) => c.id === cid) || seed[0];
  const roster = rosters[cid] || seedStudents;
  const update = (id, patch) =>
    setRosters((a) => ({
      ...a,
      [cid]: (a[cid] || seedStudents).map((s) =>
        s.id === id ? { ...s, ...patch } : s,
      ),
    }));
  const grade = (s) =>
    s === null || s === ""
      ? "—"
      : s >= 90
        ? "S"
        : s >= 80
          ? "A"
          : s >= 70
            ? "B"
            : s >= 60
              ? "C"
              : "F";
  async function csv(e) {
    try {
      const rows = parseCSV(await e.target.files[0].text());
      if (rows[0]?.[0] !== "学籍番号" || rows[0]?.[1] !== "点数")
        throw Error("ヘッダーは「学籍番号,点数」にしてください");
      const patch = rows.slice(1).map((r) => {
        if (
          !roster.some((s) => s.id === r[0]) ||
          r[1].trim() === "" ||
          !Number.isFinite(Number(r[1])) ||
          Number(r[1]) < 0 ||
          Number(r[1]) > 100
        )
          throw Error("学籍番号または点数が不正です");
        return { id: r[0], score: Number(r[1]) };
      });
      setRosters((a) => ({
        ...a,
        [cid]: roster.map((s) => ({
          ...s,
          ...patch.find((p) => p.id === s.id),
        })),
      }));
      tell(`${patch.length}人の成績を取り込みました`);
    } catch (err) {
      tell(`取り込み失敗：${err.message}`);
    }
    e.target.value = "";
  }
  return (
    <>
      <Title
        title={
          page === "home"
            ? "教員ホーム"
            : page === "students"
              ? "学生一覧"
              : page === "grades"
                ? "成績入力"
                : page === "notices"
                  ? "連絡・お知らせ"
                  : "担当科目"
        }
        subtitle="2026年度 後期 · 山田先生"
      />
      {page === "home" && (
        <div className="home-cards">
          {[
            ["担当科目", "2科目"],
            ["受講生", "5人"],
            ["未提出", "1件"],
            ["今日の予定", "授業準備"],
          ].map(([a, b], i) => (
            <Link
              to="/teacher/courses"
              className={`home-card color${i}`}
              key={a}
            >
              <BookOpen />
              <b>{a}</b>
              <strong>{b}</strong>
              <small>担当科目を確認 →</small>
            </Link>
          ))}
        </div>
      )}
      <section className="panel">
        <div className="section-head">
          <h3>担当科目</h3>
          <select
            aria-label="担当科目を切替"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
          >
            {catalog
              .filter((c) => c.teacher === "山田")
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
        <div className="tabs">
          {["受講者一覧", "成績入力", "出欠管理", "お知らせ"].map((t) => (
            <button
              key={t}
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "お知らせ" ? (
          <Broadcast course={course} />
        ) : (
          <>
            <div className="filters">
              <input
                placeholder="学生名・学籍番号で検索"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select
                aria-label="課題提出で絞り込み"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">すべての受講生</option>
                <option value="missing">課題未提出</option>
              </select>
            </div>
            {tab === "成績入力" && (
              <div className="button-row">
                <label className="file-button">
                  <Upload size={16} />
                  CSVで一括入力
                  <input type="file" accept=".csv" onChange={csv} />
                </label>
                <button
                  onClick={() =>
                    download(
                      "grades-template.csv",
                      "\uFEFF学籍番号,点数\r\n" +
                        roster
                          .map((s) => `${s.id},${s.score ?? 0}`)
                          .join("\r\n"),
                      "text/csv;charset=utf-8",
                    )
                  }
                >
                  CSVテンプレート
                </button>
                <small className="muted">
                  入力は自動保存されます · S≥90 / A≥80 / B≥70 / C≥60
                </small>
              </div>
            )}
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>学籍番号</th>
                    <th>氏名</th>
                    <th>出欠</th>
                    <th>課題提出</th>
                    <th>成績（中間）</th>
                    <th>評語</th>
                  </tr>
                </thead>
                <tbody>
                  {roster
                    .filter(
                      (s) =>
                        `${s.id}${s.name}`.includes(query) &&
                        (!filter || !s.submitted),
                    )
                    .map((s) => (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.name}</td>
                        <td>
                          {tab === "出欠管理" ? (
                            <select
                              value={s.attendance}
                              onChange={(e) =>
                                update(s.id, { attendance: e.target.value })
                              }
                            >
                              {["○", "△", "×"].map((a) => (
                                <option key={a}>{a}</option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className={
                                s.attendance === "○" ? "success" : "danger"
                              }
                            >
                              {s.attendance}
                            </span>
                          )}
                        </td>
                        <td>{s.submitted ? "提出" : "未提出"}</td>
                        <td>
                          {tab === "成績入力" ? (
                            <input
                              aria-label={`${s.name}の点数`}
                              type="number"
                              min="0"
                              max="100"
                              value={s.score ?? ""}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (
                                  v === "" ||
                                  (Number(v) >= 0 && Number(v) <= 100)
                                )
                                  update(s.id, {
                                    score: v === "" ? null : Number(v),
                                  });
                              }}
                            />
                          ) : (
                            (s.score ?? "—")
                          )}
                        </td>
                        <td>
                          <span className="badge">{grade(s.score)}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </>
  );
}
