import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export default function Layout({ children, title, showBack = true }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="page-container relative">
      {!isHome && showBack && (
        <header className="flex items-center gap-3 py-4 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/70 hover:bg-white/90 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            aria-label="返回"
          >
            <ArrowLeft size={20} className="text-earth/70" />
          </button>
          {title && (
            <h1 className="font-serif text-xl text-earth/80">{title}</h1>
          )}
        </header>
      )}
      {children}
    </div>
  );
}
