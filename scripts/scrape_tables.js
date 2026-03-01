const { chromium } = require('playwright');

const SEEDS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const BASE_URL = 'https://sanand0.github.io/tdsdata/js_table/?seed=';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let grandTotal = 0;

  for (const seed of SEEDS) {
    const url = BASE_URL + seed;
    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for at least one table to appear
    await page.waitForSelector('table', { timeout: 15000 });

    // Extract all numbers from all table cells
    const numbers = await page.$$eval('table td, table th', cells =>
      cells
        .map(c => c.innerText.trim())
        .filter(t => /^-?\d+(\.\d+)?$/.test(t))
        .map(Number)
    );

    const seedSum = numbers.reduce((a, b) => a + b, 0);
    console.log(`Seed ${seed}: ${numbers.length} numbers, sum = ${seedSum}`);
    grandTotal += seedSum;
  }

  await browser.close();

  console.log(`\nTotal sum across all seeds (7-16): ${grandTotal}`);
})();
