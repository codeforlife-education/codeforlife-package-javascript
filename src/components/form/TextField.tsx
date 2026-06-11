import { type FC, useEffect, useState } from "react"
import { Field, type FieldConfig, type FieldProps } from "formik"
import {
  TextField as MuiTextField,
  type TextFieldProps as MuiTextFieldProps,
} from "@mui/material"
import { type StringSchema, type ValidateOptions, array as YupArray } from "yup"

import { type FormValues, schemaToFieldValidator } from "../../utils/form"
import { getNestedProperty } from "../../utils/object"

export type TextFieldProps = Omit<
  MuiTextFieldProps,
  | "name"
  | "value"
  | "onChange"
  | "onBlur"
  | "error"
  | "defaultValue"
  | "helperText"
> & {
  name: string
  schema: StringSchema
  validateOptions?: ValidateOptions
  dirty?: boolean
  split?: string | RegExp
  unique?: boolean
  uniqueCaseInsensitive?: boolean
}

// https://formik.org/docs/examples/with-material-ui
const TextField: FC<TextFieldProps> = ({
  id,
  name,
  schema,
  type = "text",
  required = false,
  dirty = false,
  unique = false,
  uniqueCaseInsensitive = false,
  split,
  validateOptions,
  ...otherTextFieldProps
}) => {
  const [initialValue, setInitialValue] = useState<string | string[]>("")

  const dotPath = name.split(".")

  function buildSchema() {
    // Build a schema for a single string.
    let stringSchema = schema
    // 1: Validate string is required.
    stringSchema = required ? stringSchema.required() : stringSchema.optional()
    // 2: Validate string is dirty.
    if (dirty && !split)
      stringSchema = stringSchema.notOneOf(
        [initialValue as string],
        "cannot be initial value",
      )
    // Return a schema for a single string.
    if (!split) return stringSchema

    // Build a schema for an array of strings.
    let arraySchema = YupArray().of(stringSchema)
    // 1: Validate array has min one string.
    arraySchema = required
      ? arraySchema.required().min(1)
      : arraySchema.optional()
    // 2: Validate array has unique strings.
    if (unique || uniqueCaseInsensitive)
      arraySchema = arraySchema.test({
        message: "cannot have duplicates",
        test: values => {
          if (
            Array.isArray(values) &&
            values.length >= 2 &&
            values.every(value => typeof value === "string")
          ) {
            return (
              new Set(
                uniqueCaseInsensitive
                  ? values.map(value => value.toLowerCase())
                  : values,
              ).size === values.length
            )
          }

          return true
        },
      })
    // 3: Validate array is dirty.
    if (dirty)
      arraySchema = arraySchema.notOneOf(
        [initialValue as string[]],
        "cannot be initial value",
      )
    // Return a schema for an array of strings.
    return arraySchema
  }

  const fieldConfig: FieldConfig = {
    name,
    type,
    validate: schemaToFieldValidator(buildSchema(), validateOptions),
  }

  const FieldInternal: FC<FieldProps> = ({ form }) => {
    const initialValue = getNestedProperty(
      form.initialValues as FormValues,
      dotPath,
    ) as string
    const value = getNestedProperty(
      form.values as FormValues,
      dotPath,
    ) as string
    const error = getNestedProperty(form.errors, dotPath) as string | undefined
    const touched = getNestedProperty(form.touched, dotPath) as boolean

    useEffect(() => {
      setInitialValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      void form.setFieldValue(
        name,
        split && typeof value === "string" ? value.split(split) : value,
        true,
      )
    }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <MuiTextField
        id={id ?? name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={touched && Boolean(error)}
        helperText={(touched && error) as false | string}
        {...otherTextFieldProps}
      />
    )
  }

  return <Field {...fieldConfig}>{FieldInternal}</Field>
}

export default TextField
