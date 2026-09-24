export default {
  async uploadAvatar(params) {
    const { type } = params;
		
    let file;
		if (type === "user")
	    file = pickerUser.files[0];
		else
      file = pickerTeam.files[0];
		
    if (!file) throw new Error("No file selected");
 		const allowedTypes = ["image/png", "image/jpeg"];
		if (!jsTableHelpers.validateFileType(file, allowedTypes)) {
		  throw new Error("❌ Invalid file type. Only PNG or JPEG avatars are allowed.");
		}

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showAlert("File exceeds 5MB limit");
      return;
    }

		if (type === "user")
			await storeValue("avatarName", appsmith.store.editRow.email);
		else
			await storeValue("avatarName", String(appsmith.store.editRow.ID).replace(/-/g, ""));

		await storeValue("avatarType", type);
		await storeValue("avatarFile", file);

		await apiUploadAvatar.run();
		const getUrl = await apiGetAvatar.run();
		await storeValue("avatarUrl", getUrl.url.trim());
  }
}