import CommentList from "./CommentList";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getMap, resetState } from "../features/maps/mapSlice";

const ViewMapItem = () => {
  const dispatch = useDispatch();
  const { map, isError, message } = useSelector((state) => state.maps);
  const { mapId } = useParams();

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(getMap(mapId));

    // TODO: If map is private, navigate to a page that notifies the user.
    // Currently, every map is private since getMap is a protected route
    // console.log(map);

    return () => {
      dispatch(resetState());
    };
  }, [dispatch, isError, message, mapId]);

  return (
    <div>
      <div className="map-item">
        <h3>Map Details</h3>
        <div>{`Owned by: ${map ? map.user.username : "loading..."}`}</div>
        <div>{`Title: ${map ? map.title : "loading..."}`}</div>
        <div>
          {`Created at: ${
            map ? new Date(map.createdAt).toLocaleString("en-US") : "loading..."
          }`}
        </div>
        <Link style={{ color: "#065fd4" }}>View Map</Link>
      </div>
      <div>
        <CommentList />
      </div>
    </div>
  );
};

export default ViewMapItem;
