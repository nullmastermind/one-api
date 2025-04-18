import React, { useContext, useEffect, useState } from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API, showError, showSuccess } from '../helpers';
import { UserContext } from '../context/User';

const GitHubOAuth = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [_userState, userDispatch] = useContext(UserContext);
  const [prompt, setPrompt] = useState('Processing...');
  const [_processing, _setProcessing] = useState(true);

  let navigate = useNavigate();

  const sendCode = async (code, state, count) => {
    const res = await API.get(`/api/oauth/github?code=${code}&state=${state}`);
    const { success, message, data } = res.data;
    if (success) {
      if (message === 'bind') {
        showSuccess('Successfully linked!');
        navigate('/setting');
      } else {
        userDispatch({ type: 'login', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        showSuccess('Login successful!');
        navigate('/');
      }
    } else {
      showError(message);
      if (count === 0) {
        setPrompt(`Operation failed, redirecting to login page...`);
        navigate('/setting'); // in case this is failed to bind GitHub
        return;
      }
      count++;
      setPrompt(`Oops, something went wrong! Retrying for the ${count} time...`);
      await new Promise((resolve) => setTimeout(resolve, count * 2000));
      await sendCode(code, state, count);
    }
  };

  useEffect(() => {
    let code = searchParams.get('code');
    let state = searchParams.get('state');
    sendCode(code, state, 0).then();
  }, []);

  return (
    <Segment style={{ minHeight: '300px' }}>
      <Dimmer active inverted>
        <Loader size='large'>{prompt}</Loader>
      </Dimmer>
    </Segment>
  );
};

export default GitHubOAuth;
