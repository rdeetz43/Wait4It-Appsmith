export default {
  async resetTables() {
    await Promise.all([
      qGetChallenges.run(),
      qGetChallengesActiveEngine.run(),
      qGetCategoryTotals.run(),
			qPollingChallengesGetAll.run(),
			qVideoChallengeGetAll.run(),
    ]);
  }
}
