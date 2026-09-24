export default {
  async saveFeed(category, row, index) {
    const storeKey = `tableYoutube${category}`;
    const feeds = appsmith.store[storeKey] || [];

showAlert(row.channel_id, "success");
showAlert(row.source_name, "success");

		const feed = {
      id: row.id,
      channel_id: row.channel_id,
      source_name: row.source_name,
      notes: row.notes ?? null,
      enabled: row.enabled ?? true,
      category
    };

    if (!feed.channel_id || !feed.source_name) {
      showAlert("Channel ID and Source Name are required", "error");
      return;
    }

    if (typeof index === "number" && index >= 0) {
      // UPDATE
      const newFeeds = [...feeds];
      newFeeds[index] = feed;

      await qYoutubeUpdateFeed.run(feed);
      await storeValue(storeKey, newFeeds);

      showAlert("Feed updated", "success");
      return;
    }

    // INSERT
    const newFeeds = [...feeds, feed];

    await qYoutubeSaveFeed.run(feed);
    await storeValue(storeKey, newFeeds);

    showAlert("Feed added", "success");
  }
}