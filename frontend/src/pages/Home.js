import { useSelector } from "react-redux";

function Home() {
  // if user is null, user is a guest.
  const { user } = useSelector((state) => state.user);

  return (
    <div>
      {user ? (
        <div>
          <div>Home Page</div>
          <div>Welcome back, {user.username}!</div>
        </div>
      ) : (
        <div>
          <div>Home Page</div>
          <div>You are browsing as a guest</div>
        </div>
      )}
    </div>
  );
}

export default Home;
