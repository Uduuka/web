# Uduuka Web App

Uduuka is a hyper-local marketplace web app built with Next.js, designed to connect buyers and sellers within communities. It features listings with image carousels, flash sale timers, price range filtering, and an admin dashboard, all styled with a TailwindCSS design system (Inter font, `uduuka-blue` #3B82F6). The app is a Progressive Web App (PWA) for offline access and mobile usability, hosted on Vercel with a Supabase backend.

## Features

- **Listings**: Browse products with multi-image carousels (`components/Carousel.tsx`), prices, and contact seller popups (`components/Popup.tsx`) at `/listings`.
- **Flash Sales**: View time-sensitive deals with countdown timers (`components/FlashSaleCard.tsx`, `components/CountdownTimer.tsx`) at `/flash-sales`.
- **Price Filtering**: Filter listings by price range using a dual-thumb slider (`components/PriceRangeSlider.tsx`, `components/ListingsFilter.tsx`) at `/listings`.
- **Admin Dashboard**: Manage users and listings with a generic striped table (`components/Table.tsx`) at `/admin`.
- **Responsive Design**: Mobile-friendly UI with TailwindCSS, horizontal scroll for tables, and touch support.
- **Accessibility**: ARIA-compliant components, keyboard navigation, and screen reader support.
- **PWA**: Installable app with offline capabilities.

## Tech Stack

- **Framework**: Next.js 14.2.3
- **Styling**: TailwindCSS (custom `primary`, `accent`, `error`, `background`)
- **State Management**: Zustand 4
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **TypeScript**: Type-safe components
- **Font**: Inter (Google Fonts)
- **Hosting**: Vercel (Free Tier initially)
- **Backend Hosting**: Supabase (Free Tier initially)

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git
- Vercel account
- Supabase account and project
- GitHub account for repository

## Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/uduuka/uduuka-web.git
   cd uduuka-web
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment**:

   - Create `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     NEXT_PUBLIC_API_URL=/api
     ```
     - Get `SUPABASE_URL` and `SUPABASE_ANON_KEY` from your Supabase project’s API settings.
   - Ensure `app/globals.css` includes:

     ```css
     @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap");

     @tailwind base;
     @tailwind components;
     @tailwind utilities;

     :root {
       --primary: #3b82f6;
       --accent: #6b7280;
       --background: #f3f4f6;
       --error: #ef4444;
     }
     ```

4. **Setup Supabase**:

   - Create a Supabase project at [supabase.com](https://supabase.com).
   - Create tables:
     - `users`
     - `listings`
     - `etc`.
   - Enable Row Level Security (RLS) and create policies (e.g., public read for `listings`).
   - Use Supabase CLI or dashboard to initialize:
     ```bash
     npx supabase init
     npx supabase login
     npx supabase link --project-ref your-supabase-project
     ```

5. **Run Locally**:
   ```bash
   npm run dev
   ```
   - Open `http://localhost:3000`.
   - Test routes: `/listings`, `/flash-sales`, `etc`.

## Key Components

- **ListingCard**: Displays listings with carousel, price, and popup trigger.
- **FlashSaleCard**: Extends ListingCard with countdown timer and badge.
- **PriceRangeSlider**: Dual-thumb slider for price filtering.
- **Carousel**: Slides through listing images.
- **Table**: Generic striped table for admin data.
- **Popup**: Contact seller modal.
- **Dropdown**: Reusable dropdown menu.
- **ScrollArea**: Scrollable container with custom scrollbar.
- **Select**: Custom select input.

## Testing

1. **Local Testing**:

   - Run `npm run dev` and test:
     - `/listings`: Listings with carousel, price filter (mock or Supabase data).
     - `/flash-sales`: Flash sale cards with timers.
     - `/admin`: User and listing tables.
   - Accessibility: Test with NVDA/VoiceOver (ARIA, keyboard navigation).
   - Responsive: Check mobile layout (image scaling, scroll, touch events).
   - TypeScript: `npx tsc --noEmit`.

2. **Supabase Testing**:

   - Verify API routes (`/api/listings`, `/api/flash-sales`, `/api/admin`) fetch from Supabase.
   - Test RLS policies (e.g., authenticated access for `/admin`).

3. **Build**:
   ```bash
   npm run build
   npm run start
   ```

## Deployment to Vercel

1. **Push to GitHub**:

   - Ensure repository exists: `https://github.com/uduuka/uduuka-web`.
   - Initialize if needed:
     ```bash
     git init
     git remote add origin https://github.com/uduuka/uduuka-web.git
     ```
   - Push:
     ```bash
     git add .
     git commit -m "Initial commit of Uduuka web app"
     git branch -M main
     git push -u origin main
     ```

2. **Setup Vercel**:

   - Login to [vercel.com](https://vercel.com).
   - Import GitHub repository (`uduuka/uduuka-web`).
   - Configure:
     - Framework: Next.js.
     - Environment Variables:
       ```
       NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
       NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
       ```
     - Deploy.
   - Note domain (e.g., `https://uduuka-web.vercel.app`).

3. **Test**:
   - Open Vercel domain and verify all routes (`/listings`, `/flash-sales`, `/admin`).
   - Check PWA installation (Chrome/Edge dev tools).
   - Monitor Vercel logs for errors.

## Supabase Backend

1. **Configure Tables**:

   - `users`: Store user data (ID, email, joined).
   - `listings`: Store listing data (ID, title, price, currency, images).
   - `flash_sales`: Store flash sale data (ID, listing_id, end_time).

2. **RLS Policies**:

   - Example for `listings`:
     ```sql
     ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
     CREATE POLICY "Public read" ON listings FOR SELECT USING (true);
     ```

3. **API Integration**:

   - Update `lib/api.ts` to use Supabase client:

     ```typescript
     import { createClient } from "@supabase/supabase-js";

     const supabase = createClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     );

     export async function fetchListings() {
       const { data, error } = await supabase.from("listings").select("*");
       if (error) throw new Error(error.message);
       return data;
     }
     ```

## Contribution

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m "Add your feature"`.
4. Push: `git push origin feature/your-feature`.
5. Open a PR to `main`.

- **Team**:
  - Egessa David Wafula (Lead)
  - Wangira Barasa Simeon (Dev 2)
  - Samanya (Dev 1, React Native)
- **Guidelines**:
  - Use TypeScript.
  - Follow TailwindCSS design system.
  - Ensure ARIA compliance.
  - Test with `npm run build` and `npx tsc --noEmit`.

## Roadmap

- **Week 2 (May 5–11, 2025)**: Flash sales, price filter, carousel, admin table.
- **Week 3**:
  - Supabase auth for `SigninForm.tsx` (~5h).
  - Mapbox for `Search.tsx` (~5h).
  - Canva flyers (May 12).
- **Future**:
  - Sticky navbar (`d1e91f00-1f80-45de-b13c-285f339735f9`).
  - Listing details page (`/listings/:id`).
  - Full Supabase API integration.

## Budget

- **Development**: $3,000 (50h/week x 6 weeks x $10/h).
- **Hosting**: $120 Vercel (Free Tier initially, then ~$20/month x 6 months).
- **Backend**: $150 Supabase (Free Tier initially, then ~$25/month x 6 months).
- **Advertisments**: $600 Bilboards, waerables, social media ($100/month x 6 months).
- **Maintainace**: $2,400 (2 devs x $200/dev/month x 6 months)
- **Total**: Within $6,270 (for the first six months).

## Contact

- **Email**: services@dolinesystems.com
- **GitHub Issues**: [uduuka/web](https://github.com/Uduuka/web/issues)
- **Lead**: Egessa David Wafula

---

Built by the Uduuka team, May 2025.
