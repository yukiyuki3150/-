import React, { useMemo, useState } from "react";

import { ArrowRight, Search, Users } from "../../icons";
import { useStore } from "../../lib/store";
import { Title } from "../../components/Display";

const initialCommunities = [
  {
    id: "community-economics",
    name: "経済学部の勉強会",
    visibility: "公開",
    description: "ミクロ・マクロ経済学を一緒に勉強して、試験や課題の情報を交換しましょう。",
    hashtags: ["経済学", "勉強会", "試験対策"],
    emails: [],
    owner: "seed",
  },
  {
    id: "community-nagasaki",
    name: "長崎まちづくりラボ",
    visibility: "公開",
    description: "長崎の地域や観光、まちづくりに関心がある学生がアイデアを話し合うグループです。",
    hashtags: ["長崎", "地域活動", "まちづくり"],
    emails: [],
    owner: "seed",
  },
  {
    id: "community-language",
    name: "ゆるっと語学カフェ",
    visibility: "公開",
    description: "英語などの語学を、会話を楽しみながら気軽に練習するコミュニティです。",
    hashtags: ["語学", "英会話", "交流"],
    emails: [],
    owner: "seed",
  },
];

function highlight(text, query) {
  const keywords = query.trim().split(/\s+/).filter(Boolean);
  if (!keywords.length) return text;
  const expression = new RegExp(
    `(${keywords.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi",
  );
  return text.split(expression).map((part, index) =>
    keywords.some((word) => part.toLocaleLowerCase() === word.toLocaleLowerCase()) ? (
      <mark key={`${part}-${index}`}>{part}</mark>
    ) : (
      part
    ),
  );
}

export function Community() {
  const [communities, setCommunities] = useStore(
    "ch-communities",
    initialCommunities,
  );
  const [mode, setMode] = useState("choice");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [form, setForm] = useState({
    emails: "",
    name: "",
    visibility: "公開",
    description: "",
    hashtags: "",
  });
  const [message, setMessage] = useState("");

  const publicCommunities = communities.filter(
    (community) => community.visibility === "公開",
  );
  const myCommunities = communities.filter(
    (community) =>
      community.owner === "current" && community.visibility === "非公開",
  );
  const results = useMemo(() => {
    const keywords = submittedQuery
      .trim()
      .toLocaleLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    return publicCommunities.filter((community) => {
      const searchable = [
        community.name,
        community.description,
        ...community.hashtags,
      ]
        .join(" ")
        .toLocaleLowerCase();
      return keywords.every((keyword) => searchable.includes(keyword));
    });
  }, [publicCommunities, submittedQuery]);

  function createCommunity(event) {
    event.preventDefault();
    const emails = form.emails
      .split(/[,;\s]+/)
      .map((email) => email.trim())
      .filter(Boolean);
    const invalidEmail = emails.find(
      (email) => !/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(email),
    );
    if (invalidEmail) {
      setMessage("メールアドレスの形式を確認してください。");
      return;
    }

    const hashtags = [
      ...new Set(
        form.hashtags
          .split(/[\s,、#]+/)
          .map((tag) => tag.trim())
          .filter(Boolean)
          .map((tag) => `#${tag}`),
      ),
    ];
    setCommunities((current) => [
      {
        id: `community-${Date.now()}`,
        name: form.name.trim(),
        visibility: form.visibility,
        description: form.description.trim(),
        hashtags,
        emails,
        owner: "current",
      },
      ...current,
    ]);
    setForm({
      emails: "",
      name: "",
      visibility: "公開",
      description: "",
      hashtags: "",
    });
    setMessage("グループを作成しました。招待メールはデモのため送信されません。");
    setMode("search");
    setQuery("");
    setSubmittedQuery("");
  }

  function renderCommunity(community, queryText = "") {
    return (
      <article className="panel community-card" key={community.id}>
        <div className="community-card-heading">
          <h3>{highlight(community.name, queryText)}</h3>
          <span className="badge">
            {community.visibility === "公開" ? "公開" : "非公開"}
          </span>
        </div>
        <p>{highlight(community.description, queryText)}</p>
        {community.hashtags.length > 0 && (
          <div className="community-tags">
            {community.hashtags.map((tag) => (
              <span className="badge" key={tag}>
                {highlight(tag, queryText)}
              </span>
            ))}
          </div>
        )}
        {community.owner === "current" && (
          <small className="muted">
            招待先 {community.emails.length}件
            {community.emails.length > 0 && ` · ${community.emails.join("、")}`}
          </small>
        )}
      </article>
    );
  }

  return (
    <>
      <Title
        title="コミュニティ"
        subtitle="興味のある仲間とつながろう。"
      />
      {mode === "choice" ? (
        <section className="panel community-choice">
          <h3>
            <Users />
            コミュニティを作成・検索
          </h3>
          <p className="muted">
            グループを作成するか、興味のあるコミュニティを検索できます。
          </p>
          <div className="community-actions">
            <button
              className="primary"
              type="button"
              onClick={() => {
                setMessage("");
                setMode("create");
              }}
            >
              グループを作成 <ArrowRight size={17} />
            </button>
            <button
              type="button"
              onClick={() => {
                setMessage("");
                setMode("search");
              }}
            >
              グループを検索 <Search size={17} />
            </button>
          </div>
        </section>
      ) : (
        <>
          <div className="community-actions community-mode-actions">
            <button
              className={mode === "create" ? "primary" : ""}
              type="button"
              onClick={() => {
                setMessage("");
                setMode("create");
              }}
            >
              作成
            </button>
            <button
              className={mode === "search" ? "primary" : ""}
              type="button"
              onClick={() => {
                setMessage("");
                setMode("search");
              }}
            >
              検索
            </button>
            <button type="button" onClick={() => setMode("choice")}>
              選択に戻る
            </button>
          </div>

          {mode === "create" ? (
            <section className="panel community-form-panel">
              <h3>グループを作成</h3>
              <form onSubmit={createCommunity}>
                <label>
                  招待する生徒・学生のメールアドレス
                  <input
                    type="text"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="student@example.jp（複数の場合はカンマ区切り）"
                    value={form.emails}
                    onChange={(event) =>
                      setForm({ ...form, emails: event.target.value })
                    }
                  />
                </label>
                <label>
                  グループ名
                  <input
                    required
                    maxLength={60}
                    placeholder="例：地域活動サークル"
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                  />
                </label>
                <label>
                  公開設定
                  <select
                    value={form.visibility}
                    onChange={(event) =>
                      setForm({ ...form, visibility: event.target.value })
                    }
                  >
                    <option value="公開">公開（検索結果に表示）</option>
                    <option value="非公開">非公開（作成者のみ表示）</option>
                  </select>
                </label>
                <label>
                  グループ紹介文
                  <textarea
                    required
                    maxLength={500}
                    placeholder="活動内容や、参加してほしい人について紹介してください。"
                    value={form.description}
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                  />
                </label>
                <label>
                  ハッシュタグ
                  <input
                    placeholder="例：地域活動, ボランティア"
                    value={form.hashtags}
                    onChange={(event) =>
                      setForm({ ...form, hashtags: event.target.value })
                    }
                  />
                </label>
                <p className="muted tiny">
                  入力されたメールアドレスに招待メールは送信されません（ローカルデモ）。
                </p>
                <button className="primary" type="submit">
                  グループを作成
                </button>
              </form>
            </section>
          ) : (
            <section className="panel community-search-panel">
              <h3>グループを検索</h3>
              <form
                className="community-search"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmittedQuery(query);
                }}
              >
                <input
                  aria-label="コミュニティ検索キーワード"
                  placeholder="グループ名・紹介文・ハッシュタグで検索"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <button className="primary" type="submit">
                  <Search size={17} />
                  検索
                </button>
              </form>
              <p className="muted tiny">
                キーワードに一致した部分を黄色でハイライトします。非公開グループは検索結果に表示されません。
              </p>
              {message && <p className="community-message">{message}</p>}
              <div className="community-results" aria-live="polite">
                {results.map((community) =>
                  renderCommunity(community, submittedQuery),
                )}
                {results.length === 0 && (
                  <p className="empty">
                    該当する公開グループがありません。別のキーワードで検索してください。
                  </p>
                )}
              </div>
              {myCommunities.length > 0 && (
                <div className="community-own">
                  <h3>あなたが作成した非公開グループ</h3>
                  {myCommunities.map((community) => renderCommunity(community))}
                </div>
              )}
            </section>
          )}
        </>
      )}
      {message && mode !== "search" && (
        <p className="community-message" role="status">
          {message}
        </p>
      )}
    </>
  );
}
