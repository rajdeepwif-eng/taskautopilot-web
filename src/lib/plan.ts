/** Per-visitor plan (cart) kept in the browser. Storage can be unavailable, so every access is guarded. */
const KEY = "ta-plan";

export function loadPlan(): number[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

export function savePlan(ids: number[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* storage blocked — plan lives in memory only */
  }
  try { window.dispatchEvent(new CustomEvent("ta-plan-change", { detail: ids })); } catch { /* ignore */ }
}
