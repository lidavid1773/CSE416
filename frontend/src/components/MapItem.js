import { useDispatch } from "react-redux";
import { deleteMap } from "../features/maps/mapSlice";

function MapItem({ map }) {
  const dispatch = useDispatch();

  return (
    <div className="map-item">
      <div>{new Date(map.createdAt).toLocaleString("en-US")}</div>
      <div>{map.title}</div>
      <button
        onClick={() => dispatch(deleteMap(map._id))}
        className="delete-btn"
      >
        X
      </button>
    </div>
  );
}

export default MapItem;
