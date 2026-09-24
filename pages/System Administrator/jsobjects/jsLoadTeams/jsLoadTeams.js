export default {
  showTeams: async () => {
		await jsTableHelpers.setButtonColor(appsmith.store.currentTable);
		btnAllUserSettings.setVisibility(false);
		Teams_Button.setColor("#00A82F");
    const table = "teams";
		storeValue("currentTable", table);
    await qLoadTeams.run();
		const rawTeams = qLoadTeams.data;
		const fieldsToFormat = jsTableHelpers.fieldMap[table];
    const formattedTeams = jsTableHelpers.formatRows(rawTeams, fieldsToFormat);
    const orderedTeams = await jsTableHelpers.applyColumnOrder(table, formattedTeams);
    await storeValue("activeData", orderedTeams);
    return orderedTeams;
  } 
}