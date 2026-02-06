/**
 * Get current date in YYYY-MM-DD format using browser's local timezone
 */
function getCurrentDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateString(isoDateTimeString: string): string {
  const [datePart] = isoDateTimeString.split("T"); // "YYYY-MM-DDT00:00:000Z"
  const [year, month, day] = datePart.split("-");
  return `${month}-${day}-${year}`;
}

function daysBetween(dateStr1: string, dateStr2: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const d1 = new Date(dateStr1 + "T00:00:00");
  const d2 = new Date(dateStr2 + "T00:00:00");
  return Math.round(Math.abs(d2.getTime() - d1.getTime()) / msPerDay);
}

function dayOfTheWeekPrint(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function roundPlayDatePrint(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  return `${dayOfTheWeekPrint(dateStr)}, ${Number(month)}/${Number(day)}`;
}

export { getCurrentDateString, getDateString, daysBetween, roundPlayDatePrint };
