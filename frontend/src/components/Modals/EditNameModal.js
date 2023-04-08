import { XMarkIcon } from "../../assets/index";

const EditNameModal = () => {
  return (
    <div>
      <button>
        <XMarkIcon />
      </button>
      <div>Please enter the name of the new region</div>
      <input type="text" />
    </div>
  );
};

export default EditNameModal;
