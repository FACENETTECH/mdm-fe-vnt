export const environment = {
  production: true,
  api_end_point: 'http://192.168.68.87:8312',
  auth_api:'/api/auth/',
  keycloak: {
    issuer: 'http://192.168.68.90:8080/auth/',
    // Realm
    realm: 'QLSX',
    clientId: 'mrp-client',
  },
  BASE_API_URI: {
   BASE_SERVICE_API: 'http://localhost:8088/',
   CLIENT_ADDRESS:    'http://localhost:8082',
  },
};
