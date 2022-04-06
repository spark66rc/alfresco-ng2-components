import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { RouterTestingModule } from "@angular/router/testing";
import { MockModule, MockProvider } from "ng-mocks";
import { AuthService } from "../../auth.service";
import { AuthenticationConfirmationView } from "./authentication-confirmation.view";

describe("AuthenticationConfirmationView", () => {
    let component: AuthenticationConfirmationView;
    let fixture: ComponentFixture<AuthenticationConfirmationView>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AuthenticationConfirmationView],
            providers: [
                MockProvider(AuthService, {
                    loginCallback() {
                        return Promise.resolve(undefined);
                    }
                })
            ],
            imports: [MockModule(MatIconModule), RouterTestingModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthenticationConfirmationView);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
