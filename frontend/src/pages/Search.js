import { useParams } from "react-router-dom";
import MapList from "../components/MapList";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { searchMapsBy, resetState } from "../features/maps/mapSlice";

const Search = () => {
  const dispatch = useDispatch();

  const { username } = useParams();
  const { maps, isError, message, isLoading } = useSelector(
    (state) => state.maps
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(searchMapsBy(username));

    return () => {
      dispatch(resetState());
    };
  }, [username, dispatch, isError, message]);

  return (
    <div>
      <h1>Search Results</h1>
      {isLoading ? <div>Loading... </div> : <MapList maps={maps} />}
    </div>
  );
};

export default Search;
