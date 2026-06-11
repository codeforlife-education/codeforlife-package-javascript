import {
  Autocomplete,
  type AutocompleteProps,
  type ChipTypeMap,
  TextField,
  type TextFieldProps,
} from "@mui/material"
import { type ElementType, type JSX } from "react"
import { Field, type FieldConfig, type FieldProps } from "formik"
import {
  type ValidateOptions,
  number as YupNumber,
  string as YupString,
} from "yup"

import { type FormValues, schemaToFieldValidator } from "../../utils/form"
import { getNestedProperty } from "../../utils/object"

export interface AutocompleteFieldProps<
  Value extends string | number,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends ElementType = ChipTypeMap["defaultComponent"],
> extends Omit<
    AutocompleteProps<
      Value,
      Multiple,
      DisableClearable,
      FreeSolo,
      ChipComponent
    >,
    "renderInput" | "defaultValue" | "onChange" | "onBlur" | "value"
  > {
  textFieldProps: Omit<
    TextFieldProps,
    | "name"
    | "value"
    | "onChange"
    | "onBlur"
    | "error"
    | "helperText"
    | "defaultValue"
    | "type"
  > & {
    name: string
  }
  validateOptions?: ValidateOptions
}

const AutocompleteField = <
  Value extends string | number,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends ElementType = ChipTypeMap["defaultComponent"],
>({
  textFieldProps,
  options,
  validateOptions,
  ...otherAutocompleteProps
}: AutocompleteFieldProps<
  Value,
  Multiple,
  DisableClearable,
  FreeSolo,
  ChipComponent
>): JSX.Element => {
  const { id, name, required, ...otherTextFieldProps } = textFieldProps

  const dotPath = name.split(".")

  const message = "not a valid option"
  let schema =
    typeof options[0] === "string"
      ? YupString().oneOf(options as readonly string[], message)
      : YupNumber().oneOf(options as readonly number[], message)
  if (required) schema = schema.required()

  const fieldConfig: FieldConfig = {
    name,
    type: typeof options[0] === "string" ? "text" : "number",
    validate: schemaToFieldValidator(schema, validateOptions),
  }

  return (
    <Field {...fieldConfig}>
      {({ form, meta }: FieldProps) => {
        const value = getNestedProperty(
          form.values as FormValues,
          dotPath,
        ) as string
        const touched = getNestedProperty(form.touched, dotPath) as boolean
        const error = getNestedProperty(form.errors, dotPath) as
          | string
          | undefined

        return (
          <Autocomplete
            options={options}
            // @ts-expect-error value can be assigned
            defaultValue={
              meta.initialValue === ""
                ? undefined
                : (meta.initialValue as string)
            }
            renderInput={({
              id: _, // eslint-disable-line @typescript-eslint/no-unused-vars
              ...otherParams
            }) => (
              <TextField
                id={id ?? name}
                name={name}
                required={required}
                type="text" // Force to be string to avoid number incrementor/decrementor
                value={value}
                error={touched && Boolean(error)}
                helperText={touched && error}
                {...otherTextFieldProps}
                {...otherParams}
              />
            )}
            onChange={(_, value) => {
              void form.setFieldValue(name, value ?? undefined, true)
            }}
            onBlur={form.handleBlur}
            {...otherAutocompleteProps}
          />
        )
      }}
    </Field>
  )
}

export default AutocompleteField
