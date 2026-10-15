import React, { useState, useContext } from "react";

import { CalendarDays, BookOpen, Star, ArrowRight } from "../../icons";
import { days } from "../../data/mock";
import { CampusContext } from "../../lib/context";
import { Title, Progress } from "../../components/Display";
import { Grid } from "../../components/Grid";
import { Filters } from "../../components/Filters";

export function Registration() {
  const {
    catalog,
    setRegistered,
    draft,
    setDraft,
    favorites,
    setFavorites,
    nav,
    selected,
    total,
    tell,
    add,
    openCourse,
    warnings,
    setModal,
  } = useContext(CampusContext);
  const [results, setResults] = useState(catalog);
  const confirm = () =>
    setModal({
      title: "登録内容を確認",
      body: (
        <>
          <p>
            2026年度 後期 · {selected.length}科目 / 合計{total}単位
          </p>
          {selected.map((c) => (
            <div className="list-row" key={c.id}>
              <b>{c.name}</b>
              <span>
                {days[c.day]}
                {c.period}限 · {c.credits}単位
              </span>
            </div>
          ))}
          {!selected.length && <p>科目が選択されていません。</p>}
          {warnings}
          <p className="muted">
            現在の登録科目への追加・削除を、この内容で確定します。卒業要件の加算は取得見込みです。
          </p>
        </>
      ),
      label: "この内容で登録する",
      action: () => {
        setRegistered(draft);
        setModal(null);
        tell("履修登録を確定しました");
        nav("/student/timetable");
      },
    });
  return (
    <>
      <Title title="履修登録" subtitle="2026年度（後期）">
        <button className="primary" onClick={confirm}>
          登録内容を確認 <ArrowRight size={17} />
        </button>
      </Title>
      <div className="steps">
        <span className="active">① 科目を選ぶ</span>
        <span className={draft.length ? "active" : ""}>② 時間割に配置</span>
        <span>③ 登録内容を確認</span>
      </div>
      <div className="progress-layout">
        <section className="panel">
          <h3>
            卒業要件の達成状況{" "}
            <span className="muted tiny">仮登録分は取得見込み</span>
          </h3>
          <div className="credit-summary">
            <div>
              <small>取得単位 ＋ 取得見込み</small>
              <div>
                <strong>{64 + total}</strong> / 124 単位
              </div>
            </div>
            <div className="grow">
              <Progress value={((64 + total) / 124) * 100} />
              <small>達成率 {Math.round(((64 + total) / 124) * 100)}%</small>
            </div>
            <b>
              あと <em>{Math.max(0, 60 - total)}</em> 単位
            </b>
          </div>
        </section>
        <section className="panel category-cards">
          {[
            ["共通教育", 22, 28],
            ["専門教育", 30, 78],
            ["自由選択", 12, 18],
          ].map(([name, n, max], i) => {
            const v =
              n +
              selected
                .filter((c) => c.category === name)
                .reduce((a, c) => a + c.credits, 0);
            return (
              <div key={name} className={`category color${i + 1}`}>
                <b>{name}</b>
                <p>
                  <strong>{v}</strong> / {max} 単位
                </p>
                <Progress value={(v / max) * 100} />
              </div>
            );
          })}
        </section>
      </div>
      <div className="registration-columns">
        <section className="panel">
          <div className="section-head">
            <h3>
              <CalendarDays />
              時間割（仮登録中）
            </h3>
            <button
              className="subtle danger"
              onClick={() =>
                setModal({
                  title: "仮登録を一括削除しますか？",
                  body: (
                    <p>
                      仮登録中の{selected.length}
                      科目を外します。確定済みの時間割は、再度確定するまで保持されます。
                    </p>
                  ),
                  label: "一括削除",
                  action: () => {
                    setDraft([]);
                    setModal(null);
                  },
                })
              }
            >
              カレンダーから一括削除
            </button>
          </div>
          <p className="muted tiny">
            <span className="registration-help-desktop">
              右の科目をドラッグ、または「＋追加」。別のコマに落としても開講時限に配置されます。
            </span>
            <span className="registration-help-mobile">
              下の科目一覧から「＋追加」で登録できます。
            </span>
          </p>
          <Grid items={selected} editable />
        </section>
        <section className="panel">
          <h3>
            <BookOpen />
            開講科目一覧
          </h3>
          <Filters onChange={setResults} />
          <div className="catalog-list">
            {[...results]
              .sort(
                (a, b) =>
                  Number(favorites.includes(b.id)) -
                  Number(favorites.includes(a.id)),
              )
              .map((c) => (
                <div
                  key={c.id}
                  className="catalog-row"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", c.id);
                    window.chDrag = c.id;
                    document
                      .querySelectorAll(".registration-columns .slot")
                      [c.day + (c.period - 1) * 5]?.classList.add("droppable");
                  }}
                  onDragEnd={() => {
                    document
                      .querySelectorAll(".droppable")
                      .forEach((el) => el.classList.remove("droppable"));
                    window.chDrag = null;
                  }}
                >
                  <button
                    className={`star ${favorites.includes(c.id) ? "chosen" : ""}`}
                    aria-label={`${c.name}のお気に入り`}
                    aria-pressed={favorites.includes(c.id)}
                    onClick={() =>
                      setFavorites((a) =>
                        a.includes(c.id)
                          ? a.filter((id) => id !== c.id)
                          : [...a, c.id],
                      )
                    }
                  >
                    <Star size={18} />
                  </button>
                  <div className="grow">
                    <button
                      className="text-button"
                      onClick={() => openCourse(c)}
                    >
                      {c.name}
                    </button>
                    {c.popular && (
                      <span className="badge gold">{c.popular}</span>
                    )}
                    <small>
                      {c.teacher} 先生 · {days[c.day]}
                      {c.period}限 · {c.credits}単位 · 教室{c.room}
                    </small>
                    <small>
                      {c.category} / {c.type}
                    </small>
                  </div>
                  <button
                    className={draft.includes(c.id) ? "subtle" : "primary"}
                    disabled={draft.includes(c.id)}
                    onClick={() => add(c)}
                  >
                    {draft.includes(c.id) ? "追加済み" : "＋追加"}
                  </button>
                </div>
              ))}
            {!results.length && (
              <p className="empty">該当する科目がありません。</p>
            )}
          </div>
        </section>
      </div>
      <section className="panel bottom-summary">
        <b>
          登録中の単位数 <em>{total}</em> 単位
        </b>
        <span>
          {["必修", "選択必修", "選択"]
            .map(
              (t) =>
                `${t} ${selected.filter((c) => c.type === t).reduce((a, c) => a + c.credits, 0)}`,
            )
            .join("　/　")}
        </span>
        {warnings}
      </section>
    </>
  );
}
