import ClientLayout from "./components/clientLayout";
import "./globals.css";
import { AuthProvider } from "contexts/AuthContext";
export const metadata = {
  title: "My App",
  description: "Some description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
