"use client";
import Conversations from "./components/Conversations";
import JoinUsSection from "./components/home/JoinUsSection";
import MainSection from "./components/home/MainSection";
import { NotificationProvider } from "./context/NotificationContext";
import { useAppSelector } from "./libs/hooks";

const Home = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  return (
    <NotificationProvider>
      <MainSection />
      {isLoggedIn && <Conversations />}
      <JoinUsSection />
    </NotificationProvider>
  );
};

export default Home;
