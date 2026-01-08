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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">🧹</div>
            <div>
              <h1 className="text-3xl font-bold">Putzplan Manager</h1>
              <p className="text-blue-100 mt-1">Organisieren Sie Ihre Reinigungsaufgaben effizient</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 ${
                    currentView === item.id
                      ? 'text-blue-600 border-b-3 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p className="text-sm">Putzplan Manager - Behalten Sie den Überblick über Ihre Reinigungsarbeiten</p>
        </div>
      </footer>
    </div>
  );
}
