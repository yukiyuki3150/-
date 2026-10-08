import React from "react";

export function Title({ title, subtitle, children }) {
  return (
    <div className="page-title">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
export function Progress({ value }) {
  return (
    <div className="progress">
      <span style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}
export function Donut({ value, label, sub }) {
  return (
    <div className="donut">
      <svg viewBox="0 0 120 120" aria-label={`${label} ${sub}`}>
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="#e7effa"
          strokeWidth="12"
        />
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="#2878ee"
          strokeWidth="12"
          strokeDasharray={`${(value / 100) * 289} 289`}
          transform="rotate(-90 60 60)"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <strong>{label}</strong>
        <small>{sub}</small>
      </div>
    </div>
  );
}
export function Bars({ admin = false }) {
  const values = admin ? [1924, 2050, 2147, 2300] : [2.7, 3.0, 3.2, 3.4];
  return (
    <div className="bars">
      <svg
        viewBox="0 0 360 170"
        role="img"
        aria-label={admin ? "学年別在学生数" : "学期別成績"}
      >
        {values.map((v, i) => (
          <g key={i}>
            <rect
              x={35 + i * 83}
              y={140 - (v / (admin ? 2500 : 4)) * 115}
              width="42"
              height={(v / (admin ? 2500 : 4)) * 115}
              rx="4"
              fill={i === 3 ? "#1a6ff0" : "#83b5fc"}
            />
            <text x={56 + i * 83} y="159" textAnchor="middle">
              {admin ? `${i + 1}年` : ["25前", "25後", "26前", "26後"][i]}
            </text>
            {admin && (
              <text
                x={56 + i * 83}
                y={132 - (v / 2500) * 115}
                textAnchor="middle"
              >
                {v}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
