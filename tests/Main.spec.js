import { test, expect } from '@playwright/test';
import { Basefile } from './Basefile';
import { CreateOrder } from './CreateOrder';
// import { AddDeals } from './AddDeals';
import { AddDealsCsv } from './AddDealsCsv';
import { SearchOrder } from './SearchOrder';

test.describe('Test Suite with beforeAll Hook', () => {
  let basefile;
  let createOrder;
  let searchOrder;
  let orderrefvalue;
  // let addDeals;  // Declare this variable

  test.beforeAll(async () => {
    console.log('Launching the browser in non-headless mode');

    basefile = new Basefile();  // Create an instance of the Basefile class
    await basefile.launchBrowser();  // Launch the browser
    await basefile.login();  // Perform login

    createOrder = new CreateOrder(basefile);  // Initialize CreateOrder after the page is ready
    searchOrder = new SearchOrder(basefile);  // Initialize searchorder after the page is ready
  });

  test('Test 1 - Navigate till Sales Page and Take Screen Shot', async () => {
    console.log('Running Test 1 - Get title and Take Screen Shot');

    console.log(await basefile.page.title());
    expect(await basefile.page.title()).toEqual('Silver Surfer');

    await createOrder.StartSelling();  // Call StartSelling after CreateOrder is initialized

    await basefile.page.screenshot({ path: 'ssHomepage-screenshot.png' });

    console.log('Test 1 completed');
  });

  test('Test 2 - Fill Customer Details', async () => {
    console.log('Running Test 2 - Fill Customer Details');

    await createOrder.CustomerDetails();
    await createOrder.CustomerAddress();
    await createOrder.DealsDeatils();
    orderrefvalue = await createOrder.AddBankDetails();
    await searchOrder.searchingOrder(orderrefvalue)
    await searchOrder.fetchOrderStatus()
    await searchOrder.cancelOrdersFromSS()
    
  })

  test.afterAll(async () => {
      console.log('Closing the browser after all tests');
      await basefile.closeBrowser();  // Close browser (shared resource)
  });

});
