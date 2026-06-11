import {
  excludeKeyPaths,
  getKeyPaths,
  getNestedProperty,
  prefixValuesWithKeyPath,
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

// prefixValuesWithKeyPath

test("prefix the values of nested keys with their path", () => {
  const obj = prefixValuesWithKeyPath({
    a: 1,
    b: { c: 2, d: { e: 3 } },
  } as const)

  expect(obj).toMatchObject({
    a: "a.1",
    b: { c: "b.c.2", d: { e: "b.d.e.3" } },
  })
})
