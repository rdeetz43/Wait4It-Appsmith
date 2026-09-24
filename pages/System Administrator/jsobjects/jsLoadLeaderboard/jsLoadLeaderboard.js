export default {
  showLeaders: async () => {
		await jsTableHelpers.setButtonColor(appsmith.store.currentTable);
		btnAllUserSettings.setVisibility(false);
		Leaderboard_Button.setColor("#00A82F");
    const table = "leaderboard";
    storeValue("currentTable", table);
    await qLoadLeaderboard.run();
    const rawLeaderboard = qLoadLeaderboard.data;
		const fieldsToFormat = jsTableHelpers.fieldMap[table];
    const formattedLeaderboard = jsTableHelpers.formatRows(rawLeaderboard, fieldsToFormat);
    const orderedLeaderboard = await jsTableHelpers.applyColumnOrder(table, formattedLeaderboard);
    storeValue('activeData', orderedLeaderboard);
		return orderedLeaderboard;
  }
}