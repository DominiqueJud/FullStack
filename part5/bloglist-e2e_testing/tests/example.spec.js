const { test, expect, beforeEach, describe } = require('@playwright/test')


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/users/reset')
    await request.post('http://localhost:3003/api/users',{ data:
      { username:"test",
        name:"test",
        password:"secret"
      }}
    )
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const title=await page.getByText("Login to application")
    await expect(title).toBeVisible()
  })

  test('login with correct Acc works', async ({page}) => {
    const userInput=page.getByTestId("username")
    await userInput.fill("test")
    const passwordInput=page.getByTestId('password')
    await passwordInput.fill("secret")
    const loginButton=page.getByTestId("login")
    await loginButton.click()
    const loggedIn=await page.getByText("Logged in as test")
    await expect(loggedIn).toBeVisible()
  })
  test('login with wrong Acc fails', async ({page}) => {
    const userInput=page.getByTestId("username")
    await userInput.fill("test")
    const passwordInput=page.getByTestId('password')
    await passwordInput.fill("test")
    const loginButton=page.getByTestId("login")
    await loginButton.click()
    const loggedIn=await page.getByText("Wrong")
    await expect(loggedIn).toBeVisible()
  })
})


describe('When logged in', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/users/reset')
    await request.post('http://localhost:3003/api/users',{ data:
      { username:"test",
        name:"test",
        password:"secret"
      }}
    )
    await page.goto('http://localhost:5173')
    await page.getByTestId("username").fill("test")
    await page.getByTestId('password').fill("secret")
    await page.getByTestId("login").click()
  })

  test('a new blog can be created', async ({ page }) => {
    await page.getByLabel("create new blog").click()
    await page.getById("title").fill("test title")
    await page.getById('author').fill('test author')
    await page.getById('url').fill('www.test.test')
    await page.getByLabel('create').click()
    const blog=page.getByLabel('www.test.test')
    expect(blog).toBeVisible()
  })
})