import React, { useState, useContext } from "react";

import { X } from "../icons";
import { days, periods } from "../data/mock";
import { CampusContext } from "../lib/context";

import { weekDate } from "../lib/dates";

export function Grid({ items, editable = false, offset = 0 }) {
  const { catalog, setDraft, add, openCourse, setModal } =
    useContext(CampusContext);
  const [drag, setDrag] = useState(null);
  return (
    <div className="grid-scroll">
      <div className="timetable-grid">
        <div className="grid-head">時限</div>
        {days.map((d, i) => (
          <div
            key={d}
            className={`grid-head ${i === 3 && offset === 0 ? "today" : ""}`}
          >
            {d}
            <small>{weekDate(offset, i)}</small>
          </div>
        ))}
        {periods.map((p, pi) => (
          <React.Fragment key={p}>
            <div className="period">
              <b>{pi + 1}</b>
              <small>{p}</small>
            </div>
            {days.map((d, di) => (
              <div
                key={d}
                className={`slot ${di === 3 && offset === 0 ? "today" : ""} ${drag?.day === di && drag?.period === pi + 1 ? "droppable" : ""}`}
                onDragEnter={() => {}}
                onDragOver={(e) => {
                  if (editable) {
                    e.preventDefault();
                    try {
                      const c = catalog.find((c) => c.id === window.chDrag);
                      setDrag(c);
                    } catch {}
                  }
                }}
                onDragLeave={() => setDrag(null)}
                onDrop={(e) => {
                  if (!editable) return;
                  e.preventDefault();
                  const c = catalog.find(
                    (c) => c.id === e.dataTransfer.getData("text/plain"),
                  );
                  setDrag(null);
                  if (c) add(c);
                }}
              >
                {items
                  .filter((c) => c.day === di && c.period === pi + 1)
                  .map((c) => (
                    <div key={c.id} className={`course color${c.color}`}>
                      <button
                        className="course-main"
                        onClick={() => openCourse(c)}
                      >
                        <strong>{c.name}</strong>
                        <small>教室 {c.room}</small>
                        <small>{c.teacher} 先生</small>
                      </button>
                      {editable && (
                        <button
                          aria-label={`${c.name}を外す`}
                          className="remove"
                          onClick={() =>
                            setModal({
                              title: "科目を外しますか？",
                              body: <p>{c.name}を仮登録から外します。</p>,
                              action: () => {
                                setDraft((a) => a.filter((id) => id !== c.id));
                                setModal(null);
                              },
                              label: "外す",
                            })
                          }
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
