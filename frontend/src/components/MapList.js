import { useDispatch } from "react-redux";
import { deleteMap } from "../features/maps/mapSlice";
import { useNavigate } from "react-router-dom";

const MapList = ({ maps }) => {
  return (
    <div>
      {maps.length > 0 ? (
        <div className="maps">
          {maps.map((map) => (
            <MapItem key={map._id} map={map} />
          ))}
        </div>
      ) : (
        <h3>0 Maps</h3>
      )}
    </div>
  );
};

const MapItem = ({ map }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="map-item" onClick={() => navigate(`/viewmap/${map._id}`)}>
      <div style={{ fontWeight: "bold" }}>
        {new Date(map.createdAt).toLocaleString("en-US")}
      </div>
      <div>{map.title}</div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch(deleteMap(map._id));
        }}
        className="delete-btn"
      >
        X
      </button>
    </div>
  );
};

export default MapList;
