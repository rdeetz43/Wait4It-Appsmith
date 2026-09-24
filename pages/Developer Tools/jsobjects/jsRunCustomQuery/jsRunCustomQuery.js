export default {
  generateAndRunSQL: async () => {
    try {
      const sql = inpCustomPrompt.text;
      await qCustomDbQuery.run({ sql });
      await storeValue("queryRow", qCustomDbQuery.data);
			if (typeof data === "string") {
      	await inpCustomResponse.setValue(qCustomDbQuery.data || "Success!");
			}
			else {
      	await inpCustomResponse.setValue("Success!");
			}
    } catch (e) {
      await inpCustomResponse.setValue(qCustomDbQuery.data || "");
    }
  },
	
	tableSchema: async () => {
			if (!tableCustomQuery.selectedRow) {
					showAlert("Select a table first.");
					return;
			}

			await qGetDbTables.run();
			await qGetSchema.run();

			const tableName = tableCustomQuery.selectedRow.Table;
			const sql = `SELECT * FROM ${tableName}`;

			await qCustomDbQuery.run({ sql });
			await storeValue("queryRow", qCustomDbQuery.data);

			return qCustomDbQuery.data;
	},

	getEnumDefinitions: async () => {
    await qGetDbEnums.run();
		await storeValue("enumRow", qGetDbEnums.data);
  },
	
	deleteAllRecords: async () => {
		const table = tableCustomQuery.selectedRow?.Table;
		if (!table) {
			showAlert("Please select a table first.", "warning");
			return;
		}
		await qDeleteAllRecords.run({ table });
		await jsRunCustomQuery.tableSchema();
	}
}