export default {
updateAndRefresh: async () => {
  const table = appsmith.store.currentTable;

  // Map table names to create queries
  const createMap = {
    users: qCreateUser,
		teams: qCreateTeam,
		subscriptions: qCreateSub,
		feedback: qCreateFeedback,
		predictions: qCreatePrediction,
		wallets: qCreateWallet
  };

	// Map table names to update queries
  const updateMap = {
    users: qUpdateUser,
    teams: qUpdateTeam,
    subscriptions: qUpdateSubscription,
    feedback: qUpdateFeedback,
    predictions: qUpdatePrediction,
    wallets: qUpdateWallet
  };

  // Map table names to reload the table after the modal closes
  const reloadMap = {
    users: jsLoadUsers.showUsers,
    teams: jsLoadTeams.showTeams,
    subscriptions: jsLoadSubscriptions.showSubscriptions,
    feedback: jsLoadFeedback.showFeedback,
    predictions: jsLoadPredictions.showPredictions,
    wallets: jsLoadWallets.showWallets
  };

  // Map table names to close the modal
  const modalMap = {
    users: modalEditUser.name,
    teams: modalEditTeam.name,
    subscriptions: modalEditSubscription.name,
    feedback: modalEditFeedback.name,
    predictions: modalEditPrediction.name,
    wallets: modalEditWallet.name
  };

  try {
    const createFn = createMap[table];
    const updateFn = updateMap[table];
    const reloadFn = reloadMap[table];
    const modalName = modalMap[table];

    //if (!createFn || !updateFn || !reloadFn) {
    if (!updateFn || !reloadFn) {
      showAlert(`No create, update, or reload function defined for table: ${table}`, "error");
      return;
    }

		if (appsmith.store.modalOrigin === "create") {
			// Check if the email address changed associated with the avatar
			if (table == "users") {
				if (appsmith.store?.avatarName != inpUserEmail.text) {
					try { await apiRenameAvatar.run(); } catch (err) {}
				}
			}

			else if (table == "wallets") {
				const result = await createFn.run();
				const walletId = result[0].id;
				showAlert("wallet ID: " + walletId, "success");

				const rewards = appsmith.store.rewardHistory;

				for (let r of rewards) {
       		await qCreateWalletReward.run({
	          wallet_id: walletId,
   		      coins: r.points_awarded,
       		  reason: r.reason,
	          date: r.awarded_at
	      	});
		  	}

				const transactions = appsmith.store.transactions;

				for (let t of transactions) {
       		await qCreateWalletTransaction.run({
	          wallet_id: walletId,
   		      amount: t.amount,
       		  type: t.type,
	          date: t.transaction_date,
   		      desc: t.description
	      	});
		  	}

				await reloadFn();
  	    await closeModal(modalName);
				return;
			}
			
			await createFn.run();
      await reloadFn();
      await closeModal(modalName);
	  }
		else if (appsmith.store.modalOrigin === "fromModal") {
			await updateFn.run();
			await storeValue("currentTable", appsmith.store.previousModal);
			await storeValue("editRow", appsmith.store.cachedTriggeredRow);
	  	await removeValue("cachedTriggeredRow");
	  	await removeValue("modalOrigin");
			await jsOpenModelFromUserEdit.openModal();
	  }
		else {
			// Check if the email address changed associated with the avatar
		  //const avatarChanged = appsmith.store.avatarUpdated;
			if (table == "users") {
				if (appsmith.store.avatarName != inpUserEmail.text) {
					await storeValue("avatarRename", inpUserEmail.text);
					try { await apiRenameAvatar.run(); } catch (err) {}
				}
			}
				
      await updateFn.run();
      await reloadFn();
      await closeModal(modalName);
		}
  } catch (err) {
    showAlert("Update failed. Check logs or rollback.", "error");
  }
}}