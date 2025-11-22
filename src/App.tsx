import { BrowserRouter } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Router from './app/routes/router';
import '@/shared/config/i18n/config';
import { syncService } from '@/shared/api/syncService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const syncedRef = useRef(false);

  useEffect(() => {
    // React StrictMode 중복 실행 방지
    if (syncedRef.current) return;
    syncedRef.current = true;

    // 앱 시작 시 자동으로 동기화 체크
    const autoSync = async () => {
      try {
        await syncService.syncIfNeeded();
      } catch (error) {
        console.error('자동 동기화 실패:', error);
      }
    };
    
    autoSync();
  }, []);

  return (
    <BrowserRouter>
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
