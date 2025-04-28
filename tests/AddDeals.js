export class AddDeals {
    
    constructor(page) {
        this.page = page;
        this.DealDetailsTab = '#dealsTab'
        this.SelectProviderType = '#ddlDealProvider'
        this.Providers = '#ddlVasProvider'
        this.deals = '#ddlDeals'
        this.ProviderSpecificInfoBody = '#providerModalBody'
        this.CustomerCity = '//div//b[contains(text(),"Customer City")]'
        this.SelectCustomerCity = '#provinceSelection'
        this.ProviderSpecificMsisdn = '#msisdn'
        this.ProvoderSpecificMsisdnValue = '0678678767'
        this.ProviderSpecificInfoFooter = '//div[@id="providerModalBody"]//div[@class="modal-footer"]'
        this.ProviderSpecificInfoSaveButton = '#SvChanges'
        this.FICA_Compliance = '#ficaQuestionTab'
        this.FICADropDown = '#ficaClient'
    }
    
    async dealsDetails() {
        const providerTypes = ['VAS','Telco'];
        const providerNames = {
    //      'Type1': ['ProviderA', 'ProviderB'],  // Providers for Type1
    //      'Type2': ['ProviderC', 'ProviderD'],  // Providers for Type2
            // 'VAS': ['FMTLocal'],
            // 'VAS': ['Peeq'],
            'VAS' : ['Driven'],
            'Telco': ['On Air'],
        };
        const dealNames = {
    //      'ProviderA': ['Deal1', 'Deal2'],  // Deals for ProviderA
    //      'ProviderB': ['Deal3', 'Deal4'],  // Deals for ProviderB
            // 'FMTLocal': ['FMTLocal Deal'],
            // 'Peeq': ['MagZone Zinio @ R85'],
            // 'Vision Movies': ['Vision @ R99'],
            'Driven' : ['Driven @ R139'],
            'On Air': ['On Air Testing Deal']
        };

        for (const providerType of providerTypes) {
            const providerTypeSelector = this.SelectProviderType;
            await this.page.waitForTimeout(2500);
            await this.page.click(providerTypeSelector);
            await this.page.selectOption(providerTypeSelector, { label: providerType });
            await this.page.waitForTimeout(1000);
        
            // Iterate through all providers for the current provider type
            for (const providerName of providerNames[providerType]) {
                const providerNameSelector = this.Providers;
                await this.page.click(providerNameSelector);
                await this.page.selectOption(providerNameSelector, { label: providerName });
                await this.page.waitForTimeout(2000);
        
                // Iterate through all deals for the current provider
                for (const dealName of dealNames[providerName]) {
                    const dealNameSelector = this.deals;
                    await this.page.click(dealNameSelector);
                    await this.page.waitForTimeout(2000);
                    await this.page.selectOption(dealNameSelector, { label: dealName });
                    console.log(`Selected ${providerType} -> ${providerName} -> ${dealName}`);
                    await this.page.waitForTimeout(2500);
                    // await this.page.pause()
                     const providerspecificinfo = await this.page.locator(this.ProviderSpecificInfoBody)
                    const isVisible = await providerspecificinfo.isVisible()
                    if(isVisible){
                        const custcity = this.page.locator(this.CustomerCity)
                        const custcityisVisible = await custcity.isVisible()
                        if(custcityisVisible){
                            const CustomerCityDropdown = this.page.locator(this.SelectCustomerCity)
                            await CustomerCityDropdown.click()
                            await CustomerCityDropdown.selectOption({label:'Durban'})
                            this.page.click(this.ProviderSpecificInfoFooter)
                            await this.page.waitForTimeout(1000)
                        }
                        // await this.page.pause()
                        const msisdnField = this.page.locator(this.ProviderSpecificMsisdn)
                        const msisdnFieldisVisible = await msisdnField.isVisible()
                        if(msisdnFieldisVisible){
                            this.page.fill(this.ProviderSpecificMsisdn,this.ProvoderSpecificMsisdnValue)
                            await this.page.waitForTimeout(1000)
                        }
                        this.page.click(this.ProviderSpecificInfoFooter)
                        this.page.click(this.ProviderSpecificInfoSaveButton)
                        this.page.waitForTimeout(2000)
                    }

                    if(providerName == 'Driven' || providerType == 'Fais' ){
                        const FICAisVisible =  await this.page.isVisible(this.FICA_Compliance)

                        if(FICAisVisible){
                            await this.page.click(this.FICA_Compliance)
                            await this.page.waitForTimeout(1000)
                            const FICADropDownValue = await this.page.locator(this.FICADropDown)
                            await FICADropDownValue.selectOption({label:'No'})
                            await this.page.waitForTimeout(1000)
                            await this.page.click(this.DealDetailsTab)
                        }
                    }
                }
            }
        }
    }
}
