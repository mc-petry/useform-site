export type Device = 'mobile'

export const mqList = [
  ['mobile', `(max-width: 768px)`]
]

export const mq = mqList.reduce<{ [key in Device]: string }>((prev, next) => {
  prev[next[0] as Device] = `@media ${next[1]}`
  return prev
}, {} as any)
