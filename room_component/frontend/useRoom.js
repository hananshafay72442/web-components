import { useEffect, useState } from 'react'
import { getMemberId } from './memberId'

// Same origin as the page; in Vite dev, /ws is proxied to Flask.
const WS_PATH = '/ws/room'
const RECONNECT_DELAY_MS = 2000
// Close codes the server uses for permanent errors: do not retry.
const FATAL_CLOSE_CODES = new Set([4004, 4400])

/**
 * Connect to the room WebSocket, join, and stay in sync.
 *
 * Socket lifecycle:
 *   1. connect to /ws/room/<token>
 *   2. send {"type":"join","memberId":...}
 *   3. receive {"type":"room","room":...} now and on every change
 *   4. if the connection drops, reconnect after 2s
 *
 * @param {string} token Room token from the URL.
 * @param {object|null} initialRoom Room already known from the create flow.
 */
export function useRoom(token, initialRoom = null) {
	const [room, setRoom] = useState(initialRoom)
	const [status, setStatus] = useState(initialRoom ? 'ready' : 'loading')
	const [error, setError] = useState('')

	useEffect(() => {
		let socket = null
		let retryTimer = null
		let stopped = false

		function connect() {
			const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
			const url = `${protocol}//${window.location.host}${WS_PATH}/${encodeURIComponent(token)}`
			socket = new WebSocket(url)

			socket.onopen = () => {
				socket.send(JSON.stringify({ type: 'join', memberId: getMemberId() }))
			}

			socket.onmessage = (event) => {
				let message
				try {
					message = JSON.parse(event.data)
				} catch {
					return
				}

				if (message.type === 'room') {
					setRoom(message.room)
					setStatus('ready')
					setError('')
				} else if (message.type === 'error') {
					setError(message.error || 'Could not join this room.')
					setStatus('error')
				}
			}

			socket.onclose = (event) => {
				// Unmount or a permanent error: stop reconnecting.
				if (stopped || FATAL_CLOSE_CODES.has(event.code)) return
				retryTimer = setTimeout(connect, RECONNECT_DELAY_MS)
			}
		}

		connect()

		// React StrictMode runs effects twice in development; this cleanup
		// closes the throwaway socket and stops its retry timer.
		return () => {
			stopped = true
			clearTimeout(retryTimer)
			if (socket) socket.close()
		}
	}, [token])

	return { room, status, error }
}
