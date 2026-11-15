import { Link, useLocation, useParams } from 'react-router-dom'
import { useRoom } from './useRoom'

export default function RoomPage() {
	const { token } = useParams()
	const location = useLocation()

	// When the room was just created, CreateRoomPage passes it in
	// location.state so the first paint has data. On a shared link this is
	// null and the WebSocket fills it in.
	const routedRoom =
		location.state?.room?.token === token ? location.state.room : null

	const { room, status, error } = useRoom(token, routedRoom)

	if (status === 'loading') {
		return (
			<section className="card">
				<p className="muted">Loading room…</p>
			</section>
		)
	}

	if (status === 'error') {
		return (
			<section className="card">
				<h1>Room not found</h1>
				<p className="muted">{error}</p>
				{/* ".." goes back to the module root ("/rooms"). */}
				<Link to=".." className="btn">
					Create a room
				</Link>
			</section>
		)
	}

	const joinUrl = `${window.location.origin}/rooms/${token}`

	return (
		<section className="card">
			<header className="card-header">
				<div className="room-title-row">
					<h1>{room.roomName}</h1>
					<span className="badge">{capitalize(room.preset)}</span>
				</div>
				{room.description ? (
					<p className="muted">{room.description}</p>
				) : (
					<p className="muted">No description yet.</p>
				)}
			</header>

			<div className="token-panel">
				<span className="token-label">Room token</span>
				<span className="token">{room.token}</span>
				<span className="muted small">
					Share the link from the navbar so others can join.
				</span>
			</div>

			<div className="field">
				<span>Invite link</span>
				<code className="link-box">{joinUrl}</code>
			</div>

			<div className="room-meta">
				<span>
					<strong>{room.memberCount ?? 0}</strong>{' '}
					{room.memberCount === 1 ? 'member' : 'members'}
				</span>
				<span className="muted">Anyone with the link can join.</span>
			</div>
		</section>
	)
}

function capitalize(value = '') {
	return value.charAt(0).toUpperCase() + value.slice(1)
}
