import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowLeftComponent } from './arrow-left.component';
import { ElementRef }         from '@angular/core';

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
