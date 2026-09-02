const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/html/mportal/stu/LIB_00.html');
  const rect = await page.evaluate(() => {
    const el = document.querySelector('.footer_box');
    return el ? el.getBoundingClientRect().toJSON() : null;
  });
  console.log('footer_box rect:', rect);
  
  const contentRect = await page.evaluate(() => {
    const el = document.querySelector('.content');
    return el ? el.getBoundingClientRect().toJSON() : null;
  });
  console.log('content rect:', contentRect);
  
  await browser.close();
})();
