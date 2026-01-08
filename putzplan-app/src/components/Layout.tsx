import React from 'react';
import { Home, Calendar, History, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">🧹 Putzplan Manager</h1>
          <p className="text-blue-100 mt-1">Organisieren Sie Ihre Reinigungsaufgaben</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    currentView === item.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>Putzplan Manager - Behalten Sie den Überblick über Ihre Reinigungsarbeiten</p>
        </div>
      </footer>
    </div>
  );
}
