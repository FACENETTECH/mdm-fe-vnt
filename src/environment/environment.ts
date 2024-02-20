// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url_home_page:
    'http://localhost:4200/home-page/#/auth/business-acc-setting/home-page',
  // url_home_page:
  //   'http://dev.fcim.facenet.vn/home-page/#/auth/business-acc-setting/home-page',
  api_end_point: 'http://dev.apifcim.facenet.vn/mdm-v2',
  // api_end_point: 'http://222.252.25.37:10319',
  // api_end_point: 'http://localhost:10320',
  auth_api: '/api/auth/',
  keycloak: {
    // issuer: 'https://ssoproduction.xfactory.vn/auth/',
    issuer: 'https://sso.xfactory.vn/auth/',
    // Realm
    realm: 'fcim_cloud',
    clientId: 'fcim_cloud',
  },
  BASE_API_URI: {
    BASE_SERVICE_API: 'http://localhost:8088/',
    CLIENT_ADDRESS: 'http://localhost:8082',
  },
  // API_URL: 'http://dev.apifcim.facenet.vn/all',
  API_URL: 'http://222.252.25.37:10302',
};

// export const environment = {
//   production: false,
//   api_end_point: 'http://222.252.25.37:8312',
//   auth_api: '/api/auth/',
//   keycloak: {
//     issuer: 'http://sso.xfactory.vn/auth/',
//     // Realm
//     realm: 'Facenet',
//     clientId: 'mrp_backend',
//   },
//   // keycloak: {
//   //   issuer: 'https://user.difitech.vn/',
//   //   // Realm
//   //   realm: 'financeapp',
//   //   clientId: 'finance-cms',
//   // },

//   BASE_API_URI: {
//     BASE_SERVICE_API: 'http://localhost:8088/',
//     CLIENT_ADDRESS: 'http://localhost:8082',
//   },
// };
/*
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI
