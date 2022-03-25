// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  wsEndpoint: "ws://localhost:3000",
  reconnectInterval: 10000,
  MORALIS_APP_ID: 'enter your own MORALIS_APP_ID',
  MORALIS_SERVER_URL: 'enter your own MORLAIS_SERVER_URL',
  PK: 'enter your own PK',
  MUMBAI_RPC_URL: 'https://rpc-mumbai.matic.today',
  PROFILE_ID: 'enter your own PROFILE_ID',
  LENS_API: 'https://api-mumbai.lens.dev/',
  LENS_HUB_CONTRACT: '0xd7B3481De00995046C7850bCe9a5196B7605c367',
  MOCK_PROFILE_CREATION_CONTRACT: '0x9BB48d8F9c4596b98C8bB1fB6D67aaE238F81CC2',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
