import { Link } from "react-router-dom";
import globeImage from "../assets/globe.jpg";

const LoginPage = () => {
  return (
    <div>
      <form>
        <div>MapWorkshop</div>
        <div>
          <input type="text" placeholder="Email" />
          <input type="text" placeholder="Password" />
        </div>
        <div>
          <Link to="/home" state={{ isGuest: false }}>
            <button>Log in</button>
          </Link>
        </div>
        {/* dashed lines need to be replaced w/ css*/}
        <div>------ OR ------</div>
        <div>
          <span>Don't have an account?</span>
          <span>
            <Link to="/register">Sign up</Link>
          </span>
        </div>
        <div>
          <Link to="/recover-password">I forgot my password</Link>
        </div>
      </form>
      <div>
        <img src={globeImage} alt="globe" />
      </div>
    </div>
  );
};

export default LoginPage;
