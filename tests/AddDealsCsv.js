import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';

export class AddDealsCsv {
    
    constructor(page) {
        this.page = page;
        this.DealDetailsTab = '#dealsTab';
        this.SelectProviderType = '#ddlDealProvider';
        this.Providers = '#ddlVasProvider';
        this.deals = '#ddlDeals';
        this.ProviderSpecificInfoBody = '#providerModalBody';
        this.CustomerCity = '//div//b[contains(text(),"Customer City")]';
        this.SelectCustomerCity = '#provinceSelection';
        this.ProviderSpecificMsisdn = '#msisdn';
        this.ProviderSpecificInfoFooter = '//div[@id="providerModalBody"]//div[@class="modal-footer"]';
        this.ProviderSpecificInfoSaveButton = '#SvChanges';
        this.FICA_Compliance = '#ficaQuestionTab';
        this.FICADropDown = '#ficaClient';
        this.dealsData;
    }
    
    async readDealsData() {
        const csvPath = path.join(process.cwd(), 'tests', 'deals_data.csv');
        
        if (!fs.existsSync(csvPath)) {
            throw new Error(`CSV file not found at: ${csvPath}`);
        }

        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }

    async readBankingData() {
        const csvPath = path.join(process.cwd(), 'tests', 'banking_data.csv');
        
        if (!fs.existsSync(csvPath)) {
            throw new Error(`CSV file not found at: ${csvPath}`);
        }

        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }
    
    async dealsDetails() {
        this.dealsData = await this.readDealsData();
        
        for (const deal of this.dealsData) {
            await this.page.waitForTimeout(1500);
            await this.page.click(this.SelectProviderType);
            await this.page.selectOption(this.SelectProviderType, { label: deal.providerType });
            await this.page.waitForTimeout(1000);
        
            // Select provider
            await this.page.click(this.Providers);
            await this.page.selectOption(this.Providers, { label: deal.providerName });
            await this.page.waitForTimeout(2000);
        
            // Select deal
            await this.page.click(this.deals);
            await this.page.waitForTimeout(2000);
            await this.page.selectOption(this.deals, { label: deal.dealName });
            console.log(`Selected ${deal.providerType} -> ${deal.providerName} -> ${deal.dealName}`);
            await this.page.waitForTimeout(2500);
            
            // Handle provider specific info
            const providerspecificinfo = await this.page.locator(this.ProviderSpecificInfoBody);
            const isVisible = await providerspecificinfo.isVisible();
            
            if(isVisible) {
                const custcity = this.page.locator(this.CustomerCity);
                const custcityisVisible = await custcity.isVisible();
                
                if(custcityisVisible) {
                    const CustomerCityDropdown = this.page.locator(this.SelectCustomerCity);
                    await CustomerCityDropdown.click();
                    await CustomerCityDropdown.selectOption({label: deal.customerCity || 'Durban'});
                    this.page.click(this.ProviderSpecificInfoFooter);
                    await this.page.waitForTimeout(1000);
                }
                
                const msisdnField = this.page.locator(this.ProviderSpecificMsisdn);
                const msisdnFieldisVisible = await msisdnField.isVisible();
                
                if(msisdnFieldisVisible) {
                    this.page.fill(this.ProviderSpecificMsisdn, deal.msisdn || '0678678767');
                    await this.page.waitForTimeout(1000);
                }
                
                this.page.click(this.ProviderSpecificInfoFooter);
                this.page.click(this.ProviderSpecificInfoSaveButton);
                this.page.waitForTimeout(2000);
            }

            if(deal.providerName === 'Driven' || deal.providerType === 'Fais') {
                const FICAisVisible = await this.page.isVisible(this.FICA_Compliance);

                if(FICAisVisible) {
                    await this.page.click(this.FICA_Compliance);
                    await this.page.waitForTimeout(1000);
                    const FICADropDownValue = await this.page.locator(this.FICADropDown);
                    await FICADropDownValue.selectOption({label:'No'});
                    await this.page.waitForTimeout(1000);
                    await this.page.click(this.DealDetailsTab);
                }
            }
        }
    }
}