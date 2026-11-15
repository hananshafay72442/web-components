// Room component frontend - single entry point.
//
// Merge into an existing React Router app:
//
//   import { Route } from 'react-router-dom'
//   import { RoomModule, ShareRoomButton } from './room_component/frontend'
//
//   // 1. Mount the room pages under any prefix:
//   <Route path="/rooms/*" element={<RoomModule />} />
//
//   // 2. Optionally add the share button to your navbar:
//   <ShareRoomButton />
//
// RoomModule renders the create page at "/rooms" and a room at
// "/rooms/<token>". It needs the backend's /api and /ws endpoints on the
// same origin (in Vite dev, proxy both to Flask).
export { default as RoomModule } from './RoomModule'
export { default as CreateRoomPage } from './CreateRoomPage'
export { default as RoomPage } from './RoomPage'
export { default as ShareRoomButton } from './ShareRoomButton'
export { useRoom } from './useRoom'
