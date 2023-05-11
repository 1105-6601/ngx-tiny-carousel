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
