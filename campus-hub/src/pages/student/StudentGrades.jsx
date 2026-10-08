import React, { useState, useContext } from "react";

import { courses as seed } from "../../data/mock";
import { CampusContext } from "../../lib/context";
import { Title, Donut, Bars } from "../../components/Display";

export function StudentGrades() {
  const {} = useContext(CampusContext);
  const [gpa, setGpa] = useState(false);
  return (
    <>
      <Title title="成績・履修状況" subtitle="あなたの学びの積み重ね" />
      <div className="home-columns">
        <section className="panel">
          <h3>今学期の履修状況</h3>
          <Donut value={(8 / 12) * 100} label="8 / 12" sub="履修中" />
          <div className="legend">● 履修中 8　● 登録可能 2　● 未履修 2</div>
        </section>
        <section className="panel">
          <h3>学期別の成績</h3>
          <Bars />
          <label className="toggle">
            <input
              type="checkbox"
              checked={gpa}
              onChange={(e) => setGpa(e.target.checked)}
            />
            GPAを表示
          </label>
          {gpa && <p className="gpa">GPA 3.4</p>}
        </section>
      </div>
      <section className="panel">
        <h3>科目ごとの成績（2026年度 前期）</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>科目名</th>
                <th>単位</th>
                <th>点数</th>
                <th>評語</th>
                <th>状態</th>
              </tr>
            </thead>
            <tbody>
              {seed.slice(0, 5).map((c, i) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>2</td>
                  <td>{[78, 92, 85, 70, 88][i]}</td>
                  <td>
                    <span className="badge">
                      {["B", "S", "A", "B", "A"][i]}
                    </span>
                  </td>
                  <td>取得済み</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
