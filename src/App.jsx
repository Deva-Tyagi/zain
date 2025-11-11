import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import LoadingScene from './sections/LoadingScene';
import LuxuryVillaHero from './sections/HeroSection';
import LivingRoomSection from './sections/LivingRoomSection';
import DiningKitchenSection from './sections/DiningKitchenSection';
import MasterBedroomSection from './sections/MasterBedroomSection';
import BalconySection from './sections/BalconySection';
import VillaOverviewContact from './sections/VillaOverviewContact';
import FooterTransition from './sections/FooterTransition';
import ParallaxBedroom from './sections/ParallaxBedroom';

const App = () => {
  const lenisRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Initialize Lenis only after loading completes
    if (!isLoading && showContent) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      lenisRef.current = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }
  }, [isLoading, showContent]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  return (
    <>
      {/* Preloader Scene */}
      {isLoading && (
        <LoadingScene onLoadingComplete={handleLoadingComplete} />
      )}

      {/* Main Content - Only render after loading */}
      {showContent && (
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
          <LuxuryVillaHero />
          <LivingRoomSection />
          <DiningKitchenSection />
          <MasterBedroomSection />
          {/* <ParallaxBedroom /> */}
          <BalconySection />
          <VillaOverviewContact />
          <FooterTransition />
        </div>
      )}
    </>
  );
};

export default App;