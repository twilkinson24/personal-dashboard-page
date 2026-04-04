/**
 * Cloudflare Pages Function — proxies Finnhub stock quotes.
 * Keeps FINNHUB_API_KEY server-side and handles CORS for the frontend.
 *
 * URL: /api/stocks?symbols=SPY,SCHG,SCHF,SCHE
 */
export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const symbolsParam = url.searchParams.get('symbols') || ''
  const symbols = symbolsParam
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  const apiKey = env.FINNHUB_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'FINNHUB_API_KEY is not configured.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  if (symbols.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Provide at least one symbol via ?symbols=' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const finnhubUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
        const res = await fetch(finnhubUrl)
        if (!res.ok) throw new Error(`Finnhub error for ${symbol}: ${res.status}`)
        const data = await res.json()
        return { symbol, ...data }
      }),
    )

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}
