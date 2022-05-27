export type Point = [number, number]

export const int2Roman = (num: number) => {
  const thousands = ['', 'M', 'MM', 'MMM']
  const hundreds = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM']
  const tens = ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC']
  const ones = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
  const roman = []
  roman.push(thousands[Math.floor(num / 1000)])
  roman.push(hundreds[Math.floor((num % 1000) / 100)])
  roman.push(tens[Math.floor((num % 100) / 10)])
  roman.push(ones[num % 10])
  return roman.join('')
}
