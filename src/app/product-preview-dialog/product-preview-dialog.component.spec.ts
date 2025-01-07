import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPreviewDialogComponent } from './product-preview-dialog.component';

describe('ProductPreviewDialogComponent', () => {
  let component: ProductPreviewDialogComponent;
  let fixture: ComponentFixture<ProductPreviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPreviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
