import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthenticationConfirmationView } from "./view/authentication-confirmation/authentication-confirmation.view";
import { UnauthenticatedView } from "./view/unauthenticated/unauthenticated.view";

const routes: Routes = [
    { path: "view/authentication-confirmation", component: AuthenticationConfirmationView },
    { path: "view/unauthenticated", component: UnauthenticatedView }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
