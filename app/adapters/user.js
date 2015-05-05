import ApplicationAdapter from './application';


//noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export default ApplicationAdapter.extend({
  /**
   *  User Login to Authentication
   * @param store
   * @param type
   * @param credentials
   * @returns {Promise}
   */
    login(store, type, credentials) {
    return this.ajax(this.buildURL(type.typeKey, null, null, 'resourceOperation', 'login'), 'POST', {data: credentials});
  },
  /**
   * Logout User
   * @param store
   * @param type
   * @param tokenId
   * @returns {*}
   */
    logout(store, type, tokenId) {
    return this.ajax(this.buildURL(type.typeKey, null, null, 'resourceOperation', 'logout'), 'POST', {data: {tokenId: tokenId}});
  }
});
