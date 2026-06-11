import "dayjs/locale/en-gb"
import {
  DatePicker,
  type DatePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers"
import { Field, type FieldConfig, type FieldProps } from "formik"
import { type ValidateOptions, date as YupDate } from "yup"
import dayjs, { type Dayjs } from "dayjs"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { type JSX } from "react"

import { type FormValues, schemaToFieldValidator } from "../../utils/form"
import { getNestedProperty } from "../../utils/object"

export interface DatePickerFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends Omit<
    DatePickerProps<TEnableAccessibleFieldDOMStructure>,
    "name" | "value" | "onChange" | "slotProps"
  > {
  name: string
  required?: boolean
  validateOptions?: ValidateOptions
}

const DatePickerField = <
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>({
  name,
  required,
  minDate,
  maxDate,
  validateOptions,
  ...otherDatePickerProps
}: DatePickerFieldProps<TEnableAccessibleFieldDOMStructure>): JSX.Element => {
  const dotPath = name.split(".")

  function dateToString(date: Dayjs) {
    return date.locale("en-gb").format("L")
  }

  let schema = YupDate()
  if (required) schema = schema.required()
  if (minDate) {
    schema = schema.min(
      minDate,
      `this field must be after or equal to ${dateToString(minDate)}`,
    )
  }
  if (maxDate) {
    schema = schema.max(
      maxDate,
      `this field must be before or equal to ${dateToString(maxDate)}`,
    )
  }

  const fieldConfig: FieldConfig = {
    name,
    type: "date",
    validate: schemaToFieldValidator(schema, validateOptions),
  }

  return (
    <Field {...fieldConfig}>
      {({ form }: FieldProps) => {
        const error = getNestedProperty(form.errors, dotPath) as
          | string
          | undefined
        const touched = getNestedProperty(form.touched, dotPath) as boolean
        let value: Dayjs | null | string = getNestedProperty(
          form.values as FormValues,
          dotPath,
        ) as string

        value = value ? dayjs(value) : null

        function handleChange(value: Dayjs | null) {
          void form.setFieldValue(
            name,
            value && value.isValid() ? value.format("YYYY-MM-DD") : null,
            true,
          )
        }

        return (
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="en-gb"
          >
            <DatePicker
              name={name}
              value={value}
              minDate={minDate}
              maxDate={maxDate}
              onChange={handleChange}
              slotProps={{
                textField: {
                  id: name,
                  // @ts-expect-error value is compatible
                  onChange: value => {
                    handleChange(value as Dayjs | null)
                  },
                  onBlur: form.handleBlur,
                  required,
                  error: touched && Boolean(error),
                  helperText: (touched && error) as false | string,
                },
              }}
              {...otherDatePickerProps}
            />
          </LocalizationProvider>
        )
      }}
    </Field>
  )
}

export default DatePickerField
