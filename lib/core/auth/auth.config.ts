// This api will come in the next version

import { AuthConfig } from "angular-oauth2-oidc";

export const authConfig: AuthConfig = {
    issuer: "http://localhost:5002/idp",
    clientId: "alfresco",
    scope: "openid hxp profile offline_access",
    redirectUri: "http://localhost:4200/view/authentication-confirmation",
    postLogoutRedirectUri: "http://localhost:4200/view/unauthenticated",
    silentRefreshRedirectUri: window.location.origin + "/silent-refresh.html",
    showDebugInformation: true,
    responseType: "code"
};
