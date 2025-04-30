import { expect } from '@playwright/test';
import { generateRandomID } from './RsaId.js';
// import { AddDeals } from './AddDeals';
import { AddDealsCsv } from './AddDealsCsv.js';

function generateRandomNumberString(length) {
  let randomString = '';

  for (let i = 0; i < length; i++) {
    randomString += Math.floor(Math.random() * 10);  // Generate a random digit (0-9)
  }
  return randomString;
}

function generateDynamicEmail() {
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;  // Random number between 1000 and 9999
  return `Automate_${randomNumber}@yopmail.com`;  // Using template literals
}

export class CreateOrder {
  constructor(basefile) {
    // Accepting basefile as parameter and using it to get the page
    this.page = basefile.page;
    this.SalesDropdown = '//a[@class="dropdown-toggle menuItems"][contains(text(),"Sales")]';
    this.StartSellingDropdown = '//li[@class="dropdown features open"]//a[text()="Start Selling"]';
    this.DialerReferField = '#DialerLeadReference'
    this.titledropdown = '//select[@id="customerTitles"]'
    this.LeadAuthOptIns = '//input[@class="opt-in"][@value="2"][contains(@name,"Lead Auth")]'
    this.SpotOptIns = '//input[@class="opt-in"][@value="2"][contains(@name,"Spot")]'
    this.firstnameField = '#CustomerName'
    this.firstname = 'Rohit'
    this.lastNameField = '#CustomerSurname'
    this.lastName = 'Automate'
    this.idNumberField = '#IdNumber'
    this.mobileNumberField = '#Contact1'
    this.mobileNumber = '0676544567'
    this.emailAddress = '#Contact4'
    this.CustomerAddressTab = '//a[contains(text(),"Customer Addresses")]'
    this.googleMap = '#googleMap'
    this.deliveryRadioButton = '#addDeliveredTo_2'
    this.checkDisclaimer = '#chkDisclaimer'
    this.MapEnterLocation = '#searchInputMain'
    this.MapSearchInput = '#searchInput'
    this.SaveAddressButton = '//input[@value="Save"]'
    this.ResidentialAddressRadioButoon = '#addType_2'
    this.sameAddresscheckbox = '#chkSameAsDelivery' 
    this.residenceType = '#residenceTypes'
    this.dateAddress = '#dateAtAddress'
    this.datepicker = '//a[@class="ui-state-default"][text()="1"]'
    this.dealDetailsTab = '//a[contains(text(),"Deal Details")]'
    this.cartBody = '#cart-body'
    this.campaignsDropdown = '#ddlCampaigns'
    this.BasketItem = '//div[@data-bind="text: dealDescription"]'
    this.AddBankDeatilsButton = '#add-bank-detail-btn'
    this.AccountHolderName = '//input[@name="AccHolder"]'
    this.banknameField = '#ddlBanks'
    this.bankname = 'BIDVEST BANK'
    this.bankBranchesField = '#ddlBranches'
    this.branchName = 'BIDVEST BANK (GENERIC)'
    this.accountNumberField = '//input[@name="AccNumber"]'
    this.accountTypes = '#ddlAccTypes'
    this.debitdays = '#ddlDebitDays'
    this.PrimaryMsisdnNumberField = '//input[@name="PrimaryMSISDN"]'
    this.validateBankDetailsButton = '//button[contains(text(),"Validate Bank Detail")]'
    this.ProceedBankButton = '//button[contains(text(),"Proceed")]'
    this.saveButton = '#saveOrder'
    this.progreeIndicator = '#progress-indicator'
    this.DebicheckPopUp = '//div[@class="modal-header"]//h4[contains(text(),"DEBICHECK")]'
    this.DebichecktableOrderReference = ''
    this.orderReferenceField = '#OrderReference'
    this.orderReferenceValue = '//td[contains(text(),"Test Lead Campaign")]/following-sibling::td[1]'
    this.addDeals;
    this.readBankingData = [];
  }

  async StartSelling() {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }

    // Wait for the Sales dropdown to be visible before clicking
    await this.page.waitForSelector(this.SalesDropdown, { state: 'visible' });
    console.log('Sales dropdown visibled')
    await this.page.click(this.SalesDropdown);
    console.log('Sales dropdown clicked')
    await this.page.waitForTimeout(2000);
    
    // Wait for Start Selling dropdown to be visible and then click
    await this.page.waitForSelector(this.StartSellingDropdown, { state: 'visible' });
    await this.page.click(this.StartSellingDropdown);
    await this.page.waitForTimeout(2000);
   
  }

  async CustomerDetails() {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    await this.page.fill(this.DialerReferField,'Rohit')
    await this.page.waitForTimeout(2000)
    await this.page.click(this.LeadAuthOptIns)
    await this.page.waitForTimeout(2000)
    await this.page.click(this.SpotOptIns)
    await this.page.waitForTimeout(2000)
    const dropdown = this.page.locator('#customerTitles')
    await dropdown.click()
    await dropdown.selectOption({ index: 2});
    await this.page.waitForTimeout(1000)
    await this.page.fill(this.firstnameField,this.firstname)
    await this.page.waitForTimeout(1000)
    await this.page.fill(this.lastNameField,this.lastName)
    await this.page.waitForTimeout(1000)
     
    const emailfield = generateDynamicEmail();
    const rsaID = generateRandomID();
    console.log("Generated RSA ID:", rsaID);  // Log the generated RSA ID
    if (!rsaID) {
      throw new Error("RSA ID generation failed. RSA ID is undefined or invalid.");
    }
    await this.page.fill(this.idNumberField, rsaID);
     
    await this.page.waitForTimeout(1000)
    await this.page.fill(this.mobileNumberField,this.mobileNumber)
     
    await this.page.waitForTimeout(1000)
    const emailfieldlocator = await this.page.locator(this.emailAddress)
     
    await this.page.waitForTimeout(1000)
    await emailfieldlocator.clear()
    await this.page.waitForTimeout(1000)
    await emailfieldlocator.fill(emailfield)
     
    await this.page.waitForTimeout(1000)
    await this.page.screenshot({ path: 'CustomerDetailsPage-screenshot.png' })
     
  }

  async CustomerAddress() {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
     
    const isElementVisible =  await this.page.isVisible(this.CustomerAddressTab)
    if(isElementVisible){
    await this.page.waitForSelector(this.CustomerAddressTab)
    await this.page.waitForTimeout(2000)
    await this.page.click(this.CustomerAddressTab)
    await this.page.waitForSelector(this.googleMap, {state : 'visible'})
    await this.page.waitForTimeout(1000)
    await this.page.click(this.deliveryRadioButton)
    await this.page.waitForTimeout(1000)
    await this.page.click(this.checkDisclaimer)
    await this.page.waitForTimeout(1000)
    await this.page.fill(this.MapEnterLocation,'2')
    await this.page.waitForTimeout(1000)
    await this.page.click(this.MapSearchInput)
    await this.page.waitForTimeout(1500)
    await this.page.keyboard.press('ArrowDown')
    await this.page.waitForTimeout(1500)
    await this.page.keyboard.press('Enter')
    await this.page.waitForTimeout(1500)
    await this.page.click(this.SaveAddressButton)
    await this.page.waitForTimeout(1000)
    await this.page.click(this.ResidentialAddressRadioButoon)
    await this.page.waitForTimeout(1000)
    await this.page.click(this.sameAddresscheckbox)
    await this.page.waitForTimeout(1000)
    const residenceType = await this.page.locator(this.residenceType)
    await this.page.waitForTimeout(1000)
    residenceType.selectOption({index:1})
    await this.page.waitForTimeout(1000)
    await this.page.click(this.dateAddress)
    await this.page.waitForTimeout(1000)
    await this.page.click(this.datepicker)
    await this.page.waitForTimeout(1000)
    await this.page.click(this.SaveAddressButton)
     
    await this.page.waitForTimeout(1000)
    }
    else{
      console.log('Customer Address are not required.')
    }
  }

  async DealsDeatils(){
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
     
    this.page.waitForSelector(this.dealDetailsTab)
    await this.page.click(this.dealDetailsTab)
     
    this.page.waitForTimeout(2000)
    // this.page.pause()
    await this.page.waitForSelector(this.cartBody)
    const campaignDropdown = this.page.locator(this.campaignsDropdown)
    await campaignDropdown.click()
    await campaignDropdown.selectOption({label:'Test Lead Campaign'})
    await this.page.waitForTimeout(2000)
    this.addDeals = new AddDealsCsv(this.page);  // Create an instance of AddDeals
    await this.addDeals.dealsDetails();  // Call the dealsDetails method properly
  
  }

  async AddBankDetails(){
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
     
    await this.page.waitForSelector(this.AddBankDeatilsButton)
    await this.page.click(this.AddBankDeatilsButton)
    this.page.waitForTimeout(2000)

    this.readBankingData = await this.addDeals.readBankingData();

    for(const bankdetail of this.readBankingData) {
      await this.page.fill(this.AccountHolderName,bankdetail.AccountHolderName)
      await this.page.waitForTimeout(1000)
      const bankname = this.page.locator(this.banknameField)
      await bankname.click()
      await this.page.waitForTimeout(1000)
      await bankname.selectOption({label:bankdetail.BankName})
      const branches = this.page.locator(this.bankBranchesField)
      await branches.click()
      await this.page.waitForTimeout(1000)
      await branches.selectOption({label:bankdetail.BranchName})
      const accountNumber = generateRandomNumberString(7);
      await this.page.waitForTimeout(1000)
      await this.page.click(this.accountNumberField)
      await this.page.waitForTimeout(1000)
      await this.page.fill(this.accountNumberField, String(bankdetail.AccountNumber))
      await this.page.waitForTimeout(1000)
      const accountType = this.page.locator(this.accountTypes)
      await accountType.click()
      await this.page.waitForTimeout(1000)
      await accountType.selectOption({label:bankdetail.AccountType})
      await this.page.waitForTimeout(1000)
      const debitdays = this.page.locator(this.debitdays)
      await debitdays.click()
      await this.page.waitForTimeout(1000)
      await debitdays.selectOption({label:String(bankdetail.DebitDay)})
      await this.page.waitForTimeout(1000)
      const primaryMSISDN = await this.page.locator(this.PrimaryMsisdnNumberField)
      const primaryMsisdnValue = await primaryMSISDN.inputValue()
      expect(primaryMsisdnValue).toEqual(this.mobileNumber)
      await this.page.waitForTimeout(1000)
      await this.page.click(this.validateBankDetailsButton)
      await this.page.waitForTimeout(1000)
      await this.page.waitForSelector(this.ProceedBankButton, {state:'visible'})
      await this.page.waitForTimeout(1000)
      await this.page.click(this.ProceedBankButton)
      await this.page.waitForTimeout(1000)
      await this.page.click(this.saveButton)
      await this.page.waitForSelector(this.DebicheckPopUp, {state:'visible'})
    }
     
  const IsDebiCheckPopUpAvailable = await this.page.isVisible(this.DebicheckPopUp)
  if (IsDebiCheckPopUpAvailable) {
    await this.page.waitForSelector(this.orderReferenceValue, { state: 'attached' });
  
    // Use .all() to get all matching elements
    const DebicheckOrdereferences = await this.page.locator(this.orderReferenceValue).all();
  
    // Loop through all elements and extract their text content
    for (const DebicheckOrdereference of DebicheckOrdereferences) {
      try {
        const value = await DebicheckOrdereference.textContent(); // Use textContent() instead of inputValue()
        if (value != null && value.trim() !== "") {
          console.log('DebiCheckOrderReference Value is:', value.trim());
        } else {
          console.log('Error: One of the DebiCheckOrderReference values is null or empty.');
        }
      } catch (error) {
        console.error('Error fetching value from one of the elements:', error);
      }
    }
  } else {
    await this.page.waitForSelector(this.orderReferenceField, { state: 'attached' });
    const Ordereference = this.page.locator(this.orderReferenceField);
    const value = await Ordereference.inputValue(); // Use inputValue() for input fields
    if (value != null) {
      console.log('OrderReference Value is:', value);
    } else {
      console.log('Error While Fetching the OrderReference Value');
    }
  }
     
  }
}
