import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowLeftComponent } from './arrow-left.component';

describe('ArrowLeftComponent', () => {
  let component: ArrowLeftComponent;
  let fixture: ComponentFixture<ArrowLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArrowLeftComponent],
    })
      .compileComponents();

    fixture   = TestBed.createComponent(ArrowLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('コンポーネント生成時', () => {
    it('SVGがレンダリングされる', () => {
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg).toBeTruthy();
    });
  });

  describe('スケール変更時', () => {

    beforeEach(() => {
      const svg = fixture.nativeElement.querySelector('svg');
      component.setScale(svg, 0.5);
    });

    it('SVGのtransformプロパティが変更される', () => {
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg.style.transform).toBe('scale(0.5, 0.5)');
    });
  });
});
