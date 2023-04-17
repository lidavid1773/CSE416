import { useState } from "react";

function RecoverPassword() {
  const [email, setEmail] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <div className="header">
        <h2>Forgot Password</h2>
      </div>

      <div className="form">
        <form onSubmit={onSubmit}>
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

export default RecoverPassword;
