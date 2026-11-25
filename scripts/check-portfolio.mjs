import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
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
  errors: [],
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function loadImages(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 650) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
  });
  await page.waitForFunction(
    () =>
      [...document.images].every((img) => img.complete && img.naturalWidth > 0),
    { timeout: 30000 },
  );
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(650);
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
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const mobile = await touch.newPage();
  await mobile.goto(url, { waitUntil: "networkidle" });
  assert.equal(
    await mobile
      .locator(".portrait-color")
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  assert.equal(
    await mobile
      .locator(".portrait-color")
      .evaluate((el) => getComputedStyle(el).maskImage),
    "none",
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
    "Touch devices show color without hover; no-JS visit retains readable content, working anchors, CV and mobile navigation",
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
