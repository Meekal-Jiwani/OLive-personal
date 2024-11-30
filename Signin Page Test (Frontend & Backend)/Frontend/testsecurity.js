const puppeteer = require('puppeteer');

async function testXSS() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // Go to the sign-in page
    await page.goto('http://localhost/signin.html');
    
    // Test XSS 
    await page.type('#email', `<script>alert('XSS');</script>`);
    await page.type('#password-signin', 'testpassword');
    
    //sign-in button
    await page.click('.submit-btn');
    
    // alerts
    page.on('dialog', async dialog => {
        console.log('XSS alert detected:', dialog.message());
        await dialog.dismiss();
    });


    await page.waitForTimeout(1000); 
    await browser.close();
}

async function testSQLInjection() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    //sign in page
    await page.goto('http://localhost/signin.html');

    //test sql injecttion
    await page.type('#email', `admin' OR '1'='1`);
    await page.type('#password-signin', `admin' OR '1'='1`);
    
    //click sign-in
    await page.click('.submit-btn');

    // check for unusual behavior
    await page.waitForNavigation();
    const url = await page.url();
    console.log('Current Page URL after SQL Injection attempt:', url);

    await browser.close();
}

(async () => {
    await testXSS();
    await testSQLInjection();
})();
