// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const IS_LIVE = false;

export const environment = {
  production: false,
  GATEWAY_URL: 'http://dev-hscm.grp.gov.bd/bcc/api',
  GLOBAL_GATEWAY_URL: 'http://dev-hscm.grp.gov.bd/global/api',
  NOTIFICATION_URL: 'http://dev-hscm.grp.gov.bd/bcc/notification',
  LOG_IN_API_Endpoint: 'http://dev-hscm.grp.gov.bd/global/web',
  IS_MODAL_OPEN: false
};
