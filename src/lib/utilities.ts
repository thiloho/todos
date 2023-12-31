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

export const generateAndExportSecretKey = async () => {
	const key = await window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
		'encrypt',
		'decrypt'
	]);

	const exportedKey = await window.crypto.subtle.exportKey('raw', key);
	return window.btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
};

export const generateKeyHash = async (key: string) => {
	const encoder = new TextEncoder();
	const encodedKey = encoder.encode(key);

	const hashBuffer = await window.crypto.subtle.digest('SHA-512', encodedKey);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

	return hashHex;
};

export const importSecretKey = async (base64Key: string) => {
	const rawKey = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
	return await window.crypto.subtle.importKey('raw', rawKey, 'AES-GCM', true, [
		'encrypt',
		'decrypt'
	]);
};

export const encryptData = async (secretKey: CryptoKey, data: string) => {
	const encodedData = new TextEncoder().encode(data);
	const iv = window.crypto.getRandomValues(new Uint8Array(12));

	const encryptedData = await window.crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv },
		secretKey,
		encodedData
	);

	return { encryptedData, iv };
};

export const decryptData = async (
	secretKey: CryptoKey,
	encryptedData: ArrayBuffer,
	iv: Uint8Array
) => {
	const decryptedData = await window.crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv },
		secretKey,
		encryptedData
	);

	return new TextDecoder().decode(decryptedData);
};
