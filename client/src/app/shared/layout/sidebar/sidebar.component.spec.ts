import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Data, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { of } from 'rxjs';

import { SidebarComponent } from './sidebar.component';
import { SidebarService } from './sidebar.service';
import { FnParam } from '@angular/compiler/src/output/output_ast';

class MockSidebarService {
  getSidebarState = jasmine.createSpy('getSidebarState');
  menus$ = of([] as any);
}

class MockRouter {
  events = {
    subscribe: (fn: (value: Data) => void) => fn(null as any),
  };
}
class MockActivatedRoute {
  snapshot = {
    queryParams: { q: '' },
  };
  queryParams = {
    subscribe: (fn: (value: Data) => void) => fn({ q: '' } as any),
  };
}

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, PerfectScrollbarModule, FormsModule],
      declarations: [SidebarComponent],
      providers: [
        { provide: SidebarService, useClass: MockSidebarService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
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
