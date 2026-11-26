import React, { useState, useContext } from "react";

import { X } from "../icons";
import { days, periods } from "../data/mock";
import { CampusContext } from "../lib/context";

import { weekDate } from "../lib/dates";

export function Grid({
  items,
  editable = false,
  offset = 0,
  showSubmissions = false,
  activeSlot = null,
  onSlotClick,
}) {
  const { catalog, setDraft, add, openCourse, setModal, tasks } =
    useContext(CampusContext);
  const [drag, setDrag] = useState(null);
  const submissionDays = showSubmissions
    ? days.map((_, dayIndex) => {
        const date = weekDate(offset, dayIndex);
        return {
          date,
          counts: ["課題", "アンケート"].map((type) => ({
            type,
            count: tasks.filter(
              (task) =>
                task.type === type &&
                !task.done &&
                task.date.match(/^\d{1,2}\/\d{1,2}/)?.[0] === date,
            ).length,
          })),
        };
      })
    : [];
  const openSubmissionDetails = (type, date) => {
    const matchingTasks = tasks.filter(
      (task) =>
        task.type === type &&
        !task.done &&
        task.date.match(/^\d{1,2}\/\d{1,2}/)?.[0] === date,
    );
    setModal({
      title: `${date}の${type}`,
      body: (
        <div className="submission-details">
          {matchingTasks.map((task) => (
            <article className="submission-detail" key={task.id}>
              <strong>{task.submissionName || task.title}</strong>
              <span>科目：{task.course || "科目未設定"}</span>
              <span>締切日：{task.deadline || task.date}</span>
            </article>
          ))}
        </div>
      ),
    });
  };
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
            {days.map((d, di) => {
              const occupied = items.some(
                (c) => c.day === di && c.period === pi + 1,
              );
              return (
                <div
                  key={d}
                  className={`slot ${di === 3 && offset === 0 ? "today" : ""} ${drag?.day === di && drag?.period === pi + 1 ? "droppable" : ""} ${activeSlot?.day === di && activeSlot?.period === pi + 1 ? "slot-selected" : ""}`}
                  role={editable && !occupied ? "button" : undefined}
                  tabIndex={editable && !occupied ? 0 : undefined}
                  aria-label={
                    editable && !occupied
                      ? `${d}曜日${pi + 1}限の空欄から開講科目を表示`
                      : undefined
                  }
                  aria-pressed={
                    editable && !occupied
                      ? activeSlot?.day === di &&
                        activeSlot?.period === pi + 1
                      : undefined
                  }
                  onDragEnter={() => {}}
                  onClick={() => {
                    if (editable && !occupied)
                      onSlotClick?.({ day: di, period: pi + 1 });
                  }}
                  onKeyDown={(e) => {
                    if (
                      editable &&
                      !occupied &&
                      (e.key === "Enter" || e.key === " ")
                    ) {
                      e.preventDefault();
                      onSlotClick?.({ day: di, period: pi + 1 });
                    }
                  }}
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
                                  setDraft((a) =>
                                    a.filter((id) => id !== c.id),
                                  );
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
                  {editable &&
                    !occupied &&
                    activeSlot?.day === di &&
                    activeSlot?.period === pi + 1 && (
                      <span className="slot-selection-label">選択中</span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
        {showSubmissions && (
          <>
            <div className="period submission-period">提出物</div>
            {submissionDays.map(({ date, counts }, dayIndex) => (
              <div
                className={`slot submission-day ${dayIndex === 3 && offset === 0 ? "today" : ""}`}
                key={date}
                aria-label={`${date}の提出物`}
              >
                {counts.map(({ type, count }) => (
                  count > 0 && (
                    <button
                      className="submission-count"
                      key={type}
                      type="button"
                      aria-label={`${date}の${type}${count}件の詳細`}
                      onClick={() => openSubmissionDetails(type, date)}
                    >
                      {type} <b>{count}</b>件
                    </button>
                  )
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
