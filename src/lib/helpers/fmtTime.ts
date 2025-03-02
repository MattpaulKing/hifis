export default function(d: Date) {
  let utcHours = d.getUTCHours()
  let isAM = utcHours < 12
  return `${isAM ? utcHours : utcHours - 12}:${d.getUTCMinutes()} ${isAM ? 'AM' : 'PM'}`
}
