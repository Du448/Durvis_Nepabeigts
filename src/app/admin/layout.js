import "../globals.css";

export const metadata = {
  title: "Управление ценами | NT Durys",
  robots: { index: false, follow: false, nocache: true },
};

/* The price panel has its own root layout: no site header, footer, cookie
   banner or analytics, and no language routing. */
export default function AdminLayout({ children }) {
  return (
    <html lang="ru">
      <body className="admin-root" style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
