export const padZero = (num: number, len: number) => {
  return (Array(len).join('0') + num).slice(-len)
}
