import "../styles/globals.css";
import FooterComponent from "../components/FooterComponent";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FS_Chats",
  description: "This is world fastest and safest messaging platform.",
  author: "Nitesh Yadav",
  keyword: "chat, FS_chats, fs chats, messaging, fastest, safest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {children}
        <FooterComponent />
      </body>
    </html>
  );
}
