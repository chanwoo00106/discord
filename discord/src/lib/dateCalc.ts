import { AtDate } from "src/types";

type DateCalc = [Date, string, string];

export function dateCalc(atDate: AtDate): DateCalc {
  let date = new Date();
  switch (atDate) {
    case "yesterday":
      date = new Date(date.setDate(date.getDate() - 1));
    case "today":
      break;
    case "tomorrow":
      date = new Date(date.setDate(date.getDate() + 1));
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
