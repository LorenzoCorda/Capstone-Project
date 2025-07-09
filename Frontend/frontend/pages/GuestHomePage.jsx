import GuestLayout from "../layouts/GuestLayout";
import InfoGuestSection from "../src/components/infoGuestSection/InfoSectionGuest";
import HeroSectionGuest from "../src/components/heroSectionGuest/HeroSectionGuest";
import FeaturesSectionGuest from "../src/components/featuresSectionGuest/FeaturesSectionGuest";

const GuestHomePage = () => {
  return (
    <>
      <GuestLayout>
        <HeroSectionGuest />
        <InfoGuestSection />
        <FeaturesSectionGuest />
      </GuestLayout>
    </>
  );
};

export default GuestHomePage;
