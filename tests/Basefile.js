// basefile.js
import { chromium } from 'playwright';

export class Basefile {  // Class name in PascalCase

  constructor() {
    this.browser = null;
    this.page = null;
    this.TestURL = 'http://t2.silversurfer.ignitiongroup.co.za/Auth'
    this.ProdURL = 'https://silversurfer.ignitiongroup.co.za/Auth'
    this.loginFormUserName = '#txtUsername';
    this.loginFormPassword = '#txtPassword';
    this.signInButton = '#btnSignIn';
    this.homepageText = '//h3[@class="page-header"]';
    this.loginUsername = 'Developer';
    this.password = 'Pr0m3th3us!';
  }

  // Method to launch browser and page
  async launchBrowser() {
    console.log('Launching the browser...');
    this.browser = await chromium.launch();  // You can pass options to control headless mode
    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: 1366, height: 768 });
  }

  // Method to perform login
  async login() {
    console.log('Logging in...');
    await this.page.goto(this.TestURL);
    await this.page.fill(this.loginFormUserName, this.loginUsername);
    await this.page.fill(this.loginFormPassword, this.password);
    await this.page.click(this.signInButton);
    await this.page.waitForSelector(this.homepageText, { state: 'attached' });
    console.log('Logged in successfully');
  }

  // Method to close the browser
  async closeBrowser() {
    console.log('Closing the browser...');
    await this.browser.close();
  }
}
