export default {
  meEndpoint: '/admin/v1/superAdmin/get/me',
  loginEndpoint: '/admin/v1/superAdmin/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
