"""Fan-out of room updates to every WebSocket watching that room.

This module has no Flask or socket imports: it only stores "send" callables
(functions that accept a JSON string). That keeps the socket handling in
websocket.py and makes the broadcast logic trivial to follow.
"""

import json
import threading


class RoomHub:
    """token -> set of send callables."""

    def __init__(self):
        self._subscribers = {}
        self._lock = threading.Lock()
        # Serializes writes so two broadcasts never write to the same socket
        # at the same time.
        self._send_lock = threading.Lock()

    def subscribe(self, token, send):
        with self._lock:
            self._subscribers.setdefault(token, set()).add(send)

    def unsubscribe(self, token, send):
        with self._lock:
            subscribers = self._subscribers.get(token)
            if not subscribers:
                return
            subscribers.discard(send)
            if not subscribers:
                # Do not leak empty rooms in the hub.
                self._subscribers.pop(token, None)

    def broadcast(self, token, message):
        """Send ``message`` (a dict) to every socket watching ``token``."""
        payload = json.dumps(message)

        with self._lock:
            subscribers = list(self._subscribers.get(token, ()))

        for send in subscribers:
            with self._send_lock:
                try:
                    send(payload)
                except Exception:
                    # Dead sockets unsubscribe when their handler returns.
                    # A failed send must not stop the remaining broadcasts.
                    pass
