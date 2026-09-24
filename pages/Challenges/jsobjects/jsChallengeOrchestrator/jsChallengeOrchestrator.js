export default {
  intervalId: null,
  dataWatcherId: null,
  EMPTY_UUID: "00000000-0000-0000-0000-000000000000",

  async startActiveChallenges() {
    const result = await apiChallengeCreateAllActive.run();

    // Store RSS batch info
    storeValue("rssBatchId", result?.rss?.batchId);
    storeValue("rssCreatedCount", result?.rss?.createdCount);

    // Store Poll batch info
    storeValue("pollBatchId", result?.polls?.batchId);
    storeValue("pollCreatedCount", result?.polls?.createdCount);

    showAlert(
      `Stored RSS batch: ${appsmith.store.rssBatchId}, Poll batch: ${appsmith.store.pollBatchId}`,
      "success"
    );

    return result;
  },

	async simulatePredictions() {
		// 1️⃣ Load active challenges
		await this.withRetry(qTestGetActiveChallenges, {});
		const challenges = qTestGetActiveChallenges.data;

		// 2️⃣ Load active users
		await this.withRetry(apiChallengeGetActiveUsers, {});
		const users = apiChallengeGetActiveUsers.data.onlineUsers;

		const emotions = ["happy", "sad", "angry", "anxious"];

		// 3️⃣ Run ALL challenges simultaneously
		await Promise.all(
			challenges.map(challenge =>
				this.processChallenge(challenge, users, emotions)
			)
		);

		// 4️⃣ Done
		showAlert(
			`Simulated predictions for ${users.length} users across ${challenges.length} challenges`,
			"success"
		);
	},
	
  async lockChallenges() {
		await apiChallengeLock.run();
  },
	
  async resolveChallenges() {
		await apiChallengeResolve.run();
  },
	
  async payoutChallenges() {
		await apiChallengePayout.run();
  },
	
	async waitForActiveChallenges(maxWaitMs = 30000) {
		const start = Date.now();

		while (Date.now() - start < maxWaitMs) {
			await qGetChallengesActiveIngest.run();
			const active = qGetChallengesActiveIngest.data;

			if (active && active.length > 0) {
				return true; // success
			}

			// Wait 1 second before checking again
			await new Promise(resolve => setTimeout(resolve, 1000));
		}

		return false; // timed out
	},
	
	
	
// POLLS!!!	
  _pollTickerStarted: false,
	
	async runPollingCycle() {
	  const result = await qGetPollingCycleTimeout.run();
  	const ms = Number(result[0].open_period_ms);
    const endTime = Date.now() + ms;
    showAlert(endTime, "success");
  	storeValue("pollingEndTime", endTime);
		jsChallengeOrchestrator.startTicker();
		await apiRunPollingCycle.run();
	},
  
	startTicker() {
    if (this._pollTickerStarted) return;   // prevents multiple intervals
    this._pollTickerStarted = true;

    setInterval(() => {
      storeValue("pollTick", Date.now());
    }, 1000);
  },
	
	getPollingRemaining() {
    const end = appsmith.store.pollingEndTime;
    if (!end) return 0;
    return Math.max(0, end - Date.now());
  },

	
	
	
	
	

	async runFullCycle() {
		// Stop countdown watcher if running
		clearInterval(this.intervalId);
		this.intervalId = null;
		clearInterval(this.dataWatcherId);
		this.dataWatcherId = null;

		// Run cycle
		//await apiChallengeRunFullCycle.run();
		const result = await apiChallengeRunFullCycle.run();
  	const endTime = Date.now() + result.totalMs;
	  storeValue("cycleEndTime", endTime);
		this.startWatcher();
	},

	async startWatcher() {
		if (this.intervalId) return;

		this.intervalId = setInterval(() => {
			const remaining = this.getRemaining();

			if (remaining <= 0) {
				clearInterval(this.intervalId);
				this.intervalId = null;

				// Add a buffer so the engine finishes
				setTimeout(() => {
					this.startDataReadyWatcher();
				}, 1000);
			}
		}, 1000);
	},

	startDataReadyWatcher() {
		if (this.dataWatcherId) return;

		const timeoutAt = Date.now() + 65000;

		this.dataWatcherId = setInterval(() => {
			if (Date.now() > timeoutAt) {
				clearInterval(this.dataWatcherId);
				this.dataWatcherId = null;
				showAlert("Cycle finished but batch IDs not ready after 1 minute", "warning");
				return;
			}

			showAlert("Cycle finished, fetching results", "success");
			qGetChallengeBatchIds.run(() => {
				const batchIds = qGetChallengeBatchIds.data?.[0]?.batch_ids;

				if (Array.isArray(batchIds) && batchIds.length > 0) {
					clearInterval(this.dataWatcherId);
					this.dataWatcherId = null;

					// Store for dropdown
					storeValue("batchIds", batchIds);

					// Load data for the FIRST cycle (Cycle 1)
					showAlert("Loading completed challenges", "success");
					jsPipelineChallenge.loadCompletedChallenges();
					jsTest.stop();
				}
			});
		}, 1000);
	},
	
  getRemaining() {
    const end = appsmith.store.cycleEndTime;
    if (!end) return 0;
    return Math.max(0, end - Date.now());
  },

	sleep(ms) {
  	return new Promise(resolve => setTimeout(resolve, ms));
	},

	async withRetry(fn, args, retries = 3) {
		let attempt = 0;
		while (attempt < retries) {
			try {
				return await fn.run(args);
			} catch (err) {
				attempt++;
				const delay = 200 * Math.pow(2, attempt);
				console.log(`⚠️ Retry ${attempt}/${retries} after error`, err);
				await this.sleep(delay);
			}
		}
		throw new Error("❌ Max retries reached");
	},

	async processChallenge(challenge, users, emotions) {
		await this.withRetry(qTestGetSubchallenges, { challenge_id: challenge.id });
		const subchallenges = qTestGetSubchallenges.data;

		const optionsCache = {};
		for (const sc of subchallenges) {
			await this.withRetry(qTestGetSubchallengeOptions, { subchallenge_id: sc.id });
			optionsCache[sc.id] = qTestGetSubchallengeOptions.data || [];
		}

		for (const userId of users) {
			try {
				await this.sleep(10);

				const placeMain = Math.random() < 0.7;
				const emotion = placeMain
					? emotions[Math.floor(Math.random() * emotions.length)]
					: null;

				const subBetCount = Math.floor(Math.random() * 4);
				const selectedSubs = _.sampleSize(subchallenges, subBetCount);

				const sub_bets = selectedSubs.map(sc => {
					const options = optionsCache[sc.id];
					if (!options || options.length === 0) return null;
					const option = _.sample(options);
					return { subchallenge_id: sc.id, option_id: option.id };
				}).filter(Boolean);

				await this.withRetry(testPlaceChallengePrediction, {
					challenge_id: challenge.id,
					user_id: userId,
					emotion,
					sub_bets
				});

			} catch (err) {
				showAlert(`❌ Skipping user ${userId}: ${err.message || "Unknown error"}`, "warning");
				continue;
			}
		}
	}
}