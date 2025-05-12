import { expect } from '@playwright/test';
import { CreateOrder } from './CreateOrder';
import { Basefile } from './Basefile';

export class SearchOrder {

    constructor(basefile) {
        // Accepting basefile as parameter and using it to get the page
        this.page = basefile.page;
        this.orderref = ''
        this.creatorder = ''
        this.CustomerCareTab = '//ul[@id="side-menu"]//a[contains(text(),"Customer Care")]'
        this.SearchCustomer = '//ul[@id="side-menu"]//a[contains(text(),"Search Customer")]'
        this.searchbox = '#customer-search-input'
        this.searchcriteriaRadioButton = '#OrderRef'
        this.searchbutton = '#submit-search'
        this.searchResults = '#customer-search-container'
        this.searchResultViewButton = '//a[@class="item-view btn btn-success btn-sm"][contains(text(),"View")]'
        this.OrdersTab = '//li[@id="ordersTab"]/a'
        this.providersInfo = '//th/label[contains(text(),"Provider")]/ancestor::tr//following-sibling::tr//td[@data-bind="text: Provider"]'
        this.allActionDropdowns = '//th/label[contains(text(),"Actions")]/ancestor::tr//following-sibling::tr//div/a[@class="dropdown btn btn-default"]'
        this.cancelOrderDropdowmButton = '//div[@class="dropdown open"]//button[contains(text(),"Cancel")]'
        this.cancelOrderItemContainer = '#cancelItemHolder'
        this.cancelReasonDropDown = '#ID'
        this.defaultCancelReasonDropDownValue = 'undefined'
        this.CancelReasonDropDownValue = 'All'
        this.cancelReasonDetailDropDown = '#cancelReasonDetailList'
        this.CancelReasonDetialValue = 'Test Order'
        this.cancelCommentTextField = '#comment'
        this.cancelOrderButton = '//button[@type="submit"][contains(text(),"Cancel Order")]'
        this.cancelCommenttext = 'Test Order'
        this.orderCancelledalertmessage = '//div[@id="toast-container"]//div[@class="toast-message"][contains(text(),"Order Cancelled Successfully")]'
        this.expectedAlertMessageCancelOrder = 'Order Cancelled Successfully'
        this.Orderstatuses = '//th/label[contains(text(),"Status")]/ancestor::tr//following-sibling::tr//td[@data-bind="text: Status"]'
        this.orderstatusvalue = ''
        this.progressIndicator = '#progress-indicator'
        this.actualMessage = ''
        this.currentOrderStatus = ''

    }

    async searchingOrder(orderrefvalue) {

        this.orderref = orderrefvalue
        await this.page.reload({ waitUntil: 'networkidle' });
        await this.page.waitForTimeout(2000);
        await this.page.click(this.CustomerCareTab)
        await this.page.click(this.SearchCustomer)
        await this.page.waitForSelector(this.searchbox, { state: 'attached', timeout: 5000 })
        await this.page.click(this.searchbox)
        await this.page.waitForTimeout(1500)
        await this.page.fill(this.searchbox, this.orderref)
        await this.page.waitForTimeout(1000)
        await this.page.click(this.searchcriteriaRadioButton)
        await this.page.waitForTimeout(1000)
        await this.page.click(this.searchbutton)
        await this.page.waitForTimeout(1000)
        await this.page.waitForSelector(this.searchResults, { state: 'attached' })
        await this.page.waitForTimeout(1000)
        await this.page.click(this.searchResultViewButton)
        await this.page.waitForSelector(this.OrdersTab, { state: 'attached', timeout: 5000 })
        // await this.page.pause()
        await this.page.waitForTimeout(3000)
        await this.page.click(this.OrdersTab)
        // await this.page.waitForTimeout(3000)
        await this.page.waitForSelector(this.allActionDropdowns, { state: 'attached', timeout: 5000 })
        console.log('Order Successfully Created on Silver Surfer');

    }
    
    async fetchOrderStatus() {
        // Set more generous timeouts
        const STATUS_UPDATE_TIMEOUT = 90000; // 60 seconds total
        const POLL_INTERVAL = 20000; // Check every 10 seconds

        await this.page.waitForSelector(this.Orderstatuses, { state: 'visible' });
        await this.page.waitForSelector(this.providersInfo, { state: 'visible' });

        const currentOrderstatuses = await this.page.locator(this.Orderstatuses).all();
        const providernames = await this.page.locator(this.providersInfo).all();

        if (currentOrderstatuses.length === 0 || providernames.length === 0) {
            throw new Error("No order statuses or providers found!");
        }

        // Get initial statuses
        let currentStatus = '';
        for (let i = 0; i < providernames.length; i++) {
            const provider = await providernames[i].textContent();
            currentStatus = await currentOrderstatuses[i].textContent();
            console.log('Initial Status - Provider:', provider?.trim(), '| Status:', currentStatus?.trim());
        }

        console.log('Polling for status update...');

        try {
            await expect.poll(async () => {

                await this.page.reload({ waitUntil: 'networkidle' });
                await this.page.waitForSelector(this.OrdersTab, { state: 'attached' });
                await this.page.click(this.OrdersTab);

                const updatedStatuses = await this.page.locator(this.Orderstatuses).allTextContents();
                console.log('Current statuses:', updatedStatuses);
                const unwantedStatuses = ['Sale : Pending', 'AVS : Passed', 'Fraud : Passed', 'Billing : Pending']

                // Return true if no pending status found
                return !updatedStatuses.some(status =>
                    unwantedStatuses.some(unwanted => status.includes(unwanted))
                );
            }, {
                timeout: STATUS_UPDATE_TIMEOUT,
                intervals: [POLL_INTERVAL],
                message: 'Order status did not update from Pending state'
            }).toBeTruthy();
        } catch (error) {
            console.error('Status update check failed:', error.message);
            // Add recovery logic or final verification here
            await this.finalStatusVerification();
            throw error; // Re-throw if you want the test to fail
        }

    }

    async finalStatusVerification() {
        await this.page.reload({ waitUntil: 'networkidle' });
        await this.page.waitForSelector(this.OrdersTab, { state: 'attached' });
        await this.page.click(this.OrdersTab);

        const currentStatuses = await this.page.locator(this.Orderstatuses).allTextContents();
        const providers = await this.page.locator(this.providersInfo).allTextContents();

        providers.forEach((provider, i) => {
            console.log('Final Status - Provider:', provider.trim(), '| Status:', currentStatuses[i]?.trim());
        });
    }

    async cancelOrdersFromSS() {

        const STATUS_UPDATE_TIMEOUT = 60000; // 60 seconds total
        const POLL_INTERVAL = 15000; // Check every 10 seconds
        await this.page.waitForTimeout(2000);
        await this.page.waitForSelector(this.allActionDropdowns, { state: 'visible' });
        const actiondropdown = await this.page.locator(this.allActionDropdowns).all();

        if (actiondropdown.length === 0) {
            throw new Error("No Action Dropdown Found!");
        }
        console.log('Actiondropdwon length is ', actiondropdown.length)

        for (let i = 0; i < actiondropdown.length; i++) {
            await actiondropdown[i].click();  // Use Locator.click() instead of page.click()
            await this.page.waitForTimeout(1000);
            await this.page.click(this.cancelOrderDropdowmButton);
            await this.page.waitForSelector(this.cancelOrderItemContainer, { state: 'attached' });
            await this.page.click(this.cancelReasonDropDown);
            const cancelreason = this.page.locator(this.cancelReasonDropDown);
            await cancelreason.selectOption({ label: this.CancelReasonDropDownValue });
            await this.page.waitForTimeout(1000);
            // await this.page.pause()
            await this.page.click(this.cancelReasonDetailDropDown);
            const cancelReason = this.page.locator(this.cancelReasonDetailDropDown);
            await cancelReason.selectOption({ label: this.CancelReasonDetialValue });
            await this.page.waitForTimeout(1500);
            await this.page.click(this.cancelCommentTextField);
            await this.page.fill(this.cancelCommentTextField, this.cancelCommenttext);
            await this.page.waitForTimeout(1500);
            await this.page.click(this.cancelOrderButton);
            await this.page.waitForTimeout(1500)
            const ProgressindicatorisVisible = await this.page.locator(this.progressIndicator)
            if (ProgressindicatorisVisible.isVisible()) {
                console.log('Progress indicator appeared');
                await this.page.waitForSelector(this.progressIndicator, { state: 'hidden' });
                await this.page.waitForSelector(this.cancelOrderItemContainer, { state: 'hidden' });
                console.log('cancelOrderItemContainer hidden')
                await this.page.waitForTimeout(2000);
                // 1. Wait for the element to be visible
                await this.page.waitForSelector(this.orderCancelledalertmessage, { state: 'visible' });
                console.log('orderCancelledalertmessage visible')
                this.actualMessage = await this.page.locator(this.orderCancelledalertmessage).textContent()
            }
            else {
                console.log('Progress indicator not appeared');
                await this.page.waitForSelector(this.cancelOrderItemContainer, { state: 'hidden' });
                console.log('cancelOrderItemContainer hidden')
                await this.page.waitForTimeout(2000);
                // 1. Wait for the element to be visible
                await this.page.waitForSelector(this.orderCancelledalertmessage, { state: 'visible' });
                console.log('orderCancelledalertmessage visible')
                this.actualMessage = await this.page.locator(this.orderCancelledalertmessage).textContent()
            }
            console.log('Order cancelled alert message is :', this.actualMessage)

            // 3. Verify the message matches expected
            if (this.actualMessage.trim() !== this.expectedAlertMessageCancelOrder.trim()) {
                throw new Error(`Message does not match! Expected: "${this.expectedAlertMessageCancelOrder}", Actual: "${this.actualMessage}"`);
            }

        }

        try {
            await expect.poll(async () => {
                console.log('Polling for status update after cancellation...');
                await this.page.reload({ waitUntil: 'networkidle' });
                await this.page.waitForSelector(this.OrdersTab, { state: 'attached' });
                await this.page.click(this.OrdersTab);

                const updatedStatuses = await this.page.locator(this.Orderstatuses).allTextContents();
                console.log('Current statuses:', updatedStatuses);
                const wantedStatuses = ['Cancelled']

                // Return true if no pending status found
                return updatedStatuses.some(status =>
                    wantedStatuses.some(wanted => status.includes(wanted))
                );
            }, {
                timeout: STATUS_UPDATE_TIMEOUT,
                intervals: [POLL_INTERVAL],
                message: 'Order status did not update from Pending state'
            }).toBeTruthy();

            await this.finalStatusVerification(); // ✅ Assuming this is defined
            console.log('All orders have been cancelled.');
        } catch (error) {
            console.error('Status update check failed:', error.message);
            // Add recovery logic or final verification here
            await this.finalStatusVerification();
            throw error; // Re-throw if you want the test to fail
        }

    }

}