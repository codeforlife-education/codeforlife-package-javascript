import {
  createIdRegistry,
  createPathStrings,
  excludeKeyPaths,
  flattenNumberValues,
  flattenStringValues,
  getKeyPaths,
  getNestedProperty,
  withKeyPaths,
} from "./object"

// getNestedProperty

const PERSON = { father: { father: { name: "John" } } }

test("get a nested property with dot notation", () => {
  const name = getNestedProperty(PERSON, "father.father.name") as string

  expect(name).toEqual("John")
})

test("get a nested property with string array", () => {
  const name = getNestedProperty(PERSON, ["father", "father", "name"]) as string

  expect(name).toEqual("John")
})

test("get a nested property that doesn't exist", () => {
  const name = getNestedProperty(PERSON, "mother.mother.name") as undefined

  expect(name).toBeUndefined()
})

// withKeyPaths

test("set the paths of nested keys", () => {
  const obj = withKeyPaths({ a: 1, b: { c: 2, d: { e: 3 } } })

  expect(obj).toMatchObject({ a: 1, b: { "b.c": 2, "b.d": { "b.d.e": 3 } } })
})

// getKeyPaths

test("get the paths of nested keys", () => {
  const keyPaths = getKeyPaths({ a: 1, b: { c: 2, d: { e: 3 } } })

  expect(keyPaths).toMatchObject(["a", "b", "b.c", "b.d", "b.d.e"])
})

// excludeKeyPaths

test("exclude nested keys by their path", () => {
  const obj = excludeKeyPaths({ a: 1, b: { c: 2, d: { e: 3 } } }, [
    "b.c",
    "b.d.e",
  ]) as object

  expect(obj).toMatchObject({ a: 1, b: { d: {} } })
})

// createPathStrings

test("create path strings from an object", () => {
  const obj = createPathStrings({
    a: "b",
    d: { e: ["f", "g"] },
  } as const)

  expect(obj).toMatchObject({
    a: { b: "a.b" },
    d: { e: { f: "d.e.f", g: "d.e.g" } },
  })
})

test("create path strings from an array", () => {
  const obj = createPathStrings(["a", "b", "c"] as const)

  expect(obj).toMatchObject({ a: "a", b: "b", c: "c" })
})

// flattenNumberValues

test("flatten all number values in a nested object", () => {
  const numbers = flattenNumberValues({
    a: 1,
    b: { c: 2, d: { e: 3 } },
    f: "four",
  } as const)

  expect(numbers).toMatchObject([1, 2, 3])
})

// flattenStringValues

test("flatten all string values in a nested object", () => {
  const strings = flattenStringValues({
    a: "one",
    b: { c: "two", d: { e: "three" } },
    f: 4,
  } as const)

  expect(strings).toMatchObject(["one", "two", "three"])
})

// createIdRegistry

test("create an ID registry from a mapping of keys to path specifications", () => {
  const registry = createIdRegistry({
    1: "a",
    2: { b: "c" },
    3: { d: { e: "f" } },
  } as const)

  expect(registry).toMatchObject({
    a: 1,
    b: { c: 2 },
    d: { e: { f: 3 } },
  })
})
