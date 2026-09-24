export default {
	async createNewVideoChallenge() {
		await storeValue("videoChallengeRow", null);
		inpVideoUrl.setValue("");
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
		selVideoPlatform.setSelectedOption(0);
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
	
	async uploadVideoThumbnail2() {
		const videoUrl = inpVideoUrl.text;
		if (!videoUrl) {
			showAlert("No TikTok video URL provided", "error");
			return;
		}

		try {
			// 1. Fetch TikTok oEmbed metadata
			const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;
			const metaRes = await fetch(oembedUrl);

			if (!metaRes.ok) {
				showAlert("Failed to fetch TikTok metadata", "error");
				return;
			}

			const meta = await metaRes.json();
			const thumbnailUrl = meta.thumbnail_url;

			if (!thumbnailUrl) {
				showAlert("TikTok returned no thumbnail", "error");
				return;
			}

			// 2. Store values for backend
			await storeValue("videoThumbnailFileUrl", thumbnailUrl);
			await storeValue("videoChallengeId", appsmith.store.videoChallengeRow.id);

			// 3. Call backend upload
			const result = await apiUploadVideoChallengeImage.run();

			if (!result || !result.url) {
				showAlert("Backend failed to upload thumbnail", "error");
				return;
			}

			// 4. Cache-busted URL
			const version = appsmith.store.videoChallengeRow.updated_at;
			const finalUrl = `${result.url}?v=${version}`;

			// 5. Store final URL
			await storeValue("videoThumbnailUrl", finalUrl);

			showAlert("Thumbnail uploaded", "success");

		} catch (err) {
			console.log(err);
			showAlert("Error uploading TikTok thumbnail", "error");
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