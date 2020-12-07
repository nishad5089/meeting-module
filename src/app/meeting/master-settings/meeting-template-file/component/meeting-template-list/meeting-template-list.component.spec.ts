import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingTemplateListComponent } from './meeting-template.component';

describe('MeetingTemplateComponent', () => {
  let component: MeetingTemplateListComponent;
  let fixture: ComponentFixture<MeetingTemplateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingTemplateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
