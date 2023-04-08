import myImage from "../icons/img.jpg";

const LoginPage = () => {
  return (
    <div>
      <form>
        <div>MapWorkshop</div>
        <div>
          <input type="text" placeholder="Email" />
          <input type="text" placeholder="Password" />
        </div>
        <div>
          <button>Log in</button>
        </div>
        {/* dashed lines need to be replaced w/ css*/}
        <div>------ OR ------</div>
        <div>
          <span>Don't have an account?</span>
          {/* Sign up will be a link*/}
          <span> Sign up</span>
        </div>
        {/* Forgot password will be a link*/}
        <div>I forgot my password</div>
      </form>
      <div>
        <img src={myImage} alt="globe" />
      </div>
    </div>
  );
};

export default LoginPage;
