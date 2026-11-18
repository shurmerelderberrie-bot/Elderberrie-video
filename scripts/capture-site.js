// Captures phone-sized scrolls of elderberrieblue.com as sharp 30 fps clips
// in public/site/ (home.mp4, product.mp4) for SiteReel and
// LaunchReel. Each frame is a 390x844 iPhone-sized screenshot at 2x, taken
// while scrolling, so scroll-driven animations on the site show up.
//
//   node scripts/capture-site.js      (needs Playwright + Chromium, and ffmpeg)
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const SITE = "https://elderberrieblue.com";
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
// hold frames at the top, scroll to `to` over `scroll` frames, hold at the end
const plan = (hold, to, scroll, end) => [
  ...Array(hold).fill(0),
  ...Array.from({ length: scroll }, (_, i) =>
    Math.round(to * ease((i + 1) / scroll)),
  ),
  ...Array(end).fill(to),
];

const CLIPS = [
  { name: "home", path: "/", ys: plan(30, 4700, 210, 15) },
  {
    name: "product",
    path: "/card/gingham-christmas-tree-card/",
    ys: plan(45, 520, 90, 75),
  },
];

(async () => {
  const browser = await chromium.launch();
  const page = await (
    await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      locale: "en-GB",
    })
  ).newPage();

  for (const clip of CLIPS) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `site-${clip.name}-`));
    await page.goto(SITE + clip.path, { waitUntil: "networkidle" });
    // Scroll through once so lazy images load, then start from the top
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 800) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(80);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);

    let n = 0;
    for (const y of clip.ys) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(25);
      await page.screenshot({
        path: path.join(dir, `${String(n++).padStart(4, "0")}.jpg`),
        type: "jpeg",
        quality: 90,
      });
    }
    execFileSync("ffmpeg", [
      "-v",
      "error",
      "-y",
      "-framerate",
      "30",
      "-i",
      path.join(dir, "%04d.jpg"),
      "-c:v",
      "libx264",
      "-crf",
      "18",
      "-preset",
      "slow",
      "-pix_fmt",
      "yuv420p",
      path.join("public/site", `${clip.name}.mp4`),
    ]);
    fs.rmSync(dir, { recursive: true });
    console.log(`${clip.name}: ${n} frames`);
  }
  await browser.close();
})();
