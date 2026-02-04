import { test, expect } from '@playwright/test'

test.describe('Health Check API', () => {
  test('GET /api/health returns 200 when healthy', async ({ request }) => {
    const response = await request.get('/api/health')

    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data).toHaveProperty('status')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('checks')
  })

  test('health check includes API status', async ({ request }) => {
    const response = await request.get('/api/health')
    const data = await response.json()

    expect(data.checks).toHaveProperty('api')
    expect(data.checks.api).toBe('ok')
  })

  test('health check includes database status', async ({ request }) => {
    const response = await request.get('/api/health')
    const data = await response.json()

    expect(data.checks).toHaveProperty('database')
    // Database might be 'ok' or 'error' depending on connection
    expect(['ok', 'error']).toContain(data.checks.database)
  })

  test('health check returns valid timestamp', async ({ request }) => {
    const response = await request.get('/api/health')
    const data = await response.json()

    const timestamp = new Date(data.timestamp)
    expect(timestamp.getTime()).not.toBeNaN()
  })
})

test.describe('Home Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/SamGov|Karnataka/i)
  })

  test('displays main heading', async ({ page }) => {
    await page.goto('/')

    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toContainText(/Karnataka Welfare Scheme Guide/i)
  })

  test('has browse schemes button', async ({ page }) => {
    await page.goto('/')

    const browseLink = page.getByRole('link', { name: /browse schemes/i })
    await expect(browseLink).toBeVisible()
  })

  test('has important disclaimer notice', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText(/This is NOT a government website/i)).toBeVisible()
  })

  test('navigates to schemes page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /browse schemes/i }).click()

    await expect(page).toHaveURL('/schemes')
  })
})

test.describe('Schemes Page', () => {
  test('loads schemes list', async ({ page }) => {
    await page.goto('/schemes')

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Schemes/i)
  })
})

test.describe('Legal Pages', () => {
  test('terms page loads', async ({ page }) => {
    await page.goto('/terms')

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Terms of Service/i)
  })

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy')

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Privacy Policy/i)
  })

  test('terms page has NOT GOVERNMENT disclaimer', async ({ page }) => {
    await page.goto('/terms')

    await expect(page.getByText(/NOT A GOVERNMENT WEBSITE/i)).toBeVisible()
  })
})

test.describe('Mobile Viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('home page is responsive', async ({ page }) => {
    await page.goto('/')

    // Check main content is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: /browse schemes/i })).toBeVisible()
  })
})
