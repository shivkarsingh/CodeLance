import React, { useState } from "react";
import "../styles/Login.css";
import newRequest from "../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // clear old errors before new attempt
    try {
      const res = await newRequest.post("/auth/login", { username, password });

      // Save user info + JWT
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      localStorage.setItem("accessToken", res.data.token);

      navigate("/");
    } catch (err) {
      if (err.response) {
        // backend gave an error response
        if (err.response.status === 404) {
          setError("❌ User not found. Please register first.");
        } else if (err.response.status === 401) {
          setError("⚠️ Invalid password. Try again.");
        } else {
          setError(err.response.data?.message || "Something went wrong.");
        }
      } else {
        // no response at all (server down / network issue)
        setError("🚨 Server not reachable. Please try again later.");
      }
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="*********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
