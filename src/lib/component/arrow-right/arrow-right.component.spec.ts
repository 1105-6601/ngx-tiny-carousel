import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArrowRightComponent }       from './arrow-right.component';

describe('ArrowRightComponent', () => {
  let component: ArrowRightComponent;
  let fixture: ComponentFixture<ArrowRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArrowRightComponent],
    })
      .compileComponents();

    fixture   = TestBed.createComponent(ArrowRightComponent);
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
