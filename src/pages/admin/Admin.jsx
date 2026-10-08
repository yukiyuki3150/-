import React, { useState, useContext } from "react";

import { Link } from "react-router-dom";
import { CheckSquare, FileText, Users, ChevronRight } from "../../icons";
import { days, students as seedStudents } from "../../data/mock";
import { CampusContext } from "../../lib/context";
import { Title, Donut, Bars } from "../../components/Display";

import { Applications } from "../../components/Applications";
import { Broadcast } from "../../components/Broadcast";

export function Admin({ page }) {
  const { catalog, registered, notices, applications, openCourse } =
    useContext(CampusContext);
  const [query, setQuery] = useState("");
  if (page === "applications") return <Applications />;
  if (page === "notices")
    return (
      <>
        <Title title="お知らせ配信" subtitle="必要な情報を、必要な学生に。" />
        <Broadcast />
      </>
    );
  if (page === "students")
    return (
      <>
        <Title title="学生管理" subtitle="在学生の基本情報" />
        <section className="panel">
          <input
            placeholder="氏名・学籍番号で検索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>学籍番号</th>
                  <th>氏名</th>
                  <th>学部</th>
                  <th>学年</th>
                </tr>
              </thead>
              <tbody>
                {seedStudents
                  .filter((s) => `${s.id}${s.name}`.includes(query))
                  .map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.name}</td>
                      <td>経済学部</td>
                      <td>1年</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  if (page === "courses")
    return (
      <>
        <Title title="履修・科目管理" subtitle="2026年度 後期の開講科目" />
        <section className="panel">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>科目</th>
                  <th>教員</th>
                  <th>曜日・時限</th>
                  <th>単位</th>
                  <th>登録状態（デモ学生）</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <button
                        className="text-button"
                        onClick={() => openCourse(c)}
                      >
                        {c.name}
                      </button>
                    </td>
                    <td>{c.teacher}</td>
                    <td>
                      {days[c.day]}
                      {c.period}限
                    </td>
                    <td>{c.credits}</td>
                    <td>{registered.includes(c.id) ? "履修中" : "未登録"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  return (
    <>
      <Title
        title={page === "analytics" ? "統計・分析" : "ダッシュボード"}
        subtitle="2026年度 後期 · キャンパス全体のいま"
      />
      <div className="admin-kpis">
        {[
          [Users, "在学生数", "8,421", "人"],
          [CheckSquare, "履修登録率", "96.2", "%"],
          [
            FileText,
            "申請対応",
            32 + applications.filter((a) => a.status !== "完了").length,
            "件",
          ],
        ].map(([Icon, t, n, u]) => (
          <Link
            to={
              t === "申請対応"
                ? "/admin/applications"
                : t === "在学生数"
                  ? "/admin/students"
                  : "/admin/courses"
            }
            className="panel kpi"
            key={t}
          >
            <Icon />
            <div>
              <small>{t}</small>
              <strong>
                {n}
                <small>{u}</small>
              </strong>
            </div>
            <ChevronRight size={18} />
          </Link>
        ))}
      </div>
      <section className="panel">
        <div className="section-head">
          <h3>今日やること</h3>
          <Link to="/admin/applications">申請対応へ →</Link>
        </div>
        <p>申請を確認して、承認または差し戻しを行いましょう。</p>
        <small className="muted">
          定常業務32件（モック）＋ 新規申請
          {applications.filter((a) => a.status !== "完了").length}件
        </small>
      </section>
      <section className="panel">
        <h3>重要なお知らせ</h3>
        {notices.slice(0, 3).map((n) => (
          <div className="list-row important-notice-row" key={n.id}>
            <small>{n.date}</small>
            <b>{n.title}</b>
            {n.important && <span className="badge red">重要</span>}
          </div>
        ))}
      </section>
      <div className="home-columns">
        <section className="panel">
          <h3>履修登録状況</h3>
          <Donut value={96.2} label="96.2%" sub="登録済み" />
        </section>
        <section className="panel">
          <h3>学年別在学生数</h3>
          <Bars admin />
        </section>
      </div>
    </>
  );
}
