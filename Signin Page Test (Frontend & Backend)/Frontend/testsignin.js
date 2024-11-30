const puppeteer = require('puppeteer');

(async () => {
  
  const browser = await puppeteer.launch({ headless: false }); 

  // navigate to sign-in page
  await page.goto('http://localhost/your-signin-page.html');

  // Enter email and password
  await page.type('#email', 'your-test-email@example.com');
  await page.type('#password-signin', 'yourpassword');

  // remember me box
  await page.click('#rememberMe');

  // submit form
  await page.click('.submit-btn');

  // ensure login process
  await page.waitForNavigation();

  //check for successful login
  const url = await page.url();
  console.log('New Page URL:', url);  

  const loggedInSuccessfully = await page.$('selector-for-element-visible-only-on-success'); 
  if (loggedInSuccessfully) {
    console.log('Login successful!');
  } else {
    console.log('Login failed!');
  }

  // Close the browser session.
  await browser.close();
})();
