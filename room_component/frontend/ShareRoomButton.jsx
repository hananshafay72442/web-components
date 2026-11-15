import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * "Share" button that only appears on a room page (/something/rooms/<token>).
 * Drop it into any navbar. It uses the Web Share API when available and
 * falls back to the clipboard.
 *
 * The toast uses class "toast" only as a styling hook; no CSS ships with this
 * component.
 */
export default function ShareRoomButton() {
	const location = useLocation()
	const [toast, setToast] = useState('')
	const timer = useRef(null)

	const onRoomPage = /\/rooms\/[^/]+\/?$/.test(location.pathname)

	useEffect(() => () => clearTimeout(timer.current), [])

	function showToast(message) {
		setToast(message)
		clearTimeout(timer.current)
		timer.current = setTimeout(() => setToast(''), 2500)
	}

	async function handleShare() {
		const url = `${window.location.origin}${location.pathname}`

		// Native share sheet (mobile / supported browsers).
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Join my room',
					text: 'Join my room using this link:',
					url,
				})
				return
			} catch (err) {
				if (err?.name === 'AbortError') return
				// Fall through to the clipboard.
			}
		}

		try {
			await navigator.clipboard.writeText(url)
			showToast('Link copied to clipboard')
		} catch {
			window.prompt('Copy this link to invite people:', url)
		}
	}

	if (!onRoomPage) return null

	return (
		<div className="room-share">
			<button type="button" className="btn btn-ghost" onClick={handleShare}>
				<ShareIcon />
				Share
			</button>

			{toast && (
				<div className="toast" role="status">
					{toast}
				</div>
			)}
		</div>
	)
}

function ShareIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="18" cy="5" r="3" />
			<circle cx="6" cy="12" r="3" />
			<circle cx="18" cy="19" r="3" />
			<line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
			<line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
		</svg>
	)
}
