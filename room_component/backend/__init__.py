"""Room component backend - single entry point.

Merge into an existing Flask app with two lines:

    from room_component.backend import register_room_component
    register_room_component(app)

That adds:

    POST /api/room                      create a room
    GET  /api/room/<token>              read a room
    POST /api/room/<token>/join         join over HTTP (optional)
    WS   /ws/room/<token>               join + live member-count updates

Rooms are in memory (no database yet) and every server restart clears them.
The frontend must be served from the same origin, or its dev proxy must
forward both /api and /ws to this Flask app.
"""

from .hub import RoomHub
from .routes import create_room_blueprint
from .store import RoomStore
from .websocket import register_websocket

__all__ = ["register_room_component"]


def register_room_component(app, url_prefix="/api", ws_path="/ws"):
    """Register the room HTTP routes and WebSocket route on ``app``.

    Returns the store and hub so tests or other components can reuse them.
    """
    store = RoomStore()
    hub = RoomHub()

    app.register_blueprint(
        create_room_blueprint(store, hub), url_prefix=url_prefix
    )
    register_websocket(app, store, hub, path=ws_path)

    return store, hub
