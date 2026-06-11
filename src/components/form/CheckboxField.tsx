import {
  Checkbox,
  type CheckboxProps,
  FormControl,
  FormControlLabel,
  type FormControlLabelProps,
  FormHelperText,
} from "@mui/material"
import { Field, type FieldConfig, type FieldProps } from "formik"
import { type ValidateOptions, bool as YupBool } from "yup"
import { type FC } from "react"

import { type FormValues, schemaToFieldValidator } from "../../utils/form"
import { getNestedProperty } from "../../utils/object"

export interface CheckboxFieldProps
  extends Omit<
    CheckboxProps,
    "defaultChecked" | "value" | "onChange" | "onBlur"
  > {
  name: string
  formControlLabelProps: Omit<FormControlLabelProps, "control">
  errorMessage?: string
  validateOptions?: ValidateOptions
}

const CheckboxField: FC<CheckboxFieldProps> = ({
  id,
  name,
  formControlLabelProps,
  required = false,
  errorMessage = "this is a required field",
  validateOptions,
  ...otherCheckboxProps
}) => {
  const dotPath = name.split(".")

  let schema = YupBool()
  if (required) schema = schema.oneOf([true], errorMessage)

  const fieldConfig: FieldConfig = {
    name,
    type: "checkbox",
    validate: schemaToFieldValidator(schema, validateOptions),
  }

  return (
    <Field {...fieldConfig}>
      {({ form, meta }: FieldProps) => {
        const touched = getNestedProperty(form.touched, dotPath) as boolean
        const error = getNestedProperty(form.errors, dotPath) as
          | string
          | undefined
        const value = getNestedProperty(
          form.values as FormValues,
          dotPath,
        ) as boolean

        const hasError = touched && Boolean(error)

        // https://mui.com/material-ui/react-checkbox/#formgroup
        return (
          <FormControl error={hasError} required={required}>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={meta.initialValue as boolean}
                  id={id ?? name}
                  name={name}
                  value={value}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  {...otherCheckboxProps}
                />
              }
              {...formControlLabelProps}
            />
            {hasError && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        )
      }}
    </Field>
  )
}

export default CheckboxField
