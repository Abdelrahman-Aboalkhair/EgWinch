"use client";
import JoinUsSection from "./components/home/JoinUsSection";
import MainSection from "./components/home/MainSection";
import { NotificationProvider } from "./context/NotificationContext";

const Home = () => {
  return (
    <NotificationProvider>
      {/* <Chat
        userId="67abea4d27edd0c26106374d"
        receiverId="67abea7327edd0c261063750"
      /> */}
      <MainSection />
      <JoinUsSection />
    </NotificationProvider>
  );
};

export default Home;
