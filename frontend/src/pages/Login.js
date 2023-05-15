import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, resetState } from "../features/users/userSlice";
import { Link } from "react-router-dom";

function Login() {
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
    email: "",
    password: "",
  });

  const { email, password } = form;

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = { email, password };

    dispatch(login(userData));
  };

  return (
    <div>
      <div className="header">
        <h1>Login</h1>
      </div>

      <div className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              placeholder="Email"
              className="form-item"
              onChange={onChange}
            />
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              placeholder="Password"
              className="form-item"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-container">
              Login
            </button>
          </div>
        </form>
        <div>
          <Link to="/forgot-password">I forgot my password</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
