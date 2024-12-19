import { test } from '@fixtures/AcceptanceTest';


test('As an admin, I want to create new flows from templates, so that I can easily create new ones based on the default flows.', { tag: '@Flow' }, async ({
    ShopAdmin,
    AdminFlowBuilderTemplates,
    AdminFlowBuilderCreate,
    AdminFlowBuilderListing,
    AdminFlowBuilderDetail,
    IdProvider,

}) => {


    const flowId = IdProvider.getIdPair().uuid;
    const flowNameUnique = 'Test flow - ' + flowId;

    // GIVEN there are Flow Templates
    await ShopAdmin.goesTo(AdminFlowBuilderTemplates.url());
    await AdminFlowBuilderTemplates.searchBar.fill('placed');
    //WHEN the admin user chooses to create a new flow from a template
    const adminFlowBuilderTemplatesRow = await AdminFlowBuilderTemplates.getLineItemByFlowName('Order placed')
    await adminFlowBuilderTemplatesRow.createFlowLink.click();
    await AdminFlowBuilderCreate.nameField.fill(flowNameUnique)
    await AdminFlowBuilderCreate.flowTab.click();
    // todo: check for content of trigger input field
    await ShopAdmin.expects(AdminFlowBuilderCreate.triggerSelectField).toBeVisible();
    await AdminFlowBuilderCreate.triggerSelectField.click();
    await AdminFlowBuilderCreate.triggerSelectField.hover();
    const tooltip = await AdminFlowBuilderCreate.page.waitForSelector('.sw-tooltip');
    const tooltipText = await tooltip.innerText(); // Get text from the tooltip
    //console.log(await AdminFlowBuilderCreate.triggerSelectField.innerText());
    // todo: check that send email action is there
    // todo: save assertions to check again later - compare template and resulting flow -
    // assert active flow's structure
    await ShopAdmin.expects(AdminFlowBuilderCreate.page.locator('.sw-flow-sequence-action__content').locator('.sw-single-select__selection')).toBeVisible();
    await ShopAdmin.expects(AdminFlowBuilderCreate.page.locator('.sw-flow-sequence-action__content').getByRole('button').first()).toContainText('Template: Order confirmation');
    await AdminFlowBuilderCreate.saveButton.click();
    // eslint-disable-next-line playwright/no-networkidle
    await AdminFlowBuilderCreate.page.waitForLoadState('networkidle')
    //THEN the new flow will be saved and has exactly the same structure as the template
    await ShopAdmin.goesTo(AdminFlowBuilderListing.url());
    // note: fill opens dropdown ...
    await AdminFlowBuilderListing.searchBar.pressSequentially(flowNameUnique);
    //await AdminFlowBuilderListing.page.locator('.sw-tabs__content').getByTitle('My flows').click();
    await AdminFlowBuilderListing.page.locator('.sw-card-view__content').click();
    const adminFlowBuilderListingRow = await AdminFlowBuilderListing.getLineItemByFlowName(flowNameUnique)
    await AdminFlowBuilderListing.page.waitForTimeout(2000);
    await ShopAdmin.expects(adminFlowBuilderListingRow.flowDisabledCheckmark).toBeVisible();
    await adminFlowBuilderListingRow.flowNameText.click();
    await ShopAdmin.expects(AdminFlowBuilderDetail.nameField).toHaveValue(flowNameUnique);
    await AdminFlowBuilderDetail.flowTab.click();
    // assert inactive flow's structure
    await ShopAdmin.expects(AdminFlowBuilderCreate.page.locator('.sw-flow-detail-flow__trigger-card').getByPlaceholder('Select event...')).toBeVisible();
    await ShopAdmin.expects(AdminFlowBuilderCreate.page.locator('.sw-flow-sequence-action__content').locator('.sw-single-select__selection')).toBeVisible();
});
