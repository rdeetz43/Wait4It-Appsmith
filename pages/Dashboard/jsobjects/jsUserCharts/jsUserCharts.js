export default {
  getUsersByState() {
    const rows = Array.isArray(qGetUsersByState?.data) ? qGetUsersByState.data : [];

    return rows.map(r => ({
      x: String(r.state_code ?? r.state ?? "Unknown"),
      y: Number(r.cnt ?? r.count ?? 0)
    }));
  },
	
  getUserPreferences () {
    return qGetUserCategoryPreferences.data.map(r => ({
      x: String(r.category_name),
      y: Number(r.user_count)
    }));
  },
	
	getActiveUserPreferences () {
		return apiActiveUsersGetPreferences.data.preferences.map(r => ({
			x: String(r.category_name),
			y: Number(r.user_count)
		}));
	}
};