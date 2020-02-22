import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { LayoutComponent } from './layout.component';
import { SidebarService } from './sidebar/sidebar.service';
import { Component } from '@angular/core';

class MockSidebarService {
  getSidebarState = jasmine.createSpy('getSidebarState');
  setSidebarState = jasmine.createSpy('setSidebarState');
}

@Component({
  selector: 'app-header',
  template: '<p>Mock Header Component</p>',
})
class MockHeaderComponent {}

@Component({
  selector: 'app-sidebar',
  template: '<p>Mock Sidebar Component</p>',
})
class MockSidebarComponent {}

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, PerfectScrollbarModule],
      declarations: [
        LayoutComponent,
        MockHeaderComponent,
        MockSidebarComponent,
      ],
      providers: [{ provide: SidebarService, useClass: MockSidebarService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
