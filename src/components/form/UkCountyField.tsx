import { type ElementType, type JSX } from "react"
import { type ChipTypeMap } from "@mui/material"

import AutocompleteField, {
  type AutocompleteFieldProps,
} from "./AutocompleteField"
import { UK_COUNTIES } from "../../utils/location"

export interface UkCountyFieldProps<
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends ElementType = ChipTypeMap["defaultComponent"],
> extends Omit<
    AutocompleteFieldProps<
      string,
      Multiple,
      DisableClearable,
      FreeSolo,
      ChipComponent
    >,
    "options" | "textFieldProps"
  > {
  textFieldProps?: Omit<
    AutocompleteFieldProps<
      string,
      Multiple,
      DisableClearable,
      FreeSolo,
      ChipComponent
    >["textFieldProps"],
    "name"
  > & {
    name?: string
  }
}

const UkCountyField = <
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends ElementType = ChipTypeMap["defaultComponent"],
>({
  textFieldProps,
  ...otherAutocompleteFieldProps
}: UkCountyFieldProps<
  Multiple,
  DisableClearable,
  FreeSolo,
  ChipComponent
>): JSX.Element => {
  const {
    name = "uk_county",
    label = "UK county",
    placeholder = "Select your UK county",
    ...otherTextFieldProps
  } = textFieldProps || {}

  return (
    <AutocompleteField
      options={UK_COUNTIES}
      textFieldProps={{ name, label, placeholder, ...otherTextFieldProps }}
      {...otherAutocompleteFieldProps}
    />
  )
}

export default UkCountyField
