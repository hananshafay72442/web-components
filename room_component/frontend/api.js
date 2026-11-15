// HTTP calls used by the room component. Only creation is an HTTP request;
// joining and live updates go over the WebSocket (see useRoom.js).
const API_BASE = '/api'

async function request(path, options) {
	const res = await fetch(`${API_BASE}${path}`, options)
	const data = await res.json().catch(() => ({}))
	if (!res.ok) throw new Error(data.error || 'Request failed.')
	return data
}

export function createRoom(room) {
	return request('/room', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(room),
	})
}
