import { AtDate, Week } from "src/types";

type DateCalc = [Date, string, string];

export function dateCalc(atDate: AtDate | Week): DateCalc {
  let date = new Date();
  switch (atDate) {
    case "yesterday":
      date = new Date(date.setDate(date.getDate() - 1));
      break;
    case "today":
      break;
    case "tomorrow":
      date = new Date(date.setDate(date.getDate() + 1));
      break;
    default:
      date = getDate(atDate);
  }
  const month = `${
    Math.floor(date.getMonth() + 1) < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1
  }`;
  const day = `${
    Math.floor(date.getDate()) < 10 ? "0" + date.getDate() : date.getDate()
  }`;

  return [date, month, day];
}

const week = ["일", "Mon", "Tue", "Wed", "Thu", "Fri", "토"];

function getDate(weekday: Week): Date {
  const date = new Date();
  const index = week.findIndex((i) => i === weekday);
  const day = date.getDay();
  return new Date(new Date().setDate(date.getDate() + (index - day)));
}
