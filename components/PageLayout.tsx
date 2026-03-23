import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden" style={{ background: '#141415' }}>
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:flex w-[240px] shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 pb-[60px] md:pb-0">
          {children}
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden shrink-0">
          <MobileNav />
        </div>
      </main>
    </div>
  );
}
