export default {
  async deleteAllUsers() {
		await qDeleteUserAll.run();
		await jsLoadUsers.showUsers();
	},
	
  async createDummyUsers(count) {
		// Load categories once
		const categories = await qUpdatePrefGetCategories.run();

    for (let i = 0; i < count; i++) {
      try {
        // 1. Call your GPT query to generate a dummy user
        const result = await qGptDummyUser.run();
        const parsedUser = JSON.parse(result.choices[0].message.content);

				// 2. Insert the user into your DB
        const newUser = await qCreateUserTest.run({
					name: parsedUser.name,
					email: parsedUser.email,
					city: parsedUser.city,
					state: parsedUser.state,
					zip: parsedUser.zip,
					address: parsedUser.address,
					birthdate: new Date(parsedUser.birthdate).toISOString().slice(0, 10),
					ssn: parsedUser.ssn,
					phone: "+1-" + parsedUser.phone,
					tiktok_url: parsedUser.tiktok_url,
					linkedin_url: parsedUser.linkedin_url,
					twitter_url: parsedUser.twitter_url,
					reddit_url: parsedUser.reddit_url,
					facebook_url: parsedUser.facebook_url,
					instagram_url: parsedUser.instagram_url,
					created_at: moment().toISOString() // "2025-09-17T17:10:00.000Z"
        });
				
				const userId = newUser[0].id;

				// 3. Generate random preferences for this user
				const prefCount = 1 + Math.floor(Math.random() * 5);
				const shuffled = [...categories].sort(() => Math.random() - 0.5);
				const selected = shuffled.slice(0, prefCount);

				// 4. Insert preferences
				for (const cat of selected) {
					await qUpdatePrefAddPref.run({
						user_id: userId,
						category_id: cat.id,
						weight: 1
					});
				}
      } catch (err) {
        showAlert(`Failed on user ${i + 1}: ${err.message}`, "error");
      }
    }

		await jsLoadUsers.showUsers();
    showAlert(`${count} dummy users created successfully`, "success");
  },

	async randomizePreferences() {
		await qUpdatePrefLoadUsers.run();
		await qUpdatePrefGetCategories.run();
		const users = qUpdatePrefLoadUsers.data;
		const categories = qUpdatePrefGetCategories.data;

		for (const user of users) {
			// 1. Remove existing preferences
			await qUpdatePrefDelPrefs.run({ user_id: user.id });

			// 2. Random number of preferences (1–5)
			const count = 1 + Math.floor(Math.random() * 5);

			// 3. Shuffle categories
			const shuffled = [...categories].sort(() => Math.random() - 0.5);

			// 4. Pick the first N categories
			const selected = shuffled.slice(0, count);

			// 5. Insert preferences (weight always = 1)
			for (const cat of selected) {
				await qUpdatePrefAddPref.run({
					user_id: user.id,
					category_id: cat.id,
					weight: 1
				});
			}
		}

		showAlert("Randomization complete", "success");
		return "Randomization complete";
	}
}