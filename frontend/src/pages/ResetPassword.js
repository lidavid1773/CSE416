import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/user";

const ResetPassword = () => {
  const [form, setForm] = useState({
    password1: "",
    password2: "",
  });

  const { password1, password2 } = form;

  const [isMismatch, setIsMismatch] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { id, token } = useParams();

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (password1 !== password2) setIsMismatch(true);
    else {
      setIsMismatch(false);
      const data = await api.resetPassword(id, token, password1);
      console.log(data);
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Reset Password</h1>
        <h1>Enter your new password</h1>
      </div>

      {isMismatch ? (
        <div className="failure-message">Passwords do not match</div>
      ) : isSubmitted ? (
        <div className="success-message">Your password has been reset</div>
      ) : null}

      <div className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="password"
              name="password1"
              id="password1"
              value={form.password1}
              placeholder="New password"
              className="form-item"
              onChange={onChange}
            />
            <input
              type="password"
              name="password2"
              id="password2"
              value={form.password2}
              placeholder="Confirm password"
              className="form-item"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-container">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
