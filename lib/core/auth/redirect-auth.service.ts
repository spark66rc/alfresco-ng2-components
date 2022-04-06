import { Injectable } from "@angular/core";
import {
    OAuthErrorEvent,
    OAuthService,
    OAuthStorage
} from "angular-oauth2-oidc";
import { Observable } from "rxjs";
import {
    distinctUntilChanged,
    filter,
    first,
    map,
    shareReplay,
    startWith
} from "rxjs/operators";
import { authConfig } from "./auth.config";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root"
})
export class RedirectAuthService extends AuthService {
    private _loadDiscoveryDocumentPromise = Promise.resolve(false);

    /** Subscribe to whether the user has valid Id/Access tokens.  */
    readonly authenticated$: Observable<boolean>;

    /** Subscribe to errors reaching the IdP. */
    readonly idpUnreachable$: Observable<Error>;

    /** Get whether the user has valid Id/Access tokens. */
    get authenticated(): boolean {
        return (
            this.oauthService.hasValidIdToken() &&
            this.oauthService.hasValidAccessToken()
        );
    }

    /** Get current Id token, if authenticated. */
    get idToken(): string | undefined {
        return this.oauthService.getIdToken();
    }

    /** Get current Access token, if authenticated. */
    get accessToken(): string | undefined {
        return this.oauthService.getAccessToken();
    }

    constructor(
        private oauthService: OAuthService,
        protected _oauthStorage: OAuthStorage
    ) {
        super();

        this.oauthService.clearHashAfterLogin = true;

        this.authenticated$ = this.oauthService.events.pipe(
            startWith(undefined),
            map(() => this.authenticated),
            distinctUntilChanged(),
            shareReplay(1)
        );

        this.idpUnreachable$ = this.oauthService.events.pipe(
            filter(
                (event): event is OAuthErrorEvent =>
                    event.type === "discovery_document_load_error"
            ),
            map(event => event.reason as Error)
        );

        this.configureAuth();
    }

    logout() {
        this.oauthService.logOut();
    }

    /** Get user profile, if authenticated. */
    async getUserProfile<T = unknown>(): Promise<T> {
        await this.ensureDiscoveryDocument();
        const userProfile = await this.oauthService.loadUserProfile();
        return (userProfile as any).info;
    }

    /**
     * Ensure that the discovery document is loaded, if not already.
     * This can safely be repeated as a pre-auth check.
     * @returns Promise, resolve if loaded, reject if unable to reach IdP
     */
    ensureDiscoveryDocument(): Promise<boolean> {
        this._loadDiscoveryDocumentPromise = this._loadDiscoveryDocumentPromise
            .catch(() => false)
            .then(loaded => {
                if (!loaded) {
                    return this.oauthService
                        .loadDiscoveryDocument()
                        .then(() => true);
                }
                return true;
            });
        return this._loadDiscoveryDocumentPromise;
    }

    /**
     * Initiate the login flow.
     */
    login(currentUrl: string): void {
        let stateKey: string | undefined;

        if (currentUrl) {
            stateKey = `auth_state_${Math.random()}${Date.now()}`;
            this._oauthStorage.setItem(
                stateKey,
                JSON.stringify(currentUrl || {})
            );
        }

        // initLoginFlow will initialize the login flow in either code or implicit depending on the configuration
        this.ensureDiscoveryDocument().then(
            () => void this.oauthService.initLoginFlow(stateKey)
        );
    }

    /**
     * Complete the login flow.
     * Checks URL for auth and stored state. Call this once the application returns from IdP.
     */
    async loginCallback(): Promise<string | undefined> {
        return this.ensureDiscoveryDocument()
            .then(() =>
                this.oauthService.tryLogin({
                    preventClearHashAfterLogin: false
                })
            )
            .then(() => {
                const stateKey = this.oauthService.state;

                if (stateKey) {
                    const stateStringified = this._oauthStorage.getItem(
                        stateKey
                    );
                    if (stateStringified) {
                        // cleanup state from storage
                        this._oauthStorage.removeItem(stateKey);
                        return JSON.parse(stateStringified);
                    }
                }
            });
    }

    private configureAuth() {
        this.oauthService.configure(authConfig);

        if (authConfig.sessionChecksEnabled) {
            this.oauthService.events
                .pipe(filter(event => event.type === "session_terminated"))
                .subscribe(() => {
                    this.oauthService.logOut();
                });
        }

        this.authenticated$
            .pipe(
                filter(authenticated => !!authenticated),
                first()
            )
            .subscribe(() => {
                this.ensureDiscoveryDocument().then(
                    () => void this.oauthService.setupAutomaticSilentRefresh()
                );
            });
    }
}
