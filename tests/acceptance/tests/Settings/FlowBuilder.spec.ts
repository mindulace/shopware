import { test } from '@fixtures/AcceptanceTest';
import { expect } from '@playwright/test';
import {Response, isSaaSInstance, TestDataService} from '@shopware-ag/acceptance-test-suite';

test('As an admin, I want to create new flows from templates, so that I can easily create new ones based on the default flows.', { tag: '@Flow' }, async ({
    ShopAdmin,
    AdminFlowBuilderTemplates,
    AdminFlowBuilderCreate,
    AdminFlowBuilderListing,

}) => {
    // GIVEN there are Flow Templates
    // go to templates tab
    await ShopAdmin.goesTo(AdminFlowBuilderTemplates.url());
    await AdminFlowBuilderTemplates.page.locator('.sw-search-bar').getByPlaceholder('Search flows...').fill('placed');

    //WHEN the admin user chooses to create a new flow from a template
    // create new flow from template
    await AdminFlowBuilderTemplates.page.locator('.sw-data-grid__row').filter({hasText: 'Order placed'}).getByRole('link').getByTestId('sw-icon__regular-long-arrow-right').click();
    // todo: change name to sth unique
    await AdminFlowBuilderCreate.page.locator('.sw-tabs__content').locator('.sw-flow-detail__tab-flow').click();
    // assert active flow's structure
    await ShopAdmin.expects(AdminFlowBuilderCreate.page.locator('.sw-flow-detail-flow__trigger-card').getByPlaceholder('Select event...')).toBeVisible();
    // todo: check that send email action is there
    // todo: save assertions to check again later
    await ShopAdmin.expects(AdminFlowBuilderCreate.page.locator('.sw-flow-sequence-action__content').locator('.sw-single-select__selection')).toBeVisible();
    // save flow
    await AdminFlowBuilderCreate.page.locator('.smart-bar__content').locator('.sw-button--primary').getByText('Save').click();

    //THEN the new flow will be saved and has exactly the same structure as the template
    // go to flow builder
    await ShopAdmin.goesTo(AdminFlowBuilderListing.url());
    await AdminFlowBuilderListing.page.locator('.sw-search-bar').getByPlaceholder('Search flows...').fill('placed');
    // assert one active and one inactive flow
    // todo: only assert new flow (by new unique name and inactive)
    await ShopAdmin.expects(AdminFlowBuilderListing.page.locator('.sw-data-grid__row').filter({hasText: 'Order placed'}).getByTestId('sw-icon__regular-checkmark-xs')).toBeVisible();
    await ShopAdmin.expects(AdminFlowBuilderListing.page.locator('.sw-data-grid__row').filter({hasText: 'Order placed'}).getByTestId('sw-icon__regular-times-s')).toBeVisible();
    await AdminFlowBuilderListing.page.locator('.sw-data-grid__row').filter({hasText: 'Order placed'}).getByTestId('sw-icon__regular-times-s').getByRole('link').click();
    // assert inactive flow's structure
    await ShopAdmin.expects(AdminFlowBuilderCreate.page.locator('.sw-flow-detail-flow__trigger-card').getByPlaceholder('Select event...')).toBeVisible();
    await ShopAdmin.expects(AdminFlowBuilderCreate.page.locator('.sw-flow-sequence-action__content').locator('.sw-single-select__selection')).toBeVisible();
    //
    // todo: CHECK upload flow modal for missing text
    //
});
