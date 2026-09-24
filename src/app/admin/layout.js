import "../globals.css";

export const metadata = {
  title: "Kainų valdymas | NT Durys",
  robots: { index: false, follow: false, nocache: true },
};

/* The price panel has its own root layout: no site header, footer, cookie
   banner or analytics, and no language routing. The panel's own text can be
   switched to English at runtime, but the static <title> and lang attribute
   stay Lithuanian, the panel's default. */
export default function AdminLayout({ children }) {
  return (
    <html lang="lt">
      <body className="admin-root" style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
