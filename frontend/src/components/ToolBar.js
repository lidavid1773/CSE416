import { XMark } from "../assets/index";

const ToolBar = () => {
  return (
    <div>
      <div>
        <button>
          <XMark />
        </button>
      </div>
      <div>
        <div>Edit Name</div>
        <div>View Properties</div>
      </div>
      <div>
        <div>Merge Region</div>
        <div>Split Region</div>
        <div>Delete Region</div>
      </div>
      <div>
        <div>Select Vertices</div>
        <div>Insert Vertices</div>
      </div>
    </div>
  );
};

export default ToolBar;
