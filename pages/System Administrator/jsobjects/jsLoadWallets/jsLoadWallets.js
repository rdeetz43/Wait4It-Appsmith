export default {
  showWallets: async () => {
		await jsTableHelpers.setButtonColor(appsmith.store.currentTable);
		btnAllUserSettings.setVisibility(false);
		Rewards_Wallet_Button.setColor("#00A82F");
    const table = "wallets";
    storeValue("currentTable", table);
    await qLoadWallets.run();
    const rawWallets = qLoadWallets.data;
		const fieldsToFormat = jsTableHelpers.fieldMap[table];
    const formattedwallets = jsTableHelpers.formatRows(rawWallets, fieldsToFormat);
    const orderedWallets = await jsTableHelpers.applyColumnOrder(table, formattedwallets);
    await storeValue('activeData', orderedWallets);
		return orderedWallets;
	}
}
