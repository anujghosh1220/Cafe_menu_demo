# Maison Élise â€” Digital Menu

## Run locally
npm install
npm run dev

## Deploy to Vercel
Push to GitHub and import in Vercel. Set NEXT_PUBLIC_SITE_URL to your production URL.

## QR code
The QR code encodes NEXT_PUBLIC_SITE_URL (or window.location.origin in browser). Until deployed to a public URL, the QR code cannot point to a working public menu. Set NEXT_PUBLIC_SITE_URL in Vercel env and redeploy.
EOF