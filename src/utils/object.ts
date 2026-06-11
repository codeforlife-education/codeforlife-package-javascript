export function getNestedProperty(
  obj: Record<string, any>,
  dotPath: string | string[],
): any {
  if (typeof dotPath === "string") dotPath = dotPath.split(".")

  let value: unknown = obj
  for (let i = 0; i < dotPath.length; i++) {
    value = (value as Record<string, any>)[dotPath[i]]
    if (
      i !== dotPath.length - 1 &&
      (typeof value !== "object" || value === null)
    )
      return
  }

  return value
}

export function withKeyPaths(obj: object, delimiter: string = "."): object {
  function _withKeyPaths(obj: object, path: string[]) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const _path = [...path, key]

        if (typeof value === "object" && value !== null)
          value = _withKeyPaths(value as object, _path)

        return [_path.join(delimiter), value]
      }),
    )
  }

  return _withKeyPaths(obj, [])
}

export function getKeyPaths(obj: object, delimiter: string = "."): string[] {
  function _getKeyPaths(obj: object, path: string[]): string[] {
    return Object.entries(obj)
      .map(([key, value]) => {
        const _path = [...path, key]
        const keyPath = _path.join(delimiter)

        return typeof value === "object" && value !== null
          ? [keyPath, ..._getKeyPaths(value as object, _path)]
          : [keyPath]
      })
      .flat()
  }

  return _getKeyPaths(obj, [])
}

export function excludeKeyPaths(
  obj: object,
  exclude: string[],
  delimiter: string = ".",
): any {
  function _excludeKeyPaths(obj: object, path: string[]) {
    return Object.fromEntries(
      Object.entries(obj)
        .map(([key, value]: [string, unknown]) => {
          const _path = [...path, key]

          if (
            typeof value === "object" &&
            value !== null &&
            !(value instanceof Date)
          )
            value = _excludeKeyPaths(value, _path)

          return exclude.includes(_path.join(delimiter)) ? [] : [key, value]
        })
        .filter(entry => entry.length),
    ) as object
  }

  return exclude.length ? _excludeKeyPaths(obj, []) : obj
}

type JoinPath<
  A extends string,
  B extends string,
  D extends string,
> = A extends "" ? B : `${A}${D}${B}`

type PrefixedValues<
  T extends object,
  Path extends string = "",
  D extends string = ".",
> = {
  [K in keyof T & string]: T[K] extends object
    ? PrefixedValues<T[K], JoinPath<Path, K, D>, D>
    : `${JoinPath<Path, K, D>}${D}${T[K] & (string | number | bigint | boolean | null | undefined)}`
}

export function prefixValuesWithKeyPath<const T extends object>(
  obj: T,
): PrefixedValues<T>
export function prefixValuesWithKeyPath<
  const T extends object,
  D extends string,
>(obj: T, delimiter: D): PrefixedValues<T, "", D>
export function prefixValuesWithKeyPath(
  obj: object,
  delimiter: string = ".",
): object {
  function _prefixValuesWithKeyPath(obj: object, path: string[]): object {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const _path = [...path, key]

        if (typeof value === "object" && value !== null)
          value = _prefixValuesWithKeyPath(value as object, _path)
        else value = `${_path.join(delimiter)}${delimiter}${value}`

        return [key, value]
      }),
    )
  }

  return _prefixValuesWithKeyPath(obj, [])
}
