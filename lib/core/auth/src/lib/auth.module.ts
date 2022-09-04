import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AuthConfig, OAuthModule, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthRoutingModule } from './auth-routing.module';
import { AUTH_CONFIG } from './auth.module.token';
import { AuthService } from './auth.service';
import { RedirectAuthService } from './redirect-auth.service';
import { AuthenticationConfirmationComponent } from './view/authentication-confirmation/authentication-confirmation.component';

export function loginFactory(oAuthService: OAuthService, storage: OAuthStorage, config: AuthConfig) {
    const service = new RedirectAuthService(oAuthService, storage, config);
    return () => service.init();
}

@NgModule({
    declarations: [AuthenticationConfirmationComponent],
    imports: [AuthRoutingModule, OAuthModule.forRoot()],
    providers: [
        RedirectAuthService,
        { provide: AuthService, useExisting: RedirectAuthService },
        {
            provide: APP_INITIALIZER,
            useFactory: loginFactory,
            deps: [OAuthService, OAuthStorage, AUTH_CONFIG],
            multi: true
        }
    ]
})
export class AuthModule {}
