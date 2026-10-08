import React from "react";
const paths = {
  GraduationCap: "M2 9l10-5 10 5-10 5-10-5 M6 11v6l6 3 6-3v-6 M22 9v7",
  Home: "M3 10l9-7 9 7 M5 9v12h5v-7h4v7h5V9",
  CalendarDays:
    "M5 5h14v16H5z M8 3v4 M16 3v4 M5 10h14 M8 14h2 M14 14h2 M8 17h2 M14 17h2",
  BookOpen: "M12 5v16 M12 5C8 2 3 4 3 4v15s5-2 9 2c4-4 9-2 9-2V4s-5-2-9 1z",
  CheckSquare: "M20 12v8H4V4h12 M9 10l3 3 9-10",
  ChartColumn: "M3 3v18h18 M7 17v-5 M12 17V8 M17 17V4",
  Bell: "M18 8a6 6 0 0 0-12 0c0 8-3 8-3 10h18c0-2-3-2-3-10 M10 21h4",
  FileText: "M5 3h9l5 5v13H5z M14 3v5h5 M8 12h8 M8 16h8",
  Users:
    "M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M2 21v-3c0-5 14-5 14 0v3 M17 4c5 0 5 8 0 8 M18 15c4 0 4 4 4 6",
  Settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z",
  Search: "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14 M15 15l6 6",
  ChevronRight: "M9 5l7 7-7 7",
  ChevronLeft: "M15 5l-7 7 7 7",
  Plus: "M12 4v16 M4 12h16",
  Download: "M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5",
  Share2:
    "M18 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M6 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M9 10l6-3 M9 14l6 3",
  Upload: "M12 16V3 M7 8l5-5 5 5 M4 16v5h16v-5",
  Star: "M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z",
  X: "M5 5l14 14 M19 5L5 19",
  LogOut: "M10 3H4v18h6 M9 12h13 M17 7l5 5-5 5",
  ArrowRight: "M3 12h18 M15 6l6 6-6 6",
  Check: "M4 12l5 5L20 6",
  Menu: "M3 6h18 M3 12h18 M3 18h18",
};
function icon(name) {
  return function Icon({ size = 24, ...props }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <path d={paths[name]} />
      </svg>
    );
  };
}
export const GraduationCap = icon("GraduationCap"),
  Home = icon("Home"),
  CalendarDays = icon("CalendarDays"),
  BookOpen = icon("BookOpen"),
  CheckSquare = icon("CheckSquare"),
  ChartColumn = icon("ChartColumn"),
  Bell = icon("Bell"),
  FileText = icon("FileText"),
  Users = icon("Users"),
  Settings = icon("Settings"),
  Search = icon("Search"),
  ChevronRight = icon("ChevronRight"),
  ChevronLeft = icon("ChevronLeft"),
  Plus = icon("Plus"),
  Download = icon("Download"),
  Share2 = icon("Share2"),
  Upload = icon("Upload"),
  Star = icon("Star"),
  X = icon("X"),
  LogOut = icon("LogOut"),
  ArrowRight = icon("ArrowRight"),
  Check = icon("Check"),
  Menu = icon("Menu");
