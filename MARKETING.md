# Elderberrie Blue – marketing notes

## Accounts

- Website: https://elderberrieblue.com (WooCommerce, UK buyers only; built and
  looked after by Isle of Wight Advertising via the Client Hub)
- Etsy: https://elderberrieblue.etsy.com (overseas buyers; Etsy handles EU VAT)
- Instagram: @elderberrieblueofficial
- Facebook: Elderberrie Blue
- Pinterest: beccashurmer, board "ElderberrieBlue" (Metricool board ID 92605404777228095)
- Scheduling: Metricool brand "Elderberrie Blue" (timezone Europe/London)
- Assets: Google Drive folder "Elderberrie Blue"

## Brand

- Blue `#2B54AF`, cream `#F6EFE3`, paper `#FBF8F1`
- Fonts: Amatic SC (headings), Lora (body/italic)
- Tagline: "pretty little bits for every occasion"
- Selling point: printable, instant download – no post, no waiting
- Sign-off: Joe & Becca, kitchen table on the Isle of Wight
- **How the cards are made: Joe and Becca design every card themselves in Canva. They are NOT painted or hand-drawn.** Say "designed by us" or "our own designs". Never write painted, hand-painted, hand-drawn or watercolour paintings. Describing a design's look ("soft blue stripes") is fine.

## Pricing

£2.25 a card. 5-card bundles: Pun £4.99, New Baby and Birthday £5.83.

## Current schedule

Metricool Free plan: 20 published posts a month, counted per network (a
Facebook + Instagram post uses 2, a pin uses 1). Drafts don't count.

- November: every 2 days on Facebook, Instagram and Pinterest
- December: 8 Facebook + Instagram posts and 4 pins (= 20); the other
  12 December posts are kept as drafts in Metricool
- Captions and pins link to the website: product pages for cards that can
  be bought, the category page for "Coming soon" cards

Post media lives in `social/` and is served to Metricool from the public raw
GitHub URLs.

## Website follow-ups

- Claim the website on Pinterest (see the Pinterest guide in Drive)
- Update Instagram bio link and Facebook page
- When a "Coming soon" card becomes buyable, point its pins at its page
- Remove the "hand-painted watercolour" claims from the site: page titles, homepage, shop, about and 50+ product descriptions. Full list with replacement wording: `social/website-wording-fixes.csv`. After that, re-capture `public/site/*.mp4` (`node scripts/capture-site.js`) and re-render the website reels, which show the old homepage text.

## Templates (npm run dev)

- `Reel` / `Feed` / `Square` – multi-card showcase (CardShowcase)
- `CardPost` – 4:5 still of one card for feed posts
- `ProductReel` – 9:16 Reel for one card: listing photo, mockup video, end card
- `Card-<slug>` – 9:16 Reel from a card's website photos: in-hand photo, front
  flipping to the back, price and web address. Cards are listed in
  `src/Social/cards.ts`, photos in `public/cards/<slug>/`
- `LaunchReel` – 30s 9:16 website launch announcement: cards fly in around
  "We've got a website!", homepage on a phone, grid of cards, product page
  with the price, the four steps, web address and "link in our bio"
- `SiteReel` – shorter 22s website Reel: phone screen captures of the
  homepage and a product page (`public/site/`)

`npm run render:reels` renders all of the above into `social/reels/`.
`node scripts/capture-site.js` re-records the phone clips in `public/site/`
when the website changes (then re-render).
