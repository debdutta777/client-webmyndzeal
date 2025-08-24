import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VoiceMattersSection from "@/components/VoiceMattersSection";
import PartnersSection from "@/components/PartnersSection";
import GetInTouchSection from "@/components/GetInTouchSection";
import ConnectWithUsSection from "@/components/ConnectWithUsSection";

export default function Home() {
  return (
    <>
      <div id="home">
        <HeroSection />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <div id="services">
        <VoiceMattersSection />
        <PartnersSection />
        </div>
      <div id="contact">
        <GetInTouchSection />
    </div>
      <ConnectWithUsSection />
    </>
  );
}
