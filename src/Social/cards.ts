// Cards with their own CardReel. Each folder in public/cards/ holds the
// three photos from the card's page on elderberrieblue.com (photo, front,
// back). To add one, download its photos into public/cards/<slug>/ and add
// a line here; it appears in the Studio under Card-Reels.
export const CARD_PRICE = "£2.25";
export const SITE_URL = "elderberrieblue.com";

export const reelCards: { slug: string; title: string }[] = [
  {
    slug: "gingham-christmas-tree-card",
    title: "Merry Christmas & a happy new year",
  },
  {
    slug: "mistletoe-geese-christmas-card",
    title: "Meet me under the mistletoe",
  },
  {
    slug: "golden-retriever-christmas-card",
    title: "A Christmas card from the dog",
  },
  { slug: "christmas-tree-card-jolly-and-bright", title: "Jolly and bright" },
  {
    slug: "first-birthday-card-hip-hip-hooray",
    title: "One today, hip hip hooray",
  },
  { slug: "first-birthday-card-boy", title: "Today you are one" },
  { slug: "third-birthday-card-mouse", title: "Today you are three" },
  {
    slug: "goose-birthday-card-time-to-celebrate",
    title: "It's your birthday",
  },
  { slug: "big-squeeze-orange-birthday-card", title: "A big birthday squeeze" },
  { slug: "new-baby-boy-card", title: "Welcome, little one" },
  {
    slug: "grandparents-pregnancy-announcement-card",
    title: "Upgraded to grandparents",
  },
  {
    slug: "still-falling-for-you-anniversary-card",
    title: "Still falling for you",
  },
];
