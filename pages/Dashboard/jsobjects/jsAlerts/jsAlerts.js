export default {
  severityColors: {
    error: {
      bg: "#FDECEA",
      border: "#F5C6CB",
      text: "#B71C1C",
      badgeBg: "#D32F2F",
      badgeText: "#FFFFFF"
    },
    warn: {
      bg: "#FFF8E1",
      border: "#FFE082",
      text: "#8C6D1F",
      badgeBg: "#F9A825",
      badgeText: "#212121"
    },
    info: {
      bg: "#E3F2FD",
      border: "#90CAF9",
      text: "#0D47A1",
      badgeBg: "#1976D2",
      badgeText: "#FFFFFF"
    },
    debug: {
      bg: "#F5F5F5",
      border: "#E0E0E0",
      text: "#616161",
      badgeBg: "#9E9E9E",
      badgeText: "#FFFFFF"
    }
  },
	
  async showAlertDetails(row) {
    storeValue("selectedAlert", row);
    showModal(modalAlertDetails.name);
  },

	async deleteRowAndRefresh() {
    try {
      await qDeleteAlert.run();
      await qFetchAlerts.run();
      showAlert("Alerts deleted", "success");
    } catch (err) {
      showAlert("Failed to delete alert: " + err.message, "error");
    }
  },

	async deleteAllAndRefresh() {
    try {
      await qDeleteAllAlerts.run();
      await qFetchAlerts.run();
      showAlert("All alerts deleted", "success");
    } catch (err) {
      showAlert("Failed to delete alerts: " + err.message, "error");
    }
  },

  intervalId: null,

  startPolling: function() {
    if (this.intervalId) return; // prevent duplicates

    this.intervalId = setInterval(() => {
      qRefreshAlertList.run();
      qFetchAlerts.run();
    }, 30000); // 30 seconds
  },

  stopPolling: function() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
