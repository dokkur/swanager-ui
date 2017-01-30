import { authorize } from '../api';
import { loadApps } from './apps';
import { SIGNED_IN, ERROR_SIGINIG_IN, SAVE_CURRENT_PATH } from './index';

export const signedIn = (token) => ({ type: SIGNED_IN, data: token });
export const errorSigningIn = (errors) => ({ type: ERROR_SIGINIG_IN, data: errors });
export const saveCurrentPath = (path) => ({ type: SAVE_CURRENT_PATH, data: path });

export const saveTokenToLocalstore = (token) => {
  return () => {
    localStorage.setItem('authToken', token.token);
  };
};

export const signin = (email, password) => {
  let responseCode;
  return dispatch => {
    authorize(email, password)
    .then(response => {
      responseCode = response.status;
      return response.json();
    })
    .then(payload => {
      switch (responseCode) {
        case 401:
          dispatch(errorSigningIn(payload.errors));
          break;
        case 200:
          dispatch(signedIn(payload.token));
          dispatch(saveTokenToLocalstore(payload.token));
          dispatch(loadApps());
          break;
        default:
          dispatch(errorSigningIn('Unknown error'));
      }
    })
    .catch(() => {
    });
  };
};