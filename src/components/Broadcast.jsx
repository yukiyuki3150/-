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
