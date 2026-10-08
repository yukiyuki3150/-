import React, { useState, useContext } from "react";

import { ArrowRight } from "../icons";

import { CampusContext } from "../lib/context";
import { Title } from "./Display";

export function Applications() {
  const { role, applications, setApplications, tell } =
    useContext(CampusContext);
  const [type, setType] = useState("証明書発行"),
    [body, setBody] = useState("");
  return (
    <>
      <Title
        title="各種申請"
        subtitle={
          role === "admin"
            ? "学生からの申請を確認して対応できます。"
            : "窓口に行かずに、手続きを。"
        }
      />
      {role === "student" && (
        <section className="panel">
          <h3>新しい申請</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setApplications((a) => [
                {
                  id: Date.now().toString(),
                  student: "小宮路 健心",
                  studentId: "26E001",
                  type,
                  body,
                  status: "受付中",
                  date: "2026-10-08",
                },
                ...a,
              ]);
              setBody("");
              tell("申請を送信しました。事務側で確認できます。");
            }}
          >
            <label>
              申請種別
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option>証明書発行</option>
                <option>欠席届</option>
                <option>学生証再発行</option>
              </select>
            </label>
            <label>
              申請内容
              <textarea
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="証明書の種類・枚数、欠席日・理由などをご入力ください"
              />
            </label>
            <button className="primary">
              申請を送信 <ArrowRight size={16} />
            </button>
          </form>
        </section>
      )}
      <section className="panel">
        <h3>
          申請状況 <span className="badge">{applications.length}</span>
        </h3>
        {!applications.length && (
          <p className="empty">
            まだ申請がありません。学生として申請すると、ここに表示されます。
          </p>
        )}
        {applications.map((a) => (
          <article className="notice" key={a.id}>
            <div className="section-head">
              <b>{a.type}</b>
              <span
                className={`badge ${a.status === "完了" ? "green" : "blue"}`}
              >
                {a.status}
              </span>
            </div>
            <small>
              {a.date} · {a.student} / {a.studentId}
            </small>
            <p>{a.body}</p>
            {role === "admin" && (
              <div className="button-row">
                {["処理中", "完了", "差し戻し"].map((s) => (
                  <button
                    key={s}
                    className={s === "完了" ? "primary" : "subtle"}
                    onClick={() => {
                      setApplications((arr) =>
                        arr.map((x) =>
                          x.id === a.id ? { ...x, status: s } : x,
                        ),
                      );
                      tell(
                        s === "完了"
                          ? "申請を承認しました"
                          : `申請を${s}に変更しました`,
                      );
                    }}
                  >
                    {s === "完了" ? "承認" : s}
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
