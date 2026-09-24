export default {
  showUsers: async () => {
    await jsTableHelpers.setButtonColor(appsmith.store.currentTable);
		btnAllUserSettings.setVisibility(true);
    Active_Users_Button.setColor("#00A82F");

    const table = "users";
    storeValue("currentTable", table);

    // 1. Load users
		const result = await qLoadUsers.run();
		const rawUsers = result;
		const countResult = await qLoadUserCount.run();
		const total = countResult[0].total;
		await storeValue("userCount", total);

    // 2. Load online users
    await apiActiveUsersGetOnline.run();
    const onlineIds = apiActiveUsersGetOnline.data.onlineUsers || [];

    // 3. Format + order
    const fieldsToFormat = jsTableHelpers.fieldMap[table];
    const formattedUsers = jsTableHelpers.formatRows(rawUsers, fieldsToFormat);
    const orderedUsers = await jsTableHelpers.applyColumnOrder(table, formattedUsers);

    // 4. Add birthday display + online status
    let transformed = [];
    if (Array.isArray(orderedUsers) && orderedUsers.length > 0) {
      transformed = orderedUsers.map(u => ({
        ...u,
        "Birthday": jsLoadUsers.getBirthdayDisplay(u["Birthday"]),
        "Zip Code": u["Zip Code"],
        "Online": onlineIds.includes(u["ID"])
      }));
      await storeValue("activeData", transformed);
    } else {
      storeValue("activeData", []);
    }

    return transformed;
  },

  getBirthdayDisplay: (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${birthDate.toLocaleDateString()} (${age} years old)`;
  }
}
