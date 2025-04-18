import React, { Suspense, lazy, useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import GitHubOAuth from './components/GitHubOAuth';
import LarkOAuth from './components/LarkOAuth';
import Loading from './components/Loading';
import LoginForm from './components/LoginForm';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import PasswordResetForm from './components/PasswordResetForm';
import { PrivateRoute } from './components/PrivateRoute';
import RegisterForm from './components/RegisterForm';
import { StatusContext } from './context/Status';
import { UserContext } from './context/User';
import { API, getLogo, getSystemName, showError, showNotice } from './helpers';
import Channel from './pages/Channel';
import EditChannel from './pages/Channel/EditChannel';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import Log from './pages/Log';
import NotFound from './pages/NotFound';
import Redemption from './pages/Redemption';
import EditRedemption from './pages/Redemption/EditRedemption';
import Setting from './pages/Setting';
import Token from './pages/Token';
import EditToken from './pages/Token/EditToken';
import TopUp from './pages/TopUp';
import User from './pages/User';
import AddUser from './pages/User/AddUser';
import EditUser from './pages/User/EditUser';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

function App() {
  const [_userState, userDispatch] = useContext(UserContext);
  const [_statusState, statusDispatch] = useContext(StatusContext);

  const loadUser = () => {
    let user = localStorage.getItem('user');
    if (user) {
      let data = JSON.parse(user);
      userDispatch({ type: 'login', payload: data });
    }
  };
  const loadStatus = async () => {
    try {
      const res = await API.get('/api/status');
      const { success, message, data } = res.data || {}; // Add default empty object
      if (success && data) {
        // Check data exists
        localStorage.setItem('status', JSON.stringify(data));
        statusDispatch({ type: 'set', payload: data });
        localStorage.setItem('system_name', data.system_name);
        localStorage.setItem('logo', data.logo);
        localStorage.setItem('footer_html', data.footer_html);
        localStorage.setItem('quota_per_unit', data.quota_per_unit);
        localStorage.setItem('display_in_currency', data.display_in_currency);
        if (data.chat_link) {
          localStorage.setItem('chat_link', data.chat_link);
        } else {
          localStorage.removeItem('chat_link');
        }
        if (
          data.version !== import.meta.env.REACT_APP_VERSION &&
          data.version !== 'v0.0.0' &&
          import.meta.env.REACT_APP_VERSION !== ''
        ) {
          showNotice(
            `New version ${data.version} is available! Please use the shortcut Shift + F5 to refresh the page.`,
          );
        }
      } else {
        showError(message || 'Unable to connect to the server!');
      }
    } catch (error) {
      showError(error.message || 'Unable to connect to the server!');
    }
  };

  useEffect(() => {
    loadUser();
    loadStatus().then();
    let systemName = getSystemName();
    if (systemName) {
      document.title = systemName;
    }
    let logo = getLogo();
    if (logo) {
      let linkElement = document.querySelector("link[rel~='icon']");
      if (linkElement) {
        linkElement.href = logo;
      }
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="/channel"
        element={
          <PrivateRoute>
            <Channel />
          </PrivateRoute>
        }
      />
      <Route
        path="/channel/edit/:id"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditChannel />
          </Suspense>
        }
      />
      <Route
        path="/channel/add"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditChannel />
          </Suspense>
        }
      />
      <Route
        path="/token"
        element={
          <PrivateRoute>
            <Token />
          </PrivateRoute>
        }
      />
      <Route
        path="/token/edit/:id"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditToken />
          </Suspense>
        }
      />
      <Route
        path="/token/add"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditToken />
          </Suspense>
        }
      />
      <Route
        path="/redemption"
        element={
          <PrivateRoute>
            <Redemption />
          </PrivateRoute>
        }
      />
      <Route
        path="/redemption/edit/:id"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditRedemption />
          </Suspense>
        }
      />
      <Route
        path="/redemption/add"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditRedemption />
          </Suspense>
        }
      />
      <Route
        path="/user"
        element={
          <PrivateRoute>
            <User />
          </PrivateRoute>
        }
      />
      <Route
        path="/user/edit/:id"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditUser />
          </Suspense>
        }
      />
      <Route
        path="/user/edit"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditUser />
          </Suspense>
        }
      />
      <Route
        path="/user/add"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <AddUser />
          </Suspense>
        }
      />
      <Route
        path="/user/reset"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <PasswordResetConfirm />
          </Suspense>
        }
      />
      <Route
        path="/login"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <LoginForm />
          </Suspense>
        }
      />
      <Route
        path="/register"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <RegisterForm />
          </Suspense>
        }
      />
      <Route
        path="/reset"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <PasswordResetForm />
          </Suspense>
        }
      />
      <Route
        path="/oauth/github"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <GitHubOAuth />
          </Suspense>
        }
      />
      <Route
        path="/oauth/lark"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <LarkOAuth />
          </Suspense>
        }
      />
      <Route
        path="/setting"
        element={
          <PrivateRoute>
            <Suspense fallback={<Loading></Loading>}>
              <Setting />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/topup"
        element={
          <PrivateRoute>
            <Suspense fallback={<Loading></Loading>}>
              <TopUp />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/log"
        element={
          <PrivateRoute>
            <Log />
          </PrivateRoute>
        }
      />
      <Route
        path="/about"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <About />
          </Suspense>
        }
      />
      <Route
        path="/chat"
        element={
          <Suspense fallback={<Loading></Loading>}>
            <Chat />
          </Suspense>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
