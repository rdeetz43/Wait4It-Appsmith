export default {
	async showAllUserSettings () {
		const result = await apiActiveUsersGetOnline.run();
		inpOnlineUserCount.setValue(result.onlineCount);
		inpTotalUserCount.setValue(result.totalUsers);
		inpOnlineTimeout.setValue(result.ttlSeconds);
		showModal(modalUserSettings.name);
	},

	async offlineAll () {
		const result = await apiActiveUsersOfflineAll.run();
		inpOnlineUserCount.setValue(result.onlineCount);
		inpTotalUserCount.setValue(result.totalUsers);
		inpOnlineTimeout.setValue(result.ttlSeconds);
	},
	
	async onlineAll () {
		const result = await apiActiveUsersOnlineAll.run();
		inpOnlineUserCount.setValue(result.onlineCount);
		inpTotalUserCount.setValue(result.totalUsers);
		inpOnlineTimeout.setValue(result.ttlSeconds);
	},
	
	async onlineRandom () {
		const result = await apiActiveUsersOnlineRandom.run();
		inpOnlineUserCount.setValue(result.onlineAfter);
		inpTotalUserCount.setValue(result.totalUsers);
		inpOnlineTimeout.setValue(result.ttlSeconds);
	},
	
	async getTtl () {
		const result = await apiActiveUsersTtlGet.run();
		inpOnlineTimeout.setValue(result.ttlSeconds);
	},
	
	async setTtl () {
		const result = await apiActiveUsersTtlSet.run();
		inpOnlineTimeout.setValue(result.ttlSeconds);
	}
}