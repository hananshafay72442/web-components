from flask import Flask, request, jsonify

app = Flask(__name__)

EMPTY_FIELDS_MESSAGE = "Fields can't be empty"


def is_blank(value):
    """True when a value is missing, None, or only whitespace."""
    return value is None or not str(value).strip()


def get_json_body():
    """Safely read the JSON body, even if it is missing or malformed."""
    body = request.get_json(silent=True)
    return body if isinstance(body, dict) else {}


@app.post("/api/login")
def login():
    username = "MohidAhmed"
    password = "1234"
    data = get_json_body()

    # Empty-field validator: never process a request with blank fields.
    if is_blank(data.get("username")) or is_blank(data.get("password")):
        return jsonify({"message": EMPTY_FIELDS_MESSAGE}), 400

    if username == data.get("username") and password == data.get("password"):
        return jsonify({"message": "Correct Input"})
    else:
        return jsonify({"message": "Wrong Input"})


@app.post("/api/register")
def register():
    data = get_json_body()

    # Empty-field validator: never process a request with blank fields.
    if (
        is_blank(data.get("username"))
        or is_blank(data.get("password"))
        or is_blank(data.get("userMail"))
    ):
        return jsonify({"message": EMPTY_FIELDS_MESSAGE}), 400

    username = data.get("username")
    password = data.get("password")
    return jsonify({"message": "Successfully Register"})


if __name__ == "__main__":
    app.run(debug=True)
