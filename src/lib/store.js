import { useState, useEffect } from "react";
export function useStore(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(
    () => localStorage.setItem(key, JSON.stringify(value)),
    [key, value],
  );
  return [value, setValue];
}

// Migrate legacy drafts once, retaining both registered courses and pending additions.
// After migration an intentionally empty draft must remain empty.
export function useRegistrationDraft(registered) {
  const [draft, setDraft] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ch-draft"));
      if (
        localStorage.getItem("ch-draft-version") === "2" &&
        Array.isArray(saved)
      )
        return saved;
      return [
        ...new Set([...registered, ...(Array.isArray(saved) ? saved : [])]),
      ];
    } catch {
      return [...registered];
    }
  });
  useEffect(() => {
    localStorage.setItem("ch-draft", JSON.stringify(draft));
    localStorage.setItem("ch-draft-version", "2");
  }, [draft]);
  return [draft, setDraft];
}
