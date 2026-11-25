import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, devices } from "@playwright/test";

const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:3000";
const out = process.env.PORTFOLIO_REPORT_DIR || "design/verification";
await mkdir(out, { recursive: true });
const report = {
  url,
  coverage: [],
  samples: [],
  stability: [],
  checks: [],
  errors: [],
};
const browser = await chromium.launch({ channel: "chrome", headless: true });
const cases = [
  ["#about .stats > div", "stat"],
  ["#skills .skill-card", "fan"],
  ["#experience .experience-photos", "left"],
  ["#experience .experience-copy", "right"],
  ["#journey .timeline > li", "timeline"],
  ["#journey .education-photo", "photo"],
  ["#gallery .project-card", "project"],
  ["#gallery .work-photo.volunteer", "zoom"],
  ["#certificates .photo-viewer", "award"],
  ["#extras .extra-options > details", "quiet"],
  ["#contact .contact-grid > div:first-child", "contact"],
];
async function open(context, suffix = "") {
  const page = await context.newPage();
  page.on("pageerror", (error) => report.errors.push(error.message));
  await page.goto(`${url}${suffix}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() =>
    document.querySelector("#contact [data-motion]"),
  );
  return page;
}
async function enter(page, selector) {
  await page
    .locator(selector)
    .first()
    .evaluate((el) =>
      scrollTo({
        top: scrollY + el.getBoundingClientRect().top - innerHeight * 0.62,
        behavior: "instant",
      }),
    );
  await page.waitForFunction(
    (s) => document.querySelector(s)?.dataset.motionState === "running",
    selector,
  );
}
async function settled(page, selector) {
  await page.waitForFunction(
    (s) => document.querySelector(s)?.dataset.motionState === "settled",
    selector,
  );
}
async function progress(element) {
  return element.evaluate(async (el) => {
    const frames = [];
    await new Promise((resolve) => {
      const sample = () => {
        frames.push(Number(getComputedStyle(el).opacity));
        if (el.dataset.motionState === "running") requestAnimationFrame(sample);
        else resolve();
      };
      requestAnimationFrame(sample);
    });
    return frames;
  });
}
function monotonic(values, label) {
  assert.ok(values.length > 2, `${label}: sample actual frames`);
  for (let i = 1; i < values.length; i++)
    assert.ok(
      values[i] + 0.005 >= values[i - 1],
      `${label}: opacity must never reset or flicker`,
    );
  assert.equal(values.at(-1), 1, `${label}: fully readable final state`);
}
try {
  for (const mobile of [false, true]) {
    const device = mobile ? "android-emulated" : "desktop";
    const context = await browser.newContext(
      mobile
        ? { ...devices["Pixel 7"], reducedMotion: "no-preference" }
        : {
            viewport: { width: 1440, height: 900 },
            reducedMotion: "no-preference",
          },
    );
    // Test-only instrumentation counts real starts, not data-attribute labels.
    await context.addInitScript(() => {
      window.__motionStarts = new WeakMap();
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (frames, options) {
        if (options?.id?.startsWith("portfolio-"))
          window.__motionStarts.set(
            this,
            (window.__motionStarts.get(this) || 0) + 1,
          );
        return animate.call(this, frames, options);
      };
    });
    const page = await open(context);
    const coverage = await page
      .locator("main > section:not(#hero)")
      .evaluateAll((sections) =>
        sections.map((s) => ({
          id: s.id,
          targets: s.querySelectorAll("[data-motion]").length,
        })),
      );
    assert.ok(coverage.every((s) => s.targets > 0));
    report.coverage.push({ device, sections: coverage });
    await page.close();
    // Fresh visits isolate presets that would otherwise finish together.
    for (const [selector, effect] of cases) {
      const sample = await open(context);
      const element = sample.locator(selector).first();
      assert.equal(
        await element.getAttribute("data-motion-state"),
        "ready",
        `${effect}: prepared offscreen before it can flash`,
      );
      assert.equal(
        await element.evaluate((el) => getComputedStyle(el).opacity),
        "0",
      );
      await enter(sample, selector);
      assert.equal(await element.getAttribute("data-motion"), effect);
      const timing = await element.evaluate((el) =>
        el
          .getAnimations()
          .find((a) => a.id.startsWith("portfolio-"))
          .effect.getTiming(),
      );
      assert.equal(timing.duration, 1100);
      assert.ok(timing.delay <= 120);
      const values = await progress(element);
      monotonic(values, `${device}/${effect}`);
      assert.ok(
        await sample.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      report.samples.push({
        device,
        effect,
        durationMs: timing.duration,
        delayMs: timing.delay,
        frames: values.length,
        monotonicOpacity: true,
        completed: true,
      });
      await sample.close();
    }
    const stable = await open(context);
    if (mobile) {
      const cdp = await context.newCDPSession(stable);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    }
    const selector = "#skills .skill-card";
    const card = stable.locator(selector).first();
    await enter(stable, selector);
    const sampling = progress(card);
    // Reverse direction while the entrance is still in flight.
    await stable.evaluate(async () => {
      const destination = scrollY;
      for (let i = 0; i < 4; i++) {
        scrollTo({ top: 0, behavior: "instant" });
        await new Promise((resolve) => setTimeout(resolve, 85));
        scrollTo({ top: destination, behavior: "instant" });
        await new Promise((resolve) => setTimeout(resolve, 85));
      }
    });
    monotonic(await sampling, `${device}/direction-reversals`);
    await settled(stable, selector);
    // Fully exit, revisit, and jitter around the trigger: never hide read content.
    for (let i = 0; i < 3; i++) {
      await stable.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await stable.waitForTimeout(100);
      await card.evaluate((el) =>
        scrollTo({
          top: scrollY + el.getBoundingClientRect().top - innerHeight + 20,
          behavior: "instant",
        }),
      );
      await stable.waitForTimeout(100);
      assert.equal(
        await card.evaluate((el) => getComputedStyle(el).opacity),
        "1",
      );
      assert.equal(await card.getAttribute("data-motion-state"), "settled");
    }
    assert.equal(
      await card.evaluate((el) => window.__motionStarts.get(el)),
      1,
      "only one entrance per element per visit",
    );
    // Accessibility preference changes must not start another fade when restored.
    await stable.emulateMedia({ reducedMotion: "reduce" });
    await stable.waitForTimeout(100);
    assert.ok(
      await stable
        .locator("[data-motion]")
        .evaluateAll((els) =>
          els.every((el) => getComputedStyle(el).opacity === "1"),
        ),
    );
    await stable.emulateMedia({ reducedMotion: "no-preference" });
    await stable.waitForTimeout(100);
    assert.equal(
      await stable.evaluate(
        () =>
          document.getAnimations().filter((a) => a.id.startsWith("portfolio-"))
            .length,
      ),
      0,
    );
    // Newly mounted visible gallery updates stay readable, without opacity resets.
    await stable
      .getByRole("button", { name: "Volunteer", exact: true })
      .click();
    await stable.waitForFunction(
      () =>
        document.querySelector(".volunteer-story .photo-viewer")?.dataset
          .motion === "photo",
    );
    await stable.getByRole("button", { name: /Sala Dong/ }).click();
    await stable.waitForFunction(
      () =>
        document.querySelector(".volunteer-story .volunteer-copy")?.dataset
          .motion === "right",
    );
    await stable.getByRole("button", { name: "All work", exact: true }).click();
    await stable.waitForFunction(
      () =>
        document.querySelector(".project-card")?.dataset.motionState ===
        "settled",
    );
    assert.equal(
      await stable
        .locator(".project-card")
        .first()
        .evaluate((el) => getComputedStyle(el).opacity),
      "1",
    );
    // Focus makes moving controls immediately stable and usable.
    const focusPage = await open(context);
    await focusPage.locator(".project-card button").first().focus();
    await focusPage.waitForTimeout(100);
    assert.equal(
      await focusPage
        .locator(".project-card")
        .first()
        .getAttribute("data-motion-state"),
      "settled",
    );
    await focusPage.close();
    if (!mobile) {
      await card.hover();
      await stable.waitForTimeout(500);
      assert.notEqual(
        await card.evaluate((el) => getComputedStyle(el).translate),
        "none",
      );
    }
    report.stability.push({
      device,
      cpuThrottle: mobile ? 4 : 1,
      entranceStarts: 1,
      directionReversals: 8,
      revisits: 3,
      opacityResets: 0,
    });
    await stable.close();
    const linked = await open(context, "#gallery");
    assert.equal(
      await linked
        .locator("#gallery .section-head")
        .getAttribute("data-motion-state"),
      "settled",
    );
    assert.equal(
      await linked
        .locator("#gallery .section-head")
        .evaluate((el) => getComputedStyle(el).opacity),
      "1",
    );
    await linked.close();
    await context.close();
  }
  const reduced = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await open(reduced);
  assert.equal(
    await page.evaluate(
      () =>
        document.getAnimations().filter((a) => a.id.startsWith("portfolio-"))
          .length,
    ),
    0,
  );
  assert.ok(
    await page
      .locator("[data-motion]")
      .evaluateAll((els) =>
        els.every((el) => getComputedStyle(el).opacity === "1"),
      ),
  );
  await reduced.close();
  report.checks = [
    "All eight post-hero sections retain motion targets",
    "Offscreen elements are prepared before entry, never visible-then-hidden",
    "Eleven presets use 1100ms gentle easing with at most 120ms stagger",
    "Frame-by-frame opacity increases monotonically through each entrance",
    "Rapid direction reversals, edge jitter and repeat visits never restart or reset opacity",
    "Android stability also checked under 4x CPU slowdown",
    "Initially visible and deep-linked content stays readable without an entrance",
    "Visible gallery replacements do not flash; keyboard focus settles moving controls",
    "Reduced motion at load and preference changes preserve all content without replays",
    "Fine-pointer micro-interactions still work independently",
  ];
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
  await writeFile(`${out}/motion.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
