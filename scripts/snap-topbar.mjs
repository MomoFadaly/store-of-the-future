import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000/example/bedroom-reset', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/sotf-topbar.png', clip: { x: 0, y: 0, width: 1440, height: 200 } });
console.log('saved /tmp/sotf-topbar.png');
// Hover the start over button to confirm it's prominent
await page.locator('button:has-text("Start over")').hover();
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/sotf-topbar-hover.png', clip: { x: 0, y: 0, width: 1440, height: 200 } });
console.log('saved /tmp/sotf-topbar-hover.png');
// Click to show confirmation
await page.locator('button:has-text("Start over")').click();
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/sotf-topbar-confirm.png', clip: { x: 0, y: 0, width: 1440, height: 200 } });
console.log('saved /tmp/sotf-topbar-confirm.png');
await browser.close();
