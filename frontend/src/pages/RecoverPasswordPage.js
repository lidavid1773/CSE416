import globeImage from "../assets/globe.jpg";

const RecoverPasswordPage = () => {
  return (
    <div>
      <form>
        <div>MapWorkshop</div>
        <div>I don't know my password</div>
        <div>
          <input type="text" placeholder="Email" />
        </div>
        <div>
          <button>Continue</button>
        </div>
        {/* dashed lines need to be replaced w/ css*/}
        <div>------ OR ------</div>
        <div>
          <span>Remember your account?</span>
          {/* Log in will be a link*/}
          <span> Log in</span>
        </div>
      </form>
      <div>
        <img src={globeImage} alt="globe" />
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
