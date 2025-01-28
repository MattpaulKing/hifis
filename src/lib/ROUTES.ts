/* eslint-disable */
/**
 * This file was generated by 'vite-plugin-kit-routes'
 *
 *      >> DO NOT EDIT THIS FILE MANUALLY <<
 */

/**
 * PAGES
 */
const PAGES = {
  "/": `/`,
  "/[orgLabel]": (params: { orgLabel: (string | number) }) => {
    return `/${params.orgLabel}`
  },
  "/[orgLabel]/clients/create": (params: { orgLabel: (string | number) }) => {
    return `/${params.orgLabel}/clients/create`
  },
  "/[orgLabel]/clients/services/create": (params: { orgLabel: (string | number) }) => {
    return `/${params.orgLabel}/clients/services/create`
  },
  "/[orgLabel]/services": (params: { orgLabel: (string | number) }) => {
    return `/${params.orgLabel}/services`
  },
  "/[orgLabel]/services/categories/create": (params: { orgLabel: (string | number) }) => {
    return `/${params.orgLabel}/services/categories/create`
  },
  "/[orgLabel]/services/create": (params: { orgLabel: (string | number) }) => {
    return `/${params.orgLabel}/services/create`
  },
  "/[orgLabel]/users/create": (params: { orgLabel: (string | number) }) => {
    return `/${params.orgLabel}/users/create`
  },
  "/test": `/test`
}

/**
 * SERVERS
 */
const SERVERS = {
  "GET /api/v1/clients": `/api/v1/clients`,
  "GET /api/v1/clients/services": `/api/v1/clients/services`,
  "GET /api/v1/organizations": `/api/v1/organizations`,
  "GET /api/v1/search": (params?: { value?: (string) }) => {
    return `/api/v1/search${appendSp({ value: params?.value })}`
  },
  "GET /api/v1/services": `/api/v1/services`,
  "GET /api/v1/services/categories": `/api/v1/services/categories`,
  "GET /api/v1/user/grid": `/api/v1/user/grid`,
  "GET /auth/callback": `/auth/callback`
}

/**
 * ACTIONS
 */
const ACTIONS = {
  "default /[orgLabel]/clients/create": (params: { orgLabel: (string | number) }) => {
    return `/${params.orgLabel}/clients/create`
  },
  "create /[orgLabel]/services/categories/create": (params: { orgLabel: (string | number) }) => {
    return `/${params.orgLabel}/services/categories/create?/create`
  },
  "create /[orgLabel]/services/create": (params: { orgLabel: (string | number) }) => {
    return `/${params.orgLabel}/services/create?/create`
  },
  "default /[orgLabel]/users/create": (params: { orgLabel: (string | number) }) => {
    return `/${params.orgLabel}/users/create`
  }
}

/**
 * LINKS
 */
const LINKS = {
  
}

type ParamValue = string | number | undefined

/**
 * Append search params to a string
 */
export const appendSp = (sp?: Record<string, ParamValue | ParamValue[]>, prefix: '?' | '&' = '?') => {
  if (sp === undefined) return ''

  const params = new URLSearchParams()
  const append = (n: string, v: ParamValue) => {
    if (v !== undefined) {
      params.append(n, String(v))
    }
  }

  for (const [name, val] of Object.entries(sp)) {
    if (Array.isArray(val)) {
      for (const v of val) {
        append(name, v)
      }
    } else {
      append(name, val)
    }
  }

  const formatted = params.toString()
  if (formatted) {
    return `${prefix}${formatted}`
  }
  return ''
}

/**
 * get the current search params
 * 
 * Could be use like this:
 * ```
 * route("/cities", { page: 2 }, { ...currentSP() })
 * ```
 */ 
export const currentSp = () => {
  const params = new URLSearchParams(window.location.search)
  const record: Record<string, string> = {}
  for (const [key, value] of params.entries()) {
    record[key] = value
  }
  return record
}

// route function helpers
type NonFunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]
type FunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
type FunctionParams<T> = T extends (...args: infer P) => any ? P : never

const AllObjs = { ...PAGES, ...ACTIONS, ...SERVERS, ...LINKS }
type AllTypes = typeof AllObjs

export type Routes = keyof AllTypes extends `${string}/${infer Route}` ? `/${Route}` : keyof AllTypes
export const routes = [
	...new Set(Object.keys(AllObjs).map((route) => /^\/.*|[^ ]?\/.*$/.exec(route)?.[0] ?? route)),
] as Routes[]

/**
 * To be used like this: 
 * ```ts
 * import { route } from './ROUTES'
 * 
 * route('site_id', { id: 1 })
 * ```
 */
export function route<T extends FunctionKeys<AllTypes>>(key: T, ...params: FunctionParams<AllTypes[T]>): string
export function route<T extends NonFunctionKeys<AllTypes>>(key: T): string
export function route<T extends keyof AllTypes>(key: T, ...params: any[]): string {
  if (AllObjs[key] as any instanceof Function) {
    const element = (AllObjs as any)[key] as (...args: any[]) => string
    return element(...params)
  } else {
    return AllObjs[key] as string
  }
}

/**
* Add this type as a generic of the vite plugin `kitRoutes<KIT_ROUTES>`.
*
* Full example:
* ```ts
* import type { KIT_ROUTES } from '$_lib/ROUTES'
* import { kitRoutes } from 'vite-plugin-kit-routes'
*
* kitRoutes<KIT_ROUTES>({
*  PAGES: {
*    // here, key of object will be typed!
*  }
* })
* ```
*/
export type KIT_ROUTES = {
  PAGES: { '/': never, '/[orgLabel]': 'orgLabel', '/[orgLabel]/clients/create': 'orgLabel', '/[orgLabel]/clients/services/create': 'orgLabel', '/[orgLabel]/services': 'orgLabel', '/[orgLabel]/services/categories/create': 'orgLabel', '/[orgLabel]/services/create': 'orgLabel', '/[orgLabel]/users/create': 'orgLabel', '/test': never }
  SERVERS: { 'GET /api/v1/clients': never, 'GET /api/v1/clients/services': never, 'GET /api/v1/organizations': never, 'GET /api/v1/search': never, 'GET /api/v1/services': never, 'GET /api/v1/services/categories': never, 'GET /api/v1/user/grid': never, 'GET /auth/callback': never }
  ACTIONS: { 'default /[orgLabel]/clients/create': 'orgLabel', 'create /[orgLabel]/services/categories/create': 'orgLabel', 'create /[orgLabel]/services/create': 'orgLabel', 'default /[orgLabel]/users/create': 'orgLabel' }
  LINKS: Record<string, never>
  Params: { orgLabel: never, value: never }
}
