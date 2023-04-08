import { useState } from "react";
import { HamburgerIcon } from "../assets/index";
import BannerModal from "./BannerModal";

const Banner = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      <div>MapWorkshop</div>
      <input type="text" placeholder="Search" />
      <div>
        <button onClick={() => setOpenModal(!openModal)}>
          <HamburgerIcon />
        </button>
      </div>
      {openModal && <BannerModal />}
    </div>
  );
};

export default Banner;
