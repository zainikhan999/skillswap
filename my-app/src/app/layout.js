import ClientLayout from "./components/clientLayout";
import "./globals.css";

export const metadata = {
  title: "My App",
  description: "Some description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
