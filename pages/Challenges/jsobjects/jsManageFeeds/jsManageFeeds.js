export default {
	async displayRssFeeds () {

		// Politics
		await qRssGetFeeds.run({ category: "Politics" }); 
		await storeValue("tableFeedsPolitics", qRssGetFeeds.data?.[0]?.feeds || []);
		
		// Sports
		await qRssGetFeeds.run({ category: "Sports" }); 
		await storeValue("tableFeedsSports", qRssGetFeeds.data?.[0]?.feeds || []);

		// Gaming
		await qRssGetFeeds.run({ category: "Gaming" }); 
		await storeValue("tableFeedsGaming", qRssGetFeeds.data?.[0]?.feeds || []);
		
		// Entertainment
		await qRssGetFeeds.run({ category: "Entertainment" }); 
		await storeValue("tableFeedsEntertainment", qRssGetFeeds.data?.[0]?.feeds || []);

		// Tech
		await qRssGetFeeds.run({ category: "Tech" }); 
		await storeValue("tableFeedsTech", qRssGetFeeds.data?.[0]?.feeds || []);

		// Finance
		await qRssGetFeeds.run({ category: "Finance" }); 
		await storeValue("tableFeedsFinance", qRssGetFeeds.data?.[0]?.feeds || []);

		// Music
		await qRssGetFeeds.run({ category: "Music" }); 
		await storeValue("tableFeedsMusic", qRssGetFeeds.data?.[0]?.feeds || []);
		
		// Health
		await qRssGetFeeds.run({ category: "Health" }); 
		await storeValue("tableFeedsHealth", qRssGetFeeds.data?.[0]?.feeds || []);
	
		showModal(modalRssFeeds.name);
	},

	async displayYoutubeFeeds () {

		// Politics
		await qYoutubeGetFeeds.run({ category: "Politics" });
		let fresh = qYoutubeGetFeeds.data?.[0].feeds || [];
		await storeValue("tableYoutubePolitics", fresh);

		// Sports
		await qYoutubeGetFeeds.run({ category: "Sports" });
		fresh = qYoutubeGetFeeds.data?.[0].feeds || [];
		await storeValue("tableYoutubeSports", fresh);

		// Gaming
		await qYoutubeGetFeeds.run({ category: "Gaming" });
		fresh = qYoutubeGetFeeds.data?.[0].feeds || [];
		await storeValue("tableYoutubeGaming", fresh);

		// Entertainment
		await qYoutubeGetFeeds.run({ category: "Entertainment" });
		fresh = qYoutubeGetFeeds.data?.[0].feeds || [];
		await storeValue("tableYoutubeEntertainment", fresh);

		// Tech
		await qYoutubeGetFeeds.run({ category: "Tech" });
		fresh = qYoutubeGetFeeds.data?.[0].feeds || [];
		await storeValue("tableYoutubeTech", fresh);

		// Finance
		await qYoutubeGetFeeds.run({ category: "Finance" });
		fresh = qYoutubeGetFeeds.data?.[0].feeds || [];
		await storeValue("tableYoutubeFinance", fresh);

		// Music
		await qYoutubeGetFeeds.run({ category: "Music" });
		fresh = qYoutubeGetFeeds.data?.[0].feeds || [];
		await storeValue("tableYoutubeMusic", fresh);

		// Health
		await qYoutubeGetFeeds.run({ category: "Health" });
		fresh = qYoutubeGetFeeds.data?.[0].feeds || [];
		await storeValue("tableYoutubeHealth", fresh);

		setTimeout(() => {
			showModal(modalYoutubeFeeds.name);
		}, 100);
	}
}