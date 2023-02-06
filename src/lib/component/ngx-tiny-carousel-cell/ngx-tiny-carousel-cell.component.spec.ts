import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTinyCarouselCellComponent } from './ngx-tiny-carousel-cell.component';

describe('NgxTinyCarouselCellComponent', () => {

  let component: NgxTinyCarouselCellComponent;
  let fixture: ComponentFixture<NgxTinyCarouselCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgxTinyCarouselCellComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(NgxTinyCarouselCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('作成されたコンポーネントに', () => {
    it('要素の参照が注入されている', () => {
      expect(component.ElementRef).toBeTruthy();
    });
  });
});
