import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockProvider } from 'ng-mocks';
import { AuthService } from '../../auth.service';
import { UnauthenticatedView } from './unauthenticated.view';

describe('UnauthenticatedView', () => {
  let component: UnauthenticatedView;
  let fixture: ComponentFixture<UnauthenticatedView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnauthenticatedView],
      providers: [MockProvider(AuthService)],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthenticatedView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
