import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });

      alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error sending reset link");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
