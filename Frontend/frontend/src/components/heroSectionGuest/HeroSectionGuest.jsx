import { useState } from "react";
import { Button } from "react-bootstrap";
import "./HeroSectionGuest.css";
import bgImage from "../../../img/BboyPositionFreeze.JPG";
import SignUpModal from "../modals/SignupModal";
import LoginModal from "../modals/LoginModal";

const HeroSectionGuest = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <div className="hero-section position-relative text-light overflow-hidden">
        <img src={bgImage} alt="Hero" className="hero-img" />

        <div className="custom-title text-center">
          <h1 className="display-2 fw-bold">BreakMeet</h1>
        </div>
        <div className="custom-p-btn text-center">
          <p className="">
            Scopri, crea o unisciti a sessioni di allenamento nella tua città.
            {/* Connetti ballerini. Trova sessioni. Unisciti alla crew. */}
          </p>
          <div className="mt-4">
            <Button
              variant="light"
              className="me-3 btn-custom"
              onClick={() => setShowSignUp(true)}
            >
              Iscriviti
            </Button>
            <Button
              variant="outline-light"
              className="btn-custom"
              onClick={() => setShowLogin(true)}
            >
              Accedi
            </Button>
          </div>
        </div>
      </div>

      {/* Modali */}
      <SignUpModal show={showSignUp} handleClose={() => setShowSignUp(false)} />
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
    </>
  );
};

export default HeroSectionGuest;
