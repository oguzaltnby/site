// ohmyfetch.d.ts
declare module 'ohmyfetch' {
  interface FetchOptions {
    baseURL?: string
    method?: string
    headers?: Record<string, string>
    body?: any
    params?: any
  }

  type FetchFunction = <T = any>(url: string, options?: FetchOptions) => Promise<T>

  const $fetch: FetchFunction
  export default $fetch
}
