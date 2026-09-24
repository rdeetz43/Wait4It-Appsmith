export default {
  showFeedback: async () => {
    await jsTableHelpers.setButtonColor(appsmith.store.currentTable);
		btnAllUserSettings.setVisibility(false);
    Feedback_Button.setColor("#00A82F");

    const table = "feedback";
    storeValue("currentTable", table);

    await qLoadFeedback.run();
    const rawFeedback = qLoadFeedback.data;

    // ✅ Handle no records
    if (!rawFeedback || rawFeedback.length === 0) {
			await storeValue("activeData", []);      
			return [];
    }
		
    const fieldsToFormat = jsTableHelpers.fieldMap[table];
    const formattedFeedback = jsTableHelpers.formatRows(rawFeedback, fieldsToFormat);
    const orderedFeedback = await jsTableHelpers.applyColumnOrder(table, formattedFeedback);

    await storeValue("activeData", orderedFeedback);
    return orderedFeedback;
  }
}