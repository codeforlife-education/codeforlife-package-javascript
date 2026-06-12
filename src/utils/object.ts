/** Recursively extracts all numeric values from a nested object structure. */
export type DeepNumbersOf<T> = T extends number
  ? T
  : T extends object
    ? DeepNumbersOf<T[keyof T]>
    : never
/** Recursively extracts all string values from a nested object structure. */
export type DeepStringsOf<T> = T extends string
  ? T
  : T extends object
    ? DeepStringsOf<T[keyof T]>
    : never

function _flattenValuesOfType<T extends object, U>(
  obj: T,
  typeGuard: (value: unknown) => value is U,
): U[] {
  return Object.values(obj).flatMap(v =>
    typeGuard(v)
      ? [v]
      : typeof v === "object" && v !== null
        ? _flattenValuesOfType(v, typeGuard)
        : [],
  )
}

export function flattenNumberValues<T extends object>(
  obj: T,
): DeepNumbersOf<T>[] {
  return _flattenValuesOfType(
    obj,
    (value): value is number => typeof value === "number",
  ) as DeepNumbersOf<T>[]
}

export function flattenStringValues<T extends object>(
  obj: T,
): DeepStringsOf<T>[] {
  return _flattenValuesOfType(
    obj,
    (value): value is string => typeof value === "string",
  ) as DeepStringsOf<T>[]
}

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

export type PathStringMap<
  T extends object,
  Path extends string = "",
  D extends string = ".",
> = T extends readonly (infer E extends string)[]
  ? { [V in E]: JoinPath<Path, V, D> }
  : {
      [K in keyof T & string]: T[K] extends readonly (infer E extends string)[]
        ? { [V in E]: JoinPath<JoinPath<Path, K, D>, V, D> }
        : T[K] extends object
          ? PathStringMap<T[K] & object, JoinPath<Path, K, D>, D>
          : T[K] extends string
            ? { [V in T[K]]: JoinPath<JoinPath<Path, K, D>, V, D> }
            : never
    }

export function createPathStrings<const T extends object>(
  obj: T,
): PathStringMap<T>
export function createPathStrings<const T extends object, D extends string>(
  obj: T,
  delimiter: D,
): PathStringMap<T, "", D>
export function createPathStrings(
  obj: object,
  delimiter: string = ".",
): object {
  function _createPathStrings(obj: object, path: string[]): object {
    if (Array.isArray(obj)) {
      return Object.fromEntries(
        (obj as string[]).map(value => [
          value,
          [...path, value].join(delimiter),
        ]),
      )
    }

    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const _path = [...path, key]

        if (typeof value === "object" && value !== null)
          value = _createPathStrings(value as object, _path)
        else if (typeof value === "string")
          value = { [value]: [..._path, value].join(delimiter) }

        return [key, value]
      }),
    )
  }

  return _createPathStrings(obj, [])
}

type PathSpec = string | { readonly [key: string]: PathSpec }

type ResolvePathSpec<T, ID extends number | string> = T extends string
  ? Record<T, ID>
  : { [K in keyof T]: ResolvePathSpec<T[K], ID> }

type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never

export type IdRegistryResult<T extends Record<number | string, PathSpec>> =
  UnionToIntersection<
    {
      [K in keyof T]: K extends number | string
        ? ResolvePathSpec<T[K], K>
        : never
    }[keyof T]
  >

/**
 * Converts a mapping of numeric or string keys to path specifications into a
 * nested object structure where each path specification is replaced with the
 * corresponding numeric or string key. This allows to create a global registry
 * of unique keys that can be easily referenced in the code.
 *
 * @param specs A mapping of numeric or string keys to path specifications,
 * where each path specification can be a string or a nested object of strings.
 * @returns A nested object structure where each path specification is replaced
 * with the corresponding numeric or string key.
 */
export function createIdRegistry<T extends Record<number | string, PathSpec>>(
  specs: T,
): IdRegistryResult<T> {
  const result: Record<string, unknown> = {}

  function _assignPath(
    target: Record<string, unknown>,
    pathSpec: PathSpec,
    id: number | string,
  ): void {
    if (typeof pathSpec === "string") {
      target[pathSpec] = id
    } else {
      for (const [key, nested] of Object.entries(pathSpec)) {
        if (!(key in target)) target[key] = {}
        _assignPath(target[key] as Record<string, unknown>, nested, id)
      }
    }
  }

  for (const [idStr, pathSpec] of Object.entries(specs)) {
    const num = Number(idStr)
    const id: number | string = !isNaN(num) && idStr.trim() !== "" ? num : idStr
    _assignPath(result, pathSpec, id)
  }

  return result as IdRegistryResult<T>
}
