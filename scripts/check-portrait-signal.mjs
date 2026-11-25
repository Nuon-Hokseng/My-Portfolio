import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, devices } from "@playwright/test";

const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:3000";
const out = process.env.PORTFOLIO_REPORT_DIR || "design/verification";
await mkdir(out, { recursive: true });
const report = { url, samples: [], errors: [] };
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext(
      mobile
        ? {
            ...devices["Pixel 7"],
            viewport: { width: 390, height: 844 },
            reducedMotion: "no-preference",
          }
        : {
            viewport: { width: 1440, height: 1000 },
            reducedMotion: "no-preference",
          },
    );
    const page = await context.newPage();
    page.on("pageerror", (error) => report.errors.push(error.message));
    await page.goto(url, { waitUntil: "networkidle" });
    const portrait = page.locator(".poster-portrait");
    await page.waitForFunction(() =>
      document
        .querySelector(".poster-portrait")
        ?.style.getPropertyValue("--portrait-image"),
    );
    assert.equal(await portrait.getAttribute("data-glitch"), null);
    assert.equal(
      await page
        .locator(".portrait-color")
        .evaluate((el) => getComputedStyle(el).opacity),
      "0",
    );
    const rect = await portrait.boundingBox();
    const x = Math.round(rect.x + rect.width * 0.5),
      y = Math.round(rect.y + rect.height * 0.36);
    const cdp = mobile ? await context.newCDPSession(page) : null;
    const touch = async (type, dx = 0) =>
      cdp.send("Input.dispatchTouchEvent", {
        type,
        touchPoints:
          type === "touchEnd"
            ? []
            : [{ x: x + dx, y, id: 0, radiusX: 5, radiusY: 5, force: 1 }],
      });
    const activate = async () =>
      mobile ? touch("touchStart") : page.mouse.move(x, y);
    const release = async () =>
      mobile ? touch("touchEnd") : page.mouse.move(1, 1);
    await activate();
    await page.waitForFunction(() =>
      document.querySelector(".poster-portrait")?.hasAttribute("data-glitch"),
    );
    const started = await page
      .locator(".portrait-color")
      .evaluate(async (el) => {
        const animation = el.getAnimations()[0];
        await animation?.ready;
        return animation?.startTime;
      });
    await page.waitForTimeout(140);
    const sample = await page.locator(".portrait-signal").evaluate((el) => ({
      opacity: getComputedStyle(el, "::before").opacity,
      transform: getComputedStyle(el, "::before").transform,
      clip: getComputedStyle(el, "::before").clipPath,
      source: getComputedStyle(el, "::before").backgroundImage,
      duration: getComputedStyle(el, "::before").animationDuration,
    }));
    assert.ok(Number(sample.opacity) > 0 && sample.transform !== "none");
    assert.ok(
      sample.source.includes("_next/image"),
      "reuse optimized responsive portrait, no separate ghost bitmap",
    );
    assert.equal(sample.duration, "0.72s");
    if (mobile) await touch("touchMove", 12);
    else await page.mouse.move(x + 12, y);
    assert.equal(
      await page
        .locator(".portrait-color")
        .evaluate((el) => el.getAnimations()[0]?.startTime),
      started,
      "moving the pointer must not restart the glitch",
    );
    await page.screenshot({
      path: `${out}/portrait-signal-${mobile ? "mobile" : "desktop"}.png`,
      clip: rect,
      scale: "css",
    });
    await page.waitForFunction(
      () =>
        !document
          .querySelector(".poster-portrait")
          ?.hasAttribute("data-glitch"),
    );
    assert.equal(
      await page
        .locator(".portrait-signal")
        .evaluate((el) => getComputedStyle(el).opacity),
      "0",
    );
    assert.equal(
      await page
        .locator(".portrait-color")
        .evaluate((el) => getComputedStyle(el).opacity),
      "1",
    );
    assert.equal(
      await page
        .locator(".portrait-color")
        .evaluate((el) => getComputedStyle(el).filter),
      "none",
    );
    if (mobile) await touch("touchMove", 20);
    else await page.mouse.move(x + 20, y);
    await page.waitForTimeout(100);
    assert.equal(
      await portrait.getAttribute("data-glitch"),
      null,
      "holding/sliding keeps a clean color reveal, not a looping glitch",
    );
    await release();
    await page.waitForTimeout(400);
    assert.equal(
      await page
        .locator(".portrait-color")
        .evaluate((el) => getComputedStyle(el).opacity),
      "0",
    );
    // Accessibility changes cancel a live burst, not merely its next repetition.
    await page.waitForTimeout(300);
    await activate();
    await page.waitForFunction(() =>
      document.querySelector(".poster-portrait")?.hasAttribute("data-glitch"),
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(100);
    assert.equal(await portrait.getAttribute("data-glitch"), null);
    assert.equal(await page.locator(".portrait-signal").isVisible(), false);
    await release();
    await activate();
    await page.waitForTimeout(100);
    assert.equal(await portrait.getAttribute("data-glitch"), null);
    assert.equal(
      await page
        .locator(".portrait-color")
        .evaluate((el) => getComputedStyle(el).opacity),
      "1",
      "reduced motion retains the usable color reveal",
    );
    await release();
    report.samples.push({
      device: mobile ? "android-emulated" : "desktop",
      ...sample,
      pointerDoesNotRestart: true,
      settlesIn720ms: true,
      grayscaleOnRelease: true,
      reducedMotionCancelsAndSkips: true,
    });
    await context.close();
  }
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
  await writeFile(
    `${out}/portrait-signal.json`,
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
