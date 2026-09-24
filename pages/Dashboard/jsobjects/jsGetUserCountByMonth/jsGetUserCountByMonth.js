export default {
  getUserSignupByMonth() {
  const rows = qGetUserCountByMonth.data || [];

  return rows.map(r => ({
    x: r.month,              // e.g., "2025-10"
    y: Number(r.user_count)  // total users joined that month
  }));
	}
};