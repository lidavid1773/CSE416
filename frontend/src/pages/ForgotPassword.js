import { useState } from "react";
import api from "../api/user";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const sendLink = async (e) => {
    e.preventDefault();
    try {
      await api.sendLink(email);
      setIsSent(true);
      setInvalidEmail(false);
    } catch (error) {
      setIsSent(false);
      setInvalidEmail(true);
    }
    setEmail("");
  };

  return (
    <div>
      <div className="header">
        <h2>Forgot Password</h2>
      </div>

      {isSent ? (
        <div className="success-message">
          A link to reset your password was successfully sent to your email!
        </div>
      ) : null}

      {invalidEmail ? (
        <div className="failure-message">Email is invalid</div>
      ) : null}

      <div className="form">
        <form onSubmit={sendLink}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Email"
              className="form-item"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-container">
              Send login link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
