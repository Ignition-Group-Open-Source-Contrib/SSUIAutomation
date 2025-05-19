import path from 'path';
import fs from 'fs';
import XLSX from 'xlsx';
import csv from 'csv-parser';
import { expect } from '@playwright/test';

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
        this.dealsData = [];
        this.error = [];
        this.dataFilePath = process.env.TEST_DATA_FILE || 'tests/Deals&Banking_data.xlsx'; // Default fallback

    }

    async readDealsData() {
        const filePath = path.join(process.cwd(), this.dataFilePath);

        if (!fs.existsSync(filePath)) {
            throw new Error(`Excel file not found at: ${filePath}`);
        }

        const workbook = XLSX.readFile(filePath);
        const dealsSheet = workbook.Sheets['Deals_data'];

        if (!dealsSheet) {
            throw new Error('Deals_data sheet not found in Excel file');
        }

        return XLSX.utils.sheet_to_json(dealsSheet);
    }

    async readBankingData() {
        const filePath = path.join(process.cwd(), this.dataFilePath);

        if (!fs.existsSync(filePath)) {
            throw new Error(`Excel file not found at: ${filePath}`);
        }

        const workbook = XLSX.readFile(filePath);
        const bankingSheet = workbook.Sheets['Banking_Details'];

        if (!bankingSheet) {
            throw new Error('Banking_Details sheet not found in Excel file');
        }

        return XLSX.utils.sheet_to_json(bankingSheet);
    }

    async dealsDetails() {
        this.dealsData = await this.readDealsData();

        for (let i = 0; i < this.dealsData.length; i++) {
            const deal = this.dealsData[i]
            try {
                // Started working with ProviderType Data...
                const dropdown = this.page.locator(this.SelectProviderType);
                // 1. First verify the dropdown exists
                await expect(dropdown).toBeVisible();
                await dropdown.click();
                // 2. Check if option exists
                const optionExists = await dropdown.locator(`option:text-is("${deal.providerType}")`).count() > 0;
                if (optionExists) {
                    //Safe selection if option exists
                    await dropdown.selectOption({ label: deal.providerType });
                    // console.log(`Selected providertype: ${deal.providerType}`);
                } else {
                    //Graceful handling if missing
                    console.warn(`Provider "${deal.providerType}" not found in dropdown`);
                    //Fail the test with clear message
                    throw new Error(`Required provider "${deal.providerType}" missing in dropdown`);
                }

                // Started working with Provider Data...
                const providerDropdown = this.page.locator(this.Providers);
                // 1. First verify the dropdown exists
                await expect(providerDropdown).toBeVisible();
                await providerDropdown.click()
                // 2. Check if option exists
                const providerNameOptionExists = await providerDropdown.locator(`option:text-is("${deal.providerName}")`).count() > 0;
                if (providerNameOptionExists) {
                    // Safe selection if option exists
                    await providerDropdown.selectOption({ label: deal.providerName });
                    // console.log(`Selected provider: ${deal.providerName}`);
                } else {
                    // Graceful handling if missing
                    console.warn(`Provider "${deal.providerName}" not found in dropdown`);
                    // - Fail the test with clear message
                    throw new Error(`Required provider "${deal.providerName}" missing in dropdown`);
                }

                // Working with deals data
                const dealDropdown = this.page.locator(this.deals);
                // 1. First verify the dropdown exists
                await expect(dealDropdown).toBeVisible();
                await dealDropdown.click();
                // 2. Check if option exists
                const DealOptinExists = await dealDropdown.locator(`option:text-is("${deal.dealName}")`).count() > 0;
                if (DealOptinExists) {
                    // Safe selection if option exists
                    await dealDropdown.selectOption({ label: deal.dealName });
                    // console.log(`Selected deal : ${deal.dealName}`);
                    this.page.waitForTimeout(1000)
                } else {
                    //Graceful handling if missing
                    console.warn(`Deal "${deal.dealName}" not found in dropdown`);
                    // - Fail the test with clear message
                    throw new Error(`Required deal "${deal.dealName}" missing in dropdown`);
                }
                console.log(`File row ${i + 1} Data Selected :  ${deal.providerType} -> ${deal.providerName} -> ${deal.dealName}`);
                await this.page.waitForTimeout(1500);

                // Handle provider specific info
                const providerspecificinfo = await this.page.locator(this.ProviderSpecificInfoBody);
                const isVisible = await providerspecificinfo.isVisible();

                if (isVisible) {
                    const custcity = this.page.locator(this.CustomerCity);
                    const custcityisVisible = await custcity.isVisible();

                    if (custcityisVisible) {
                        const CustomerCityDropdown = this.page.locator(this.SelectCustomerCity);
                        await CustomerCityDropdown.click();
                        await CustomerCityDropdown.selectOption({ label: deal.customerCity || 'Durban' });
                        await this.page.click(this.ProviderSpecificInfoFooter);
                        await this.page.waitForTimeout(1000);
                    }

                    const msisdnField = this.page.locator(this.ProviderSpecificMsisdn);
                    const msisdnFieldisVisible = await msisdnField.isVisible();

                    if (msisdnFieldisVisible) {
                        await this.page.fill(this.ProviderSpecificMsisdn, deal.msisdn || '0678678767');
                        await this.page.waitForTimeout(1000);
                    }

                    await this.page.click(this.ProviderSpecificInfoFooter);
                    await this.page.click(this.ProviderSpecificInfoSaveButton);
                    await this.page.waitForTimeout(2000);
                }

                if (deal.providerName === 'Driven' || deal.providerType === 'Fais') {
                    const FICAisVisible = await this.page.isVisible(this.FICA_Compliance);

                    if (FICAisVisible) {
                        await this.page.click(this.FICA_Compliance);
                        await this.page.waitForTimeout(1000);
                        const FICADropDownValue = await this.page.locator(this.FICADropDown);
                        await FICADropDownValue.selectOption({ label: 'No' });
                        await this.page.waitForTimeout(1000);
                        await this.page.click(this.DealDetailsTab);
                    }
                }
            } catch (error) {
                console.error(`Error processing deal ${deal.dealName}:`, error);
                this.error.push({ deal, error });
                // Continue with next deal even if one fails
                continue;
            }
        }

        if (this.error.length > 0) {
            console.error('Failed deals:', this.error.map(e => e.deal.dealName));
            throw new Error(`${this.error.length} deals failed`);
        }
    }
}