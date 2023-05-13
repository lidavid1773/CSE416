import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMaps, resetState } from "../features/maps/mapSlice";
import MapList from "../components/MapList";

const Profile = () => {
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
      <div className="header">
        <h1>Welcome back, {user.username}!</h1>
        <h1>Your Collection</h1>
      </div>
      <MapList maps={maps} />
    </div>
  );
};

export default Profile;
