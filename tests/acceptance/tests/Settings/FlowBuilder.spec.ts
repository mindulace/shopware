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
    const flowName = 'Test flow - ' + flowId;

    // GIVEN there are Flow Templates
    await ShopAdmin.goesTo(AdminFlowBuilderTemplates.url());
    await AdminFlowBuilderTemplates.searchBar.fill('placed');

    //WHEN the admin user chooses to create a new flow from a template
    const adminFlowBuilderTemplatesRow = await AdminFlowBuilderTemplates.getLineItemByFlowName('Order placed')
    await adminFlowBuilderTemplatesRow.createFlowLink.click();
    await ShopAdmin.expects(AdminFlowBuilderCreate.smartBarHeader).toContainText('Order placed')
    await AdminFlowBuilderCreate.nameField.fill(flowName)
    await AdminFlowBuilderCreate.flowTab.click();
    // todo: make task
    await ShopAdmin.expects(AdminFlowBuilderCreate.triggerSelectField).toBeVisible();
    await AdminFlowBuilderCreate.triggerSelectField.hover();
    let tooltip = await AdminFlowBuilderCreate.page.waitForSelector('.sw-tooltip');
    let tooltipText = await tooltip.innerText(); // Get text from the tooltip
    await ShopAdmin.expects(tooltipText).toEqual('Checkout / Order / Placed');
    // todo: (optional) save assertions to check again later - compare template and resulting flow - task?
    // implicitly asserts there is no other action
    await ShopAdmin.expects(AdminFlowBuilderCreate.page.locator('.sw-flow-sequence-action__content').locator('.sw-single-select__selection')).toBeVisible();
    // asserts there are no other containers
    await ShopAdmin.expects(AdminFlowBuilderCreate.page.locator('.sw-flow-sequence-condition__container')).not.toBeVisible();
    await ShopAdmin.expects(AdminFlowBuilderCreate.page.locator('.sw-flow-delay-action__delay_card')).not.toBeVisible();
    // asserts email action (only partially available during test)
    await ShopAdmin.expects(AdminFlowBuilderCreate.page.locator('.sw-flow-sequence-action__content').getByRole('button').first()).toContainText('Template: Order confirmation');
    await ShopAdmin.expects(AdminFlowBuilderCreate.page.locator('.sw-flow-sequence-action__content').getByRole('button').first()).toContainText('Template: Order confirmation');
    await AdminFlowBuilderCreate.saveButton.click();

    //THEN the new flow will be saved and has exactly the same structure as the template
    await ShopAdmin.goesTo(AdminFlowBuilderListing.url());
    // fill opens dropdown
    await AdminFlowBuilderListing.searchBar.fill(flowName);
    // wait for and remove dropdown
    await ShopAdmin.expects(AdminFlowBuilderListing.searchDropdown).toBeVisible();
    await AdminFlowBuilderListing.pageBackground.click({position: {x: 25, y: 255}});
    await ShopAdmin.expects(AdminFlowBuilderListing.searchDropdown).not.toBeVisible();
    const listingRow = await AdminFlowBuilderListing.getLineItemByFlowName(flowName)
    await ShopAdmin.expects(listingRow.flowDisabledCheckmark).toBeVisible();
    await listingRow.flowNameText.click();
    await ShopAdmin.expects(AdminFlowBuilderDetail.nameField).toHaveValue(flowName);
    await AdminFlowBuilderDetail.flowTab.click();
    // todo: make task
    await ShopAdmin.expects(AdminFlowBuilderDetail.triggerSelectField).toBeVisible();
    await AdminFlowBuilderDetail.triggerSelectField.hover();
    tooltip = await AdminFlowBuilderDetail.page.waitForSelector('.sw-tooltip');
    tooltipText = await tooltip.innerText(); // Get text from the tooltip
    await ShopAdmin.expects(tooltipText).toEqual('Checkout / Order / Placed');
    await ShopAdmin.expects(AdminFlowBuilderDetail.page.locator('.sw-flow-sequence-action__content').locator('.sw-single-select__selection')).toBeVisible();
    // asserts there are no other containers
    await ShopAdmin.expects(AdminFlowBuilderDetail.page.locator('.sw-flow-sequence-condition__container')).not.toBeVisible();
    await ShopAdmin.expects(AdminFlowBuilderDetail.page.locator('.sw-flow-delay-action__delay_card')).not.toBeVisible();
    // asserts email action
    await ShopAdmin.expects(AdminFlowBuilderDetail.page.locator('.sw-flow-sequence-action__content').locator('.sw-single-select__selection')).toBeVisible();
    await ShopAdmin.expects(AdminFlowBuilderDetail.page.locator('.sw-flow-sequence-action__content').getByRole('button').first()).toContainText('Template: Order confirmation');
});
