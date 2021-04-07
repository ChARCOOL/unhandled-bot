declare module 'text2png' {
  const text2png: (text: string, option?: { [key: string]: string | number }) => Buffer

  export default text2png
}
