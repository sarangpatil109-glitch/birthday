# HeartNote — Premium Birthday Websites

Create a cinematic birthday website for ₹99. Upload photos, a personal message, a video, and get a shareable link in minutes.

**Live URL format:** `https://heartnote.in/w/ABCD1234`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + Inline styles |
| Animations | Framer Motion |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| Payments | Cashfree Payments |
| Deployment | Vercel |

---

## User Flow

```
/ Landing Page
  ↓
/create  ← Fill form (names, message, photos, video, song)
  ↓
POST /api/websites/draft  ← Creates DB record, returns ID
POST /api/websites/create ← Uploads files to Supabase Storage, updates DB
  ↓
/preview/[id]  ← Full cinematic preview + "Publish for ₹99" banner
  ↓
POST /api/create-order  ← Creates Cashfree order
Cashfree Checkout  ← User pays ₹99
  ↓
GET /api/verify-payment  ← Verifies payment, publishes website
  ↓
/success/[slug]  ← Share link, QR code, WhatsApp button
  ↓
/w/[slug]  ← Live birthday website (public URL)
```

---

## Local Development

### Prerequisites
- Node.js 18+
- A Supabase project
- A Cashfree account (sandbox for testing)

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cashfree
CASHFREE_APP_ID=your-app-id
CASHFREE_SECRET_KEY=your-secret-key
CASHFREE_WEBHOOK_SECRET=your-webhook-secret
CASHFREE_ENV=sandbox
NEXT_PUBLIC_CASHFREE_ENV=sandbox

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Supabase Setup

**A. Run the schema:**
Go to Supabase Dashboard → SQL Editor → paste contents of `supabase/schema.sql` → Run

**B. Create Storage buckets:**
The schema SQL creates them automatically. If it fails, create manually in Dashboard → Storage:
- `photos` — Public, 5MB limit
- `videos` — Public, 100MB limit  
- `songs`  — Public, 10MB limit

**C. Get your keys:**
- Project URL: Dashboard → Settings → API → Project URL
- Anon Key: Dashboard → Settings → API → `anon public`
- Service Role Key: Dashboard → Settings → API → `service_role secret`

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Cashfree Setup

### Sandbox (Testing)

1. Sign up at [cashfree.com](https://cashfree.com)
2. Dashboard → Developers → API Keys → copy **Test** App ID + Secret Key
3. Set `CASHFREE_ENV=sandbox` and `NEXT_PUBLIC_CASHFREE_ENV=sandbox`

### Production

1. Complete KYC on Cashfree dashboard
2. Dashboard → Developers → API Keys → copy **Production** App ID + Secret Key
3. Set `CASHFREE_ENV=production` and `NEXT_PUBLIC_CASHFREE_ENV=production`
4. Set webhook URL: `https://heartnote.in/api/cashfree-webhook`
5. Copy webhook secret to `CASHFREE_WEBHOOK_SECRET`

### Testing Payments (Sandbox)

Use Cashfree's test card details:
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: `111111`

---

## Deployment on Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Or connect GitHub repo:**
1. Push to GitHub
2. Import in [vercel.com/new](https://vercel.com/new)
3. Add all environment variables in Vercel Dashboard → Settings → Environment Variables
4. Deploy

### Important Vercel Settings
- Framework: Next.js (auto-detected)
- Build Command: `npm run build` (default)
- Output: `.next` (default)
- Node.js version: 20.x (recommended)

### Domain Setup
1. Vercel Dashboard → your project → Settings → Domains
2. Add `heartnote.in` and follow DNS instructions
3. Update `NEXT_PUBLIC_BASE_URL=https://heartnote.in` in Vercel env vars

---

## Project Structure

```
heartnote/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── create/page.tsx             # Create form page
│   ├── preview/[id]/
│   │   ├── page.tsx                # Preview page
│   │   └── PreviewClient.tsx       # Client: loads data, Cashfree SDK
│   ├── success/[slug]/
│   │   ├── page.tsx                # Success page
│   │   └── SuccessClient.tsx       # Client: copy link, QR, WhatsApp
│   ├── w/[slug]/page.tsx           # Live birthday website
│   ├── not-found.tsx               # 404 page
│   ├── layout.tsx                  # Root layout + fonts
│   ├── globals.css                 # CSS variables + global styles
│   ├── sitemap.ts                  # Sitemap
│   └── robots.ts                   # Robots.txt
│   └── api/
│       ├── websites/
│       │   ├── draft/route.ts      # POST: Create draft record
│       │   ├── create/route.ts     # POST: Upload files + update record
│       │   └── [id]/route.ts       # GET: Fetch website by ID
│       ├── create-order/route.ts   # POST: Create Cashfree payment order
│       ├── verify-payment/route.ts # GET: Verify payment + publish
│       ├── cashfree-webhook/route.ts # POST: Cashfree webhook handler
│       └── qr/route.ts             # GET: Generate QR code PNG
├── components/
│   ├── landing/                    # Hero, Features, HowItWorks, PricingFAQ, Footer
│   ├── form/CreateForm.tsx         # Multi-section form with drag/drop
│   └── template/
│       ├── BirthdayTemplate.tsx    # Full cinematic birthday website
│       └── template.css            # Template-specific styles
├── lib/
│   ├── supabase/client.ts          # Lazy Supabase client (server + anon)
│   ├── cashfree/index.ts           # Cashfree API helpers
│   └── upload.ts                   # Client-side upload helpers
├── types/index.ts                  # TypeScript interfaces
├── utils/index.ts                  # Slug generator, song options, etc.
├── supabase/schema.sql             # Full DB schema with RLS + storage
├── .env.example                    # Environment variables template
└── next.config.ts                  # Next.js config (image domains, body size)
```

---

## Key Design Decisions

- **No authentication**: Everything is anonymous. Draft websites are created by ID only.
- **Lazy Supabase client**: Prevents build-time crashes when env vars aren't set.
- **Two-step upload**: Draft record created first (to get ID), then files uploaded with that ID.
- **Idempotent payment verification**: Checks if already published before processing.
- **Webhook + redirect verification**: Double redundancy for payment confirmation.
- **Service Role Key for all server routes**: RLS allows only service role to write.
