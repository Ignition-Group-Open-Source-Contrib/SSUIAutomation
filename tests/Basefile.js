// basefile.js
import { chromium } from 'playwright';

export class Basefile {

  constructor() {
    this.browser = null;
    this.page = null;
    this.loginFormUserName = '#txtUsername';
    this.loginFormPassword = '#txtPassword';
    this.signInButton = '#btnSignIn';
    this.homepageText = '//h3[@class="page-header"]';
    this.loginUsername = 'Developer';
    this.password = 'Pr0m3th3us!';
  }

  // Method to launch browser and page
  async launchBrowser() {
    console.log('Browser Launched Successfullyy...');
    this.browser = await chromium.launch(); 
    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: 1350, height: 750 });
  }

  // Method to perform login
  async login() {
    console.log('Logging in...');
    await this.page.goto('/AUTH');
    await this.page.fill(this.loginFormUserName, this.loginUsername);
    await this.page.fill(this.loginFormPassword, this.password);
    await this.page.click(this.signInButton);
    await this.page.waitForSelector(this.homepageText, { state: 'attached' });
    console.log('Logged in successfully');
  }

  // Method to close the browser
  async closeBrowser() {
    console.log('Browser Closed :) ...');
    await this.browser.close();
  }
}
