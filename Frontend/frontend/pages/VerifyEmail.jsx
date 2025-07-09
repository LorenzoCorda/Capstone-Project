import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);
  });

  return (
    <div className="text-center mt-5">
      <h2>Email verificata con successo!</h2>
      <p>Ora puoi effettuare il login.</p>
      <p>Verrai reindirizzato alla home...</p>
    </div>
  );
};

export default VerifyEmail;
