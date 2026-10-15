import React, { useState, useContext } from "react";

import { CampusContext } from "../../lib/context";
import { Title } from "../../components/Display";

export function Tasks() {
  const { tasks, setTasks } = useContext(CampusContext);
  const [tab, setTab] = useState("すべて");
  return (
    <>
      <Title
        title="マイタスク"
        subtitle="授業も、課題も。今日やることをひと目で。"
      />
      <div className="tabs">
        {["すべて", "課題", "授業", "申請", "お知らせ"].map((t) => (
          <button
            className={tab === t ? "active" : ""}
            key={t}
            onClick={() => setTab(t)}
          >
            {t}{" "}
            <span className="badge">
              {tasks.filter((x) => t === "すべて" || x.type === t).length}
            </span>
          </button>
        ))}
      </div>
      {["期限が近い", "今日の予定", "今後の予定"].map((s) => (
        <details key={s} className="panel task-section" open>
          <summary>
            {s}{" "}
            <span className="badge">
              {
                tasks.filter(
                  (t) =>
                    t.section === s && (tab === "すべて" || t.type === tab),
                ).length
              }
            </span>
          </summary>
          {tasks
            .filter(
              (t) => t.section === s && (tab === "すべて" || t.type === tab),
            )
            .map((t) => (
              <label className={`task-row ${t.done ? "done" : ""}`} key={t.id}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() =>
                    setTasks((a) =>
                      a.map((x) =>
                        x.id === t.id ? { ...x, done: !x.done } : x,
                      ),
                    )
                  }
                />
                <div>
                  <b>{t.title}</b>
                  <small className={s === "期限が近い" ? "danger" : ""}>
                    {t.date}
                  </small>
                </div>
                <span className="badge">{t.type}</span>
              </label>
            ))}
        </details>
      ))}
    </>
  );
}
