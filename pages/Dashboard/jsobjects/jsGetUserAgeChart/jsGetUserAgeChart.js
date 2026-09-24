export default {
  getUsersWithAge() {
    const rows = Array.isArray(qGetUsersWithAge.data)
      ? qGetUsersWithAge.data
      : [];

    if (rows.length === 0) return [];

    const decades = [
      { min: 10, max: 19, label: "10s" },
      { min: 20, max: 29, label: "20s" },
      { min: 30, max: 39, label: "30s" },
      { min: 40, max: 49, label: "40s" },
      { min: 50, max: 59, label: "50s" },
      { min: 60, max: 69, label: "60s" },
      { min: 70, max: 150, label: "70+" }
    ];

    const counts = {};
    decades.forEach(d => counts[d.label] = 0);

    rows.forEach(r => {
      const raw = r?.age ?? r?.Age ?? r?.birthdate;
      let age = Number(raw);

      if (!Number.isFinite(age) &&
          typeof raw === "string" &&
          /^\d{4}-\d{2}-\d{2}/.test(raw)) {
        const birth = new Date(raw);
        if (!Number.isNaN(birth)) {
          const today = new Date();
          age =
            today.getFullYear() -
            birth.getFullYear() -
            (today.getMonth() < birth.getMonth() ||
            (today.getMonth() === birth.getMonth() &&
             today.getDate() < birth.getDate())
              ? 1
              : 0);
        }
      }

      if (!Number.isFinite(age) || age < 0) return;

      const bucket = decades.find(d => age >= d.min && age <= d.max);
      if (bucket) counts[bucket.label] += 1;
    });

    return decades.map(d => ({
      x: d.label,
      y: counts[d.label] || 0
    }));
  }
};