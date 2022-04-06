import { ModuleWithProviders, NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { OAuthModule } from "angular-oauth2-oidc";
import { AuthRoutingModule } from "./auth-routing.module";
import { AuthService } from "./auth.service";
import { RedirectAuthService } from "./redirect-auth.service";
import { AuthenticationConfirmationView } from "./view/authentication-confirmation/authentication-confirmation.view";
import { UnauthenticatedView } from "./view/unauthenticated/unauthenticated.view";

@NgModule({
    declarations: [AuthenticationConfirmationView, UnauthenticatedView],
    imports: [
        AuthRoutingModule,
        MatIconModule,
        MatButtonModule,
        OAuthModule.forRoot({
            resourceServer: {
                allowedUrls: ["http://localhost:8080"],
                sendAccessToken: true
            }
        })
    ],
    providers: [
        {
            provide: AuthService,
            useExisting: RedirectAuthService
        }
    ]
})
export class AuthModule {
    static forRoot(): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule
        };
    }
}
