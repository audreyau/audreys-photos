import { test, expect } from "@playwright/test"

test.describe("Navigation", () => {
  test("homepage loads with gallery", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toContainText("Gallery")
  })

  test("can navigate to collections", async ({ page }) => {
    await page.goto("/")
    await page.click('a[href="/collections"]')
    await expect(page.locator("h1")).toContainText("Collections")
  })

  test("can navigate to about", async ({ page }) => {
    await page.goto("/")
    await page.click('a[href="/about"]')
    await expect(page.locator("h1")).toContainText("About")
  })

  test("lightbox opens on photo click", async ({ page }) => {
    await page.goto("/")
    await page.click('[aria-label^="View photo"]')
    await expect(page.locator('[role="dialog"]')).toBeVisible()
  })

  test("lightbox closes on escape", async ({ page }) => {
    await page.goto("/")
    await page.click('[aria-label^="View photo"]')
    await page.keyboard.press("Escape")
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })
})
