export default {
  async refreshAll() {
    await qGetChallenges.run();
    await qGetChallengesActiveEngine.run();
    await qGetCategoryTotals.run();
  },

  async getAllChallenges () {
		await apiGetAllChallenges.run();
		this.refreshAll();
  },

  async getYouTubeChallenges () {
		await apiGetYouTubeChallenges.run();
		this.refreshAll();
  },

  async getPollingChallenges () {
		await apiGetPollingChallenges.run();
		this.refreshAll();
	},

	async getRedditChallenges () {
		await apiGetRedditChallenges.run();
		this.refreshAll();
	},

	async getTwitterChallenges () {
		await apiGetTwitterChallenges.run();
		this.refreshAll();
	},

	async getRssChallenges () {
		await apiGetRssChallenges.run();
		this.refreshAll();
	},

	async getGNewsChallenges () {
		await apiGetGnewsChallenges.run();
		this.refreshAll();
	},

	async getWackyChallenges() {
		await apiGetWackyChallenges.run();
		this.refreshAll();
	},

	async getCreatorCrawlChallenges() {
		await apiGetCreatorCrawlChallenges.run();
		this.refreshAll();
	}
}