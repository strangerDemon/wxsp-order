/**
 * Created by Administrator on 2017/7/4.
 */
const week = [
  "星期天",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六"
];
//day 为0 1 2 3 4 5 6 
export const getWeekStr_week = function(day) {
  return week[day];
};
//AddDayCount 为 增加天数 
export const getWeekStr_add = function(AddDayCount) {
  let dd = new Date();
  return week[(dd.getDay() + AddDayCount) % 7];
};
//dateStr 为2018/5/12 2018-5-12等
export const getWeekStr_str = function(dateStr) {
  let dd = new Date(dateStr);
  return week[dd.getDay()];
};

export const getDateStr = function(AddDayCount) {
  let dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
  let y = dd.getFullYear();
  let m = dd.getMonth() + 1; //获取当前月份的日期 
  let d = dd.getDate();
  return y + "/" + m + "/" + d;
};