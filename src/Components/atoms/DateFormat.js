export const DateFormat = (date) => {
  var  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var monthName = months[date.getMonth()];
  var Dated = date.getDate()
  var year = date.getFullYear();
  var dateFormat = monthName+' '+Dated+' '+year
  return dateFormat
}


