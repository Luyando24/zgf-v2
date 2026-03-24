import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="flex-grow pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
