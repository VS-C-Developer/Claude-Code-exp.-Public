import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { RoomManagement } from './components/RoomManagement';
import { ActivityManagement } from './components/ActivityManagement';
import { WeeklyPlan } from './components/WeeklyPlan';
import { History } from './components/History';

type View = 'rooms' | 'activities' | 'weekly' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<View>('weekly');

  return (
    <AppProvider>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {currentView === 'rooms' && <RoomManagement />}
        {currentView === 'activities' && <ActivityManagement />}
        {currentView === 'weekly' && <WeeklyPlan />}
        {currentView === 'history' && <History />}
      </Layout>
    </AppProvider>
  );
}

export default App;
