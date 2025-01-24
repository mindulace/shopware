import {expect, test} from '@fixtures/AcceptanceTest';

test('As an admin, I want to create new flows from templates, so that I can easily create new ones based on the default flows.', { tag: '@Flow' }, async ({
      ShopAdmin,
      AdminFlowBuilderTemplates,
      AdminFlowBuilderCreate,
      AdminFlowBuilderListing,
      AdminFlowBuilderDetail,
      IdProvider,
      AdminApiContext,

    }) => {

    // change this to test other flows/templates
    const flowTemplateName = 'Order placed'

    const flowTemplateSingleTerms = flowTemplateName.split(' ')
    const flowTemplateSearchTerm = flowTemplateSingleTerms[flowTemplateSingleTerms.length - 1]
    const flowUniqueId = IdProvider.getIdPair().uuid;
    const flowName = 'Test flow - ' + flowUniqueId;

    // go to flow template detail page and retrieve template's UUID
    // await ShopAdmin.goesTo(AdminFlowBuilderTemplates.url(`?limit=25&page=1&term=${flowTemplateSearchTerm}&sortBy=createdAt&sortDirection=DESC&naturalSorting=false`));
    // todo: the line above replaces the following two lines as soon as NEXT-40094 is resolved
    await ShopAdmin.goesTo(AdminFlowBuilderTemplates.url());
    await AdminFlowBuilderTemplates.searchBar.fill(flowTemplateSearchTerm);
    const adminFlowBuilderTemplatesRow = await AdminFlowBuilderTemplates.getLineItemByFlowName(flowTemplateName)
    await adminFlowBuilderTemplatesRow.templateDetailLink.click();
    await ShopAdmin.expects(AdminFlowBuilderDetail.generalTab).toBeVisible();
    await ShopAdmin.expects(AdminFlowBuilderDetail.templateName).toHaveValue(flowTemplateName);
    await ShopAdmin.expects(AdminFlowBuilderDetail.alertWarning).toContainText('Flow templates cannot be edited.')
    const flowTemplateUrl = AdminFlowBuilderDetail.page.url().split('/');
    const flowTemplateId = flowTemplateUrl[flowTemplateUrl.length - 2]

    // create flow from template
    await ShopAdmin.goesTo(AdminFlowBuilderTemplates.url());
    await AdminFlowBuilderTemplates.searchBar.fill(flowTemplateSearchTerm);
    await adminFlowBuilderTemplatesRow.createFlowLink.click();
    await ShopAdmin.expects(AdminFlowBuilderCreate.smartBarHeader).toContainText(flowTemplateName)
    await AdminFlowBuilderCreate.nameField.fill(flowName)
    await AdminFlowBuilderCreate.saveButton.click();

    // go to flow template detail page and retrieve flow's UUID
    await ShopAdmin.goesTo(AdminFlowBuilderListing.url(`?limit=25&page=1&term=${flowUniqueId}&sortBy=createdAt&sortDirection=DESC&naturalSorting=false`));
    const listingRow = await AdminFlowBuilderListing.getLineItemByFlowName(flowName)
    await ShopAdmin.expects(listingRow.flowDisabledCheckmark).toBeVisible();
    await listingRow.flowNameText.click();
    await ShopAdmin.expects(AdminFlowBuilderDetail.nameField).toHaveValue(flowName);
    const flowUrl = await AdminFlowBuilderDetail.page.url().split('/');
    const flowId = flowUrl[flowUrl.length - 2]

    // compare flow template and flow
    const isEqual = await isFlowEqualToTemplate(AdminApiContext, flowTemplateId, flowId);
    expect(isEqual).toBe(true);
});
async function isFlowEqualToTemplate(AdminApiContext, flowTemplateId: string, flowId: string): Promise<boolean> {
    // get flow template data
    const flowTemplateResponse = await AdminApiContext.post(`search/flow-template`, {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'id',
                value: flowTemplateId,
            }],
        },
    });
    const resultTemplate = (await flowTemplateResponse.json());
    expect(flowTemplateResponse.ok()).toBeTruthy();

    // get flow data
    const flowResponse = await AdminApiContext.post(`search/flow`, {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'id',
                value: flowId,
            }],
            associations: { sequences: {}  },
        },
    });
    const resultFlow = (await flowResponse.json());
    expect(flowResponse.ok()).toBeTruthy();

    // compare flow template with flow
    let i = 0;
    for (const sequenceTemplate of resultTemplate.data[0].config.sequences) {
        if (sequenceTemplate.actionName != resultFlow.data[0].sequences[i].actionName){
            return false;
        }
        if (sequenceTemplate.actionName != resultFlow.data[0].sequences[i].actionName){
            return false;
        }
        if (JSON.stringify(sequenceTemplate.config) != JSON.stringify(resultFlow.data[0].sequences[i].config)){
            return false;
        }
        i++;
    }
    return true;
}
