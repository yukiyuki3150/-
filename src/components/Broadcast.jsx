import React, { useState, useContext } from "react";

import { ArrowRight } from "../icons";

import { demoDate } from "../data/mock";
import { CampusContext } from "../lib/context";

export function Broadcast({ course }) {
  const { role, notices, setNotices, tell } = useContext(CampusContext);
  const [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [target, setTarget] = useState("全学"),
    [noticeType, setNoticeType] = useState("announcement");
  return (
    <section className="panel">
      <h3>お知らせを配信</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setNotices((a) => [
            {
              id: Date.now().toString(),
              title,
              body,
              date: demoDate,
              sender: role === "teacher" ? `${course.teacher} 先生` : "教務課",
              target: role === "teacher" ? course.name : target,
              read: false,
              ...(role === "teacher" && noticeType === "cancellation"
                ? { type: "cancellation" }
                : {}),
            },
            ...a,
          ]);
          setTitle("");
          setBody("");
          setNoticeType("announcement");
          tell(
            noticeType === "cancellation"
              ? "休講のお知らせを配信しました。対象授業の学生に反映されます。"
              : "お知らせを配信しました。学生側に反映されました。",
          );
        }}
      >
        {role === "teacher" && (
          <label>
            お知らせの種類
            <select
              aria-label="お知らせの種類"
              value={noticeType}
              onChange={(e) => setNoticeType(e.target.value)}
            >
              <option value="announcement">通常のお知らせ</option>
              <option value="cancellation">休講のお知らせ</option>
            </select>
          </label>
        )}
        {role === "admin" ? (
          <label>
            配信対象
            <select value={target} onChange={(e) => setTarget(e.target.value)}>
              <option>全学</option>
              <option>経済学部</option>
              <option>1年</option>
              <option>2年</option>
              <option>3年</option>
              <option>4年</option>
            </select>
          </label>
        ) : (
          <p className="note">
            配信対象：{course.name}の受講生
            {noticeType === "cancellation" &&
              " · 本日の授業を休講として学生の予定に表示します"}
          </p>
        )}
        <label>
          タイトル
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              noticeType === "cancellation"
                ? "例：本日の休講について"
                : "お知らせのタイトル"
            }
          />
        </label>
        <label>
          本文
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
              noticeType === "cancellation"
                ? "休講の理由や補講の予定など"
                : "学生への連絡内容"
            }
          />
        </label>
        <button className="primary">
          お知らせを配信 <ArrowRight size={16} />
        </button>
      </form>
      <h3>配信履歴</h3>
      {notices
        .filter((n) =>
          role === "admin"
            ? n.sender === "教務課"
            : n.sender === `${course.teacher} 先生`,
        )
        .map((n) => (
          <div className="list-row" key={n.id}>
            <b>{n.title}</b>
            {n.type === "cancellation" && (
              <span className="badge red">休講</span>
            )}
            <small>{n.target}</small>
          </div>
        ))}
    </section>
  );
}
import React, { useState, useContext } from "react";

import { ArrowRight } from "../icons";

import { CampusContext } from "../lib/context";

export function Broadcast({ course }) {
  const { role, notices, setNotices, tell } = useContext(CampusContext);
  const [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [target, setTarget] = useState("全学");
  return (
    <section className="panel">
      <h3>お知らせを配信</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setNotices((a) => [
            {
              id: Date.now().toString(),
              title,
              body,
              date: "2026-10-08",
              sender: role === "teacher" ? `${course.teacher} 先生` : "教務課",
              target: role === "teacher" ? course.name : target,
              read: false,
            },
            ...a,
          ]);
          setTitle("");
          setBody("");
          tell("お知らせを配信しました。学生側に反映されました。");
        }}
      >
        {role === "admin" ? (
          <label>
            配信対象
            <select value={target} onChange={(e) => setTarget(e.target.value)}>
              <option>全学</option>
              <option>経済学部</option>
              <option>1年</option>
              <option>2年</option>
              <option>3年</option>
              <option>4年</option>
            </select>
          </label>
        ) : (
          <p className="note">配信対象：{course.name}の受講生</p>
        )}
        <label>
          タイトル
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="お知らせのタイトル"
          />
        </label>
        <label>
          本文
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="学生への連絡内容"
          />
        </label>
        <button className="primary">
          お知らせを配信 <ArrowRight size={16} />
        </button>
      </form>
      <h3>配信履歴</h3>
      {notices
        .filter((n) =>
          role === "admin"
            ? n.sender === "教務課"
            : n.sender === `${course.teacher} 先生`,
        )
        .map((n) => (
          <div className="list-row" key={n.id}>
            <b>{n.title}</b>
            <small>{n.target}</small>
          </div>
        ))}
    </section>
  );
}
