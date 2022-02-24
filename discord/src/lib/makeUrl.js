export function makeUrl(one, two, name1, name2, firstDate) {
  const monthArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = new Date(firstDate).getMonth();

  const result = makeMonthArray(month, monthArray);

  return `https://quickchart.io/chart?c={type:'line',data:{labels:[${result.map(
    (i) => `\'${i}\'`
  )}],datasets:[{label:'${name1}',data:[${one}],fill:false,borderColor:'blue'},{label:'${name2}',data:[${two}],fill:false,borderColor:'green'}]}}`;
}

export function makeMonthArray(month, monthArray) {
  for (let i = 0; i < month; i++) {
    monthArray.push(monthArray.shift());
  }

  monthArray.push(monthArray[0]);

  return monthArray;
}
