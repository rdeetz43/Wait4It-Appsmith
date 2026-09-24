export default {
  removeChallenges () {
    qRemoveChallengeTestData.run();
    qGetChallenges.run();
    qGetChallengesActiveEngine.run();
    qGetChallengeResults.run();
		qGetCategoryTotals.run();
		qSubChallengeRemoveAll.run();

    // Clear UI state
		storeValue("batchIds", []);
    storeValue("testCycleResults", []);
		storeValue("completedResults", []);
    storeValue("batchTotalVotes", "");
    storeValue("batchEmotionTotals", []);
		
		storeValue("cycleEndTime", 0);

    // Refresh the batch ID query so the watcher sees the empty DB state
    qGetChallengeBatchIds.run();
		
		jsTest.flushLogs();
  }
}
