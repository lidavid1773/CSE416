import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMaps, resetState } from "../features/maps/mapSlice";
import MapList from "../components/MapList";

function Home() {
  const dispatch = useDispatch();

  // if user is null, user is a guest.
  const { user } = useSelector((state) => state.user);
  const { maps, isError, message } = useSelector((state) => state.maps);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (user) {
      dispatch(getMaps());
    }

    return () => {
      dispatch(resetState());
    };
  }, [user, dispatch, isError, message]);

  return (
    <div>
      {user ? (
        <div>
          <div className="header">
            <h1>Welcome back, {user.username}!</h1>
            <h1>Maps Owned</h1>
          </div>
          <MapList maps={maps} />
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
