# Website SEO audit, 28 November 2026

Crawled all 85 pages and products in the sitemap, ran Lighthouse on the homepage, a category and a product page, and checked the social profiles.

## Scores

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Homepage | 87 | 100 | 96 | 100 |
| Birthday category | 99 | 100 | 100 | 100 |
| Golden Retriever Christmas card | 98 | 100 | 100 | 100 |

The technical base is good. The gaps are measurement, content, wording and Pinterest/Google setup.

## Key findings

- No analytics or Search Console tag on any page.
- 70 meta descriptions and 16 titles say the cards are painted or watercolour (see title-and-description-fixes.csv); Our Story, How to Print, the site tagline and the Organization schema too.
- The Terms page shows a leftover "[CHECK VAT WORDING WITH JOE]" note.
- No blog or articles; informational searches ("what to write in a ... card") are untapped.
- 254 thin product tag pages are in the sitemap with generic titles and no descriptions.
- Site language is en-US; 22 pages (shop, categories) have no share image; front/back product photos have empty alt text.
- Instagram bio links to Etsy, not the website. Pinterest account is personal ("beccashurmer").
- Product RSS feed has no images and only 10 items.

## Fix list (also in the Customer Finder, Website traffic tab)

1. **Measure visitors with Google Site Kit** (high, Reuben + you). Nothing on the site measures visitors at the moment, so there's no way to see which searches, posts or pins bring people in. Site Kit connects Google Search Console and Google Analytics in one free plugin.
2. **Fix 82 page titles and Google descriptions that say "painted" or "watercolour"** (high, Reuben). These are the words people see in Google results. 70 descriptions and 16 titles still say the cards are painted or hand-painted watercolour, which isn't true and could count as misleading.
3. **Fix Our Story, How to Print, the site tagline and business details** (high, Reuben). A few more places still say we paint the cards, including the site tagline that shows in feeds and the business details Google reads.
4. **Remove the leftover note on the Terms page** (high, Reuben). The live Terms page shows "[CHECK VAT WORDING WITH JOE]" in the Prices section. Customers can see it.
5. **Point your Instagram bio link at the website** (high, You). Your Instagram bio links to Etsy, so every "link in our bio" post sends people to Etsy instead of the website. The bio also has a typo.
6. **Turn Pinterest into a business account and claim the website** (high, You + Reuben). Pinterest is where people search for printables, and pins keep sending visitors for months. Claiming the site unlocks bulk pin uploads, auto-publishing and your logo on every pin from the site. Your Pinterest is currently the personal-looking "beccashurmer".
7. **Install Pinterest for WooCommerce (every card becomes a shoppable pin)** (high, Reuben). The free official plugin syncs every card to Pinterest as a product pin with its price, adds rich pins and Save buttons, and keeps it all up to date by itself.
8. **Get the cards into Google Shopping for free** (high, Reuben + you). Free listings put a picture and the price of your cards in Google Shopping, Images and Search when someone searches "printable birthday card for mum". It costs nothing.
9. **Add a "Card ideas" blog for the articles** (high, Reuben). Guides like "what to write in a Christmas card" bring in people searching for help, and each one links to the matching cards. The site has no blog yet. The first four articles are ready below.
10. **Stop Google indexing the 254 thin tag pages** (medium, Reuben). There are 254 tag pages (like /card-tag/first-fathers-day-card/) with no description, a generic heading and one or two cards each. Hundreds of near-empty pages make the whole site look thinner to Google.
11. **Set the site language to English (UK)** (medium, Reuben). The site tells Google it's in US English (en-US) although it sells only to the UK. A small but easy signal for UK searches.
12. **Add share pictures to the category and shop pages** (medium, Reuben). 22 pages, including the shop and every category, have no share picture, so when someone shares them on Facebook, WhatsApp or Pinterest there's no image.
13. **Describe every card photo for Google Images** (medium, Reuben). Each card has three photos, but only the first has a description (alt text). The front and back photos are blank, so Google Images and Pinterest can't tell what they show.
14. **Collect reviews so star ratings show in Google** (medium, Reuben + you). Star ratings make a result stand out in Google and build trust. They need real reviews from buyers.
15. **Add the site to Bing (also covers DuckDuckGo and ChatGPT search)** (medium, You). Bing's index feeds Bing, DuckDuckGo, Copilot and ChatGPT search. Once Search Console is set up it takes two minutes to copy across.
16. **Add photos to the product feed for Pinterest auto-publish** (low, Reuben). Pinterest can turn every new card into a pin automatically from the site's feed, but the feed has no photos and only lists 10 items.
17. **Tell Google the refund policy in the product details** (low, Reuben). Google's product results look for a returns policy. For downloads it's simple, and adding it removes a warning in Google's checks.
18. **Add an email sign-up for reminders and new designs** (low, Reuben). Most visitors leave and forget. A short sign-up ("remind me before Mother's Day") turns one visit into repeat visits, with their permission.
19. **Add a short llms.txt so AI assistants describe the shop correctly** (low, Reuben). A tiny text file that tells AI assistants such as ChatGPT what the shop is. Low effort, small benefit.
20. **Add a "Shop now" button to your Facebook Page** (low, You). Your Page lists both Etsy and the website. A "Shop now" button puts the website one tap away for anyone who visits the Page.

## Articles

Ready: see seo/articles/. Planned topics and Pinterest pins live in the Customer Finder database; the "Elderberrie Blue traffic builder" scheduled task (Mon and Thu) writes the next articles, adds pins, re-checks the fixes and finds link opportunities.
