export default {
	selectDefaultButton() {
    jsTableHelpers.setButtonColor(appsmith.store.currentTable, true);
  },

	// Validate avatar file types
	validateFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
  },

	formatDate: (dateStr, includeTime = false) => {
  	if (!dateStr || typeof dateStr !== "string") return "";

  	if (!includeTime)
			return moment.parseZone(dateStr).tz(moment.tz.guess()).format("MMM D, YYYY" + " ");	// Needs a trailing space, otherwise the dynamic table will treate it as a date
																																													// rather then plain text and add the IOS formatting stuff
		return moment.parseZone(dateStr).tz(moment.tz.guess()).format("MMM D, YYYY h:mm A");
	},

	formatRows: (rows, fields = ["created_at", "birthdate"]) => {
	  return rows.map(row => {
	    const formatted = { ...row };

			fields.forEach(field => {
  			const raw = row[field];
  			if (!raw || typeof raw !== "string") return;

	  		const includeTime = raw.length > 10;

  			try {
  			  formatted[field] = jsTableHelpers.formatDate(raw, includeTime);
  			} catch (e) {
  		  	formatted[field] = raw;
 	 			}
			});
    	return formatted;
  	});
	},

	// Config map for which fields to format per table
  fieldMap: {
    users: ["Birthday"],
    teams: ["Created On", "Last Updated"],
    subscriptions: ["Created On", "Start Date", "End Date"],
    feedback: ["Submitted On"],
    predictions: ["Prediction Time"],
    wallets: ["Last Transaction"],
    leaderboard: []
  },

	columnOrderMap: {
    users: ["User Name", "Status", "User Type", "Online", "Email", "Address", "City", "State", "Zip Code", "Phone Number", "Birthday", "ID"],
    teams: ["Team Name", "Description", "Created On", "Last Updated", "ID"],
    subscriptions: ["User Name", "Plan", "Billing Cycle", "Status", "Auto-Renew", "Created On", "Start Date", "End Date", "User Id", "ID"],
		feedback: ["User Name", "Comments", "Rating", "Submitted On", "User Id", "ID"],
		predictions: ["User Name", "Social Platform", "Content", "Predicted Emotion", "Confidence Score", "Prediction Time", "User Id", "ID"],
		wallets: ["User Name", "Balance", "Currency", "Last Transaction", "User ID", "ID"],
		leaderboard: ["User Name", "User Rank", "User Points", "Team Name", "Team Rank", "Team Points"]
  },

  applyColumnOrder: async (tableName, data) => {
    const order = jsTableHelpers.columnOrderMap[tableName];
    if (!order || !Array.isArray(data)) return;

    const reordered = data.map(row => {
      const newRow = {};
      order.forEach(key => {
        newRow[key] = row[key] ?? ""; // Fill missing keys safely
      });
      return newRow;
    });

    return reordered;
  },
	
	setButtonColor: async (currentTable, select = false) => {
		const color = select ? "#00A82F" : "#86efac";
		switch (currentTable) {
			case "users":
				Active_Users_Button.setColor(color);
				return;
			case "teams":
				Teams_Button.setColor(color);
				return;
			case "subscriptions":
				Subscriptions_Button.setColor(color);
				return;
			case "feedback":
				Feedback_Button.setColor(color);
				return;
			case "predictions":
				Predictions_Button.setColor(color);
				return;
			case "wallets":
				Rewards_Wallet_Button.setColor(color);
				return;
			case "leaderboard":
				Leaderboard_Button.setColor(color);
				return;
		}
	},
	
  editUser: (user, currentModel) => {
		storeValue("cachedTriggeredRow", appsmith.store.editRow);
		storeValue("previousModal", currentModel);
		storeValue("currentTable", "users");
		storeValue("editRow", user);
		storeValue("modalOrigin", "fromModal");
		showModal(modalEditUser.name);
	},
	
	returnToPreviousModal: () => {
	  if (appsmith.store.modalOrigin === "fromModal") {
			storeValue("currentTable", appsmith.store.previousModal);
			storeValue("editRow", appsmith.store.cachedTriggeredRow);
			removeValue("cachedTriggeredRow");
			jsOpenModal.openEditModal();
		}
		else {
      closeModal(modalEditUser.name);
		}
	},
	
	normalizeAvatarUrl: (url) => {
  	// Step 1: Strip query string
  	const baseUrl = url.split("?")[0];

	  // Step 2: Split into path segments
  	const parts = baseUrl.split("/");

	  // Step 3: Decode filename to access extension
  	let filename = decodeURIComponent(parts.pop()); // e.g., "benjamin.taylor@example.com.png"

	  // Step 5: Rebuild the full path with encoded segments
  	const encodedPath = [...parts, filename].map(encodeURIComponent).join("/");

	  // Step 6: Decode only the filename portion for readability (optional)
  	return decodeURIComponent(encodedPath);
	}
}

