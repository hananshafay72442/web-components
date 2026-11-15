import { useState } from 'react'
import { Link } from "react-router-dom"
import { validateRequired } from "./validators"

export default function Login() {

    const [values, setValues] = useState({ username: "", password: "" });

    const [reply, setReply] = useState();

    const [error, setError] = useState("");

    async function sendData() {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: values.username, password: values.password })
        })
        const r = await res.json();
        setReply(r);

    }

    function handleChange(e) {
        setValues({ ...values, [e.target.name]: e.target.value });
        setError("");
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Empty-field validator: block the request if any field is blank.
        const errorMessage = validateRequired(values, ["username", "password"]);
        if (errorMessage) {
            setError(errorMessage);
            return;
        }

        sendData();
    }



    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>

                    Username
                    <br />
                    <input type="text" name="username" id="username" value={values.username} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Password
                    <br />
                    <input type="password" name="password" id="password" value={values.password} onChange={handleChange} />
                </label>
                <br />
                <button type='submit'>Send</button>
            </form>
            <p>Don't have an account? <Link to="/register">SignUP</Link></p>

            <h1>{values.username}</h1>
            <h1>{values.password}</h1>
            {
                reply && <h1>{reply.message}</h1>
            }
            {
                error && <h1>{error}</h1>
            }

        </>
    )
}
