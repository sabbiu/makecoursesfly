import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { HeaderComponent } from './header.component';
import { authReducer } from '../../../auth/store/auth.reducer';
import { SidebarService } from '../sidebar/sidebar.service';

class MockSidebarService {
  getSidebarState = jasmine.createSpy('getSidebarState');
  setSidebarState = jasmine.createSpy('setSidebarState');
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ auth: authReducer })],
      declarations: [HeaderComponent],
      providers: [{ provide: SidebarService, useClass: MockSidebarService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
