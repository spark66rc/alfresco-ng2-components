import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AuthService } from "../../auth.service";

@Component({
    templateUrl: "./unauthenticated.view.html",
    styleUrls: ["./unauthenticated.view.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnauthenticatedView {
    constructor(private readonly _auth: AuthService) {}

    login() {
        this._auth.login();
    }
}
