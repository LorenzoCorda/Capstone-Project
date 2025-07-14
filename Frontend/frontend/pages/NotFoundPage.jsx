import { Link } from "react-router-dom";
import Navigation from "../src/components/navigation/Navigation";
import Footer from "../src/components/footer/Footer";

const NotFoundPage = () => {
  return (
    <>
      <Navigation />
      <div
        style={{ backgroundColor: "#FFFFFF" }}
        className="flex custom-bg flex-col items-center justify-center min-h-[70vh] text-center px-4 py-12"
      >
        <h1 className="text-6xl font-bold text-blue-600"></h1>
        <img
          src="https://img.freepik.com/free-vector/page-found-concept-illustration_114360-1869.jpg"
          alt=""
        />
        <h2 className="text-2xl font-semibold ">Pagina non trovata</h2>
        <p className=" text-gray-600">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
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
