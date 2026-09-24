export default {
	async deleteBannedWord () {
		await qBannedWordDelete.run();
		await qBannedWordsGet.run();
		await storeValue("bannedWordsRow", qBannedWordsGet.data);
	},
	
	async addBannedWord () {
		await qBannedWordAdd.run();
		await qBannedWordsGet.run();
		await storeValue("bannedWordsRow", qBannedWordsGet.data);
		await qBannedWordsGet.run();
	}
}