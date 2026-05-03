import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

export const metadata = {
  title: "Python Concepts — Master Python from Basics to Advanced",
  description:
    "A comprehensive Python learning reference: explanations, real-world examples, animations, and practical exercises.",
};

// Runs before hydration so the correct theme class is on <html> on first paint.
const themeBootScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored ? stored === 'dark' : prefersDark;
    var root = document.documentElement;
    if (isDark) root.classList.add('dark');
    root.style.colorScheme = isDark ? 'dark' : 'light';
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
              <TopBar />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-default px-6 py-10 text-sm fg-muted">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span>Python Concepts — learn, practice, master.</span>
                  <span className="fg-subtle">Built with Next.js</span>
                </div>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
