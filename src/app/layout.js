export const metadata = {
  title: "MailAgent",
  description: "Il tuo assistente email AI",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body style={{ margin: 0, padding: 0, background: "#0d0f14" }}>
        {children}
      </body>
    </html>
  );
}
