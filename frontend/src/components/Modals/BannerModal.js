import { Link } from "react-router-dom";

const BannerModal = () => {
  return (
    <div>
      <div>
        <Link to="/login">
          <button>Log in</button>
        </Link>
      </div>
      <div>
        <Link to="/register">
          <button>Sign up</button>
        </Link>
      </div>
    </div>
  );
};

export default BannerModal;
