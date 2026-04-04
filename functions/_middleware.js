/**
 * Cloudflare Pages middleware — HTTP Basic Auth password protection.
 * Runs on every request before any page or function handler.
 *
 * Required environment variable: DASHBOARD_PASSWORD
 * Username: anything (only the password is validated)
 */
export async function onRequest(context) {
  const { request, env, next } = context
  const password = env.DASHBOARD_PASSWORD

  // If no password is configured, skip auth entirely (useful during initial setup)
  if (!password) {
    return next()
  }

  const authHeader = request.headers.get('Authorization')

  if (authHeader && authHeader.startsWith('Basic ')) {
    const encoded = authHeader.slice('Basic '.length)
    const decoded = atob(encoded)
    // decoded is "username:password" — we only care about the password
    const colonIndex = decoded.indexOf(':')
    const suppliedPassword = colonIndex !== -1 ? decoded.slice(colonIndex + 1) : decoded

    if (suppliedPassword === password) {
      return next()
    }
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Dashboard"',
      'Content-Type': 'text/plain',
    },
  })
}
