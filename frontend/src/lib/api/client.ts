const DEFAULT_API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://devhoc.dawitthegenius.workers.dev/api'
).replace(/\/$/, '')

const ABSOLUTE_URL_REGEX = /^https?:\/\//i

type ApiFetchOptions = RequestInit & {
  token?: string | null
}

function buildUrl(path: string) {
  if (ABSOLUTE_URL_REGEX.test(path)) {
    return path
  }
  const base = DEFAULT_API_BASE
  if (!path) {
    return base || '/'
  }
  if (path.startsWith('/')) {
    return `${base}${path}`
  }
  return `${base}/${path}`
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options
  const resolvedUrl = buildUrl(path)

  const finalHeaders = new Headers(headers ?? {})
  if (token) {
    finalHeaders.set('Authorization', `Bearer ${token}`)
  }
  const isFormData = rest.body instanceof FormData
  if (rest.body && !isFormData && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(resolvedUrl, {
    ...rest,
    headers: finalHeaders,
  })

  if (!response.ok) {
    let message: string | undefined
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      try {
        const data = await response.json()
        message =
          typeof data?.error === 'string' ? data.error : JSON.stringify(data)
      } catch {
        // ignore JSON parsing errors
      }
    }
    if (!message) {
      try {
        message = await response.text()
      } catch {
        message = undefined
      }
    }
    const error = new Error(
      message || `${response.status} ${response.statusText}`,
    )
    ;(error as any).status = response.status
    throw error
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return (await response.json()) as T
  }

  return (await response.text()) as T
}

export type { ApiFetchOptions }
