import Navbar from "@/components/navbar/Navbar";
import "./globals.css";

export const metadata = {
  title: "Get Cab UK",
  description: "Website redesign",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar logoText="Get Cab" signInHref="/sign-in" />
        {children}
      </body>
    </html>
  );
}
