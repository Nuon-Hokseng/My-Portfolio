import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, devices } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Run against `npm run start` or a deployed URL: PORTFOLIO_URL=https://... npm run test:ui
const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:3000";
const out = process.env.PORTFOLIO_REPORT_DIR || "design/verification";
const trackedPublicFiles = new Set(
  execFileSync("git", ["ls-files", "public"], { encoding: "utf8" })
    .trim()
    .split(/\r?\n/),
);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = {
  url,
  viewports: [],
  checks: [],
  accessibility: [],
  modals: [],
  errors: [],
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function loadImages(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 650) {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
  });
  await page.waitForFunction(
    () =>
      [...document.images].every((img) => img.complete && img.naturalWidth > 0),
    { timeout: 30000 },
  );
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1200);
}
async function checkModalCenter(page, label) {
  const geometry = await page.locator("dialog[open]").evaluate((el) => {
    const r = el.getBoundingClientRect();
    return {
      left: r.left,
      right: innerWidth - r.right,
      top: r.top,
      bottom: innerHeight - r.bottom,
      scrollable: el.scrollHeight > el.clientHeight,
    };
  });
  assert.ok(
    Math.abs(geometry.left - geometry.right) <= 1,
    `${label}: horizontal center`,
  );
  assert.ok(
    Math.abs(geometry.top - geometry.bottom) <= 1,
    `${label}: vertical center`,
  );
  assert.ok(
    Math.min(geometry.left, geometry.right, geometry.top, geometry.bottom) >=
      15,
    `${label}: viewport gutters`,
  );
  await page.locator("dialog[open]").evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  assert.ok(
    await page
      .locator("dialog[open]")
      .evaluate((el) => el.scrollTop > 0 || el.scrollHeight <= el.clientHeight),
    `${label}: all content reachable`,
  );
  await page.locator("dialog[open]").evaluate((el) => {
    el.scrollTop = 0;
  });
  report.modals.push({ label, ...geometry });
}
try {
  for (const scheme of ["light", "dark"])
    for (const width of [320, 390, 768, 1024, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        colorScheme: scheme,
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => report.errors.push(error.message));
      page.on("response", (response) => {
        if (response.status() >= 400 && response.url().startsWith(url))
          report.errors.push(`${response.status()} ${response.url()}`);
      });
      await page.goto(url, { waitUntil: "networkidle" });
      await loadImages(page);
      assert.equal(await page.locator("h1").count(), 1);
      assert.match(
        await page.locator(".poster-info").innerText(),
        /2\.5 years/,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `overflow ${scheme} ${width}`,
      );
      for (const selector of [".name-solid", ".name-outline"]) {
        const title = await page.locator(selector).boundingBox();
        assert.ok(
          title.x >= 0 && title.x + title.width <= width + 1,
          `clipped name ${width}`,
        );
      }
      assert.match(
        await page.locator(".volunteer-feature").innerText(),
        /18–20 November 2026/i,
      );
      assert.match(
        await page.locator(".volunteer-feature").innerText(),
        /Kompong Thom/,
      );
      assert.equal(
        await page.locator("#extras canvas").count(),
        0,
        "game must not load on initial visit",
      );
      report.viewports.push({
        scheme,
        width,
        noOverflow: true,
        allImagesLoaded: true,
      });
      if (width === 390 || width === 1440) {
        if (width === 390) {
          await page.getByRole("button", { name: "Open navigation" }).click();
          const menuAudit = await new AxeBuilder({ page })
            .include(".header")
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
          report.accessibility.push({
            scheme,
            width,
            state: "navigation-open",
            violations: menuAudit.violations.map((v) => ({
              id: v.id,
              impact: v.impact,
              nodes: v.nodes.map((n) => n.target),
            })),
          });
          const palette = await page.locator(".nav-links").evaluate((el) => ({
            background: getComputedStyle(el).backgroundColor,
            text: getComputedStyle(el).color,
          }));
          assert.notEqual(
            palette.background,
            palette.text,
            "mobile menu must not blend into its background",
          );
          await page.screenshot({
            path: `${out}/menu-${scheme}.png`,
            clip: { x: 0, y: 0, width, height: 420 },
          });
          await page.getByRole("button", { name: "Close navigation" }).click();
        }
        await page.screenshot({
          path: `${out}/${width === 390 ? "mobile" : "desktop"}-${scheme}.png`,
          fullPage: true,
          animations: "disabled",
        });
        const analysis = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        report.accessibility.push({
          scheme,
          width,
          violations: analysis.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => n.target),
          })),
        });
      }
      await context.close();
    }
  report.checks.push(
    "10 viewport/theme combinations: name, experience, new volunteer trip, lazy-loaded images, no horizontal overflow",
  );

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: "light",
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => report.errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  const portrait = page.locator(".poster-portrait");
  await portrait.screenshot({
    path: `${out}/portrait-gray.png`,
    animations: "disabled",
  });
  const rect = await portrait.boundingBox();
  await page.mouse.move(rect.x + rect.width * 0.5, rect.y + rect.height * 0.36);
  await page.waitForTimeout(450);
  assert.equal(await portrait.getAttribute("data-hover"), "true");
  assert.equal(
    await page
      .locator(".portrait-color")
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  await portrait.screenshot({
    path: `${out}/portrait-color.png`,
    animations: "disabled",
  });
  await page.mouse.move(10, 10);
  await page.waitForTimeout(450);
  assert.equal(
    await page
      .locator(".portrait-color")
      .evaluate((el) => getComputedStyle(el).opacity),
    "0",
  );
  report.checks.push(
    "Cursor color spotlight tracks position, fades in, and returns to grayscale on leave",
  );

  const cvHref = await page.locator(".poster-button").evaluate((el) => el.href);
  assert.ok(
    trackedPublicFiles.has(`public${new URL(cvHref).pathname}`),
    "CV URL must match Git filename casing, even on Windows",
  );
  const cv = await page.request.get(cvHref);
  assert.ok(cv.ok() && (await cv.body()).subarray(0, 4).toString() === "%PDF");
  const openProject = page.getByRole("button", {
    name: "Premier Optic / Workspace: view project",
    exact: true,
  });
  await openProject.click();
  await page.locator("dialog[open]").waitFor();
  assert.match(await page.locator("#project-title").innerText(), /Premier/);
  await checkModalCenter(page, "desktop");
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "detached" });
  assert.ok(await openProject.evaluate((el) => el === document.activeElement));
  for (const filter of ["Projects", "Teaching", "Private", "Volunteer"]) {
    await page.getByRole("button", { name: filter, exact: true }).click();
    assert.equal(
      await page
        .getByRole("button", { name: filter, exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
  }
  for (const name of [
    "Sala Dong · May 2024",
    "CFF Camp · Feb 2025",
    "Cambodia 4.0 · Nov 2026",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    assert.equal(
      (await page
        .locator(".volunteer-story .photo-thumbnails button")
        .count()) >= 4,
      true,
    );
  }
  await page
    .getByRole("button", {
      name: "Photo 2 of 4: Learning across generations",
      exact: true,
    })
    .click();
  assert.match(
    await page.locator(".volunteer-story .photo-caption-text").innerText(),
    /Learning across generations/,
  );
  await page.getByRole("button", { name: "All work", exact: true }).click();
  report.checks.push(
    "Actual CV, project modal/Escape/focus restoration, every filter, three volunteer experiences and photo switching",
  );

  await page.locator("#extras summary").first().click();
  await page.getByRole("button", { name: /Running/ }).click();
  await page.getByRole("button", { name: /Next question/ }).waitFor();
  await page.locator("#extras summary").first().click();
  await page.locator("#extras summary").nth(1).click();
  await page.getByRole("button", { name: /Start Game/ }).waitFor();
  await page.getByRole("button", { name: /Start Game/ }).click();
  assert.equal(await page.locator("#game canvas").count(), 1);
  await page.locator("#extras summary").nth(1).click();
  await page.locator("#game canvas").waitFor({ state: "detached" });
  assert.equal(await page.locator("#game canvas").count(), 0);
  report.checks.push(
    "Quiz works; game loads only on demand, starts, and unmounts when closed",
  );

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  assert.equal(
    await page
      .locator("html")
      .getAttribute("class")
      .then((x) => x.includes("dark")),
    true,
  );
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(
    await page.getByRole("button", { name: "Switch to light theme" }).count(),
    1,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator('.nav-links a[href="#gallery"]').click();
  assert.equal(
    await page.locator(".menu").getAttribute("aria-expanded"),
    "false",
  );
  report.checks.push(
    "Theme persists, mobile navigation works, reduced motion disables spatial transitions and smooth scrolling",
  );

  assert.match(await page.title(), /Full-Stack Web Developer in Cambodia/);
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute("href"),
    "https://nuonhokseng.sparkbytekh.com",
  );
  const graph = JSON.parse(
    await page.locator('script[type="application/ld+json"]').textContent(),
  )["@graph"];
  assert.equal(
    graph.find((item) => item["@type"] === "ProfilePage").mainEntity["@id"],
    "https://nuonhokseng.sparkbytekh.com/#person",
  );
  assert.ok(
    await page
      .locator('link[rel="icon"][media="(prefers-color-scheme: dark)"]')
      .count(),
  );
  for (const path of [
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.webmanifest",
    "/opengraph-image",
    "/favicon.svg",
    "/icons/icon-light.svg",
    "/icons/icon-dark.svg",
    "/icons/apple-touch-icon.png",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
  ])
    assert.ok((await page.request.get(new URL(path, url).href)).ok(), path);
  report.checks.push(
    "Canonical, metadata, connected ProfilePage/Person schema, sitemap, robots, OG image and both theme icons",
  );
  await context.close();

  const touch = await browser.newContext({
    ...devices["Pixel 7"],
    viewport: { width: 390, height: 844 },
    colorScheme: "dark",
  });
  const mobile = await touch.newPage();
  await mobile.goto(url, { waitUntil: "networkidle" });
  assert.equal(
    await mobile
      .locator(".portrait-color")
      .evaluate((el) => getComputedStyle(el).opacity),
    "0",
  );
  assert.notEqual(
    await mobile
      .locator(".portrait-color")
      .evaluate((el) => getComputedStyle(el).maskImage),
    "none",
  );
  const mobilePortrait = mobile.locator(".poster-portrait");
  const box = await mobilePortrait.boundingBox();
  const x = Math.round(box.x + box.width * 0.45),
    y = Math.round(box.y + box.height * 0.36);
  const input = await touch.newCDPSession(mobile);
  await input.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y, id: 0, radiusX: 5, radiusY: 5, force: 1 }],
  });
  await mobile.waitForTimeout(450);
  assert.equal(
    await mobile
      .locator(".portrait-color")
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  const startSpot = await mobilePortrait.evaluate((el) =>
    parseFloat(el.style.getPropertyValue("--spot-x")),
  );
  await input.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: x + 40, y, id: 0, radiusX: 5, radiusY: 5, force: 1 }],
  });
  await mobile.waitForTimeout(80);
  assert.ok(
    (await mobilePortrait.evaluate((el) =>
      parseFloat(el.style.getPropertyValue("--spot-x")),
    )) >
      startSpot + 20,
    "spotlight must follow a real touch drag",
  );
  await mobilePortrait.screenshot({ path: `${out}/portrait-touch-color.png` });
  await input.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await mobile.waitForTimeout(450);
  assert.equal(
    await mobile
      .locator(".portrait-color")
      .evaluate((el) => getComputedStyle(el).opacity),
    "0",
  );
  assert.equal(await mobilePortrait.getAttribute("data-hover"), null);
  // Vertical gestures should still scroll the page rather than trapping the finger.
  await input.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y, id: 0 }],
  });
  await input.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x, y: y - 90, id: 0 }],
  });
  await input.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await mobile.waitForTimeout(450);
  assert.ok(
    await mobile.evaluate(() => scrollY > 0),
    "vertical portrait swipe must preserve page scrolling",
  );
  assert.equal(
    await mobile
      .locator(".portrait-color")
      .evaluate((el) => getComputedStyle(el).opacity),
    "0",
  );
  await mobile.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  report.checks.push(
    "Android portrait starts grayscale, follows real finger input, clears on lift/cancel, and preserves vertical scroll",
  );
  for (const [width, height] of [
    [390, 844],
    [320, 640],
    [844, 390],
  ]) {
    await mobile.setViewportSize({ width, height });
    await mobile
      .getByRole("button", {
        name: "Premier Optic / Workspace: view project",
        exact: true,
      })
      .click();
    await mobile.locator("dialog[open]").waitFor();
    await checkModalCenter(mobile, `android-${width}x${height}`);
    if (width === 390) {
      await mobile.waitForFunction(() => {
        const image = document.querySelector("dialog .photo-frame img");
        return image?.complete && image.naturalWidth > 0;
      });
      await mobile.screenshot({ path: `${out}/modal-mobile-centered.png` });
    }
    await mobile
      .getByRole("button", { name: "Close project details", exact: true })
      .click();
    await mobile.locator("dialog").waitFor({ state: "detached" });
  }
  report.checks.push(
    "Project modal stays centered with equal gutters on desktop, narrow Android and landscape; long content scrolls internally",
  );
  await mobile.setViewportSize({ width: 320, height: 844 });
  await mobile.locator("#extras summary").nth(1).click();
  await mobile.getByRole("button", { name: /Start Game/ }).click();
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
    "mobile game controls overflow",
  );
  await mobile.locator("#extras summary").nth(1).click();
  await mobile.locator("#game canvas").waitFor({ state: "detached" });
  assert.equal(await mobile.locator("#game canvas").count(), 0);
  report.checks.push(
    "Touch game controls fit at 320px; closing releases the canvas",
  );
  await touch.close();
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await noJs.newPage();
  await staticPage.goto(url, { waitUntil: "networkidle" });
  assert.ok(await staticPage.locator(".poster-info").isVisible());
  assert.ok(await staticPage.locator(".nav-links a").first().isVisible());
  assert.ok(await staticPage.locator(".poster-button").isVisible());
  await noJs.close();
  report.checks.push(
    "No-JS visit retains readable content, working anchors, CV and mobile navigation",
  );
  await wait(50);
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
  const serious = report.accessibility.flatMap((result) =>
    result.violations.filter((v) => ["serious", "critical"].includes(v.impact)),
  );
  assert.equal(serious.length, 0, JSON.stringify(serious));
} finally {
  await browser.close();
  await writeFile(`${out}/verification.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
