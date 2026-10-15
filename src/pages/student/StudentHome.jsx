import React, { useContext } from "react";

import { Link } from "react-router-dom";
import {
  GraduationCap,
  CalendarDays,
  CheckSquare,
  Bell,
  FileText,
  ChevronRight,
} from "../../icons";
import { periods } from "../../data/mock";
import { CampusContext } from "../../lib/context";

export function StudentHome() {
  const {
    notices,
    applications,
    tasks,
    reg,
    studentNotices,
    unread,
    openCourse,
  } = useContext(CampusContext);
  return (
    <>
      <div className="hero">
        <div>
          <span className="eyebrow">YOUR CAMPUS, CONNECTED.</span>
          <h1>
            おかえりなさい、
            <br />
            小宮路さん <span>👋</span>
          </h1>
          <p>今日も、あなたらしい大学生活を。</p>
        </div>
        <div className="campus-art">
          <div className="mountain" />
          <div className="building" />
          <span>2026年10月8日（木）</span>
        </div>
      </div>
      <div className="home-cards">
        {[
          [
            CalendarDays,
            "今週の授業",
            `${reg.length}件`,
            "今週の予定を確認",
            "timetable",
          ],
          [
            CheckSquare,
            "課題",
            `${tasks.filter((t) => t.type === "課題" && !t.done).length}件`,
            "提出期限を確認しましょう",
            "tasks",
          ],
          [
            Bell,
            "お知らせ",
            `${unread}件`,
            "未読のお知らせがあります",
            "notices",
          ],
          [
            FileText,
            "各種申請",
            "申請する",
            "手続きを、もっとスムーズに",
            "applications",
          ],
        ].map(([Icon, title, count, desc, path], i) => (
          <Link
            key={path}
            className={`home-card color${i}`}
            to={`/student/${path}`}
          >
            <Icon />
            <b>{title}</b>
            <strong>{count}</strong>
            <small>{desc}</small>
            <ChevronRight size={18} />
          </Link>
        ))}
      </div>
      <div className="home-columns">
        <section className="panel">
          <div className="section-head">
            <h3>今日の予定</h3>
            <Link to="/student/timetable">
              すべて見る <ChevronRight size={15} />
            </Link>
          </div>
          {reg
            .filter((c) => c.day === 3)
            .map((c) => (
              <button
                key={c.id}
                className="schedule-row"
                onClick={() => openCourse(c)}
              >
                <i />
                <span>{periods[c.period - 1]}</span>
                <b>{c.name}</b>
                <small>教室 {c.room}</small>
              </button>
            ))}
          {!reg.some((c) => c.day === 3) && (
            <p className="empty">
              今日の授業はありません。自分の時間を楽しみましょう。
            </p>
          )}
          <div className="note">
            次の締切：ミクロ経済学A レポート · 10月9日 23:59
          </div>
        </section>
        <section className="panel">
          <h3>キャンパスからのお知らせ</h3>
          {studentNotices.slice(0, 3).map((n) => (
            <Link className="notice-preview" key={n.id} to="/student/notices">
              <small>
                {n.date} · {n.sender}
              </small>
              <b>{n.title}</b>
              {!n.read && <i className="unread-dot" />}
            </Link>
          ))}
        </section>
      </div>
      <section className="welcome-note">
        <GraduationCap size={28} />
        <div>
          <b>学びも、手続きも、ここから。</b>
          <p>Campus Hub は学生・教員・事務をひとつにつなぐ学務ポータルです。</p>
        </div>
        <Link to="/student/registration">後期の履修を登録する →</Link>
      </section>
    </>
  );
}
