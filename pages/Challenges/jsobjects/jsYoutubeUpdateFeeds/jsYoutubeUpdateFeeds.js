export default {
	async deleteFeed(category, row) {
		const storeKey = `tableYoutube${category}`;
		const feeds = appsmith.store[storeKey] || [];

		// Remove from DB
		await qYoutubeRemoveFeed.run({ id: row.id });

		// Remove from store
		const newFeeds = feeds.filter(f => f.id !== row.id);
		await storeValue(storeKey, newFeeds);

		showAlert("Feed deleted", "success");
	},

	// Single-category function stays the same
	async enableAllFeeds(category) {
		const storeKey = `tableYoutube${category}`;
		const feedsRaw = appsmith.store[storeKey];

		if (!Array.isArray(feedsRaw)) {
			showAlert(`No feeds loaded for ${category}`, "warning");
			return;
		}

		const updated = feedsRaw.map(f => ({ ...f, enabled: true }));
		await storeValue(storeKey, updated);

		qYoutubeSaveFeeds.run({category: category, enabled: true});

		showAlert(`All feeds enabled for ${category}`, "success");
	},

	async disableAllFeeds(category) {
		const storeKey = `tableYoutube${category}`;
		const feedsRaw = appsmith.store[storeKey];

		if (!Array.isArray(feedsRaw)) {
			showAlert(`No feeds loaded for ${category}`, "warning");
			return;
		}

		const updated = feedsRaw.map(f => ({ ...f, enabled: false }));
		await storeValue(storeKey, updated);

		qYoutubeSaveFeeds.run({category: category, enabled: false});

		showAlert(`All feeds disabled for ${category}`, "success");
	},
	
  // Parallel wrapper
  async enableAllFeedsAcrossCategories() {
    try {
      const storeKeys = Object.keys(appsmith.store)
        .filter(k => k.startsWith("tableFeeds"));

      const tasks = storeKeys.map(storeKey => {
        const category = storeKey.replace("tableFeeds", "");
        return this.enableAllFeeds(category);
      });

      // Run all in parallel
      await Promise.all(tasks);

      showAlert("✅ All feeds enabled across all categories!", "success");
    } catch (e) {
      showAlert("Error enabling feeds across categories: " + e.message, "error");
    }
  },

  async disableAllFeedsAcrossCategories() {
    try {
      const storeKeys = Object.keys(appsmith.store)
        .filter(k => k.startsWith("tableFeeds"));

      const tasks = storeKeys.map(storeKey => {
        const category = storeKey.replace("tableFeeds", "");
        return this.disableAllFeeds(category);
      });

      await Promise.all(tasks);

      showAlert("🚫 All feeds disabled across all categories!", "success");
    } catch (e) {
      showAlert("Error disabling feeds across categories: " + e.message, "error");
    }
  }
}