// A "member" is this browser, identified by a random ID kept in localStorage.
// The server uses it to count unique members: opening the same room again in
// the same browser does not increase the count.
const STORAGE_KEY = 'room-member-id'

// Used when localStorage is unavailable (private mode, blocked storage).
// The ID then only lives as long as the page stays open.
let memoryId = null

export function getMemberId() {
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY)
		if (stored) return stored

		const id = createId()
		window.localStorage.setItem(STORAGE_KEY, id)
		return id
	} catch {
		if (!memoryId) memoryId = createId()
		return memoryId
	}
}

function createId() {
	if (window.crypto?.randomUUID) return window.crypto.randomUUID()
	return `m-${Date.now()}-${Math.random().toString(36).slice(2)}`
}
