export default {
	async createNewPollingChallenge() {
		await storeValue("pollingChallengeRow", null);
		inpPollName.setValue("");
		selPollQuestion.setValue("");
		inpPollPred1.setValue("");
		inpPollPred2.setValue("");
		inpPollPred3.setValue("");
		inpPollPred4.setValue("");
		imgPoll.setImage(null);
		showModal(modalEditPoll.name);
	},
	
	async openPollingChallenge() {    
		await storeValue("pollingChallengeRow", null);
		await storeValue("pollingChallengeImageUrlMeta1", "");
		await storeValue("pollingChallengeImageUrlMeta2", "");
		inpPollPred1.setValue("");
		inpPollPred2.setValue("");
		inpPollPred3.setValue("");
		inpPollPred4.setValue("");
		await qPollingChallengeGet.run();
		const pollingItem = qPollingChallengeGet.data[0];
		await storeValue("pollingChallengeRow", pollingItem);
		await storeValue("pollingChallengeImageUrl", `${pollingItem.image_url}`);
		await storeValue("pollingChallengeImageUrlMeta1", pollingItem.meta_image_urls?.[0] ? pollingItem.meta_image_urls[0] + "?v=" + Date.now() : "");
		await storeValue("pollingChallengeImageUrlMeta2", pollingItem.meta_image_urls?.[1] ? pollingItem.meta_image_urls[1] + "?v=" + Date.now() : "");
		await storeValue("pollingChallengeImageUrlMeta3", pollingItem.meta_image_urls?.[2] ? pollingItem.meta_image_urls[2] + "?v=" + Date.now() : "");

		showModal(modalEditPoll.name);
	},

  async savePollingChallenge() {
		try {
			if (appsmith.store.pollingChallengeRow) {
				await qPollingChallengeSave.run();
				showAlert("Polling challenge updated!", "success");
			} else {
				const result = await qPollingChallengeCreate.run();
				await storeValue("pollingChallengeRow", result[0]);
				showAlert("Polling challenge created!", "success");
			}
		} catch (e) {
			showAlert("Save failed: " + e.message, "error");
			console.log("savePollingChallenge error:", e);
		}
		await qPollingChallengesGetAll.run();
		closeModal(modalEditPoll.name);
  },

  async deletePollingChallenge() {
		try {
			if (appsmith.store.pollingChallengeRow) {
				await qPollingChallengeDelete.run();
				showAlert("Polling challenge deleted!", "success");
				await qPollingChallengesGetAll.run();
				await storeValue("pollingChallengeRow", null);
			} else {
				showAlert("Polling challenge not delete!", "error");
			}
		} catch (e) {
			showAlert("Delete failed: " + e.message, "error");
			console.log("deletePollingChallenge error:", e);
		}
  },
	
	async uploadPollingChallengeImage(metaIndex = 0) {
		let file;
		if (metaIndex === 1) {
			file = pickerMetaImage.files[0];
		} else if (metaIndex === 2) {
			file = pickerMetaImage2.files[0];
		} else if (metaIndex === 3) {
			file = pickerMetaImage3.files[0];
		} else {
			file = pickerMetaImage.files[0];   // main image
		}
		if (!file) {
			showAlert("No file selected", "error");
			return;
		}

		const allowedTypes = ["image/png", "image/jpeg"];
		if (!allowedTypes.includes(file.type)) {
			showAlert("Invalid file type", "error");
			return;
		}

		// 1. Update timestamp
		await qPollingChallengeBumpUpdated.run();

		// 2. Refresh row
		await qPollingChallengeGet.run({
			id: appsmith.store.pollingChallengeRow.id,
			t: Date.now()
		});

		// 3. Update store
		await storeValue("pollingChallengeRow", qPollingChallengeGet.data[0]);

		// 4. Upload
		await storeValue("pollingChallengeFile", file);
		await storeValue("pollingChallengeId", appsmith.store.pollingChallengeRow.id);
		await storeValue("pollingChallengeMetaIndex", metaIndex);

		const result = await apiUploadPollingChallengeImage.run();

		// 5. Cache-busted URL
		const version = appsmith.store.pollingChallengeRow.updated_at;
		const url = `${result.url}?v=${version}`;

		if (metaIndex > 0) {
			await storeValue("pollingChallengeImageUrlMeta${metaIndex+1}", url);
		} else {
			await storeValue("pollingChallengeImageUrl", url);
		}

		showAlert("Image uploaded", "success");
	},

	// Validate avatar file types
	validateFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
  },
}