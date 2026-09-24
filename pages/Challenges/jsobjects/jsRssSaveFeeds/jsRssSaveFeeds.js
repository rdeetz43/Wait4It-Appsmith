export default {
  async saveCategory(category, tableRef) {
 		const storeKey = `tableFeeds${category}`;
    let feedsRaw = appsmith.store[storeKey];
    let feeds = [];

    if (typeof feedsRaw === "string") {
      try { feeds = JSON.parse(feedsRaw || "[]"); } catch { feeds = []; }
    } else if (Array.isArray(feedsRaw)) {
      feeds = feedsRaw;
    }

    if (tableRef.newRow) {
      feeds.push(tableRef.newRow);
    } else {
      const idx = tableRef.updatedRowIndex;
      if (typeof idx === "number" && idx >= 0 && idx < feeds.length) {
        feeds[idx] = tableRef.updatedRow;
      }
    }

    feeds = feeds.map(f => ({ ...f, enabled: f.enabled ?? true }));

    await storeValue(storeKey, feeds);

    try {
      await qRssSaveFeeds.run({ feedsJson: JSON.stringify(feeds), category });
      showAlert("Row saved", "success");
    } catch (e) {
      showAlert("Save failed: " + e.message, "error");
    }
  },
	
	saveRow(category, row, index) {
		const storeKey = `tableFeeds${category}`;
		let raw = appsmith.store[storeKey];
		let feeds;

		if (Array.isArray(raw)) {
			feeds = raw;
		} else if (typeof raw === "string") {
			try { feeds = JSON.parse(raw); } catch { feeds = []; }
		} else {
			feeds = [];
		}

		// Update the correct row using triggeredRowIndex
		if (typeof index === "number") {
			feeds[index] = row;
		} else {
			showAlert("No index provided", "error");
			return false;
		}

		storeValue(storeKey, feeds);

		return qRssSaveFeeds
			.run({ feedsJson: JSON.stringify(feeds), category })
			.then(() => true)
			.catch(() => false);
	}
};
