"""WebSocket endpoint: GET /ws/room/<token> (upgrades to a WebSocket).

Simple JSON protocol, no socket.io:

    client -> server:  {"type": "join", "memberId": "<random-id>"}
    server -> client:  {"type": "room", "room": { ...room fields... }}
    server -> client:  {"type": "error", "error": "..."}  (then closes)

After the first message the connection stays open and the server pushes a
new "room" message whenever the room changes (e.g. someone joins). Incoming
messages after the join are ignored.
"""

import json

from flask_sock import Sock

# Custom WebSocket close codes understood by the frontend.
CLOSE_BAD_MESSAGE = 4400
CLOSE_ROOM_NOT_FOUND = 4004

MAX_MEMBER_ID = 100
JOIN_TIMEOUT_SECONDS = 15


def register_websocket(app, store, hub, path="/ws"):
    """Attach the room WebSocket to ``app`` under ``path``."""
    sock = Sock(app)

    @sock.route(f"{path}/room/<token>")
    def room_socket(ws, token):
        member_id, error = _read_join(ws)
        if error:
            _fail(ws, error, CLOSE_BAD_MESSAGE)
            return

        room = store.join(token, member_id)
        if room is None:
            _fail(ws, "Room not found.", CLOSE_ROOM_NOT_FOUND)
            return

        def send(payload):
            ws.send(payload)

        hub.subscribe(token, send)
        try:
            # Send through the hub so the joining client and everyone already
            # in the room see exactly the same state.
            hub.broadcast(token, {"type": "room", "room": room})

            # Keep the socket open; only disconnects matter here.
            while ws.receive() is not None:
                pass
        finally:
            hub.unsubscribe(token, send)


def _read_join(ws):
    """Return (member_id, error) from the client's first message."""
    raw = ws.receive(timeout=JOIN_TIMEOUT_SECONDS)
    if raw is None:
        return None, "Connection timed out before joining."

    try:
        data = json.loads(raw)
    except (TypeError, ValueError):
        return None, "Join message must be JSON."

    if not isinstance(data, dict) or data.get("type") != "join":
        return None, "The first message must be a join message."

    member_id = (data.get("memberId") or "").strip()
    if not member_id:
        return None, "memberId is required."
    if len(member_id) > MAX_MEMBER_ID:
        return None, "Invalid member ID."

    return member_id, None


def _fail(ws, message, code):
    """Tell the client why it cannot join, then close with a custom code."""
    try:
        ws.send(json.dumps({"type": "error", "error": message}))
    except Exception:
        pass
    try:
        ws.close(reason=code, message=message)
    except Exception:
        pass
