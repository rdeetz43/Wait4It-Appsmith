export default {
  copySchema() {
    const rows = tableSchema?.tableData;

    if (!Array.isArray(rows) || rows.length === 0) {
      showAlert("No schema data to copy.", "warning");
      return;
    }

    const headers = Object.keys(rows[0]);

    const csvRows = [
      headers.join(","),

      // Add a blank line between each row for readability
      ...rows.map(r =>
        "\n" + headers.map(h => `"${r[h] ?? ""}"`).join(",")
      )
    ];

    const csv = csvRows.join("");

    copyToClipboard(csv);
    showAlert("Schema CSV copied to clipboard!", "success");
  },

	markdownTable() {
		const rows = tableToolsQuery.tableData;
		if (!rows.length) return "";

		const headers = Object.keys(rows[0]);

		const mdFormatValue = v =>
			typeof v === "object" && v !== null
				? "```json\n" + JSON.stringify(v, null, 2) + "\n```"
				: v ?? "";

		const headerRow = `| ${headers.join(" | ")} |`;
		const dividerRow = `| ${headers.map(() => "---").join(" | ")} |`;

		const dataRows = rows.map(r =>
			`| ${headers.map(h => mdFormatValue(r[h])).join(" | ")} |`
		);

		return [headerRow, dividerRow, ...dataRows].join("\n");
	},

	asciiTable() {
		const rows = tableToolsQuery.tableData;
		if (!rows.length) return "";

		const headers = Object.keys(rows[0]);

		const isObject = v => typeof v === "object" && v !== null;

		const asciiFormatValue = v => {
			if (!isObject(v)) return String(v ?? "");
			if (Array.isArray(v)) return `Array(${v.length})`;
			return `Object(${Object.keys(v).length} keys)`;
		};

		const formattedRows = rows.map(r =>
			headers.map(h => asciiFormatValue(r[h]))
		);

		const colWidths = headers.map((h, i) => {
			const values = formattedRows.map(r => r[i]);
			const maxValueWidth = Math.max(...values.map(v => v.length));
			return Math.max(h.length, maxValueWidth);
		});

		const pad = (text, width) =>
			text + " ".repeat(width - text.length);

		const makeDivider = () =>
			"+" + colWidths.map(w => "-".repeat(w + 2)).join("+") + "+";

		const makeRow = cells =>
			"|" + cells.map((c, i) => " " + pad(c, colWidths[i]) + " ").join("|") + "|";

		const divider = makeDivider();
		const headerRow = makeRow(headers);
		const dataRows = formattedRows.map(r => makeRow(r));

		return [
			divider,
			headerRow,
			divider,
			...dataRows,
			divider
		].join("\n");
	}
}