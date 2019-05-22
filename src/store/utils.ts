
export const randomNumber = () => Math.floor(Math.random() * 1000000)

export function randomItem<T>(array: Array<T>): T {
   return array[Math.floor(Math.random() * array.length)]
}

export function shuffleProblem<T>(array: Array<T>): Array<T> {
   return array.sort(() => Math.random() - 0.5)
}
