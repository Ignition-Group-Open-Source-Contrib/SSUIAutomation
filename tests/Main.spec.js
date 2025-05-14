import { test, expect } from '@playwright/test';
import { Basefile } from './Basefile';
import { CreateOrder } from './CreateOrder';
import { SearchOrder } from './SearchOrder';


test.describe.configure({ mode: 'serial' });
test.describe('Test Suite with beforeAll Hook', () => {
  let basefile;
  let createOrder;
  let searchOrder;
  let orderrefvalue;

  test.beforeAll(async () => {
    console.log('Launching the browser in non-headless mode');

    basefile = new Basefile();  // Create an instance of the Basefile class
    await basefile.launchBrowser();  // Launch the browser
    await basefile.login();  // Perform login

    createOrder = new CreateOrder(basefile);  // Initialize CreateOrder after the page is ready
    searchOrder = new SearchOrder(basefile);  // Initialize searchorder after the page is ready
  });

  test('\nTest 1 - Navigate till Sales Page and Get title', async ({ }, testInfo) => {

    console.log('\nRunning Test 1 - Navigate till Sales Page and Get title\n');
    console.log("Current env URL :", testInfo.project.use.baseURL); // → "https://uat.example.com"
    console.log('Page title is :', await basefile.page.title());
    expect(await basefile.page.title()).toEqual('Silver Surfer');
    await createOrder.StartSelling();  // Calling StartSelling after CreateOrder is initialized
    console.log('Test 1 completed');

  });

  test('\nTest 2 - Placing Order on Silver Surfer Portal...', async ({ }, testInfo) => {

    console.log('\nRunning Test 2 - Placing Order on Silver Surfer Portal...\n');
    console.log(`Started interacting with Customer Details Tab..`)
    await createOrder.CustomerDetails();
    await testInfo.attach('Customer Details Page', {
      body: await basefile.page.screenshot(),
      contentType: 'image/png'
    });
    console.log(`Started interacting with Customer Address Tab..`)
    await createOrder.CustomerAddress();
    await testInfo.attach('Customer Address Page', {
      body: await basefile.page.screenshot(),
      contentType: 'image/png'
    });
    console.log(`Started interacting with Deals Details Tab..`)
    await createOrder.DealsDeatils();
    orderrefvalue = await createOrder.AddBankDetails();

    console.log('Test 2 completed');

  })

  test('\nTest 3 - Searching Order on Silver Surfer..', async ({ }, testInfo) => {

    console.log('\nRunning Test 3 - Searching Order on Silver Surfer..\n');
    console.log(`Started searching for orders on Silver Surfer..`)
    await searchOrder.searchingOrder(orderrefvalue)
    console.log(`Started fetching the order status of all orders...`)
    await searchOrder.fetchOrderStatus()
    await testInfo.attach('Final OrderStatues Before Cancellation', {
      body: await basefile.page.screenshot(),
      contentType: 'image/png'
    })

    console.log('Test 3 completed');
    console.log('Will Cancellation happen..?', testInfo.project.use.RUN_CANCEL);
  })

  test('\nTest 4 - Cancel Order on Silver Surfer on user demand ..', async ({ }, testInfo) => {
    const shouldCancel = testInfo.project.use.RUN_CANCEL;
    if (shouldCancel) {
      console.log('\nRunning Test 4 - Cancel Order on Silver Surfer on user demand ..\n');
      console.log(`Executing process for cancellation of all orders on ${testInfo.project.name} env`);
      await searchOrder.cancelOrdersFromSS();
      await testInfo.attach('Final OrderStatues After Cancellation', {
        body: await basefile.page.screenshot(),
        contentType: 'image/png'
      });
    } else {
      console.log(`Skipping cancellation on [${testInfo.project.name}] env`);
    }
    console.log('Test 4 completed');

  })


  test.afterAll(async () => {

    console.log('Closing the browser after all tests');
    await basefile.closeBrowser();  // Close browser (shared resource)

  });

});
