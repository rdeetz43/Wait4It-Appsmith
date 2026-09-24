export default {
  showPredictions: async () => {
		await jsTableHelpers.setButtonColor(appsmith.store.currentTable);
		btnAllUserSettings.setVisibility(false);
		Predictions_Button.setColor("#00A82F");
    const table = "predictions";
    storeValue("currentTable", table);
    await qLoadPredictions.run();
    const rawPredictions = qLoadPredictions.data;
		const fieldsToFormat = jsTableHelpers.fieldMap[table];
    const formattedPredictions = jsTableHelpers.formatRows(rawPredictions, fieldsToFormat);
    const orderedPredictions = await jsTableHelpers.applyColumnOrder(table, formattedPredictions);
    storeValue('activeData', orderedPredictions);
		return orderedPredictions;
	}
}