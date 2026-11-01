import './globals.css';

export const metadata = {
  title: 'PharmDreams: PharmD study buddy',
  description:
    'Animated PharmD videos with voice in English, Hindi and Telugu, plus quizzes, flashcards, the 5-year syllabus and free study resources.'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7c4dff'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=DM+Sans:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
