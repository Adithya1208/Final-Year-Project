import "./globals.css";

import NavBar from '../components/NavBar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Anti Money Laundering System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-100">
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}

