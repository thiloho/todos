export const generateFilterQuery = (activeFilter: FormDataEntryValue | null) => {
	let text;
	switch (activeFilter) {
		case 'important':
			text = `
                SELECT * FROM user_todo
                WHERE is_important = true AND user_id = $1
            `;
			break;
		case 'active':
			text = `
                SELECT * FROM user_todo
                WHERE is_completed = false AND user_id = $1
            `;
			break;
		case 'completed':
			text = `
                SELECT * FROM user_todo
                WHERE is_completed = true AND user_id = $1
            `;
			break;
		default:
			text = `
                SELECT * FROM user_todo
                WHERE user_id = $1
            `;
			break;
	}
	return text;
};

export const generateSortQuery = (activeSort: FormDataEntryValue | null, filterText: string) => {
	let text;
	switch (activeSort) {
		case 'due-date':
			text =
				filterText +
				`
				ORDER BY
					CASE
						WHEN due_date IS NULL THEN 1
						ELSE 0
					END,
					due_date,
					created_at DESC
			`;
			break;
		default:
			text = filterText + 'ORDER BY created_at DESC';
			break;
	}
	return text;
};
