import {
  type FC,
  type JSX,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
} from "react"
import { FormHelperText, type FormHelperTextProps } from "@mui/material"
import {
  Formik,
  type FormikConfig,
  type FormikErrors,
  Form as FormikForm,
  type FormikProps,
} from "formik"
import type { TypedUseMutation } from "@reduxjs/toolkit/query/react"

import {
  type FormValues,
  type SubmitFormOptions,
  submitForm,
} from "../../utils/form"
import { getKeyPaths } from "../../utils/object"

const SCROLL_INTO_VIEW_OPTIONS: ScrollIntoViewOptions = {
  behavior: "smooth",
  block: "start",
}

type NonFieldErrorsProps = Omit<FormHelperTextProps, "error" | "ref"> & {
  scrollIntoViewOptions?: ScrollIntoViewOptions
}

const NonFieldErrors: FC<NonFieldErrorsProps> = ({
  scrollIntoViewOptions = SCROLL_INTO_VIEW_OPTIONS,
  ...formHelperTextProps
}) => {
  const pRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (pRef.current) pRef.current.scrollIntoView(scrollIntoViewOptions)
  }, [scrollIntoViewOptions])

  return <FormHelperText ref={pRef} error {...formHelperTextProps} />
}

export type FormErrors<Values> = FormikErrors<
  Omit<Values, "__all__"> & { __all__: string }
>

type _FormikProps<Values> = Omit<FormikProps<Values>, "errors"> & {
  errors: FormErrors<Values>
}

type BaseFormProps<Values> = Omit<FormikConfig<Values>, "children"> & {
  children: ReactNode | ((props: _FormikProps<Values>) => ReactNode)
  scrollIntoViewOptions?: ScrollIntoViewOptions
  nonFieldErrorsProps?: Omit<NonFieldErrorsProps, "children">
  fieldRefs?: Array<{
    name: string
    inputRef: RefObject<HTMLInputElement | null>
  }>
}

const BaseForm = <Values extends FormValues>({
  children,
  scrollIntoViewOptions = SCROLL_INTO_VIEW_OPTIONS,
  nonFieldErrorsProps,
  fieldRefs = [],
  ...otherFormikProps
}: BaseFormProps<Values>) => (
  <Formik {...otherFormikProps}>
    {/* @ts-expect-error value is assignable */}
    {(formik: _FormikProps<Values>) => {
      const hasErrors = Boolean(Object.keys(formik.errors).length)
      const hasNonFieldErrors =
        hasErrors && typeof formik.errors.__all__ === "string"

      // If a submission was attempted and refs to the fields were provided.
      if (
        hasErrors &&
        !hasNonFieldErrors &&
        formik.isSubmitting &&
        fieldRefs.length
      ) {
        const errorNames = getKeyPaths(formik.errors)

        const input = fieldRefs.find(({ name }) => errorNames.includes(name))
          ?.inputRef.current

        if (input) input.scrollIntoView(scrollIntoViewOptions)
      }

      return (
        <>
          {hasNonFieldErrors && (
            <NonFieldErrors {...nonFieldErrorsProps}>
              {formik.errors.__all__ as string}
            </NonFieldErrors>
          )}
          <FormikForm>
            {typeof children === "function" ? children(formik) : children}
          </FormikForm>
        </>
      )
    }}
  </Formik>
)

type SubmitFormProps<
  Values extends FormValues,
  QueryArg extends FormValues,
  ResultType,
> = Omit<BaseFormProps<Values>, "onSubmit"> & {
  useMutation: TypedUseMutation<ResultType, QueryArg, any>
} & (Values extends QueryArg
    ? { submitOptions?: SubmitFormOptions<Values, QueryArg, ResultType> }
    : { submitOptions: SubmitFormOptions<Values, QueryArg, ResultType> })

const SubmitForm = <
  Values extends FormValues,
  QueryArg extends FormValues,
  ResultType,
>({
  useMutation,
  submitOptions,
  ...baseFormProps
}: SubmitFormProps<Values, QueryArg, ResultType>): JSX.Element => {
  const [trigger] = useMutation()

  return (
    <BaseForm
      {...baseFormProps}
      onSubmit={submitForm<Values, QueryArg, ResultType>(
        trigger,
        baseFormProps.initialValues,
        submitOptions as SubmitFormOptions<Values, QueryArg, ResultType>,
      )}
    />
  )
}

export type FormProps<
  Values extends FormValues,
  QueryArg extends FormValues,
  ResultType,
> = BaseFormProps<Values> | SubmitFormProps<Values, QueryArg, ResultType>

const Form: {
  <Values extends FormValues>(props: BaseFormProps<Values>): JSX.Element
  <Values extends FormValues, QueryArg extends FormValues, ResultType>(
    props: SubmitFormProps<Values, QueryArg, ResultType>,
  ): JSX.Element
} = <
  Values extends FormValues = FormValues,
  QueryArg extends FormValues = FormValues,
  ResultType = any,
>(
  props: FormProps<Values, QueryArg, ResultType>,
): JSX.Element => {
  return "onSubmit" in props ? <BaseForm {...props} /> : SubmitForm(props)
}

export default Form
