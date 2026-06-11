import type { FieldValidator, FormikHelpers } from "formik"
import { type Schema, type ValidateOptions, ValidationError } from "yup"
import type { TypedMutationTrigger } from "@reduxjs/toolkit/query/react"

import { excludeKeyPaths, getKeyPaths, getNestedProperty } from "./object"

export type FormValues = Record<string, any>

export function isFormError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 400 &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null
  )
}

export function setFormErrors(
  error: unknown,
  setErrors: (errors: object) => void,
): void {
  if (!isFormError(error)) throw error

  const data = Object.fromEntries(
    Object.entries((error as { data: object }).data).map(([field, errors]) => {
      if (Array.isArray(errors)) errors = errors.join(". ")
      return [field, errors]
    }),
  )

  setErrors(data)
}

export type SubmitFormOptions<
  Values extends FormValues,
  QueryArg extends FormValues,
  ResultType,
> = Partial<{
  exclude: string[]
  include: string[]
  onlyDirtyValues: boolean
  then: (
    result: ResultType,
    values: Values,
    helpers: FormikHelpers<Values>,
  ) => void
  catch: (
    error: unknown,
    values: Values,
    helpers: FormikHelpers<Values>,
  ) => void
  finally: (values: Values, helpers: FormikHelpers<Values>) => void
}> &
  (Values extends QueryArg
    ? { clean?: (values: Values) => QueryArg }
    : { clean: (values: Values) => QueryArg })

export type SubmitFormHandler<Values extends FormValues> = (
  values: Values,
  helpers: FormikHelpers<Values>,
) => void | Promise<any>

export function submitForm<
  Values extends QueryArg,
  QueryArg extends FormValues,
  ResultType,
>(
  trigger: TypedMutationTrigger<ResultType, QueryArg, any>,
  initialValues: Values,
  options?: SubmitFormOptions<Values, QueryArg, ResultType>,
): SubmitFormHandler<Values>

export function submitForm<
  Values extends FormValues,
  QueryArg extends FormValues,
  ResultType,
>(
  trigger: TypedMutationTrigger<ResultType, QueryArg, any>,
  initialValues: Values,
  options: SubmitFormOptions<Values, QueryArg, ResultType>,
): SubmitFormHandler<Values>

export function submitForm<
  Values extends FormValues,
  QueryArg extends FormValues,
  ResultType,
>(
  trigger: TypedMutationTrigger<ResultType, QueryArg, any>,
  initialValues: Values,
  options?: SubmitFormOptions<Values, QueryArg, ResultType>,
): SubmitFormHandler<Values> {
  const {
    include,
    onlyDirtyValues = false,
    then,
    catch: _catch,
    finally: _finally,
  } = options || {}
  let { exclude = [] } = options || {}

  return (values, helpers) => {
    let arg =
      options && options.clean
        ? options.clean(values as QueryArg & FormValues)
        : (values as unknown as QueryArg)

    if (onlyDirtyValues) {
      exclude = [
        ...exclude,
        ...getCleanNames(values, initialValues).filter(
          cleanName => !exclude.includes(cleanName),
        ),
      ]
    }

    if (include) exclude = exclude.filter(name => !include.includes(name))

    if (exclude.length) arg = excludeKeyPaths(arg, exclude) as QueryArg

    trigger(arg)
      .unwrap()
      .then(result => {
        if (then) then(result, values, helpers)
      })
      .catch(error => {
        if (_catch) _catch(error, values, helpers)
        setFormErrors(error, helpers.setErrors)
      })
      .finally(() => {
        if (_finally) _finally(values, helpers)
      })
  }
}

export function schemaToFieldValidator(
  schema: Schema,
  options?: ValidateOptions,
): FieldValidator {
  return async value => {
    try {
      await schema.validate(value, options)
    } catch (error) {
      if (error instanceof ValidationError) {
        return error.errors.join(". ")
      }

      throw error
    }
  }
}

// Checking if individual fields are dirty is not currently supported.
// https://github.com/jaredpalmer/formik/issues/1421
export function getDirty<Values extends FormValues>(
  values: Values,
  initialValues: Values,
  names?: string[],
): Record<string, boolean> {
  if (!names) names = getKeyPaths(values)

  return Object.fromEntries(
    names.map(name => [name, isDirty(values, initialValues, name)]),
  )
}

export function isDirty<Values extends FormValues>(
  values: Values,
  initialValues: Values,
  name: string,
): boolean {
  const value: unknown = getNestedProperty(values, name)
  const initialValue: unknown = getNestedProperty(initialValues, name)

  return value !== initialValue
}

export function getCleanNames<Values extends FormValues>(
  values: Values,
  initialValues: Values,
  names?: string[],
): string[] {
  return Object.entries(getDirty(values, initialValues, names))
    .filter(
      ([
        _, // eslint-disable-line @typescript-eslint/no-unused-vars
        isDirty,
      ]) => !isDirty,
    )
    .map(([name]) => name)
}
