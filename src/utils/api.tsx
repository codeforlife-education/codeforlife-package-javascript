import type {
  FetchBaseQueryError,
  TypedUseMutationResult,
  TypedUseQueryHookResult,
  TypedUseQueryStateResult,
} from "@reduxjs/toolkit/query/react"
import { CircularProgress } from "@mui/material"
import { type ReactNode } from "react"

import { type Optional, type Required } from "./general"
import { type SchemaMap } from "./schema"
import SyncError from "../components/SyncError"
import { getNestedProperty } from "./object"

// -----------------------------------------------------------------------------
// Model Types
// -----------------------------------------------------------------------------

// The fields of a model.
export type Fields = Record<string, unknown>

export interface Tag<Type extends string> {
  type: Type
  id: string
}

export type ModelId = string | number

/**
 * A data model.
 *  Id: The type of Id.
 *  Data: The data fields.
 */
export type Model<Id extends ModelId, MFields extends Fields = Fields> = {
  id: Id
} & Omit<MFields, "id">

export type Schemas<M extends Model<any>> = {
  [K in keyof M]-?: SchemaMap<M[K]>
}

export type Result<
  M extends Model<any>,
  MFields extends keyof Omit<M, "id"> = never,
> = Pick<M, "id" | MFields>

export type Arg<
  M extends Model<any>,
  RequiredFields extends keyof Omit<M, "id">,
  OptionalFields extends keyof Omit<M, "id" | RequiredFields> = never,
> = Required<M, RequiredFields> & Optional<M, OptionalFields>

// -----------------------------------------------------------------------------
// CRUD Types
// https://www.django-rest-framework.org/api-guide/viewsets/#viewset-actions
// -----------------------------------------------------------------------------

// Create

export type CreateResult<
  M extends Model<any>,
  MFields extends keyof Omit<M, "id"> = never,
> = Result<M, MFields>

export type CreateArg<
  M extends Model<any>,
  RequiredFields extends keyof Omit<M, "id">,
  OptionalFields extends keyof Omit<M, "id" | RequiredFields> = never,
> = Arg<M, RequiredFields, OptionalFields>

export type BulkCreateResult<
  M extends Model<any>,
  MFields extends keyof Omit<M, "id"> = never,
  ExtraFields extends Fields = Fields,
> = Array<Result<M, MFields> & ExtraFields>

export type BulkCreateArg<
  M extends Model<any>,
  RequiredFields extends keyof Omit<M, "id">,
  OptionalFields extends keyof Omit<M, "id" | RequiredFields> = never,
  ExtraFields extends Fields = Fields,
> = Array<Arg<M, RequiredFields, OptionalFields> & ExtraFields>

// Read

export type RetrieveResult<
  M extends Model<any>,
  MFields extends keyof Omit<M, "id"> = never,
> = Result<M, MFields>

export type RetrieveArg<M extends Model<any>> = M["id"]

export interface ListResult<
  M extends Model<any>,
  MFields extends keyof Omit<M, "id"> = never,
  ExtraFields extends Fields = Fields,
> {
  count: number
  offset: number
  limit: number
  max_limit: number
  data: Array<Result<M, MFields> & ExtraFields>
}

export type ListArg<Filters extends Fields = Fields> = {
  limit: number
  offset: number
} & Partial<Omit<Filters, "limit" | "offset">>

// Update

export type UpdateResult<
  M extends Model<any>,
  MFields extends keyof Omit<M, "id"> = never,
> = Result<M, MFields>

type UpdateWithBody<
  M extends Model<any>,
  RequiredFields extends keyof Omit<M, "id">,
  OptionalFields extends keyof Omit<M, "id" | RequiredFields>,
> = Pick<M, "id"> & Arg<M, RequiredFields, OptionalFields>

// NOTE: Sometimes update does not require a body. For example, if calling the
// "refresh" action on an invitation object updates the expiry date to be 24
// hours from now. In this case, you only need to pass the ID of the object.
export type UpdateArg<
  M extends Model<any>,
  RequiredFields extends keyof Omit<M, "id"> = never,
  OptionalFields extends keyof Omit<M, "id" | RequiredFields> = never,
> = [RequiredFields] extends [never]
  ? [OptionalFields] extends [never]
    ? M["id"]
    : UpdateWithBody<M, RequiredFields, OptionalFields>
  : UpdateWithBody<M, RequiredFields, OptionalFields>

export type BulkUpdateResult<
  M extends Model<any>,
  MFields extends keyof Omit<M, "id"> = never,
  ExtraFields extends Fields = Fields,
> = Array<Result<M, MFields> & ExtraFields>

export type BulkUpdateArg<
  M extends Model<any>,
  RequiredFields extends keyof Omit<M, "id">,
  OptionalFields extends keyof Omit<M, "id" | RequiredFields> = never,
  ExtraFields extends Fields = Fields,
> = Record<M["id"], Arg<M, RequiredFields, OptionalFields> & ExtraFields>

// Delete

export type DestroyResult = null

export type DestroyArg<M extends Model<any>> = M["id"]

export type BulkDestroyResult = null

export type BulkDestroyArg<M extends Model<any>> = Array<M["id"]>

// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------

export function buildUrl(
  url: string,
  params: {
    search?: Fields
    url?: Fields
  },
): string {
  if (params.url) {
    Object.entries(params.url).forEach(([key, value]) => {
      url = url.replace(`<${key}>`, String(value))
    })
  }

  if (params.search) {
    const searchParams: string[][] = []
    for (const key in params.search) {
      const values = params.search[key]
      if (values === undefined) continue

      if (Array.isArray(values)) {
        for (const value of values) searchParams.push([key, String(value)])
      } else {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        searchParams.push([key, String(values)])
      }
    }

    if (searchParams.length !== 0) {
      url += `?${new URLSearchParams(searchParams).toString()}`
    }
  }

  return url
}

export function isModelId(value: unknown): boolean {
  return typeof value === "number" || typeof value === "string"
}

export function listTag<Type extends string>(type: Type): Tag<Type> {
  return { type, id: "LIST" }
}

export type TagDataOptions = Partial<{
  includeListTag: boolean
  argKeysAreIds: boolean
  id: string
}>

export function tagData<Type extends string, M extends Model<any>>(
  type: Type,
  options?: TagDataOptions,
): (
  result:
    | Result<M, any>
    | Array<Result<M, any>>
    | ListResult<M, any>
    | null
    | undefined,
  error: FetchBaseQueryError | undefined,
  arg:
    | Arg<M, any>
    | Array<Arg<M, any>>
    | Record<M["id"], Arg<M, any>>
    | ListArg<any>
    | Array<M["id"]>
    | string
    | number
    | undefined,
) => Array<Tag<Type>> {
  const {
    includeListTag = false,
    argKeysAreIds = false,
    id = "id",
  } = options || {}

  function tags(
    ids: ModelId[],
    list: boolean = includeListTag,
  ): Array<Tag<Type>> {
    const tags = ids.map(id => ({ type, id: String(id) }))
    if (list) tags.push(listTag(type))
    return tags
  }

  function getModelId(result: Result<M, any>) {
    return getNestedProperty(result, id) as ModelId
  }

  return (result, error, arg) => {
    if (!error) {
      if (arg) {
        // The argument is an ID.
        if (isModelId(arg)) return tags([arg as ModelId])

        // The argument is an array of IDs.
        if (Array.isArray(arg)) {
          if (arg.length && isModelId(arg[0])) {
            return tags(arg as Array<M["id"]>)
          }
        }
        // The argument is an object that contains the id field.
        else if (typeof arg === "object" && argKeysAreIds) {
          return tags(Object.keys(arg as Record<M["id"], any>))
        }
      }

      if (result) {
        // The result is an array of models that contain the id field.
        if (Array.isArray(result)) {
          return tags(result.map(getModelId))
        }

        // The result is a model that contains the id field.
        if (getModelId(result as Result<M, any>) !== undefined) {
          return tags([getModelId(result as Result<M, any>)])
        }

        // The result is a list that contains an array of models that contain
        // the id field.
        return tags((result as ListResult<M, any>).data.map(getModelId), true)
      }
    }

    return tags([])
  }
}

export function modelUrls(list: string, detail: string) {
  if (list === detail) throw Error("List and detail are the same.")

  return { list, detail }
}

export type HandleQueryStateOptions = Partial<{
  loading: ReactNode
  error: ReactNode
}>

export function handleResultState<QueryArg, ResultType>(
  result:
    | TypedUseQueryHookResult<ResultType, QueryArg, any>
    | TypedUseQueryStateResult<ResultType, QueryArg, any>
    | TypedUseMutationResult<ResultType, QueryArg, any>,
  children: (data: NonNullable<ResultType>) => ReactNode,
  options?: HandleQueryStateOptions,
): ReactNode {
  const { data, isLoading, isSuccess } = result
  const error = result.error as string | undefined

  const {
    loading: loadingNode = <CircularProgress />,
    error: errorNode = <SyncError />,
  } = options || {}

  // An error occurred.
  if (error) {
    console.error(error)
    return errorNode
  }

  // Busy calling the API.
  if (isLoading) return loadingNode

  // Called the API and got data.
  if (data) return children(data)

  // Called the API and did not get data.
  if (isSuccess) throw Error("Expected to get data from API but got nothing.")

  // Have yet to call the API.
  return loadingNode
}

export function isSafeHttpMethod(method: string) {
  // https://datatracker.ietf.org/doc/html/rfc9110.html#section-9.2.1
  return ["GET", "HEAD", "OPTIONS", "TRACE"].includes(method.toUpperCase())
}
