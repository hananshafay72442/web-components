import { useState } from 'react'
import { Link } from "react-router-dom"
import { validateRequired } from "./validators"

export default function Register() {

  const [values, setValues] = useState({ username: "", password: "", userMail: "" });

  const [reply, setReply] = useState();

  const [error, setError] = useState("");

  async function sendData() {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: values.username, password: values.password, userMail: values.userMail })
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
    const errorMessage = validateRequired(values, ["username", "password", "userMail"]);
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

        <label>
          Email
          <br />
          <input type="email" name="userMail" id="userMail" value={values.userMail} onChange={handleChange} />
        </label>

        <button type='submit'>Send</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
      {

       reply && <h1>{reply.message}</h1>
      }
      {
        error && <h1>{error}</h1>
      }
    </>
  )
}
