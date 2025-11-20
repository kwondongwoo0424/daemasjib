import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import Router from './app/routes/router';
import './i18n/config';
import { syncService } from './services/syncService';

function App() {
  useEffect(() => {
    // 앱 시작 시 자동으로 동기화 체크
    const autoSync = async () => {
      try {
        const { synced, result } = await syncService.syncIfNeeded();
        if (synced && result) {
          console.log(`✅ 자동 동기화 완료: 전체 ${result.total}개, 신규 ${result.new}개`);
        }
      } catch (error) {
        console.error('자동 동기화 실패:', error);
      }
    };
    
    autoSync();
  }, []);

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
