"use client";
import Conversations from "./components/Conversations";
import JoinUsSection from "./components/home/JoinUsSection";
import MainSection from "./components/home/MainSection";
import { useAppSelector } from "./libs/hooks";

const Home = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  return (
    <>
      <MainSection />
      {isLoggedIn && <Conversations />}
      <JoinUsSection />
    </>
  );
};

export default Home;
