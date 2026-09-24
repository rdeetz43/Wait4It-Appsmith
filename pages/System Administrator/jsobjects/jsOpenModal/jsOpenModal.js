export default {
  openEditModal: async () => {
    const table = appsmith.store.currentTable;
    const modalMap = {
      users: "modalEditUser",
      teams: "modalEditTeam",
      subscriptions: "modalEditSubscription",
      feedback: "modalEditFeedback",
      predictions: "modalEditPrediction",
		  wallets: "modalEditWallet",
			leaderboard: "modalLeaderboard"
		};
		
    const row = tableMain.triggeredRow;
 		//const index = tableMain.tableData.findIndex(row => row.ID === tableMain.triggeredRow.ID);
	  storeValue("modalOrigin", "fromDashboard");
		
		// Fetch additional user info
    if (table === "users") {
			await storeValue("avatarType", "user");
			await storeValue("avatarName", row.Email);
			await qLoadUserPoints.run({userId: row.ID})
        .then(() => {
          storeValue("userPoints", qLoadUserPoints.data[0].balance);
        })
        .catch(() => {
          showAlert("Failed to load user points", "error");
        });
				try {
					// Load full user
					const fullUser = await qLoadUserFull.run({ userId: row.ID });

					// Load preferences
					const prefs = await qLoadUserPreferences.run({ user_id: row.ID });

					// Store everything in one clean object
					storeValue("editRow", {
						...fullUser[0],
						preferences: prefs
					});

				} catch (e) {
					showAlert("Failed to load user details or preferences", "error");
				}
			await apiGetAvatar.run()
			  .then(() => {
			    const url = apiGetAvatar.data?.url;
					const normalized = jsTableHelpers.normalizeAvatarUrl(url);
			    storeValue("avatarUrl", normalized || "");
			  })
			  .catch(() => {
			    storeValue("avatarUrl", "");
			  });

				showModal(modalMap[table]);
				return;
		} 

		// Fetch additional user info
    if (table === "teams") {
			await storeValue("avatarType", "team");
			await storeValue("avatarName", String(row.ID).replace(/-/g, ""));
			await qLoadTeamPoints.run({team_id: row.ID})
        .then(() => {
          storeValue("teamPoints", qLoadTeamPoints.data[0].value);
        })
        .catch(() => {
          showAlert("Failed to load team points", "error");
        });
			await apiGetAvatar.run()
			  .then( async() => {
			    const url = apiGetAvatar.data?.url;
					const normalized = jsTableHelpers.normalizeAvatarUrl(url);
			    await storeValue("avatarUrl", normalized || "");
			  })
			  .catch( async() => {
			    await storeValue("avatarUrl", "");
			  });
    } 

		// Fetch rewards info for wallets
    else if (table === "wallets") {
			selWalletUser.setDisabled(true);
			await qLoadWallet.run({userId: row["User ID"]});
			const wallet = qLoadWallet.data[0];
			await qLoadUser.run({userId: wallet.user_id});
      const rewards = await qLoadRewardHistory.run({ wallet_id: wallet.ID })
      const transactions = await qLoadTransactions.run({ wallet_id: wallet.ID })
			await storeValue("rewardHistory", rewards);
			await storeValue("totalCoinsAwarded", rewards.reduce((sum, row) => sum + (row["Coins Awarded"] || 0), 0));
			await storeValue("transactions", transactions);
    }   

		else if (table === "subscriptions") {
			selSubUser.setDisabled(true);
    }   
    
		else if (table === "feedback") {
			selFeedUser.setDisabled(true);
    }   

		else if (table === "predictions") {
			selPredUser.setDisabled(true);
    }   

   	await storeValue("editRow", row);
		showModal(modalMap[table]);
	},
		
	openCreateNewModal: async () => {
	  await storeValue("modalOrigin", "create");

		const table = appsmith.store.currentTable;
    const modalMap = {
      users: "modalEditUser",
      teams: "modalEditTeam",
      subscriptions: "modalEditSubscription",
      feedback: "modalEditFeedback",
      predictions: "modalEditPrediction",
		  wallets: "modalEditWallet"
		};
		
    if (table === "users") {
			const user = {
				birthdate: null,
				created_at: moment().toISOString() // "2025-09-17T17:10:00.000Z"
			};

    	await storeValue("avatarType", "");
    	await storeValue("avatarName", "");
    	await storeValue("avatarUrl", "");
			await storeValue("editRow", user);
		}
		else if (table === "teams") {
			const team = {
				created_at: moment().toISOString(),
				updated_at: moment().toISOString()
			};

    	await storeValue("avatarType", "");
    	await storeValue("avatarName", "");
    	await storeValue("avatarUrl", "");
			await storeValue("editRow", team);
		}
		else if (table === "subscriptions") {
			selSubUser.setDisabled(false);
			const sub = {
				plan_type: 2,
				auto_renew: false,
				created_at: moment().toISOString(),
				start_date: new Date(),
				end_date: null
			};
			storeValue("editRow", sub);
		}
		else if (table === "feedback") {
			selFeedUser.setDisabled(false);
			const feedback = {
				rating: 5,
				submitted_at: moment().toISOString(),
			};
			storeValue("editRow", feedback);
		}
		else if (table === "predictions") {
			selPredUser.setDisabled(false);
			const prediction = {
				prediction_time: moment().toISOString()
			};
			await storeValue("editRow", prediction);
		}
		else if (table === "wallets") {
			selWalletUser.setDisabled(false);
			qLoadRewardHistory.run();
			qLoadTransactions.run();

			const transactions = [];
			const rewards = [];
			await storeValue("transactions",transactions);
			await storeValue("rewardHistory", rewards);
			
			const wallet = {
				last_transaction_date: moment().toISOString()
			};
			await storeValue("editRow", wallet);
		}
		else {
			await storeValue("editRow", null); // Clear previous data
		}

		showModal(modalMap[table]);
	},

	openCreateModal: async () => {
	  await storeValue("modalOrigin", "create");

		const table = appsmith.store.currentTable;
    const modalMap = {
      users: "modalEditUser",
      teams: "modalEditTeam",
      subscriptions: "modalEditSubscription",
      feedback: "modalEditFeedback",
      predictions: "modalEditPrediction",
		  wallets: "modalEditWallet"
		};
		
		storeValue("editRow", null); // Clear previous data
		
    if (table === "users") {
			await qGptDummyUser.run();
			const rawContent = qGptDummyUser.data.choices[0].message.content;
		
			const parsedUser = JSON.parse(rawContent);

			const user = {
  			first_name: parsedUser.name,
			  email: parsedUser.email,
  			city: parsedUser.city,
			  state: parsedUser.state,
	  		zip: parsedUser.zip,
				address: parsedUser.address,
				Birthday: new Date(parsedUser.birthdate).toISOString().slice(0, 10),
				ssn: parsedUser.ssn,
  			phone: "+1-" + parsedUser.phone,
  			tiktok_url: parsedUser.tiktok_url,
		  	linkedin_url: parsedUser.linkedin_url,
	  		twitter_url: parsedUser.x_url,
  			reddit_url: parsedUser.reddit_url,
	  		facebook_url: parsedUser.facebook_url,
  			instagram_url: parsedUser.instagram_url,
				created_at: moment().toISOString() // "2025-09-17T17:10:00.000Z"
			};

    	await storeValue("avatarType", "");
    	await storeValue("avatarName", "");
    	await storeValue("avatarUrl", "");
			await storeValue("editRow", user);
		}
    else if (table === "teams") {
			await qGptDummyTeam.run();
			const rawContent = qGptDummyTeam.data.choices[0].message.content;
			const parsedTeam = JSON.parse(rawContent);
			const team = {
  			"Team Name": parsedTeam.name,
			  Description: parsedTeam.description,
				created_at: moment().toISOString(),
				updated_at: moment().toISOString()
			};

    	await storeValue("avatarType", "");
    	await storeValue("avatarName", "");
    	await storeValue("avatarUrl", "");
			await storeValue("editRow", team);
		}
    else if (table === "subscriptions") {
			selSubUser.setDisabled(false);
			//await qGptGetDummySubscription.run();
			//const rawContent = qGptGetDummySubscription.data.choices[0].message.content;
			//const parsedSubscription = JSON.parse(rawContent);
			const sub = {
				Plan: 2,
				Auto_Renew: false,
				created_at: moment().toISOString(),
				start_date: new Date(),
				end_date: null
			};
			storeValue("editRow", sub);
		}
		else if (table === "feedback") {
			selFeedUser.setDisabled(false);
			const feedback = {
				rating: 5,
				submitted_at: moment().toISOString()
			};
			storeValue("editRow", feedback);
		}
		else if (table === "predictions") {
			selPredUser.setDisabled(false);
			await qGptDummyPrediction.run();
			const rawContent = qGptDummyPrediction.data.choices[0].message.content;
			const parsedPred = JSON.parse(rawContent);
			const prediction = {
			  confidence_score: parsedPred.confidence_score,
				prediction_time: moment().toISOString()
			};
			await storeValue("editRow", prediction);
		}
		else if (table === "wallets") {
			selWalletUser.setDisabled(false);
			const transactions = [];
			transactions.push({
				amount: 350,
   			type: "points refresh",
				description: "Added 350 coins",
   			transaction_date: moment().format("YYYY-MM-DD")
			});
			transactions.push({
				amount: 200,
   			type: "subscription",
				description: "Monthly premium payment",
   			transaction_date: moment().format("YYYY-MM-DD")
			});
			await storeValue("transactions", transactions);

			const rewards = [];
			for (let i = 0; i < 3; i++) {
  			await qGptDummyRewardHistory.run();
  			const rawContent = qGptDummyRewardHistory.data.choices[0].message.content;
  			const parsed = JSON.parse(rawContent);

  			rewards.push({
    			points_awarded: parsed.points_awarded,
    			reason: parsed.reason,
    			awarded_at: moment().format("YYYY-MM-DD")
  			});
			}
			await storeValue("rewardHistory", rewards);

			const wallet = {
				balance: 150,
				Currency: "USD",
				last_transaction_date: moment().toISOString()
			};
			await storeValue("editRow", wallet);
		}
		
		showModal(modalMap[table]);
	}
}
