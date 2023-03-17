import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArrowRightComponent }       from './arrow-right.component';
import { ElementRef }                from '@angular/core';

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
      const mockElmRef = new class extends ElementRef<HTMLElement>{}(fixture.nativeElement.querySelector('svg'));
      component.uiScale = 0.5;
      component.svg = mockElmRef;
    });

    it('SVGのtransformプロパティが変更される', () => {
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg.style.transform).toBe('scale(0.5, 0.5)');
    });
  });
});
