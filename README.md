
# Run with Jesus 2025 — Blob-only (no KV)

- Next.js App Router
- Vercel Blob for images **and** metadata (captions + write-ups stored as JSON/TXT)
- Bilingual (`/en`, `/ko`)
- Three events with upload/delete, caption sort, write-up per event

## Env
```
VERCEL_BLOB_READ_WRITE_TOKEN=your_token
```

## Dev
```
npm install
npm run dev
# http://localhost:3000/en
```
