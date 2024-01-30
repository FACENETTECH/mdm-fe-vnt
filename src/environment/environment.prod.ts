export const environment = {
  production: true,
  api_end_point: 'http://222.252.25.37:8312',
  auth_api:'/api/auth/',
  keycloak: {
    issuer: 'https://sso.xfactory.vn/auth',
    // Realm
    realm: 'Facenet',
    clientId: 'mrp-client',
  },


  BASE_API_URI: {
	  BASE_SERVICE_API: 'http://localhost:8088/',
    CLIENT_ADDRESS:    'http://localhost:8082',
  },

}
