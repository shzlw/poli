
class AuthStore {

  constructor() {
    this._sysRole = '';
    this._username = '';
  }

  set sysRole(sysRole) {
    this._sysRole = sysRole;
  }

  get sysRole() {
    return this._sysRole;
  }

  set username(username) {
    this._username = username;
  }

  get username() {
    return this._username;
  }

  get isAuthenticated() {
    return this._sysRole !== '';
  }
}

export default new AuthStore();