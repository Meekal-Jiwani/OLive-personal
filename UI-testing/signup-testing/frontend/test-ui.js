const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // Navigate to the sign-up page
    await page.goto('http://localhost:3000/signup');

    // **Test 1: Successful Sign-up with Valid Data**
    await page.type('#username', 'uniqueuser');
    await page.type('#email', 'uniqueuser@example.com');
    await page.type('#password', 'Password123!');
    await page.type('#confirmPassword', 'Password123!');
    await page.click('#submit');
    try {
        await page.waitForSelector('.success-message', { timeout: 5000 });
        console.log('Sign-up successful');
    } catch {
        console.log('Sign-up failed or success message not found.');
    }

    // Reload the page for a new test case
    await page.reload();

    // **Test 2: Missing Required Fields**
    await page.click('#submit');
    try {
        await page.waitForSelector('.error-message.required', { timeout: 2000 });
        console.log('Error message displayed for missing required fields');
    } catch {
        console.log('Missing field error message not displayed.');
    }
    await page.reload();

    // **Test 3: Invalid Email Format**
    await page.type('#username', 'testuser');
    await page.type('#email', 'invalid-email');
    await page.type('#password', 'Password123!');
    await page.type('#confirmPassword', 'Password123!');
    await page.click('#submit');
    try {
        await page.waitForSelector('.error-message.invalid-email', { timeout: 2000 });
        console.log('Error message displayed for invalid email format');
    } catch {
        console.log('Invalid email format error message not displayed.');
    }
    await page.reload();

    // **Test 4: Password Mismatch**
    await page.type('#username', 'anotheruser');
    await page.type('#email', 'anotheruser@example.com');
    await page.type('#password', 'Password123!');
    await page.type('#confirmPassword', 'Password1234'); // Mismatch
    await page.click('#submit');
    try {
        await page.waitForSelector('.error-message.password-mismatch', { timeout: 2000 });
        console.log('Error message displayed for password mismatch');
    } catch {
        console.log('Password mismatch error message not displayed.');
    }
    await page.reload();

    // **Test 5: Duplicate Email/Username**
    await page.type('#username', 'uniqueuser'); // Same as used in Test 1
    await page.type('#email', 'uniqueuser@example.com'); // Duplicate email
    await page.type('#password', 'Password123!');
    await page.type('#confirmPassword', 'Password123!');
    await page.click('#submit');
    try {
        await page.waitForSelector('.error-message.duplicate', { timeout: 2000 });
        console.log('Error message displayed for duplicate email/username');
    } catch {
        console.log('Duplicate account error message not displayed.');
    }

    // Close the browser
    await browser.close();
})();
