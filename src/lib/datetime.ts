import dayjs, { Dayjs } from "dayjs";

const strings = {
  relativeDateSuffix: "日前",
  relativeMonthSuffix: "ヶ月前",
};

export function formatRelativeDateTime(
  targetDate: Dayjs,
  currentDate?: Dayjs
): string {
  if (!currentDate) {
    currentDate = dayjs();
  }

  const diff = currentDate.diff(targetDate, "day");

  if (diff < 1) {
    return targetDate.format("H:mm");
  } else if (diff < 31) {
    return `${Math.floor(diff)}${strings.relativeDateSuffix}`;
  } else {
    return `${Math.floor(diff / 30)}${strings.relativeMonthSuffix}`;
  }
}
