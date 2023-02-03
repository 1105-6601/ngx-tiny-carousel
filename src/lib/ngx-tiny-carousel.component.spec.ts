import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild }      from '@angular/core';
import { ArrowLeftComponent }        from './component/arrow-left/arrow-left.component';
import { ArrowRightComponent }       from './component/arrow-right/arrow-right.component';
import { DotsComponent }             from './component/dots/dots.component';
import { NgxTinyCarouselComponent }  from './ngx-tiny-carousel.component';

jest.useFakeTimers();

@Component({
  template: `
              <div>
                <ngx-tiny-carousel #tinyCarouselComponent>
                  <div class="cell">
                    <img src="https://picsum.photos/300/400" alt="">
                  </div>
                  <div class="cell">
                    <img src="https://picsum.photos/250/400" alt="">
                  </div>
                  <div class="cell">
                    <img src="https://picsum.photos/400/250" alt="">
                  </div>
                  <div class="cell">
                    <img src="https://picsum.photos/400/300" alt="">
                  </div>
                  <div class="cell">
                    <img src="https://picsum.photos/400/400" alt="">
                  </div>
                </ngx-tiny-carousel>
              </div>
            `,
})
class HostComponent
{
  @ViewChild('tinyCarouselComponent')
  public tinyCarouselComponent?: NgxTinyCarouselComponent;
}

describe('NgxTinyCarouselComponent', () => {

  let hostComponent: HostComponent;
  let hostFixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NgxTinyCarouselComponent,
        ArrowLeftComponent,
        ArrowRightComponent,
        DotsComponent,
        HostComponent,
      ],
    })
      .compileComponents();

    hostFixture   = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  beforeEach(() => {
    // `clientWidth`読み取り時`400`が返るようにエミュレート
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {configurable: true, value: 400});
  });

  describe('コンポーネント生成時', () => {

    beforeEach(() => {
      jest.runAllTimers();
    });

    describe('要素幅が', () => {
      describe('設定されていない場合', () => {
        it('ルート要素の幅が要素幅として設定される', () => {
          expect(hostComponent.tinyCarouselComponent?.cellWidth).toBe(400);
        });
      });

      describe('設定されている場合', () => {
        beforeEach(() => {
          hostComponent.tinyCarouselComponent!.cellWidth = 600;
        });
        it('設定が維持される', () => {
          expect(hostComponent.tinyCarouselComponent?.cellWidth).toBe(600);
        });
      });
    });

    describe('カルーセルの高さが', () => {
      describe('設定されていない場合', () => {
        it('要素幅が高さとして設定される', () => {
          expect(hostComponent.tinyCarouselComponent?.height).toBe(hostComponent.tinyCarouselComponent?.cellWidth);
        });
      });

      describe('設定されている場合', () => {
        beforeEach(() => {
          hostComponent.tinyCarouselComponent!.height = 700;
        });
        it('設定が維持される', () => {
          expect(hostComponent.tinyCarouselComponent?.height).toBe(700);
        });
      });
    });

    it('特定クラスを持つ要素をカルーセルの要素として検出される', () => {
      expect(hostComponent.tinyCarouselComponent?.totalCells).toBe(5);
    });

    it('要素コンテナの幅が要素数x要素幅に設定される', () => {
      const cellWidth  = hostComponent.tinyCarouselComponent!.cellWidth;
      const totalCells = hostComponent.tinyCarouselComponent!.totalCells;
      expect(hostComponent.tinyCarouselComponent?.cells?.nativeElement.style.width).toBe(`${cellWidth * totalCells}px`);
    });

    it('各要素にwidthが設定される', () => {
      const cell = hostComponent.tinyCarouselComponent?.cells?.nativeElement.querySelector('.cell');
      expect(cell.style.width).toBe(`${hostComponent.tinyCarouselComponent!.cellWidth}px`);
    });
  });

  describe('UIスケールのテスト', () => {
    test.each`
      height | scale
      ${400} | ${1}
      ${300} | ${0.75}
      ${200} | ${0.5}
      ${100} | ${0.25}
      `('高さが$heightの時、UIスケールは$scaleになる', ({height, scale}) => {
      hostComponent.tinyCarouselComponent!.height = height;
      jest.runAllTimers();
      expect(hostComponent.tinyCarouselComponent?.uiScale).toBe(scale);
    });
  });

  describe('UIのテスト', () => {

    beforeEach(() => {
      jest.runAllTimers();
      hostFixture.detectChanges();
    });

    describe('次へボタンを押した際', () => {
      describe('末尾の要素でない場合', () => {
        it('currentCellIndexが加算される', () => {
          hostFixture.nativeElement.querySelector('.arrow-right').click();
          expect(hostComponent.tinyCarouselComponent?.currentCellIndex).toBe(1);
        });
      });

      describe('末尾の要素の場合', () => {
        it('currentCellIndexが0に戻る', () => {
          hostComponent.tinyCarouselComponent!.currentCellIndex = hostComponent.tinyCarouselComponent!.totalCells - 1
          hostFixture.nativeElement.querySelector('.arrow-right').click();
          expect(hostComponent.tinyCarouselComponent?.currentCellIndex).toBe(0);
        });
      });
    });

    describe('戻るボタンを押した際', () => {
      describe('先頭の要素でない場合', () => {
        it('currentCellIndexが減算される', () => {
          hostComponent.tinyCarouselComponent!.currentCellIndex = 3;
          hostFixture.nativeElement.querySelector('.arrow-left').click();
          expect(hostComponent.tinyCarouselComponent?.currentCellIndex).toBe(2);
        });
      });

      describe('先頭の要素の場合', () => {
        it('currentCellIndexが最終要素に設定される', () => {
          hostComponent.tinyCarouselComponent!.currentCellIndex = 0
          hostFixture.nativeElement.querySelector('.arrow-left').click();
          expect(hostComponent.tinyCarouselComponent?.currentCellIndex).toBe(hostComponent.tinyCarouselComponent!.totalCells - 1);
        });
      });
    });
  });

  describe('UIのtransformテスト', () => {

    beforeEach(() => {
      jest.runAllTimers();
      hostFixture.detectChanges();
    });

    describe('要素幅が400pxの場合', () => {

      test.each`
      currentCellIndex | transform
      ${0}             | ${'translateX(-400px)'}
      ${1}             | ${'translateX(-800px)'}
      ${2}             | ${'translateX(-1200px)'}
      ${3}             | ${'translateX(-1600px)'}
      ${4}             | ${'translateX(-0px)'}
      `('現在の表示セルが$currentCellIndexの時、次へボタンを押した場合、transformの値は$transformになる', ({currentCellIndex, transform}) => {
        hostComponent.tinyCarouselComponent!.currentCellIndex = currentCellIndex;
        hostFixture.nativeElement.querySelector('.arrow-right').click();
        expect(hostComponent.tinyCarouselComponent?.cells?.nativeElement.style.transform).toBe(transform);
      });

      test.each`
      currentCellIndex | transform
      ${0}             | ${'translateX(-1600px)'}
      ${1}             | ${'translateX(-0px)'}
      ${2}             | ${'translateX(-400px)'}
      ${3}             | ${'translateX(-800px)'}
      ${4}             | ${'translateX(-1200px)'}
      `('現在の表示セルが$currentCellIndexの時、前へボタンを押した場合、transformの値は$transformになる', ({currentCellIndex, transform}) => {
        hostComponent.tinyCarouselComponent!.currentCellIndex = currentCellIndex;
        hostFixture.nativeElement.querySelector('.arrow-left').click();
        expect(hostComponent.tinyCarouselComponent?.cells?.nativeElement.style.transform).toBe(transform);
      });
    });
  });

  describe('ドット数の計算テスト', () => {
    test.each`
    totalCells | displayCells | dotCount
    ${2}       | ${3}         | ${0}
    ${3}       | ${3}         | ${1}
    ${4}       | ${1}         | ${4}
    ${5}       | ${3}         | ${3}
    `('要素数が$totalCells、同時表示数が$displayCellsの時、ドットは$dotCount個表示される', ({totalCells, displayCells, dotCount}) => {
      hostComponent.tinyCarouselComponent!.totalCells = totalCells;
      hostComponent.tinyCarouselComponent!.displayCells = displayCells;
      expect(hostComponent.tinyCarouselComponent?.dotCount).toBe(dotCount);
    });
  });
});
