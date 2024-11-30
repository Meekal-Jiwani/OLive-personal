const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const url = 'file:///path/to/your/signup.html';
    await page.goto(url);

    // Function to test for XSS protection
    async function testXSSProtection() {
        console.log("Testing XSS protection...");

        const xssString = "<script>alert('XSS')</script>";
        await page.type('#first-name', xssString);
        await page.click('#signup-form-student .submit-btn');

        const alertPresent = await page.evaluate(() => !!document.querySelector('script'));
        if (!alertPresent) {
            console.log("XSS protection passed.");
        } else {
            console.log("XSS protection failed.");
        }

        await page.evaluate(() => document.getElementById('first-name').value = ''); // Reset field
    }

    // Function to test password confirmation
    async function testPasswordConfirmation() {
        console.log("Testing password confirmation...");

        await page.type('#password-student', 'SecurePassword1!');
        await page.type('#confirm-password', 'DifferentPassword!');
        await page.click('#signup-form-student .submit-btn');

        const confirmPasswordError = await page.$eval('#confirm-password:invalid', el => el !== null);
        if (confirmPasswordError) {
            console.log("Password confirmation validation passed.");
        } else {
            console.log("Password confirmation validation failed.");
        }

        await page.evaluate(() => {
            document.getElementById('password-student').value = '';
            document.getElementById('confirm-password').value = '';
        }); // Reset fields
    }

    // Function to test email uniqueness (mockup, as backend would be needed for real check)
    async function testEmailUniqueness() {
        console.log("Testing email uniqueness...");

        const existingEmail = "test@example.com"; // Use an email known to be in use
        await page.type('#email', existingEmail);
        await page.click('#signup-form-student .submit-btn');

        const emailUniqueError = await page.evaluate(() => {
            const errorMessage = document.querySelector('.email-error');
            return errorMessage && errorMessage.textContent.includes('already in use');
        });
        if (emailUniqueError) {
            console.log("Email uniqueness validation passed.");
        } else {
            console.log("Email uniqueness validation failed.");
        }

        await page.evaluate(() => document.getElementById('email').value = ''); // Reset field
    }

    // Run all tests
    await testXSSProtection();
    await testPasswordConfirmation();
    await testEmailUniqueness();

    await browser.close();
})();
