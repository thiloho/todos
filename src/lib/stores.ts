import { writable } from 'svelte/store';

export const isEditingItem = writable(false);
export const editingId = writable(0);
export const editingTitle = writable('');
export const editingIsImportant = writable(false);
export const editingDueDate = writable('');
