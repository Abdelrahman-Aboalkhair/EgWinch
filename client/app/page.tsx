"use client";
import Conversations from "./components/Conversations";
import JoinUsSection from "./components/home/JoinUsSection";
import MainSection from "./components/home/MainSection";
import { NotificationProvider } from "./context/NotificationContext";

const Home = () => {
  return (
    <NotificationProvider>
      <MainSection />
      <Conversations />
      <JoinUsSection />
    </NotificationProvider>
  );
};

export default Home;
