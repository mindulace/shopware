import { test } from '@fixtures/AcceptanceTest';

test(
    'As a customer, I expect to see and use the google recaptcha function on the contact form.',
    { tag: '@form @contact' },
    async ({ ShopCustomer, StorefrontHome, StorefrontContactForm, TestDataService }) => {

        //activate v2 and v3 captcha
        await TestDataService.setSystemConfig({'core.basicInformation.activeCaptchasV2': {'basicCaptcha': { 'name': 'basicCaptcha', 'isActive': true }} });

        await test.step('Open the contact form modal on home page.', async () => {
            await ShopCustomer.goesTo(StorefrontHome.url());
            await StorefrontHome.contactFormLink.click();
            await ShopCustomer.expects(StorefrontContactForm.cardTitle).toContainText('Contact');
        });

        await test.step('Validate the google recaptcha is available.', async () => {
            await ShopCustomer.expects(StorefrontContactForm.greCaptchaV2Container).toBeVisible();

            // Check whether input exists but not visible, Currently just look that the element is not visible
            await ShopCustomer.expects(StorefrontContactForm.greCaptchaV2Input).not.toBeVisible();
            await ShopCustomer.expects(StorefrontContactForm.greCaptchaProtectionInformation).toBeVisible();
            await ShopCustomer.expects(StorefrontContactForm.greCaptchaProtectionInformation).toHaveCount(1);
            await ShopCustomer.expects(StorefrontContactForm.greCaptchaProtectionInformation).toContainText('This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.');
        });
    }
);
