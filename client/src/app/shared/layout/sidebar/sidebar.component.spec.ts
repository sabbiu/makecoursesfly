import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Router, Data } from '@angular/router';
import { of } from 'rxjs';

import { SidebarComponent } from './sidebar.component';
import { SidebarService } from './sidebar.service';

class MockSidebarService {
  getSidebarState = jasmine.createSpy('getSidebarState');
  menus$ = of([] as any);
}

class MockRouter {
  events = {
    subscribe: (fn: (value: Data) => void) => fn(null as any),
  };
}

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, PerfectScrollbarModule],
      declarations: [SidebarComponent],
      providers: [
        { provide: SidebarService, useClass: MockSidebarService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
