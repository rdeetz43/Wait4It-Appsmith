export default {
	  getTableDefinitions: async () => {
    await qGetDbTables.run();
		await storeValue("customRow", qGetDbTables.data);
  }
}