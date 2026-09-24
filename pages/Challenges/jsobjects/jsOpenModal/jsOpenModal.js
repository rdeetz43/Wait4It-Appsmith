export default {
  openEditModal: async () => {
		await qGetChallenges.run();
		await storeValue("challengeRow", tableChallenges.triggeredRow);
		showModal(modalChallenge.name);
	},

	openEditActiveModal: async () => {
		await qGetChallengesActiveEngine.run();
		await storeValue("challengeRow", tableActive.triggeredRow);
		showModal(modalChallenge.name);
	},

	openBannedWordsModal: async () => {
		await qBannedWordsGet.run();
		await storeValue("bannedWordsRow", qBannedWordsGet.data);
		showModal(modalBannedWords.name);
	},

	openCategoryPrompts: async () => {
		await this.getCategoryPrompt();
		showModal(modalPoliticsEnrich.name);
	},

	getCategoryPrompt: async () => {
    const category = selCategoryPrompt.selectedOptionValue
      ?.trim()
      .toLowerCase();

    const data = await qPromptCategoryEnrichmentGet.run({ type: selPromptType.selectedOptionValue, category: category });

    // Update the store with the returned template
    await storeValue("enrichPromptRow", data?.[0]?.template ?? "");
  },
	
	saveCategoryPrompt: async () => {
		const category = selCategoryPrompt.selectedOptionValue
			?.trim()
			.toLowerCase();

		await qPromptCategoryEnrichmentSave.run({ type: selPromptType.selectedOptionValue, category: category, template: inpPrompt.text });
		//await this.getCategoryPrompt();
	}
}
