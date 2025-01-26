import { test, expect } from '@playwright/test';

const host = 'https://api.club-administration.qa.qubika.com';
const password = '12345678';
const newUserEmail = 'hello@mail.cl';
let userName : string;
const newRootCategory = 'Category 1-1';
const newNoRootCategory = 'Child category a'

test('Create a new user', async ({request}) =>{
  const endpoint = '/api/auth/register'
  const url = host + endpoint
  const payload = {
    email: newUserEmail,
    password: password,
    roles: ["ROLE_ADMIN"]
  };

  const response = await request.post(url, {
    data: payload, 
    headers: {
      'Content-Type': 'application/json'
    },
  });

  expect(response.status()).toBe(201); 
  const responseBody = await response.json();
  userName = responseBody.userName;
  console.log("El user creado es: " + userName);

});


test('Login with new user created', async ({ page }) => {
  await page.goto('https://club-administration.qa.qubika.com/');

  const emailInput = page.locator('input[formcontrolname="email"]');
  await expect(emailInput).toBeVisible();

  const passInput = page.locator('input[formcontrolname="password"]');
  await expect(passInput).toBeVisible();
  
  const authButton = page.locator('button:has-text("Autenticar")');
  await expect(authButton).toBeDisabled;
  
  await emailInput.fill(newUserEmail);
  await expect(authButton).toBeDisabled;

  await passInput.fill(password);
  await expect(authButton).toBeEnabled;

  await authButton.click();

  await page.waitForURL('https://club-administration.qa.qubika.com/#/dashboard');
  const dashboardElement = page.locator('#sidenav-collapse-main');
  await expect(dashboardElement).toBeVisible();

});

test('Go to Category', async ({ page }) => {
  
  // Login process
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://club-administration.qa.qubika.com/');

  const emailInput = page.locator('input[formcontrolname="email"]');
  await expect(emailInput).toBeVisible();

  const passInput = page.locator('input[formcontrolname="password"]');
  await expect(passInput).toBeVisible();
  
  const authButton = page.locator('button:has-text("Autenticar")');
  await expect(authButton).toBeDisabled;
  
  await emailInput.fill(newUserEmail);
  await expect(authButton).toBeDisabled;

  await passInput.fill(password);
  await expect(authButton).toBeEnabled;

  await authButton.click();

  await page.waitForURL('https://club-administration.qa.qubika.com/#/dashboard');
  const dashboardElement = page.locator('#sidenav-collapse-main');
  await expect(dashboardElement).toBeVisible();

  // Go to Category Page
  const categoryLiMenu = page.locator('xpath= //a[@href="#/category-type"]/parent::li');
  await expect(categoryLiMenu).toBeVisible();
  await categoryLiMenu.click();

  const categoryTitle = page.locator('h3:has-text("Tipos de categorías")');
  await expect(categoryTitle).toBeVisible();

  const addCategoryButton = page.locator('xpath=//button[contains(text(), "Adicionar")]')
  await expect(addCategoryButton).toBeVisible();
  await addCategoryButton.click();

  // Create a new Category
  const modalAddCategoryTitle = page.locator('h1:has-text("Adicionar tipo")');
  await expect(modalAddCategoryTitle).toBeVisible();

  const categoryNameInput = page.locator('input[formcontrolname="name"]');
  await expect(categoryNameInput).toBeVisible();

  const  acceptCreateCategoryButton = page.locator('button:has-text("Aceptar")');
  await expect(acceptCreateCategoryButton).toBeDisabled;

  await categoryNameInput.fill(newRootCategory);
  
  await expect(acceptCreateCategoryButton).toBeEnabled;
  await acceptCreateCategoryButton.click();

  // Validate Category is created succesfully
  const successMessage = page.locator('div[role="alertdialog"][aria-label="Tipo de categoría adicionada satisfactoriamente"]');
  await expect(successMessage).toBeVisible();

  await page.waitForSelector('li.page-item.ng-star-inserted');
  const lastPage = page.locator('xpath=//li[@class="page-item ng-star-inserted"][last()]');
  await lastPage.click({ force: true });

  let categoryInTable = page.locator(`td:has-text("${newRootCategory}")`);
  await expect(categoryInTable).toBeVisible();

  // Create a subCategory
  await expect(addCategoryButton).toBeVisible();
  await addCategoryButton.click();

  await expect(modalAddCategoryTitle).toBeVisible();
  await expect(categoryNameInput).toBeVisible();
  await categoryNameInput.fill(newNoRootCategory);

  const checkSubCategory = page.locator('label[for="customCheckMain"]');
  await expect(checkSubCategory).toBeVisible;
  await checkSubCategory.click();
  await expect(checkSubCategory).toBeChecked;

  const rootCategoryInput = page.locator('input[aria-autocomplete="list"]');
  await expect(rootCategoryInput).toBeVisible();
  await rootCategoryInput.fill(newRootCategory);

  const rootCategoryElementInList = page.locator(`span:has-text("${newRootCategory}")`)
  await expect(rootCategoryElementInList).toBeVisible();
  await rootCategoryElementInList.click();

  await expect(acceptCreateCategoryButton).toBeEnabled;
  await acceptCreateCategoryButton.click();

  // Validate new subCategory in table list
  categoryInTable = page.locator(`td:has-text("${newNoRootCategory}")`);
  await expect(categoryInTable).toBeVisible();

});

