import { Link } from "react-router-dom";
import Navigation from "../src/components/navigation/Navigation";
import Footer from "../src/components/footer/Footer";
import { OctagonAlert } from "lucide-react";

const NotFoundPage = () => {
  return (
    <>
      <Navigation />
      <div
        style={{ backgroundColor: "#FFFFFF" }}
        className="flex custom-bg flex-col items-center justify-center min-h-[70vh] text-center px-4 py-12"
      >
        <OctagonAlert size={300} />

        <h1 className="custom-question text-6xl font-bold mt-2 mb-3">404</h1>

        <h2 className="custom-question text-2xl font-semibold mt-4 ">
          Pagina non trovata
        </h2>
        <h3 className=" text-gray-600 mt-3">
          La pagina che stai cercando non esiste o è stata spostata.
        </h3>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Torna alla Home
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default NotFoundPage;
