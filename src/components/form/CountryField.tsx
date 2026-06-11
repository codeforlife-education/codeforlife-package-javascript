import { type ElementType, type JSX } from "react"
import { type ChipTypeMap } from "@mui/material"

import AutocompleteField, {
  type AutocompleteFieldProps,
} from "./AutocompleteField"
import {
  COUNTRY_ISO_CODES,
  COUNTRY_ISO_CODE_MAPPING,
  type CountryIsoCodes,
} from "../../utils/location"

export interface CountryFieldProps<
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
    "options" | "textFieldProps" | "getOptionLabel"
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

const CountryField = <
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends ElementType = ChipTypeMap["defaultComponent"],
>({
  textFieldProps,
  ...otherAutocompleteFieldProps
}: CountryFieldProps<
  Multiple,
  DisableClearable,
  FreeSolo,
  ChipComponent
>): JSX.Element => {
  const {
    name = "country",
    label = "Country",
    placeholder = "Select your country",
    ...otherTextFieldProps
  } = textFieldProps || {}

  return (
    <AutocompleteField
      options={COUNTRY_ISO_CODES}
      getOptionLabel={isoCode =>
        COUNTRY_ISO_CODE_MAPPING[isoCode as CountryIsoCodes]
      }
      textFieldProps={{ name, label, placeholder, ...otherTextFieldProps }}
      {...otherAutocompleteFieldProps}
    />
  )
}

export default CountryField
