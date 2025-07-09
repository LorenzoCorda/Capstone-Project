import NavigationGuest from "../src/components/guestNavigation/NavigationGuest";
import Footer from "../src/components/footer/Footer";

const GuestLayout = ({ children }) => {
  return (
    <>
      <NavigationGuest />
      {children}
      <Footer />
    </>
  );
};

export default GuestLayout;
