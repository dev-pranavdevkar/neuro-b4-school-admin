export default {
  meEndpoint: '/admin/v1/superAdmin/get/me',
  loginEndpoint: '/admin/v1/admin/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
