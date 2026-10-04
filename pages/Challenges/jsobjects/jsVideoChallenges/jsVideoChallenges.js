export default {
  async enableAllVideos() {
		await	qVideoEnableAll.run();
		await	qVideoChallengeGetAll.run();
  },
	
  async disableAllVideos() {
		await	qVideoDisableAll.run();
		await	qVideoChallengeGetAll.run();
  },
	
	async createNewVideoChallenge() {
		await storeValue("videoChallengeRow", null);
		inpVideoUrl.setValue("");
		inpThumbnailUrl.setValue("");
		inpVideoQuestion.setValue("");
		inpVideoTopic.setValue("");
		inpVideoSnippet.setValue("");
		inpVideoPred1.setValue("");
		inpVideoPred2.setValue("");
		inpVideoPred3.setValue("");
		inpVideoPred4.setValue("");
		inpPauseTime.setValue("");
		switchVideoEnabled = true;
		selCorrectAnswer.setSelectedOption(0);
		selVideoPlatform.setSelectedOption('tiktok');
		selVideoCategory.setSelectedOption(0);
		showModal(modalVideoChallenges.name);
	},
	
	async openVideoChallenge() {    
		await storeValue("videoChallengeRow", null);
		inpVideoPred1.setValue("");
		inpVideoPred2.setValue("");
		inpVideoPred3.setValue("");
		inpVideoPred4.setValue("");
		await qVideoChallengeGet.run();
		const videoItem = qVideoChallengeGet.data[0];
		await storeValue("videoChallengeRow", videoItem);

		showModal(modalVideoChallenges.name);
	},

	async saveVideoChallenge() {
		try {
			if (appsmith.store.videoChallengeRow) {
				await qVideoChallengeSave.run();
				showAlert("Video challenge updated!", "success");
			} else {
				const result = await qVideoChallengeCreate.run();
				await storeValue("videoChallengeRow", result[0]);
				showAlert("Video challenge created!", "success");
			}
		} catch (e) {
			showAlert("Save failed: " + e.message, "error");
			console.log("saveVideoChallenge error:", e);
		}

		if (qVideoChallengeGetAll?.run) {
			await qVideoChallengeGetAll.run();
		}

		setTimeout(() => {
			closeModal(modalVideoChallenges.name);
		}, 50);
	},

  async deleteVideoChallenge() {
		try {
  		await qVideoChallengeDelete.run();
			showAlert("Video challenge deleted!", "success");
			await qVideoChallengeGetAll.run();
			await storeValue("videoChallengeRow", null);
		} catch (e) {
			showAlert("Delete failed: " + e.message, "error");
			console.log("deleteVideoChallenge error:", e);
		}
  },

	async uploadVideoThumbnail() {
		const file = pickerSaveVideoImage.files[0];
		if (!file) {
			showAlert("No image selected", "error");
			return;
		}

		try {
			await storeValue("videoChallengeId", appsmith.store.videoChallengeRow.id);

			const result = await apiUploadVideoChallengeImage.run();
			if (!result || !result.url) {
				showAlert("Backend failed to upload thumbnail", "error");
				return;
			}

			const version = appsmith.store.videoChallengeRow.updated_at;

			// ⭐ FIX: add a random cache-buster
			const finalUrl = `${result.url}?v=${version}&u=${Math.random()}`;

			// FIX: delay widget update by one microtask
			setTimeout(() => {
				inpThumbnailUrl.setValue(finalUrl);
			}, 0);

			await storeValue("videoThumbnailUrl", finalUrl);

			showAlert("Thumbnail uploaded:" + finalUrl, "success");
		} catch (err) {
			console.log("Thumbnail upload error:", err);
			showAlert(`Thumbnail upload failed: ${err?.message || "Unknown error"}`, "error");
		}
	},

	async uploadVideoChallengeImage(metaIndex = 0) {
		const file = pickerMetaImage.files[0];   // main image
		if (!file) {
			showAlert("No file selected", "error");
			return;
		}

		const allowedTypes = ["image/png", "image/jpeg"];
		if (!allowedTypes.includes(file.type)) {
			showAlert("Invalid file type", "error");
			return;
		}

		// Update store
		await storeValue("pollingChallengeRow", qVideoChallengeGet.data[0]);

		// Upload
		await storeValue("videoChallengeFile", file);
		await storeValue("videoChallengeId", appsmith.store.pollingChallengeRow.id);
		await storeValue("videoChallengeIndex", metaIndex);

		const result = await apiUploadVideoChallengeImage.run();

		// Cache-busted URL
		const version = appsmith.store.videoChallengeRow.updated_at;
		const url = `${result.url}?v=${version}`;

		await storeValue("pollingChallengeImageUrl", url);
		showAlert("Image uploaded", "success");
	},

	// Validate avatar file types
	validateFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
  }
}