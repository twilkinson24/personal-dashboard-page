# Homepage Dashboard

A personal dashboard built with React + Vite, Tailwind CSS, and Lucide React icons.  
Deployed on Cloudflare Pages with a Pages Function to proxy Finnhub stock data.

## Features

| Widget | Data Source | Auth Required |
|---|---|---|
| USD → MXN exchange rate | [Frankfurter API](https://frankfurter.dev/) | No |
| Bitcoin price (BTC/USD) | [CoinGecko](https://www.coingecko.com/en/api) | No |
| Stocks — SPY, SCHG, SCHF, SCHE | [Finnhub](https://finnhub.io/) via Pages Function | **Yes** |
| Weather — Guadalajara, Chicago, Detroit | [Open-Meteo](https://open-meteo.com/) | No |
| World clocks — Mexico City, Denver, Chicago, New York, Los Angeles | `Intl.DateTimeFormat` | — |

## Local Development

```bash
npm install
npm run dev
```

> **Note:** The stocks widget calls `/api/stocks`, which is served by the Cloudflare Pages
> Function in `functions/api/stocks.js`. During local dev you can either:
>
> 1. Use [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for a full local Pages
>    emulation:
>    ```bash
>    npx wrangler pages dev dist --binding FINNHUB_API_KEY=your_key
>    ```
>    (run `npm run build` first)
>
> 2. Or temporarily hard-code a dev-only key in `src/hooks/useStocks.js` (never commit this).

## Deploying to Cloudflare Pages

1. Push this repo to GitHub/GitLab.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/) go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select your repository and set:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Under **Settings → Environment Variables**, add:
   | Variable | Value |
   |---|---|
   | `FINNHUB_API_KEY` | Your key from [finnhub.io](https://finnhub.io/) |
   | `DASHBOARD_PASSWORD` | A password of your choice (protects the site with HTTP Basic Auth) |

   > If `DASHBOARD_PASSWORD` is not set, the site will be publicly accessible.
5. Deploy. The Pages Function in `functions/api/stocks.js` is picked up automatically.

## Project Structure

```
├── functions/
│   ├── _middleware.js           # Basic Auth password protection
│   └── api/
│       └── stocks.js            # Cloudflare Pages Function (Finnhub proxy)
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── hooks/
│   │   ├── useExchangeRate.js
│   │   ├── useCrypto.js
│   │   ├── useStocks.js
│   │   └── useWeather.js
│   └── components/
│       ├── CardShell.jsx      # Shared card wrapper + helpers
│       ├── ExchangeRateCard.jsx
│       ├── CryptoCard.jsx
│       ├── StocksCard.jsx
│       ├── WeatherCard.jsx
│       └── WorldClocksCard.jsx
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```
