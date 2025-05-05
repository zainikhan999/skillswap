import ClientLayout from "./components/clientLayout";
import "./globals.css";
import { AuthProvider } from "contexts/AuthContext";
import { ChatProvider } from "contexts/ChatContext";
export const metadata = {
  title: "My App",
  description: "Some description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ChatProvider>
            <ClientLayout>{children}</ClientLayout>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
