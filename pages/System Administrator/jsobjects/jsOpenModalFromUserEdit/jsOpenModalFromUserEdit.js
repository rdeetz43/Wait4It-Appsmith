export default {
  openModal: () => {
    
		const table = appsmith.store.currentTable;

		const modalMap = {
      subscriptions: "modalEditSubscription",
      feedback: "modalEditFeedback",
      predictions: "modalEditPrediction",
		  wallets: "modalEditWallet"
		};
		
    //const row = tableMain.triggeredRow;
		
		// Fetch rewards info for wallets
    if (table === "wallets") {
      //qLoadRewardHistory.run({ user_id:appsmith.store.editRow.id })
			//qLoadUser.run({ user_id: appsmith.store.editRow.id })
    }   

    else if (table === "subscriptions" ||
					   table === "feedback" ||
						 table === "predictions") {
			//qLoadUser.run({ user_id: appsmith.store.editRow.id })
    }   

		showModal(modalMap[table]);
	}
}
