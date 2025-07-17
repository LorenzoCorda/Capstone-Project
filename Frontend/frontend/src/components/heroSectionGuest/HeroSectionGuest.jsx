import { useState } from "react";
import { Button } from "react-bootstrap";
import "./HeroSectionGuest.css";

import SignUpModal from "../modals/SignupModal";
import LoginModal from "../modals/LoginModal";

const HeroSectionGuest = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <div className="hero-section position-relative text-light overflow-hidden">
        <img
          src="/images/BboyPositionFreezeMod.jpg"
          alt="Hero"
          className="hero-img"
        />

        <div className="custom-title text-center">
          <h1 className="display-2 fw-bold">BreakMeet</h1>
        </div>
        <div className="custom-p-btn text-center">
          <p>
            Scopri, crea o unisciti a sessioni di street dance nella tua città.
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

      <SignUpModal show={showSignUp} handleClose={() => setShowSignUp(false)} />
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
    </>
  );
};

export default HeroSectionGuest;
