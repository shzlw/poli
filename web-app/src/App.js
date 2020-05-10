import React from 'react';
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faChalkboard, faDatabase, faUsersCog, faPlus, faTimes,
  faEdit, faTrashAlt, faPlayCircle, faStopCircle, faRedoAlt,
  faTv, faPlug, faUser, faSignOutAlt, faCompress, faExpandArrowsAlt,
  faFileExport, faFileCsv, faCircleNotch, faSearch, faSave, 
  faCalendarPlus, faFilter, faExternalLinkAlt, faCheckSquare, 
  faLongArrowAltRight, faWrench, faArchive, faFileDownload,
  faHeart, faShareSquare, faSearchLocation, faClipboard, 
  faAngleRight, faAngleDown, faFilePdf, faEllipsisH, faBolt, faAngleLeft, 
  faChevronRight, faChevronLeft
} from '@fortawesome/free-solid-svg-icons';
import {
  faSquare as farSquare,
  faHeart as farHeart
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


import './App.css';

import Login from './views/Login/Login';
import ChangeTempPassword from './views/Login/ChangeTempPassword';
import Workspace from './views/Workspace';
import PageNotFound from './views/PageNotFound';
import * as Constants from './api/Constants';
import * as Util from './api/Util';


library.add(faChalkboard, faDatabase, faUsersCog, faPlus, faTimes, 
  faEdit, faTrashAlt, faPlayCircle, faStopCircle, faRedoAlt, 
  faTv, faPlug, faUser, faSignOutAlt, faCompress, faExpandArrowsAlt,
  faFileExport, faFileCsv, faCircleNotch, faSearch, faSave, 
  faCalendarPlus, faFilter, faExternalLinkAlt, faCheckSquare,
  faLongArrowAltRight, faWrench, farSquare, faArchive, faFileDownload,
  faHeart, farHeart, faShareSquare, faSearchLocation, faClipboard,
  faAngleRight, faAngleDown, faFilePdf, faEllipsisH, faBolt, faAngleLeft,
  faChevronRight, faChevronLeft
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      sysRole: '',
      isAuthorizing: false,
      localeLanguage: ''
    }
  }

  componentDidMount() {
    this.configAxiosInterceptors();
    this.configLocaleLanguage();

    const pathname = this.props.location.pathname;
    const search = this.props.location.search;
    const currentPath = pathname + search;

    const params = new URLSearchParams(search);
    const apiKey = params.get('$apiKey');
    const shareKey = params.get('$shareKey');
    const isFullScreenView = pathname.indexOf('/workspace/report/fullscreen') !== -1;
    if (isFullScreenView) {
      // Only allow using ApiKey in fullscreen view.
      if (apiKey !== null) {
        delete axios.defaults.headers.common['Poli-Share-Key'];

        const loginRequest = {
          apiKey: apiKey
        };
        this.setState({
          isAuthorizing: true
        }, () => {
          axios.post('/auth/login/apikey', loginRequest)
            .then(res => {
              axios.defaults.headers.common = {
                "Poli-Api-Key": apiKey
              };
              this.handleLoginResponse(res.data, currentPath);
            });
        });
        return;   
      } else if (shareKey !== null) {
        delete axios.defaults.headers.common['Poli-Api-Key'];

        // Only allow using ShareKey in fullscreen view.
        const loginRequest = {
          shareKey: shareKey
        };
        this.setState({
          isAuthorizing: true
        }, () => {
          axios.post('/auth/login/sharekey', loginRequest)
            .then(res => {
              axios.defaults.headers.common = {
                "Poli-Share-Key": shareKey
              };
              this.handleLoginResponse(res.data, currentPath);
            });
        });
        return;
      }
    } else {
      delete axios.defaults.headers.common['Poli-Api-Key'];
      delete axios.defaults.headers.common['Poli-Share-Key'];
    }
    
    const rememberMeConfig = localStorage.getItem(Constants.REMEMBERME);
    const rememberMe = (rememberMeConfig && rememberMeConfig === Constants.YES) || isFullScreenView;

    const {
      sysRole
    } = this.state;

    let isAuthenticated = false;
    if (sysRole) {
      isAuthenticated = true;
    }

    if (!isAuthenticated && rememberMe) {
      this.setState({
        isAuthorizing: true
      }, () => {
        axios.post('/auth/login/cookie')
          .then(res => {
            this.handleLoginResponse(res.data, currentPath);
          }).catch(error => {
            this.onLogout();
          });
      });
    }
  }

  handleLoginResponse = (loginResponse, currentPath) => {
    if (loginResponse.error) {
      this.setState({
        sysRole: '',
        isAuthorizing: false
      }, () => {
        this.props.history.push('/login');
      });
    } else {
      this.onLoginSuccess(loginResponse, currentPath);
    }
  }

  onLoginSuccess = (loginResponse = {}, pathname = '/') => {
    if (loginResponse.isTempPassword) {
      this.props.history.push('/changepassword');
    } else {
      this.setState({
        username: loginResponse.username,
        sysRole: loginResponse.sysRole,
        isAuthorizing: false
      }, () => {
        let directUrl = '/workspace/report';
        if (pathname !== '/' && pathname !== '/login') {
          directUrl = pathname;
        }
        this.props.history.push(directUrl);
      });
    }
  }

  onLogout = () => {
    this.setState({
      username: '',
      sysRole: '',
      isAuthorizing: false
    }, () => {
      this.props.history.push('/login');
    });
  }

  configAxiosInterceptors = () => {
    axios.interceptors.response.use((response) => {
        return response;
      }, (error) => {
        const readableServerError = Util.toReadableServerError(error);
        toast.error(() => <div className="toast-msg-body">{readableServerError}</div>);
        const statusCode = error.response.status;
        if(statusCode === 401 || statusCode === 403) { 
          this.onLogout();
        }
        return Promise.reject(error);
    });
  }

  configLocaleLanguage = () => {
    const {
      localeLanguage
    } = this.state;
    if (localeLanguage) {
      return;
    }

    axios.get('/info/general')
      .then(res => {
        const info = res.data;
        const {
          localeLanguage
        } = info;
        const { i18n } = this.props;
        i18n.changeLanguage(String(localeLanguage));
        this.setState({
          localeLanguage: localeLanguage
        });
      });
  }
   
  render() {
    const {
      username,
      sysRole,
      isAuthorizing
    } = this.state;

    const { t } = this.props;

    let isAuthenticated = false;
    if (sysRole) {
      isAuthenticated = true;
    }

    if (isAuthorizing) {
      return (
        <div className="authenticating-panel">
          <div className="authenticating-panel-title">{t('Poli')}</div>
          <FontAwesomeIcon icon="circle-notch" spin={true} size="2x" />
        </div>
      )
    }

    return (
      <div className="app">
        <Switch>
          <Route exact path="/" render={() => <Login onLoginSuccess={this.onLoginSuccess} />} />
          <Route path="/login" render={() => <Login onLoginSuccess={this.onLoginSuccess} />} />
          <Route path="/changepassword" component={ChangeTempPassword} />
          <PrivateRoute 
            authenticated={isAuthenticated} 
            path='/workspace' 
            component={Workspace} 
            username={username}
            sysRole={sysRole} 
            onLogout={this.onLogout}
          />
          <Route component={PageNotFound} />
        </Switch>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          draggable={false}
          hideProgressBar
          closeOnClick
        />
      </div>
    );
  }
}

function PrivateRoute({component: Component, authenticated, ...rest}) {
  return (
    <Route
      {...rest}
      render={
        (props) => authenticated === true
        ? <Component {...props} {...rest} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />
      }
    />
  )
}

export default (withTranslation()(withRouter(App)));
