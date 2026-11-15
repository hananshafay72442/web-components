import { Route, Routes } from 'react-router-dom'
import CreateRoomPage from './CreateRoomPage'
import RoomPage from './RoomPage'

/**
 * All room routes, relative to wherever the host mounts this component.
 * Mount it with a wildcard so nested routes work:
 *
 *   <Route path="/rooms/*" element={<RoomModule />} />
 */
export default function RoomModule() {
	return (
		<Routes>
			<Route index element={<CreateRoomPage />} />
			<Route path=":token" element={<RoomPage />} />
		</Routes>
	)
}
