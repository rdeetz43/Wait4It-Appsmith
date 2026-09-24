export default {
  async promoteIngestToActivePolls() {
    try {
      await apiPromotePollsToActive.run();

      await Promise.all([
        qGetChallenges.run(),
        qGetChallengesActiveEngine.run()
      ]);

    } catch (err) {
      showAlert("Error promoting ingest → active: " + err.message, "error");
    }
  },

	async promoteIngestToActive() {
    try {
      await apiPromoteIngestToActive.run();

      await Promise.all([
        qGetChallenges.run(),
        qGetChallengesActiveEngine.run()
      ]);

    } catch (err) {
      showAlert("Error promoting ingest → active: " + err.message, "error");
    }
  },

	async promoteActiveToPublished() {
    try {
      await apiPromoteActiveToPublish.run();

      await Promise.all([
        qGetChallenges.run(),
        qGetChallengesActiveEngine.run()
      ]);

    } catch (err) {
      showAlert("Error promoting active → publish: " + err.message, "error");
    }
  },

	getCategoryQuotas () {
    const quotas = apiCategoryQuotasGet.data?.quotas || {};

    return Object.entries(quotas).map(([category, count]) => ({
      category,
      quota: Number(count)
    }));
  },

	openPipelineModalWithQuotas () {
		return apiCategoryQuotasGet.run()
			.then(() => apiIngestionConfigGet.run())
			.then(() => {
				showModal(modalManagePipeline.name);
			})
			.catch(() => {
				showModal(modalManagePipeline.name);
			});
	},

  // Refresh quotas while modal stays open
  refreshQuotasInModal () {
    return apiCategoryQuotasGet.run();
  }
}