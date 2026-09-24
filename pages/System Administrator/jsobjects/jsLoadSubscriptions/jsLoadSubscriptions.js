export default {
	showSubscriptions: async () => {
		await jsTableHelpers.setButtonColor(appsmith.store.currentTable);
		btnAllUserSettings.setVisibility(false);
		Subscriptions_Button.setColor("#00A82F");
    const table = "subscriptions";
    storeValue("currentTable", table);
    await qLoadSubs.run();
    const rawSubs = qLoadSubs.data;
		const fieldsToFormat = jsTableHelpers.fieldMap[table];
    const formattedSubs = jsTableHelpers.formatRows(rawSubs, fieldsToFormat);
    const orderedSubs = await jsTableHelpers.applyColumnOrder(table, formattedSubs);
    storeValue('activeData', orderedSubs);
		return orderedSubs;
  },
}