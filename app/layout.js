import "./globals.css";

export const metadata = {
  title: "Review CV — Dona Talks",
  description:
    "Review CV berbasis AI yang disesuaikan dengan role, industri, dan level karier yang kamu tuju.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
