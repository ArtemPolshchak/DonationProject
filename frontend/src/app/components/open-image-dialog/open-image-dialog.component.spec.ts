import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenImageDialogComponent } from './open-image-dialog.component';

describe('OpenImageDialogComponent', () => {
  let component: OpenImageDialogComponent;
  let fixture: ComponentFixture<OpenImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenImageDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
