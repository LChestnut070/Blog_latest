/** 统一按 UTC 解析 YYYY-MM-DD，避免服务器时区导致日期差一天 */
function toDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

/** 2026-10-20 → 2026年10月20日 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(toDate(iso));
}

/** 2026-10-20 → 2026.10.20 */
export function formatDateDot(iso: string): string {
  return iso.replaceAll("-", ".");
}

export function formatYear(iso: string): string {
  return iso.slice(0, 4);
}
