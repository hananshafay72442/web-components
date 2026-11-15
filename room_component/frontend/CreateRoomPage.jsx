import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRoom } from './api'
import { getMemberId } from './memberId'

export default function CreateRoomPage() {
	const navigate = useNavigate()

	const [values, setValues] = useState({
		roomName: '',
		description: '',
		preset: 'university',
	})
	const [status, setStatus] = useState('idle') // idle | submitting
	const [error, setError] = useState('')

	function handleChange(e) {
		setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	}

	function handleSubmit(e) {
		e.preventDefault()
		submit()
	}

	async function submit() {
		setStatus('submitting')
		setError('')

		try {
			// memberId makes this browser the room's first unique member.
			const room = await createRoom({
				roomName: values.roomName.trim(),
				description: values.description.trim(),
				preset: values.preset,
				memberId: getMemberId(),
			})

			// Relative navigation keeps the host's mount prefix.
			navigate(String(room.token), { state: { room } })
		} catch (err) {
			setError(err.message || 'Something went wrong. Please try again.')
			setStatus('idle')
		}
	}

	return (
		<section className="card">
			<header className="card-header">
				<h1>Create a room</h1>
				<p className="muted">
					Give your group a name and a purpose. We&apos;ll generate a secure
					token so others can join.
				</p>
			</header>

			<form onSubmit={handleSubmit} className="form">
				<label className="field" htmlFor="roomName">
					<span>Room name</span>
					<input
						type="text"
						name="roomName"
						id="roomName"
						placeholder="e.g. Software Engineering Project"
						maxLength={60}
						onChange={handleChange}
						value={values.roomName}
						required
					/>
				</label>

				<label className="field" htmlFor="description">
					<span>Description</span>
					<textarea
						name="description"
						id="description"
						placeholder="What is this room about? (optional)"
						maxLength={200}
						rows={3}
						onChange={handleChange}
						value={values.description}
					/>
				</label>

				<label className="field" htmlFor="preset">
					<span>Purpose</span>
					<select
						name="preset"
						id="preset"
						onChange={handleChange}
						value={values.preset}
					>
						<option value="university">University</option>
						<option value="project">Project</option>
					</select>
				</label>

				{error && <p className="alert">{error}</p>}

				<button type="submit" className="btn" disabled={status === 'submitting'}>
					{status === 'submitting' ? 'Creating…' : 'Create room'}
				</button>
			</form>
		</section>
	)
}
