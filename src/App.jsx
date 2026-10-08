import React, { useState, useEffect } from "react";

import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Bell,
  Users,
  Search,
  ChevronRight,
  X,
  LogOut,
  ArrowRight,
  Check,
} from "./icons";
import {
  courses as seed,
  days,
  periods,
  notices as seedNotices,
  tasks as seedTasks,
} from "./data/mock";
import { CampusContext } from "./lib/context";
import { Title } from "./components/Display";

import { useStore, useRegistrationDraft } from "./lib/store";
import { roleNames, menus } from "./lib/navigation";
import { Teacher } from "./pages/teacher/Teacher";
import { Admin } from "./pages/admin/Admin";
import { Applications } from "./components/Applications";
import { StudentHome } from "./pages/student/StudentHome";
import { Timetable } from "./pages/student/Timetable";
import { Registration } from "./pages/student/Registration";
import { Tasks } from "./pages/student/Tasks";
import { StudentGrades } from "./pages/student/StudentGrades";
import { Notices } from "./pages/student/Notices";

export function App() {
  const nav = useNavigate(),
    loc = useLocation();
  const [role, setRole] = useStore("ch-role", null),
    [catalog, setCatalog] = useStore("ch-courses", seed),
    [registered, setRegistered] = useStore(
      "ch-registered",
      seed.slice(0, 6).map((c) => c.id),
    ),
    [draft, setDraft] = useRegistrationDraft(registered),
    [favorites, setFavorites] = useStore("ch-favorites", []),
    [notices, setNotices] = useStore("ch-notices", seedNotices),
    [applications, setApplications] = useStore("ch-applications", []),
    [tasks, setTasks] = useStore("ch-tasks", seedTasks),
    [rosters, setRosters] = useStore("ch-rosters", {});
  const [modal, setModal] = useState(null),
    [toast, setToast] = useState(""),
    [profile, setProfile] = useState(false),
    [globalSearch, setGlobalSearch] = useState("");
  useEffect(() => {
    setModal(null);
  }, [loc.key, loc.pathname, loc.search, loc.hash]);
  const tell = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 4000);
  };
  const login = (r) => {
    setRole(r);
    setProfile(false);
    nav(`/${r}/home`);
  };
  const reg = catalog.filter((c) => registered.includes(c.id));
  const selected = catalog.filter((c) => draft.includes(c.id));
  const total = selected.reduce((s, c) => s + c.credits, 0);
  const conflicts = Object.values(
    selected.reduce((a, c) => {
      const k = c.day + "-" + c.period;
      (a[k] ??= []).push(c);
      return a;
    }, {}),
  ).filter((a) => a.length > 1);
  const studentNotices = notices.filter(
    (n) =>
      ["全学", "経済学部", "1年"].includes(n.target) ||
      reg.some((c) => c.name === n.target),
  );
  const unread = studentNotices.filter((n) => !n.read).length;
  function add(c) {
    setDraft((a) => (a.includes(c.id) ? a : [...a, c.id]));
    tell(`${c.name}を${days[c.day]}曜${c.period}限に仮登録しました`);
  }
  const warnings = (
    <>
      {conflicts.length > 0 && (
        <div className="warning">
          同一時限の重複 {conflicts.length}件：
          {conflicts
            .map(
              (a) =>
                `${days[a[0].day]}${a[0].period}限 (${a.map((c) => c.name).join("・")})`,
            )
            .join(" / ")}
        </div>
      )}
      {total > 24 && (
        <div className="warning">
          学期の上限24単位を{total - 24}
          単位オーバーします。内容を確認してください。
        </div>
      )}
    </>
  );
  const openCourse = (c) =>
    setModal({
      title: c.name,
      body: (
        <>
          <div className={`course-detail color${c.color}`}>
            <p>
              {days[c.day]}曜日・{c.period}限　{periods[c.period - 1]}
            </p>
            <p>
              {c.teacher} 先生 / 教室 {c.room} / {c.credits}単位
            </p>
          </div>
          <h3>シラバス概要</h3>
          <p>{c.summary}</p>
          <p className="muted">
            {c.category} · {c.type} · 2026年度 後期
          </p>
        </>
      ),
    });
  const SettingsPage = () => (
    <>
      <Title title="設定" subtitle="アカウントと表示について" />
      <section className="panel">
        <h3>アカウント</h3>
        <p>{roleNames[role]}としてログイン中</p>
        <p>右上のアバターから役割切替・ログアウトできます。</p>
        <p className="note">
          プロトタイプのデータはこのブラウザに保存されます。
        </p>
      </section>
    </>
  );
  function pageContent(page) {
    if (page === "settings") return <SettingsPage />;
    if (role === "teacher") return <Teacher key={page} page={page} />;
    if (role === "admin") return <Admin key={page} page={page} />;
    return {
      home: <StudentHome />,
      timetable: <Timetable />,
      registration: <Registration />,
      tasks: <Tasks />,
      grades: <StudentGrades />,
      notices: <Notices />,
      applications: <Applications />,
    }[page];
  }
  if (!role || loc.pathname === "/")
    return (
      <div className="login">
        <div className="login-brand">
          <GraduationCap /> Campus Hub
        </div>
        <span className="eyebrow">NAGASAKI UNIVERSITY · CAMPUS PORTAL</span>
        <h1>
          大学生活を、
          <br />
          <em>もっとひとつに。</em>
        </h1>
        <p>学び、連絡、手続き。あなたに必要な情報が、ここに。</p>
        <div className="login-roles">
          {[
            ["student", "学生", "自分の学びを、わかりやすく。", GraduationCap],
            ["teacher", "教員", "授業と学生を、もっと近くに。", BookOpen],
            ["admin", "事務", "キャンパスの毎日を、スムーズに。", Users],
          ].map(([r, t, desc, Icon], i) => (
            <section key={r} className={`panel role-card color${i}`}>
              <Icon size={40} />
              <h2>{t}の画面</h2>
              <p>{desc}</p>
              <small>
                {r === "student"
                  ? "時間割 · 履修登録 · 課題"
                  : r === "teacher"
                    ? "担当科目 · 成績入力 · 連絡"
                    : "学生管理 · 申請対応 · お知らせ"}
              </small>
              <button className="primary" onClick={() => login(r)}>
                {t}としてログイン <ArrowRight size={17} />
              </button>
            </section>
          ))}
        </div>
        <p className="login-footer">
          ひとつの学務情報基盤で、学生・教員・事務をつなぐ。
          <br />
          <small>認証不要のデモです。架空のデータを使用しています。</small>
        </p>
      </div>
    );
  const page = loc.pathname.split("/")[2] || "home";
  if (loc.pathname.split("/")[1] !== role)
    return <Navigate to={`/${role}/home`} replace />;
  return (
    <CampusContext.Provider
      value={{
        role,
        catalog,
        setCatalog,
        registered,
        setRegistered,
        draft,
        setDraft,
        favorites,
        setFavorites,
        notices,
        setNotices,
        applications,
        setApplications,
        tasks,
        setTasks,
        rosters,
        setRosters,
        nav,
        reg,
        selected,
        total,
        conflicts,
        studentNotices,
        unread,
        tell,
        add,
        openCourse,
        warnings,
        setModal,
      }}
    >
      <div className="app">
        <aside className="sidebar">
          <Link className="sidebar-brand" to={`/${role}/home`}>
            <GraduationCap size={27} />
            <b>Campus Hub</b>
          </Link>
          <nav>
            {menus[role].map(([path, label, Icon]) => (
              <Link
                key={path}
                title={label}
                className={page === path ? "active" : ""}
                to={`/${role}/${path}`}
              >
                <Icon size={22} />
                <span>{label}</span>
                {path === "notices" && unread > 0 && <i>{unread}</i>}
              </Link>
            ))}
          </nav>
          <button className="sidebar-user" onClick={() => setProfile(!profile)}>
            <span className="avatar">
              {role === "student" ? "小" : role === "teacher" ? "山" : "事"}
            </span>
            <span>
              <b>
                {role === "student"
                  ? "小宮路 健心"
                  : role === "teacher"
                    ? "山田 先生"
                    : "教務課"}
              </b>
              <small>
                {role === "student" ? "経済学部 1年" : roleNames[role]}
              </small>
            </span>
          </button>
        </aside>
        <header className="header">
          <Link className="brand" to={`/${role}/home`}>
            <GraduationCap />
            <b>Campus Hub</b>
          </Link>
          <form
            className="global-search"
            onSubmit={(e) => {
              e.preventDefault();
              setModal({
                title: `「${globalSearch}」の検索結果`,
                body: (
                  <>
                    <h3>科目</h3>
                    {catalog
                      .filter((c) =>
                        `${c.name}${c.teacher}`.includes(globalSearch),
                      )
                      .map((c) => (
                        <button
                          className="list-row"
                          key={c.id}
                          onClick={() => openCourse(c)}
                        >
                          {c.name}
                          <ChevronRight size={16} />
                        </button>
                      ))}
                    <h3>お知らせ</h3>
                    {notices
                      .filter((n) =>
                        `${n.title}${n.body}`.includes(globalSearch),
                      )
                      .map((n) => (
                        <div className="notice" key={n.id}>
                          <b>{n.title}</b>
                          <p>{n.body}</p>
                        </div>
                      ))}
                  </>
                ),
              });
            }}
          >
            <Search size={17} />
            <input
              aria-label="全体検索"
              placeholder="科目・お知らせを検索…"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </form>
          <span className="role-tag">{roleNames[role]}</span>
          <button
            className="bell icon-button"
            aria-label="お知らせ"
            onClick={() => nav(`/${role}/notices`)}
          >
            <Bell size={23} />
            {unread > 0 && <span>{unread}</span>}
          </button>
          <button
            aria-label="アカウントメニュー"
            className="avatar"
            onClick={() => setProfile(!profile)}
          >
            {role === "student" ? "小" : role === "teacher" ? "山" : "事"}
          </button>
          {profile && (
            <div className="profile-menu">
              <b>役割を切り替える</b>
              {Object.keys(roleNames).map((r) => (
                <button key={r} onClick={() => login(r)}>
                  {roleNames[r]}としてログイン
                </button>
              ))}
              <button
                onClick={() => {
                  setRole(null);
                  setProfile(false);
                  nav("/");
                }}
              >
                <LogOut size={16} />
                ログアウト
              </button>
            </div>
          )}
        </header>
        <main>
          <Routes>
            {menus[role].map(([p]) => (
              <Route key={p} path={`/${role}/${p}`} element={pageContent(p)} />
            ))}
            <Route
              path="*"
              element={<Navigate to={`/${role}/home`} replace />}
            />
          </Routes>
          <footer>
            Campus Hub <span>長崎大学 学務ポータル · プロトタイプ</span>
          </footer>
        </main>
        {modal && (
          <div className="modal-backdrop" onClick={() => setModal(null)}>
            <section
              role="dialog"
              aria-modal="true"
              aria-label={modal.title}
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="section-head">
                <h2>{modal.title}</h2>
                <button aria-label="閉じる" onClick={() => setModal(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">{modal.body}</div>
              <div className="modal-actions">
                <button onClick={() => setModal(null)}>閉じる</button>
                {modal.action && (
                  <button className="primary" onClick={modal.action}>
                    {modal.label}
                  </button>
                )}
              </div>
            </section>
          </div>
        )}
        {toast && (
          <div className="toast" role="status">
            <Check size={18} />
            {toast}
          </div>
        )}
      </div>
    </CampusContext.Provider>
  );
}
