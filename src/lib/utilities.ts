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

export const generateSortQuery = (activeSort: FormDataEntryValue | null, filterText = '') => {
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

export const generateSearchQuery = (searchTerm: FormDataEntryValue | null, sortText = '') => {
	const text =
		`
		WITH FilteredTodos AS (
			SELECT ut.*
			FROM user_todo ut
			JOIN user_todo_organization uto ON ut.user_id = uto.user_id
			WHERE ut.title ILIKE CONCAT('%', '${searchTerm}', '%')
		)` + sortText.replace('user_todo', 'FilteredTodos');

	return text;
};

export const isOverdue = (dueDateString: string | null) => {
	if (!dueDateString) return false;

	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0);

	const dueDate = new Date(dueDateString);
	dueDate.setHours(0, 0, 0, 0);

	return currentDate > dueDate;
};
