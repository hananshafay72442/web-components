"""Room store: rooms and their members (no Flask, no sockets).

Each browser is identified by a random ``memberId`` kept in localStorage and
sent when it opens a room. A room keeps a *set* of member IDs, so a new
browser adds one member while a refresh does not. Rooms are in memory; there
is no database yet, so restarting the server clears everything.
"""

import secrets
import threading

# token_urlsafe(10) produces a 14-character URL-safe token,
# e.g. "V1StGXR8_Z5jdHi6B-myT".
TOKEN_BYTES = 10


class RoomStore:
    """Thread-safe in-memory store of rooms and their members."""

    def __init__(self):
        self._rooms = {}
        self._lock = threading.Lock()

    def create(self, room_name, description, preset, member_id=None):
        """Create a room and return its public view.

        If ``member_id`` is given, the creator counts as the first member.
        """
        with self._lock:
            token = self._new_token_locked()
            members = {member_id} if member_id else set()
            self._rooms[token] = {
                "token": token,
                "roomName": room_name,
                "description": description,
                "preset": preset,
                # Private: only the size of this set is exposed.
                "members": members,
            }
            return self._view(self._rooms[token])

    def get(self, token):
        """Return the public view of a room, or None if it does not exist."""
        with self._lock:
            room = self._rooms.get(token)
            return self._view(room) if room else None

    def join(self, token, member_id):
        """Add ``member_id`` to the room and return its public view.

        Returns None for an unknown token. Joining twice with the same member
        ID is a no-op, so refreshes are harmless.
        """
        with self._lock:
            room = self._rooms.get(token)
            if room is None:
                return None
            room["members"].add(member_id)
            return self._view(room)

    def _new_token_locked(self):
        """Generate an unused token. The caller must hold the lock."""
        while True:
            token = secrets.token_urlsafe(TOKEN_BYTES)
            if token not in self._rooms:
                return token

    @staticmethod
    def _view(room):
        """Build the JSON-safe room shape sent to clients."""
        return {
            "token": room["token"],
            "roomName": room["roomName"],
            "description": room["description"],
            "preset": room["preset"],
            "memberCount": len(room["members"]),
        }
