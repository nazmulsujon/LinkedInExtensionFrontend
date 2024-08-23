import { CircularProgress, Stack } from '@mui/material';
import '@src/Popup.css';
import { useRecoilState } from 'recoil';
import { navigationAtom, PAGES } from './atoms';
import Login from './pages/Login';
import Home from './pages/Home';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { apiGetAllCommentTypes, apiGetAllPersonas, apiGetUser, apiRefreshToken } from './util';

const Popup = () => {
  const [navState, setNav] = useRecoilState(navigationAtom);
  const [hideUI, setHideUI] = useState(true);
  const [cssLoaded, setCssLoaded] = useState('');

  useEffect(() => {
    const asyncCheck = async () => {
      const localData = await chrome.storage.local.get('authInfo');
      if (!localData.authInfo) return setNav(PAGES.LOGIN);
      try {
        await apiRefreshToken();
        await apiGetAllPersonas();
        await apiGetAllCommentTypes();
        await apiGetUser();
        return setNav(PAGES.HOME);
      } catch (e) {
        console.log(e);
        toast.info('Login expired, please login again.');
      }

      return setNav(PAGES.LOGIN);
    };
    asyncCheck();
  }, []);

  useEffect(() => {
    chrome.storage.session.onChanged.addListener(changes => {
      if (changes.hideUI) {
        setHideUI(changes.hideUI.newValue);
      }
    });

    chrome.storage.session.get('hideUI', data => {
      console.log('data: ', data);
      if (data) setHideUI(data.hideUI);
    });

    fetch(chrome.runtime.getURL('content-popup-ui/style.css'))
      .then(res => res.text())
      .then(css => setCssLoaded(css));
  }, []);

  const handleHideUI = () => {
    chrome.storage.session.set({ hideUI: true });
  };

  if (hideUI) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      onClick={handleHideUI}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 9999999999,
      }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events  */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            right: '30px',
            top: '10px',
            backgroundColor: 'white',
            width: '300px',
            height: '300px',
          }}>
          <style>{cssLoaded}</style>
          <ToastContainer />
          <Stack width="100%" height="100%" justifyContent="center" alignItems="center">
            {navState === PAGES.LOADING && <CircularProgress color="primary" size={24} />}
            {navState === PAGES.LOGIN && <Login />}
            {navState === PAGES.HOME && <Home />}
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default Popup;
