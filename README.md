## About
This repository contains a demonstration of automated end-to-end testing using Playwright. 
The test cases validate key functionalities of the Qubika Sports Club Management System by focusing on the following scenarios:

### User Management

A new user is created via the API.
The created user successfully logs in to the application.

### Category Management

A root category is added to the system through the web interface.
A subcategory is created and linked to the root category.
The creation of both categories is validated by checking their appearance in the table.

###  Key Features in the Tests
- API Testing: Direct interaction with the backend to create a user.
- UI Testing: Simulates real user interactions like filling forms, navigating menus, and validating UI elements.
- Dynamic Assertions: Ensures proper validation of UI states, such as button enablement and successful creation messages.
- Data-Driven Logic: Dynamic use of test data for categories and users.

##  Setup and Instructions

Follow these steps to set up and run the tests:

1. Install Dependencies

Ensure you have Node.js installed. Then run:

`npm install`

2. Install Playwright Browsers

Download the necessary browsers:

`npx playwright install`

3. Before Run tests

Set de email parameter for test in test-1.spec.ts, *a new mail must be enter for succed*.

4. Run the Tests

Execute all tests:

`npx playwright test`

Run tests in a specific browser:

`npx playwright test --project=chromium`

Run a specific test file:

`npx playwright test tests/test-1.spec.ts`

5. View Reports

After running the tests, access the HTML report:

`npx playwright show-report`