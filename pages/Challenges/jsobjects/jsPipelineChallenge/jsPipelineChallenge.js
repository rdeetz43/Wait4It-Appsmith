export default {
	loadCompletedChallenges() {
		return apiChallengeGetCompleted.run().then(() => {
			const data = apiChallengeGetCompleted.data;

			// Save the full results for the tab control
			storeValue("testCycleResults", data);

			// --- TOTAL VOTES ACROSS BATCH ---
			const totalVotes = data.reduce(
				(sum, challenge) =>
					sum +
					challenge.emotion_counts.reduce((s, e) => s + e.count, 0),
				0
			);
			storeValue("batchTotalVotes", totalVotes);

			// --- TOTALS PER EMOTION ---
			const emotions = ["happy", "sad", "angry", "anxious"];
			const totalsByEmotion = emotions.reduce((acc, emotion) => {
				acc[emotion] = data.reduce(
					(sum, challenge) =>
						sum +
						(challenge.emotion_counts.find((e) => e.emotion === emotion)?.count ||
							0),
					0
				);
				return acc;
			}, {});
			storeValue("batchEmotionTotals", totalsByEmotion);

			return {
				totalVotes,
				totalsByEmotion
			};
		});
	},
	
	openChallengeManagement () {
		apiChallengeGetActiveUsers.run();
		const totalUsers = apiChallengeGetActiveUsers.data.totalUsers;
		storeValue("userCount", totalUsers);

		return apiChallengeGetRules.run()
			.then(() => {
				storeValue("challengeRules", apiChallengeGetRules.data);
				return apiChallengeGetPayoutRules.run();
			})
			.then(() => {
				storeValue("payoutRules", apiChallengeGetPayoutRules.data);
				showModal(modalChallengeMgmt.name);
			})
			.catch(() => {
				showModal(modalChallengeMgmt.name);
			});
	},
	
  getChallengeDefaults() {
    const defaults = apiChallengeGetRules.data.defaults || [];
    const payoutRules = appsmith.store.payoutRules.payout_rules || [];

    return defaults.map(d => {
      const pr = payoutRules.find(p => p.id === d.payout_rule_id);

      return {
        ...d,
				category: d.source === "polling" ? "Polling" : (d.category ?? "All Categories"),
				sponsor: d.sponsor === "default"
          ? "Default Sponsor"
          : (d.sponsor ?? ""),
        payout_rule_id: d.payout_rule_id,
      };
    });
  },
	
	saveChallengeRule () {
    return apiChallengeSetRule.run()
      .then(() => apiChallengeGetRules.run());
  },
	
	savePayoutRule () {
  	return apiChallengeSetPayoutRule.run()
    	.then(() => jsPipelineChallenge.openChallengeManagement())
	},

	saveHouseTake () {
  	return apiChallengeSetHouseTake.run()
		  .then(() => jsPipelineChallenge.openChallengeManagement())
	},
}