import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, devices } from "@playwright/test";

const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:3000";
const out = process.env.PORTFOLIO_REPORT_DIR || "design/verification";
await mkdir(out, { recursive: true });
const report = { url, coverage: [], samples: [], checks: [], errors: [] };
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

async function enter(page, selector) {
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(100);
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
    (selector) =>
      document.querySelector(selector)?.dataset.motionState === "running",
    selector,
  );
}
async function framePacing(page) {
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  return page.evaluate(async () => {
    const intervals = [];
    let previous;
    await new Promise((resolve) => {
      function sample(now) {
        if (previous) intervals.push(now - previous);
        previous = now;
        scrollBy({ top: 18, behavior: "instant" });
        if (intervals.length < 120) requestAnimationFrame(sample);
        else resolve();
      }
      requestAnimationFrame(sample);
    });
    const sorted = [...intervals].sort((a, b) => a - b);
    return {
      frames: intervals.length,
      meanMs: intervals.reduce((a, b) => a + b, 0) / intervals.length,
      p95Ms: sorted[Math.floor(sorted.length * 0.95)],
    };
  });
}
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext(
      mobile
        ? { ...devices["Pixel 7"], reducedMotion: "no-preference" }
        : {
            viewport: { width: 1440, height: 900 },
            reducedMotion: "no-preference",
          },
    );
    const page = await context.newPage();
    page.on("pageerror", (error) => report.errors.push(error.message));
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForFunction(() =>
      document.querySelector("#contact [data-motion]"),
    );
    const coverage = await page
      .locator("main > section:not(#hero)")
      .evaluateAll((sections) =>
        sections.map((section) => ({
          id: section.id,
          targets: section.querySelectorAll("[data-motion]").length,
        })),
      );
    assert.ok(coverage.every((section) => section.targets > 0));
    report.coverage.push({
      device: mobile ? "android-emulated" : "desktop",
      sections: coverage,
    });
    for (const [selector, effect] of cases) {
      await enter(page, selector);
      const element = page.locator(selector).first();
      assert.equal(await element.getAttribute("data-motion"), effect);
      const start = await element.evaluate((el) => ({
        transform: getComputedStyle(el).transform,
        opacity: getComputedStyle(el).opacity,
      }));
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${effect}: no overflow during entrance`,
      );
      await page.waitForTimeout(180);
      const middle = await element.evaluate((el) => ({
        transform: getComputedStyle(el).transform,
        opacity: getComputedStyle(el).opacity,
      }));
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${effect}: no overflow mid-entrance`,
      );
      assert.notEqual(
        start.transform,
        middle.transform,
        `${effect} must visibly move, not only be labeled`,
      );
      await page.waitForFunction(
        (selector) =>
          document.querySelector(selector)?.dataset.motionState === "settled",
        selector,
      );
      assert.equal(
        await element.evaluate((el) => getComputedStyle(el).opacity),
        "1",
      );
      report.samples.push({
        device: mobile ? "android-emulated" : "desktop",
        effect,
        start,
        middle,
        completed: true,
      });
    }
    // The same section should animate again after a substantial revisit.
    await enter(page, "#skills .skill-card");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(100);
    assert.equal(
      await page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(
              (a) => a.id.startsWith("portfolio-") && a.playState === "running",
            ).length,
      ),
      0,
    );
    assert.ok(
      await page
        .locator("[data-motion]")
        .evaluateAll((elements) =>
          elements.every((el) => getComputedStyle(el).opacity === "1"),
        ),
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.getByRole("button", { name: "Volunteer", exact: true }).click();
    await page.waitForFunction(
      () =>
        document.querySelector(".volunteer-story .photo-viewer")?.dataset
          .motion === "photo",
    );
    await page.getByRole("button", { name: /Sala Dong/, exact: false }).click();
    await page.waitForFunction(
      () =>
        document.querySelector(".volunteer-story .volunteer-copy")?.dataset
          .motion === "right",
    );
    await page.getByRole("button", { name: "All work", exact: true }).click();
    await page.waitForFunction(
      () =>
        document.querySelector(".project-card")?.dataset.motion === "project",
    );
    if (mobile) {
      const cdp = await context.newCDPSession(page);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      report.androidScrollPacing4xCPU = await framePacing(page);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    } else {
      await page.locator(".skill-card").first().hover();
      await page.waitForTimeout(1100);
      assert.notEqual(
        await page
          .locator(".skill-card")
          .first()
          .evaluate((el) => getComputedStyle(el).translate),
        "none",
      );
      report.desktopScrollPacing = await framePacing(page);
    }
    await page.waitForTimeout(1200);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await context.close();
  }
  const reduced = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await reduced.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("#contact").evaluate((el) => el.scrollIntoView());
  await page.waitForTimeout(150);
  assert.equal(
    await page.evaluate(
      () =>
        document.getAnimations().filter((a) => a.id.startsWith("portfolio-"))
          .length,
    ),
    0,
  );
  assert.equal(
    await page
      .locator(".contact-grid")
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  await reduced.close();
  report.checks = [
    "All eight post-hero sections have motion targets",
    "Eleven distinct entrance presets visibly advance and finish on desktop and Android emulation",
    "Revisiting a section replays its entrance",
    "Gallery filters and volunteer tabs register their newly mounted content",
    "Live reduced-motion changes cancel animations and restore all content",
    "Reduced motion at load has no spatial entrance animation",
    "Micro hover response works independently from entrance transforms",
    "Normal and 4x CPU scroll frame pacing measured; no universal frame-rate guarantee",
  ];
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
  await writeFile(`${out}/motion.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
