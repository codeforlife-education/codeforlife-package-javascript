export type Required<T, K extends keyof T> = { [P in K]-?: T[P] }
export type Optional<T, K extends keyof T> = Partial<Pick<T, K>>
export type OptionalPropertyNames<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never
}[keyof T]
export type IsOptional<T, K extends keyof T> =
  K extends OptionalPropertyNames<T> ? true : false

/** Creates a tuple type of length N with elements of type T. */
export type Tuple<
  T,
  N extends number,
  A extends T[] = [],
> = A["length"] extends N ? A : Tuple<T, N, [...A, T]>

export function openInNewTab(url: string, target = "_blank"): void {
  window.open(url, target)
}

export function wrap(
  newFn: {
    before?: (...args: any[]) => void
    after?: (...args: any[]) => void
  },
  fn?: (...args: any[]) => any,
): (...args: any[]) => any {
  return (...args) => {
    if (newFn.before !== undefined) {
      newFn.before(...(args as unknown[]))
    }
    let value
    if (fn !== undefined) {
      value = fn(...(args as unknown[])) as unknown
    }
    if (newFn.after !== undefined) {
      newFn.after(...(args as unknown[]))
    }
    return value
  }
}

export function snakeCaseToCamelCase(obj: Record<string, any>): void {
  Object.entries(obj).forEach(([snakeKey, value]) => {
    if (typeof value === "object") snakeCaseToCamelCase(value as object)

    const camelKey = snakeKey.replace(/_+[a-z]/g, _char =>
      _char[_char.length - 1].toUpperCase(),
    )

    delete obj[snakeKey]
    obj[camelKey] = value as unknown
  })
}

export function camelCaseToSnakeCase(obj: Record<string, any>): void {
  Object.entries(obj).forEach(([camelKey, value]) => {
    if (typeof value === "object") camelCaseToSnakeCase(value as object)

    const snakeKey = camelKey.replace(
      /[A-Z]/g,
      char => `_${char.toLowerCase()}`,
    )

    delete obj[camelKey]
    obj[snakeKey] = value as unknown
  })
}

export const MIN_DATE = new Date(0, 0, 0)

export function generateSecureRandomString(
  length: number,
  charSet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
) {
  // Create an array of 32-bit unsigned integers
  const randomValues = window.crypto.getRandomValues(new Uint8Array(length))

  // Map the random values to characters from our string
  let result = ""
  for (let i = 0; i < length; i++) {
    result += charSet.charAt(randomValues[i] % charSet.length)
  }

  return result
}
