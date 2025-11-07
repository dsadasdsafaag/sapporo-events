export const metadata = {
  title: "Today in Sapporo | Things To Do",
  description: "今日・今週末・来週に札幌でできることを多言語で。地図と一覧でサクッと意思決定。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
