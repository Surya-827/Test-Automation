import {test,expect} from '@playwright/test';

test('Amazon Demo Test',async ({page})=>{
    //Navigate to Amazon 
    await page.goto('http://www.amazon.in/');
    //Click on All Filter 
    //await page.locator('//select[@id=\'searchDropdownBox\']').click();
    //Click on Search Box
    await page.locator('input#twotabsearchtextbox').click();
})