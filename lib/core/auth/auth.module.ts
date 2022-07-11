import { StorageService } from '@alfresco/adf-core/storage';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { AuthConfig, OAuthModule, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { authConfigFactory, AuthConfigService } from '../auth-factories/auth-config.service';
import { OIDCAuthenticationService } from '../auth-factories/oidc-authentication.service';
import { AuthGuard } from '../services/auth-guard.service';
import { AuthBearerInterceptor } from './auth-bearer.interceptor';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthModuleConfig, AUTH_CONFIG, AUTH_MODULE_CONFIG } from './auth.module.token';
import { AuthService } from './auth.service';
import { BaseAuthenticationService } from './base-authentication.service';
import { OidcAuthGuard } from './oidc-auth.guard';
import { RedirectAuthService } from './redirect-auth.service';
import { AuthenticationConfirmationComponent } from './view/authentication-confirmation/authentication-confirmation.component';

export function loginFactory(oAuthService: OAuthService, storage: OAuthStorage, config: AuthConfig) {
    const service = new RedirectAuthService(oAuthService, storage, config);
    return () => service.init();
};

const defaultConfig: AuthModuleConfig = {
    useHash: false
};

@NgModule({
  declarations: [AuthenticationConfirmationComponent],
  imports: [
    AuthRoutingModule,
    OAuthModule.forRoot()
  ],
  providers: [
    RedirectAuthService,
    { provide: AuthService, useExisting: RedirectAuthService },
    { provide: OAuthStorage, useExisting: StorageService },
    {
      provide: APP_INITIALIZER,
      useFactory: loginFactory,
      deps: [OAuthService, OAuthStorage, AUTH_MODULE_CONFIG],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthBearerInterceptor, multi: true },
    { provide: AuthGuard, useClass: OidcAuthGuard },
    { provide: BaseAuthenticationService, useClass: OIDCAuthenticationService },
    {
        provide: AUTH_CONFIG,
        useFactory: authConfigFactory,
        deps: [AuthConfigService]
    }
  ]
})
export class AuthModule {
  static forRoot(config: AuthModuleConfig = defaultConfig): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
        providers: [
            { provide: AUTH_MODULE_CONFIG, useValue: config }
        ]
    };
  }
}
