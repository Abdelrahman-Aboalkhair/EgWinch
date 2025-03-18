import type { Metadata } from "next";
import { Lato, Poppins } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import SessionWrapper from "./components/auth/SessionWrapper";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

export const metadata: Metadata = {
  title: "Egwinch",
  description:
    "Egwinch is a platform that connects you with trusted winch drivers, providing easy, stress-free moving solutions. Book your move or become a driver today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${lato.variable} antialiased`}>
        <StoreProvider>
          <SessionWrapper>{children}</SessionWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
