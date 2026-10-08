import React, { useState, useEffect, useContext } from "react";

import {
  Home,
  CalendarDays,
  BookOpen,
  CheckSquare,
  ChartColumn,
  Bell,
  FileText,
  Users,
  Settings,
} from "../icons";

export const roleNames = { student: "学生", teacher: "教員", admin: "事務" };
export const menus = {
  student: [
    ["home", "ホーム", Home],
    ["timetable", "時間割", CalendarDays],
    ["registration", "履修登録", BookOpen],
    ["tasks", "マイタスク", CheckSquare],
    ["grades", "成績・履修状況", ChartColumn],
    ["notices", "お知らせ", Bell],
    ["applications", "各種申請", FileText],
  ],
  teacher: [
    ["home", "ホーム", Home],
    ["courses", "担当科目", BookOpen],
    ["students", "学生一覧", Users],
    ["grades", "成績入力", ChartColumn],
    ["notices", "連絡・お知らせ", Bell],
    ["settings", "設定", Settings],
  ],
  admin: [
    ["home", "ダッシュボード", Home],
    ["students", "学生管理", Users],
    ["courses", "履修・科目管理", BookOpen],
    ["applications", "各種申請", FileText],
    ["notices", "お知らせ配信", Bell],
    ["analytics", "統計・分析", ChartColumn],
    ["settings", "設定", Settings],
  ],
};
