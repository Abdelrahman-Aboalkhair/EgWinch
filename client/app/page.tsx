"use client";
import JoinUsSection from "./components/home/JoinUsSection";
import MainSection from "./components/home/MainSection";
import { NotificationProvider } from "./context/NotificationContext";

const Home = () => {
  return (
    <NotificationProvider>
      <MainSection />
      <JoinUsSection />
    </NotificationProvider>
  );
};

export default Home;
