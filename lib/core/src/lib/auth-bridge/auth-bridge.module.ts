import { AuthModule, OidcAuthGuard } from '@alfresco/adf-core/auth';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { AUTH_CONFIG, OAuthStorage } from 'angular-oauth2-oidc';
import { AlfrescoApiServiceWithAngularBasedHttpClient } from '../api-factories/alfresco-api-service-with-angular-based-http-client';
import { AlfrescoApiService, AuthenticationService, AuthGuard } from '../services';
import { StorageService } from '../services/storage.service';
import { authConfigFactory, AuthConfigService } from './auth-config.service';
import { OIDCAuthenticationService } from './oidc-authentication.service';

export interface AuthModuleConfig {
    readonly useHash: boolean;
}

export const AUTH_MODULE_CONFIG = new InjectionToken<AuthModuleConfig>('AUTH_MODULE_CONFIG');

@NgModule({
    imports: [AuthModule],
    providers: [
        { provide: OAuthStorage, useExisting: StorageService },
        { provide: AuthGuard, useClass: OidcAuthGuard },
        { provide: AuthenticationService, useClass: OIDCAuthenticationService },
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceWithAngularBasedHttpClient },
        {
            provide: AUTH_CONFIG,
            useFactory: authConfigFactory,
            deps: [AuthConfigService]
        }
    ]
})
export class AuthBridgeModule {
    static forRoot(config: AuthModuleConfig = { useHash: false }): ModuleWithProviders<AuthBridgeModule> {
        return {
            ngModule: AuthBridgeModule,
            providers: [{ provide: AUTH_MODULE_CONFIG, useValue: config }]
        };
    }
}
