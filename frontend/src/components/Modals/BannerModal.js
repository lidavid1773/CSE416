import { Link } from "react-router-dom";

const BannerModal = ({ isGuest }) => {
  return (
    <div>
      {isGuest ? (
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
      ) : (
        <div>
          <Link to="/home/profile">
            <button>Visit profile</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BannerModal;
