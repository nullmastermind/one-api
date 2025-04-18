import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';

import App from './App';
import Footer from './components/Footer';
import Header from './components/Header';
import { StatusProvider } from './context/Status';
import { UserProvider } from './context/User';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StatusProvider>
      <UserProvider>
        <BrowserRouter>
          <Header />
          <Container className={'main-content'}>
            <App />
          </Container>
          <ToastContainer />
          <Footer />
        </BrowserRouter>
      </UserProvider>
    </StatusProvider>
  </StrictMode>,
);
