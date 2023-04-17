import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, resetState } from "../features/users/userSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      navigate("/");
    }

    dispatch(resetState);
  }, [user, isError, isSuccess, message, dispatch, navigate]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { username, email, password, confirmPassword } = form;

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      const userData = { username, email, password };
      dispatch(register(userData));
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Register</h1>
      </div>

      <div className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              placeholder="Username"
              className="form-item"
              onChange={onChange}
            />
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Email"
              className="form-item"
              onChange={onChange}
            />
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              placeholder="Password"
              className="form-item"
              onChange={onChange}
            />
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm password"
              className="form-item"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-container">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
