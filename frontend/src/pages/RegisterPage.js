import myImage from "../icons/img.jpg";

const RegisterPage = () => {
  return (
    <div>
      <form>
        <div>MapWorkshop</div>
        <div>
          <input type="text" placeholder="Email" />
          <input type="text" placeholder="Username" />
          <input type="text" placeholder="Password" />
        </div>
        <div>
          <button>Sign up</button>
        </div>
        {/* dashed lines need to be replaced w/ css*/}
        <div>------ OR ------</div>
        <div>
          <span>Have an account?</span>
          {/* Log in will be a link*/}
          <span> Log in</span>
        </div>
      </form>
      <div>
        <img src={myImage} alt="globe" />
      </div>
    </div>
  );
};

export default RegisterPage;
