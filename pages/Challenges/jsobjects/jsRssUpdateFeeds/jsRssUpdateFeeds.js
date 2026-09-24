export default {
  async deleteFeed(category, tableRef) {
    try {
      await qRssRemoveFeed.run({
        category,
        url: tableRef.selectedRow.url,
        source: tableRef.selectedRow.source
      });

      await qRssGetFeeds.run({ category });
			const feeds = (qRssGetFeeds.data.length > 0 && qRssGetFeeds.data[0].feeds) ? qRssGetFeeds.data[0].feeds : [];
      await storeValue(`tableFeeds${category}`, feeds);

      showAlert("Feed deleted", "success");
    } catch (e) {
      showAlert("Error: " + e.message, "error");
    }
  },
  async deleteAllFeeds (category) {
		try {
    	await qRssRemoveCategoryFeeds.run({category});
			await qRssGetFeeds.run({category});
			const feeds = (qRssGetFeeds.data.length > 0 && qRssGetFeeds.data[0].feeds) ? qRssGetFeeds.data[0].feeds : [];
			await storeValue(`tableFeeds${category}`, feeds);		
		} catch (e) {
  		showAlert("Error: " + e.message, "error");
		}
	},

	// Single-category function stays the same
  async enableAllFeeds(category) {
    try {
      const storeKey = `tableFeeds${category}`;
      let feedsRaw = appsmith.store[storeKey];
      let feeds = [];

      if (typeof feedsRaw === "string") {
        try { feeds = JSON.parse(feedsRaw || "[]"); } catch { feeds = []; }
      } else if (Array.isArray(feedsRaw)) {
        feeds = feedsRaw;
      }

      // ✅ Toggle all to enabled
      feeds = feeds.map(f => ({ ...f, enabled: true }));

      await storeValue(storeKey, feeds);

      await qRssSaveFeeds.run({
        category,
        feedsJson: JSON.stringify(feeds)
      });

      showAlert(`✅ All feeds enabled for ${category}`, "success");
    } catch (e) {
      showAlert(`Error enabling feeds for ${category}: ${e.message}`, "error");
    }
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

	async disableAllFeeds (category) {
    try {
		  const storeKey = `tableFeeds${category}`;

			let feedsRaw = appsmith.store[storeKey];
      let feeds = typeof feedsRaw === "string" ? JSON.parse(feedsRaw || "[]") : Array.isArray(feedsRaw) ? feedsRaw : [];

      // ✅ Toggle all to disabled
      feeds = feeds.map(f => ({ ...f, enabled: false }));

      await storeValue(storeKey, feeds);

      await qRssSaveFeeds.run({
        category,
        feedsJson: JSON.stringify(feeds)
      });

      showAlert(`🚫 All feeds disabled for ${category}`, "success");
    } catch (e) {
      showAlert("Error: " + e.message, "error");
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