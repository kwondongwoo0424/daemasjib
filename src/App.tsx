import { BrowserRouter } from 'react-router-dom';
import Router from './app/routes/router';
import './i18n/config';

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
