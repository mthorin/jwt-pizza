import { test, expect } from 'playwright-test-coverage';

async function mockGetMenuRoute(page){
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });
}

async function mockGetFranchiseRoute(page){
  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });
}

async function mockRegisterRoute(page) {
  await page.route('*/**/api/auth', async (route) => {
    const registerReq = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
    const registerRes = { user: { id: 4, name: 'John Doe', email: 'john@example.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    if (route.request().method() === 'POST') {
      expect(route.request().postDataJSON()).toMatchObject(registerReq);
      await route.fulfill({ json: registerRes });
    }
  });
}

async function mockLoginDinerRoute(page){
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    if (route.request().method() === 'PUT') {
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    }
  });
}

async function mockLoginFranchiseeRoute(page){
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'f@jwt.com', password: 'franchisee' };
    const loginRes = { user: { id: 3, name: 'pizza franchisee', email: 'f@jwt.com', roles: [{ role: 'franchisee', objectId: '1' }] }, token: 'abcdef' };
    if (route.request().method() === 'PUT') {
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    }
  });
}

async function mockLoginAdminRoute(page){
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'admin' };
    const loginRes = { user: { id: 3, name: '常用名字', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
    if (route.request().method() === 'PUT') {
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    }
  });
}

async function mockLogoutRoute(page) {
  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 200 });
    }
  });
}

async function mockPostOrderRoute(page){
  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });
}

async function mockCloseStoreRoute(page) {
  await page.route(`*/**/api/franchise/1/store/10`, async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 200 });
    }
  });
}

async function mockCreateStoreRoute(page) {
  await page.route(`*/**/api/franchise/1/store`, async (route) => {
    const storeReq = { name: 'New Store' };
    const storeRes = { id: 10, franchiseID: 1, name: 'New Store' };
    if (route.request().method() === 'POST') {
      expect(route.request().postDataJSON()).toMatchObject(storeReq);
      await route.fulfill({ json: storeRes });
    }
  });
}

async function mockCloseFranchiseRoute(page, franchiseID) {
  await page.route(`*/**/api/franchise/${franchiseID}`, async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 200 });
    }
  });
}

async function mockCreateFranchiseRoute(page) {
  await page.route('*/**/api/franchise', async (route) => {
    const franchiseReq = { name: 'New Franchise' };
    const franchiseRes = { id: 5, name: 'New Franchise', stores: [] };
    if (route.request().method() === 'POST') {
      expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
      await route.fulfill({ json: franchiseRes });
    }
  });
}

async function mockGetUserFranchiseRoute(page) {
  await page.route('*/**/api/franchise/3', async (route) => {
    const franchiseRes = [{
      id: 1,
      name: 'pizzaPocket',
      admins: [
        { id: 3, name: "pizza franchisee", email: "f@jwt.com" },
      ],
      stores: [
        { id: 1, name: 'SLC', totalRevenue: 0.0304 },
      ],
    }];
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, json: franchiseRes });
    }
  });
}

async function mockGetUserFranchiseRouteUpdated(page) {
  await page.route('*/**/api/franchise/3', async (route) => {
    const franchiseRes = [{
      id: 1,
      name: 'pizzaPocket',
      admins: [
        { id: 3, name: "pizza franchisee", email: "f@jwt.com" },
      ],
      stores: [
        { id: 1, name: 'SLC', totalRevenue: 0.0304 },
        { id: 10, name: 'New Store', totalRevenue: 0 },
      ],
    }];
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, json: franchiseRes });
    }
  });
}

async function mockGetAdminFranchiseRoute(page) {
  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [{
      id: 1,
      name: "pizzaPocket",
      admins: [{
          id: 3,
          name: "pizza franchisee",
          email: "f@jwt.com"
      }],
      stores: [{
          id: 1,
          name: "SLC",
          totalRevenue: 0.0304
      }],
  }];
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, json: franchiseRes });
    }
  });
}

test('purchase with login', async ({ page }) => {

  await mockGetMenuRoute(page);
  await mockGetFranchiseRoute(page);
  await mockLoginDinerRoute(page);
  await mockPostOrderRoute(page);

  await page.goto('http://localhost:5173/');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});

test('about page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByRole('main')).toContainText('At JWT Pizza, our amazing employees are the secret behind our delicious pizzas. They are passionate about their craft and spend every waking moment dreaming about how to make our pizzas even better. From selecting the finest ingredients to perfecting the dough and sauce recipes, our employees go above and beyond to ensure the highest quality and taste in every bite. Their dedication and attention to detail make all the difference in creating a truly exceptional pizza experience for our customers. We take pride in our team and their commitment to delivering the best pizza in town.');
  await expect(page.getByRole('main')).toContainText('Our talented employees at JWT Pizza are true artisans. They pour their heart and soul into every pizza they create, striving for perfection in every aspect. From hand-stretching the dough to carefully layering the toppings, they take pride in their work and are constantly seeking ways to elevate the pizza-making process. Their creativity and expertise shine through in every slice, resulting in a pizza that is not only delicious but also a work of art. We are grateful for our dedicated team and their unwavering commitment to delivering the most flavorful and satisfying pizzas to our valued customers.');
  await expect(page.getByRole('main')).toContainText('The secret sauce');
  await expect(page.getByRole('main')).toContainText('JWT Pizza is home to a team of pizza enthusiasts who are truly passionate about their craft. They are constantly experimenting with new flavors, techniques, and ingredients to push the boundaries of traditional pizza-making. Their relentless pursuit of perfection is evident in every bite, as they strive to create a pizza experience that is unparalleled. Our employees understand that the secret to a great pizza lies in the details, and they leave no stone unturned in their quest for pizza perfection. We are proud to have such dedicated individuals on our team, as they are the driving force behind our reputation for exceptional quality and taste.');
  await expect(page.getByRole('main')).toContainText('Our employees');
  await expect(page.getByRole('main')).toContainText('At JWT Pizza, our employees are more than just pizza makers. They are culinary artists who are deeply passionate about their craft. They approach each pizza with creativity, precision, and a genuine love for what they do. From experimenting with unique flavor combinations to perfecting the cooking process, our employees are constantly pushing the boundaries of what a pizza can be. Their dedication and expertise result in pizzas that are not only delicious but also a reflection of their passion and commitment. We are grateful for our talented team and the incredible pizzas they create day in and day out.');
  await expect(page.locator('div').filter({ hasText: /^James$/ }).getByRole('img')).toBeVisible();
  await page.locator('div').filter({ hasText: /^Maria$/ }).getByRole('img').click();
  await page.locator('div').filter({ hasText: /^Anna$/ }).getByRole('img').click();
  await page.locator('div').filter({ hasText: /^Brian$/ }).getByRole('img').click();
  await page.getByRole('main').getByRole('img').first().click();
});

test('register and logout', async ({ page }) => {
  await mockLogoutRoute(page);
  await mockRegisterRoute(page);

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Register' }).click();
  await expect(page.getByPlaceholder('Full name')).toBeVisible();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Password').click();
  await page.locator('div').filter({ hasText: /^Password$/ }).getByRole('button').click();
  await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
  await expect(page.locator('form')).toContainText('Already have an account? Login instead.');
  await expect(page.getByRole('heading')).toContainText('Welcome to the party');
  await page.getByPlaceholder('Full name').click();
  await page.getByPlaceholder('Full name').fill('John Doe');
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('john@example.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('password123');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.getByRole('link', { name: 'JD' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  await page.getByRole('link', { name: 'JD' }).click();
  await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');
  await expect(page.getByRole('main')).toContainText('John Doe');
  await expect(page.getByRole('main')).toContainText('john@example.com');
  await expect(page.getByRole('main')).toContainText('diner');
  await expect(page.getByRole('main')).toContainText('How have you lived this long without having a pizza? Buy one now!');
  await expect(page.getByRole('img', { name: 'Employee stock photo' })).toBeVisible();
  await page.getByRole('link', { name: 'Buy one' }).click();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
  await page.getByRole('link', { name: 'home' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
});

test('create and close store, franchisee dashboard', async ({ page }) => {
  await mockLoginFranchiseeRoute(page);
  await mockGetUserFranchiseRoute(page);
  await mockCreateStoreRoute(page);
  await mockCloseStoreRoute(page);

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('f@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('link', { name: 'pf' })).toBeVisible();

  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByRole('heading')).toContainText('pizzaPocket');
  await expect(page.getByRole('main')).toContainText('Everything you need to run an JWT Pizza franchise. Your gateway to success.');
  await expect(page.locator('tbody')).toContainText('0.03 ₿');
  await expect(page.locator('tbody')).toContainText('SLC');

  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByPlaceholder('store name').click();
  await page.getByPlaceholder('store name').fill('New Store');
  await mockGetUserFranchiseRouteUpdated(page);
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByRole('cell', { name: 'New Store' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0 ₿' })).toBeVisible();
  await expect(page.locator('tbody')).toContainText('0 ₿');
  await expect(page.locator('tbody')).toContainText('New Store');
  await expect(page.getByRole('row', { name: 'New Store 0 ₿ Close' }).getByRole('button')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();

  await page.getByRole('row', { name: 'New Store 0 ₿ Close' }).getByRole('button').click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  await expect(page.getByRole('main')).toContainText('Are you sure you want to close the pizzaPocket store New Store ? This cannot be restored. All outstanding revenue with not be refunded.');
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});


test('admin dashboard', async ({ page }) => {
  await mockLoginAdminRoute(page);
  await mockGetAdminFranchiseRoute(page);

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: '常' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
  await expect(page.getByRole('heading')).toContainText('Mama Ricci\'s kitchen');
  await expect(page.getByRole('main')).toContainText('Keep the dough rolling and the franchises signing up.');
  await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'pizzaPocket' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'pizza franchisee' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'pizzaPocket pizza franchisee' }).getByRole('button')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'SLC' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '₿' })).toBeVisible();
});