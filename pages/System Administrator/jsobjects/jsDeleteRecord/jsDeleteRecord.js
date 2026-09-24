export default {
	async deleteRecord() {
		const allowedTables = ["users", "teams", "subscriptions", "feedback", "predictions", "wallets"];
		if (allowedTables.includes(appsmith.store.currentTable)) {

			// Unfortunaltely, you can't pass the table name into the query, so separate delete queries are required
			switch (appsmith.store.currentTable) {
			  case "users":
					await storeValue("avatarName", tableMain.selectedRow.Email);
					try { await apiDeleteAvatar.run(); } catch (err) {}
   				await qDeleteUser.run({ id: tableMain.selectedRow.ID })
   				jsLoadUsers.showUsers();
			    break;
			  case "teams":
					await storeValue("avatarName", String(tableMain.selectedRow.ID));
					try { await apiDeleteAvatar.run(); } catch (err) {}
   				await qDeleteTeam.run({ id: qLoadTeams.data[tableMain.selectedRowIndex].ID })
			    jsLoadTeams.showTeams();
			    break;
			  case "subscriptions":
   				await qDeleteSub.run({ id: qLoadSubs.data[tableMain.selectedRowIndex].ID })
   				await jsLoadSubscriptions.showSubscriptions();
			    break;
			  case "feedback":
			    await qDeleteFeedback.run({ id: qLoadFeedback.data[tableMain.selectedRowIndex].ID })
   				await jsLoadFeedback.showFeedback();
			    break;
			  case "predictions":
   				await qDeletePrediction.run({ id: qLoadPredictions.data[tableMain.selectedRowIndex].ID })
   				await jsLoadPredictions.showPredictions();
			    break;
			  case "wallets":
					if (tableMain.selectedRowIndex >= 0) {
							  await qDeleteWallet.run();
	   				await jsLoadWallets.showWallets();
					}
			    break;
			  default:
			    showAlert("Unknown table selected", "error");
   				break;
				}
				
  			//showAlert("Record deleted", "success");
			
		} else {
  		showAlert("Invalid table name:" + appsmith.store.tableName, "error");
		}
	}
}