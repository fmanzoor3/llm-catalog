const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
    const dir = process.cwd().split('\\').join('/');

    // 1. Default state (Benchmark ranking, Coding)
    await page.goto('file:///' + dir + '/index.html');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshot-filters-v2.png', fullPage: false });
    console.log('1. Default filter state');

    // 2. Click Quality
    await page.click('#optimize-group [data-value="quality"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot-filters-quality.png', fullPage: false });
    console.log('2. Quality optimize');

    // 3. Click Fast
    await page.click('#optimize-group [data-value="fast"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot-filters-fast.png', fullPage: false });
    console.log('3. Fast optimize');

    // 4. Click Privacy
    await page.click('#optimize-group [data-value="privacy"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot-filters-privacy.png', fullPage: false });
    console.log('4. Privacy optimize');

    // 5. Switch to Community ranking
    await page.click('#optimize-group [data-value="balanced"]');
    await page.click('#rankby-group [data-value="community"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot-filters-community.png', fullPage: false });
    console.log('5. Community rank');

    // 6. Switch back to Benchmark ranking
    await page.click('#rankby-group [data-value="benchmark"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot-filters-benchmark.png', fullPage: false });
    console.log('6. Benchmark rank');

    // 7. Environment: On-Prem
    await page.selectOption('#environment-filter', 'on-prem');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot-filters-onprem.png', fullPage: false });
    console.log('7. On-Prem environment');

    // 8. Environment: Azure
    await page.selectOption('#environment-filter', 'azure');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot-filters-azure.png', fullPage: false });
    console.log('8. Azure environment');

    await browser.close();
    console.log('Done!');
})();
