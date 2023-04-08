import { XMarkIcon } from "../assets/index";
import EditNameModal from "./Modals/EditNameModal";
import { useState } from "react";

const ToolBar = () => {
  const [tempState, setTempState] = useState(false);
  return (
    <div>
      <div>
        <button>
          <XMarkIcon />
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            setTempState(!tempState);
          }}
        >
          Edit Name
        </button>
        {tempState && <EditNameModal />}
        <button>View Properties</button>
      </div>
      <div>
        <button>Merge Region</button>
        <button>Split Region</button>
        <button>Delete Region</button>
      </div>
      <div>
        <button>Select Vertices</button>
        <button>Insert Vertices</button>
      </div>
    </div>
  );
};

export default ToolBar;
