import type { ReactNode } from 'react';
import { Home, Calendar, History, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentView: 'rooms' | 'activities' | 'weekly' | 'history';
  onViewChange: (view: 'rooms' | 'activities' | 'weekly' | 'history') => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const navItems = [
    { id: 'rooms' as const, icon: Home, label: 'Räume' },
    { id: 'activities' as const, icon: Settings, label: 'Tätigkeiten' },
    { id: 'weekly' as const, icon: Calendar, label: 'Wochenplan' },
    { id: 'history' as const, icon: History, label: 'Historie' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-win11-gray-50 via-white to-win11-blue-50">
      {/* Header */}
      <header className="glass-win11 border-b border-white/20 shadow-win11-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-win11-blue-500 to-win11-blue-600 rounded-win11-lg flex items-center justify-center text-2xl shadow-win11-sm">
              🧹
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-win11-gray-900 tracking-tight">Putzplan Manager</h1>
              <p className="text-sm text-win11-gray-500 mt-0.5">Organisieren Sie Ihre Reinigungsaufgaben effizient</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="glass-win11-dark border-b border-white/20 sticky top-[88px] z-40 shadow-win11-sm">
        <div className="container mx-auto px-6">
          <div className="flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-5 py-3.5 font-medium rounded-win11 transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-white text-win11-blue-600 shadow-win11-sm'
                      : 'text-win11-gray-700 hover:bg-white/50 hover:text-win11-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 pb-24 animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass-win11 border-t border-white/20 mt-16">
        <div className="container mx-auto px-6 py-5 text-center">
          <p className="text-xs text-win11-gray-500">Putzplan Manager - Behalten Sie den Überblick über Ihre Reinigungsarbeiten</p>
        </div>
      </footer>
    </div>
  );
}
