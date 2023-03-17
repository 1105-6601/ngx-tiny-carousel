import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotsComponent } from './dots.component';
import { ElementRef }    from '@angular/core';

jest.useFakeTimers();

describe('DotsComponent', () => {
  let component: DotsComponent;
  let fixture: ComponentFixture<DotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DotsComponent],
    })
      .compileComponents();

    fixture   = TestBed.createComponent(DotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    // 必須パラメーターをセット
    component.dotCount = 5;
    fixture.detectChanges();
  });

  describe('スケール変更時', () => {

    beforeEach(() => {
      const mockElmRef = new class extends ElementRef<HTMLElement>{}(fixture.nativeElement.querySelector('.dots'));
      component.uiScale = 0.5;
      component.dots = mockElmRef;
      jest.runAllTimers();
    });

    it('ホスト要素のtransformプロパティが変更される', () => {
      const dots = fixture.nativeElement.querySelector('.dots');
      expect(dots.style.transform).toBe('scale(0.65, 0.65)');
    });
  });

  describe('表示中の要素のインデックスが一致する場合', () => {

    beforeEach(() => {
      component.currentIndex = 3;
      fixture.detectChanges();
    });

    it('ドットがハイライトされる', () => {
      const dot = fixture.nativeElement.querySelector('.dots > .dot:nth-child(4)');
      expect(dot.classList.toString()).toContain('active');
    });
  });
});
