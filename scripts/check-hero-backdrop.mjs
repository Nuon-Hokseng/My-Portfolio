import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { chromium, devices } from "@playwright/test";
import sharp from "sharp";

const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:3000";
const out = process.env.PORTFOLIO_REPORT_DIR || "design/verification";
await mkdir(out, { recursive: true });
const asset = await readFile("public/hero/sculpted-ribbon.webp");
const metadata = await sharp(asset).metadata();
assert.ok(metadata.hasAlpha && asset.length < 160000);
const report = {
  url,
  asset: {
    bytes: asset.length,
    width: metadata.width,
    height: metadata.height,
    alpha: metadata.hasAlpha,
    sha256: createHash("sha256").update(asset).digest("hex"),
  },
  views: [],
  checks: [],
  errors: [],
};
const browser = await chromium.launch({ channel: "chrome", headless: true });
const phase = (image) =>
  image.evaluate(async (el) => {
    const animation = el.getAnimations()[0];
    await animation?.ready;
    return animation?.currentTime;
  });
try {
  for (const scheme of ["light", "dark"])
    for (const width of [320, 390, 1440]) {
      const context = await browser.newContext({
        ...(width < 760 ? devices["Pixel 7"] : {}),
        viewport: { width, height: width < 760 ? 844 : 1000 },
        colorScheme: scheme,
        reducedMotion: "no-preference",
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => report.errors.push(error.message));
      await page.goto(url, { waitUntil: "networkidle" });
      const image = page.locator(".hero-ribbon-image");
      await image.evaluate((el) => el.decode());
      await page.waitForFunction(
        () =>
          document.querySelector(".hero-backdrop")?.dataset.running === "true",
      );
      const before = await image.evaluate(
        (el) => getComputedStyle(el).transform,
      );
      await page.waitForTimeout(350);
      assert.notEqual(
        await image.evaluate((el) => getComputedStyle(el).transform),
        before,
        "ribbon must actually move",
      );
      assert.equal(
        await image.evaluate((el) => getComputedStyle(el).animationDuration),
        "24s",
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert.ok(
        await page.locator(".poster-portrait").evaluate((el) => {
          const r = el.getBoundingClientRect();
          return !!document
            .elementFromPoint(r.x + r.width / 2, r.y + r.height * 0.35)
            ?.closest(".poster-portrait");
        }),
        "background must not intercept portrait gestures",
      );
      await page
        .getByRole("button", {
          name: "Pause background animation",
          exact: true,
        })
        .click();
      await page.waitForFunction(
        () =>
          document.querySelector(".hero-backdrop")?.dataset.running === "false",
      );
      const paused = await phase(image);
      await page.waitForTimeout(250);
      assert.equal(
        await phase(image),
        paused,
        "manual pause freezes the exact phase",
      );
      if (width !== 320)
        await page.screenshot({
          path: `${out}/hero-ribbon-${width < 760 ? "mobile" : "desktop"}-${scheme}.png`,
        });
      await page
        .getByRole("button", {
          name: "Resume background animation",
          exact: true,
        })
        .click();
      await page.waitForFunction(
        () =>
          document.querySelector(".hero-backdrop")?.dataset.running === "true",
      );
      await page.waitForTimeout(100);
      assert.ok(
        (await phase(image)) > paused && (await phase(image)) < paused + 500,
        "resume continues, never restarts",
      );
      await page
        .locator("#contact")
        .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
      await page.waitForFunction(
        () =>
          document.querySelector(".hero-backdrop")?.dataset.running === "false",
      );
      const offscreen = await phase(image);
      await page.waitForTimeout(250);
      assert.equal(
        await phase(image),
        offscreen,
        "offscreen hero must stop drawing",
      );
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForFunction(
        () =>
          document.querySelector(".hero-backdrop")?.dataset.running === "true",
      );
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForTimeout(100);
      assert.equal(await image.evaluate((el) => el.getAnimations().length), 0);
      assert.equal(
        await page.locator(".hero-motion-toggle").isVisible(),
        false,
      );
      assert.ok(await image.isVisible());
      report.views.push({
        scheme,
        width,
        moving: true,
        pauseResumeContinuous: true,
        offscreenPaused: true,
        reducedMotionStatic: true,
        noOverflow: true,
      });
      await context.close();
    }
  for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({
      javaScriptEnabled,
      reducedMotion: javaScriptEnabled ? "reduce" : "no-preference",
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    const image = page.locator(".hero-ribbon-image");
    await image.waitFor({ state: "visible" });
    assert.equal(await page.locator(".hero-motion-toggle").isVisible(), false);
    if (javaScriptEnabled) {
      assert.equal(await image.evaluate((el) => el.getAnimations().length), 0);
    } else {
      const frozen = await phase(image);
      await page.waitForTimeout(250);
      assert.equal(
        await phase(image),
        frozen,
        "no-JS backdrop remains paused even without a reduced-motion preference",
      );
      assert.ok(await page.locator(".poster-info").isVisible());
    }
    await context.close();
  }
  report.checks = [
    "Original supplied sculpture optimized to a transparent WebP, no visual regeneration",
    "Actual slow transform motion in both themes at 320/390/1440px",
    "Manual pause/resume keeps phase; offscreen hero pauses",
    "Reduced motion at load/change keeps a static sculpture and hides the control",
    "No-JavaScript fallback remains static and readable",
    "Decorative layer never intercepts the portrait's input",
  ];
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
  await writeFile(`${out}/hero-backdrop.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
