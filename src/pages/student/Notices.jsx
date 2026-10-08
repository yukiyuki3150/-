import React, { useContext } from "react";

import { CampusContext } from "../../lib/context";
import { Title } from "../../components/Display";

export function Notices() {
  const { setNotices, studentNotices, unread } = useContext(CampusContext);
  return (
    <>
      <Title title="お知らせ" subtitle={`${unread}件の未読のお知らせ`} />
      <section className="panel">
        {studentNotices.map((n) => (
          <article className={`notice ${n.read ? "read" : ""}`} key={n.id}>
            <div className="section-head">
              <small>
                {n.date} · {n.sender} · {n.target}
              </small>
              <span className={`badge ${n.read ? "" : "blue"}`}>
                {n.read ? "既読" : "未読"}
              </span>
            </div>
            <h3>
              {n.title} {n.important && <span className="badge red">重要</span>}
            </h3>
            <p>{n.body}</p>
            <button
              className="subtle"
              onClick={() =>
                setNotices((a) =>
                  a.map((x) => (x.id === n.id ? { ...x, read: !x.read } : x)),
                )
              }
            >
              {n.read ? "未読に戻す" : "既読にする"}
            </button>
          </article>
        ))}
      </section>
    </>
  );
}
