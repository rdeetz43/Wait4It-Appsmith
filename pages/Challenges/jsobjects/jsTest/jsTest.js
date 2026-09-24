export default {
  async flushLogs () { 
		apiLogsFlush.run(() => {
			storeValue("engineLogs", []);     // clear UI immediately
			apiLogsGetLogs.run();              // pull fresh logs
		});
	},

  intervalId: null,

	async start() {
		if (this.intervalId) return;

		this.intervalId = setInterval(() => {
			apiLogsGetLogs.run();
		}, 2000);
	},

	stop() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	},
	
	initAdmin() {
		storeValue("adminToken", "e4f8c9e1a7b2f3c4d9e8a1b7a6f4e3d2a9b8c7e6d5f4a3b2c1d0e9f8a7b6c7");
	}
}
