import Navbar from "./components/navbar"; 
import '../app/globals.css';

export const metadata = {
  title: "Skill Swap",
  description: "Skill Exchange platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
       className="m-0"
      >
        <header>
         <Navbar>
         </Navbar>
        </header>
        {children}
      </body>
    </html>
  );
}
