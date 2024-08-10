"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { FirebaseAppProvider } from "reactfire";
import { firebaseConfig } from './firebase';


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </FirebaseAppProvider>
  );
}
