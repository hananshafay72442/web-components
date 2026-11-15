"""HTTP routes for the room feature (create / read / join).

The routes receive the store and hub from the entry point, so this module has
no globals and no import-order surprises. Joining over HTTP broadcasts the
same WebSocket update as joining over the socket.
"""

from flask import Blueprint, jsonify, request

MAX_ROOM_NAME = 60
MAX_DESCRIPTION = 200
MAX_MEMBER_ID = 100

VALID_PRESETS = {"university", "project"}


def create_room_blueprint(store, hub):
    """Build the blueprint. ``url_prefix`` is added by the caller."""
    bp = Blueprint("room_component", __name__)

    @bp.post("/room")
    def create_room():
        data = request.get_json(silent=True) or {}

        room_name = (data.get("roomName") or "").strip()
        description = (data.get("description") or "").strip()
        preset = (data.get("preset") or "university").strip()

        if not room_name:
            return jsonify({"error": "Room name is required."}), 400
        if len(room_name) > MAX_ROOM_NAME:
            return jsonify(
                {"error": f"Room name must be {MAX_ROOM_NAME} characters or fewer."}
            ), 400
        if len(description) > MAX_DESCRIPTION:
            return jsonify(
                {"error": f"Description must be {MAX_DESCRIPTION} characters or fewer."}
            ), 400
        if preset not in VALID_PRESETS:
            preset = "university"

        member_id, error = _read_member_id(data)
        if error:
            return jsonify({"error": error}), 400

        room = store.create(
            room_name=room_name,
            description=description,
            preset=preset,
            member_id=member_id or None,
        )
        return jsonify(room), 201

    @bp.get("/room/<token>")
    def get_room(token):
        room = store.get(token)
        if room is None:
            return jsonify({"error": "Room not found."}), 404
        return jsonify(room)

    @bp.post("/room/<token>/join")
    def join_room(token):
        data = request.get_json(silent=True) or {}

        member_id, error = _read_member_id(data)
        if error:
            return jsonify({"error": error}), 400
        if not member_id:
            return jsonify({"error": "memberId is required."}), 400

        room = store.join(token, member_id)
        if room is None:
            return jsonify({"error": "Room not found."}), 404

        # Push the new member count to already-open WebSockets.
        hub.broadcast(token, {"type": "room", "room": room})
        return jsonify(room)

    return bp


def _read_member_id(data):
    """Return (member_id, error) from a JSON body; the ID is optional."""
    member_id = (data.get("memberId") or "").strip()
    if len(member_id) > MAX_MEMBER_ID:
        return None, "Invalid member ID."
    return member_id, None
