export default function(d: Date, opts: { year?: boolean } = {}) {
  if (opts.year) {
    return d.toString().split(' ').slice(1, 4).join(' ')
  } else {
    return d.toString().split(' ').slice(1, 3).join(' ')
  }
}
