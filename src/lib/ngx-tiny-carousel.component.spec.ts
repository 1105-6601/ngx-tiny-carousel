import { ComponentFixture, TestBed }    from '@angular/core/testing';
import { Component, ViewChild }         from '@angular/core';
import { ArrowLeftComponent }           from './component/arrow-left/arrow-left.component';
import { ArrowRightComponent }          from './component/arrow-right/arrow-right.component';
import { DotsComponent }                from './component/dots/dots.component';
import { NgxTinyCarouselCellComponent } from './component/ngx-tiny-carousel-cell/ngx-tiny-carousel-cell.component';
import { NgxTinyCarouselComponent }     from './ngx-tiny-carousel.component';

jest.useFakeTimers();

@Component({
  template: `
              <div>
                <ngx-tiny-carousel #tinyCarouselComponent>
                  <ngx-tiny-carousel-cell>
                    <div>cell</div>
                  </ngx-tiny-carousel-cell>
                  <ngx-tiny-carousel-cell>
                    <div>cell</div>
                  </ngx-tiny-carousel-cell>
                  <ngx-tiny-carousel-cell>
                    <div>cell</div>
                  </ngx-tiny-carousel-cell>
                  <ngx-tiny-carousel-cell>
                    <div>cell</div>
                  </ngx-tiny-carousel-cell>
                  <ngx-tiny-carousel-cell>
                    <div>cell</div>
                  </ngx-tiny-carousel-cell>
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
        NgxTinyCarouselCellComponent,
        ArrowLeftComponent,
        ArrowRightComponent,
        DotsComponent,
        HostComponent,
      ],
    }).compileComponents();

    hostFixture   = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  beforeEach(() => {
    // `clientWidth`をエミュレート
    const containerWidth = 400;
    jest.spyOn<any, any, any>(hostComponent.tinyCarouselComponent?.container?.nativeElement, 'clientWidth', 'get').mockImplementation(() => {
      return containerWidth;
    });
    jest.spyOn<any, any, any>(hostComponent.tinyCarouselComponent?.cellContainer?.nativeElement, 'clientWidth', 'get').mockImplementation(() => {
      return containerWidth;
    });
    jest.spyOn<any, any, any>(hostComponent.tinyCarouselComponent?.cellContainerInner?.nativeElement, 'clientWidth', 'get').mockImplementation(() => {
      return containerWidth * 5;
    });
  });

  describe('コンポーネント生成時', () => {
    it('セルを検出する', () => {
      expect(hostComponent.tinyCarouselComponent?.cells?.length).toBe(5);
    });

    describe('初期化処理後', () => {

      it('各セルにwidthが設定される', () => {
        jest.runAllTimers();
        hostComponent.tinyCarouselComponent?.cells?.forEach((cell) => {
          expect(cell?.ElementRef.nativeElement.style.width).toBe('400px');
        });
      });

      it('各矢印にtopのスタイルが付与される', () => {
        jest.runAllTimers();
        Array.from(hostComponent.tinyCarouselComponent!.arrows!.nativeElement.querySelectorAll('.arrow')).forEach((arrow: any) => {
          expect(arrow.style.top).toBe('200px');
        });
      });

      describe('UIスケールは', () => {
        beforeEach(() => {
          hostComponent.tinyCarouselComponent!.cellContainerHeight = 700;
        });
        describe('設定されていない場合', () => {
          beforeEach(() => {
            jest.runAllTimers();
          });
          it('自動的にUIスケールが計算される', () => {
            expect(hostComponent.tinyCarouselComponent!.uiScale).toBe(1.75);
          });
        });
        describe('設定されている場合', () => {
          beforeEach(() => {
            hostComponent.tinyCarouselComponent!.uiScale = 2;
            jest.runAllTimers();
          });
          it('自動的にUIスケールが計算される', () => {
            expect(hostComponent.tinyCarouselComponent!.uiScale).toBe(2);
          });
        });
      });
    });

    describe('セル幅は', () => {
      describe('設定されていない場合', () => {
        beforeEach(() => {
          jest.runAllTimers();
        });
        it('ルート要素の幅がセル幅として設定される', () => {
          expect(hostComponent.tinyCarouselComponent?.cells?.get(0)?.ElementRef.nativeElement.style.width).toBe('400px');
        });
      });
    });

    describe('セルコンテナの高さは', () => {
      describe('設定されていない場合', () => {
        beforeEach(() => {
          hostComponent.tinyCarouselComponent!.cellHeightScale = 2;
          jest.runAllTimers();
        });
        it('「セル幅 x セルの高さ倍率」が高さとして設定される', () => {
          expect(hostComponent.tinyCarouselComponent?.cellContainerHeight).toBe(800);
        });
      });
    });

    describe('ドラッグ処理が', () => {
      describe('無効化されている場合', () => {
        beforeEach(() => {
          hostComponent.tinyCarouselComponent!.enableDrag = false;
          jest.runAllTimers();
        });

        it('transform()が呼ばれ各セルにtransformスタイルが設定される', () => {
          hostComponent.tinyCarouselComponent?.cells?.forEach((cell) => {
            expect(cell?.ElementRef.nativeElement.style.transform).toContain('translateX');
          });
        });
      });

      describe('有効化されている場合', () => {

        beforeEach(() => {
          hostComponent.tinyCarouselComponent!.enableDrag = true;
        });

        it('全てのセルがアクティブ化される', () => {
          jest.runAllTimers();
          hostComponent.tinyCarouselComponent?.cells?.forEach((cell) => {
            expect(cell?.ElementRef.nativeElement.classList).toContain('active');
          });
        });

        describe('各種イベントがバインドされる', () => {

          const mockAddEventListener = jest.fn();

          beforeEach(() => {
            hostComponent.tinyCarouselComponent!.cellContainer!.nativeElement.addEventListener      = mockAddEventListener;
            hostComponent.tinyCarouselComponent!.cellContainerInner!.nativeElement.addEventListener = mockAddEventListener;
            jest.runAllTimers();
          });

          it('ルートコンテナにスクロールイベントがバインドされる', () => {
            expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
          });

          it('セルインナーコンテナに各種ドラッグ機能用のイベントがバインドされる', () => {
            expect(mockAddEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
            expect(mockAddEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
            expect(mockAddEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
            expect(mockAddEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function));
          });
        });

        describe('セルインナーコンテナは', () => {
          describe('無限スクロールが無効化されている場合', () => {
            beforeEach(() => {
              hostComponent.tinyCarouselComponent!.enableInfiniteScroll = false;
              jest.runAllTimers();
            });
            it('「セル幅 x セル数」に設定される', () => {
              expect(hostComponent.tinyCarouselComponent?.cellContainerInner?.nativeElement.style.width).toBe('2000px');
            });
          });

          describe('無限スクロールが有効化されている場合', () => {

            const mockScrollTo = jest.fn();

            beforeEach(() => {
              hostComponent.tinyCarouselComponent!.enableInfiniteScroll                  = true;
              hostComponent.tinyCarouselComponent!.cellContainer!.nativeElement.scrollTo = mockScrollTo;
              jest.runAllTimers();
            });
            it('「セル幅 x セル数 x INFINITE_SCROLL_MAX_LOOP_COUNT」に設定され', () => {
              expect(hostComponent.tinyCarouselComponent?.cellContainerInner?.nativeElement.style.width).toBe('14000px');
            });
            it('その後セルコンテナのscrollTo()が呼び出される', () => {
              expect(mockScrollTo).toHaveBeenCalledWith(expect.objectContaining({'left': 6001}));
            });
          });
        });
      });
    });

    describe('ルートコンテナの高さは', () => {
      describe('設定されていない場合', () => {
        describe('ドットポジションが', () => {
          describe('インナー表示の場合', () => {
            beforeEach(() => {
              hostComponent.tinyCarouselComponent!.dotPosition = 'inner';
              jest.runAllTimers();
            });
            it('セルコンテナの高さと同様のものが設定される', () => {
              expect(hostComponent.tinyCarouselComponent?.containerHeight).toBe(400);
            });
          });

          describe('アウター表示の場合', () => {
            beforeEach(() => {
              hostComponent.tinyCarouselComponent!.dotPosition = 'outer';
              jest.runAllTimers();
            });
            it('セルコンテナを1.15倍したのもが設定される', () => {
              expect(hostComponent.tinyCarouselComponent?.containerHeight).toBe(Math.round(400 * 1.15));
            });
          });
        });
      });
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
      hostComponent.tinyCarouselComponent!.cellContainerHeight = height;
      jest.runAllTimers();
      expect(hostComponent.tinyCarouselComponent?.uiScale).toBe(scale);
    });
  });

  describe('UIのテスト', () => {
    describe('ドラッグ機能が', () => {
      describe('無効の場合', () => {
        beforeEach(() => {
          hostComponent.tinyCarouselComponent!.enableDrag = false;
          jest.runAllTimers();
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
              hostComponent.tinyCarouselComponent!.currentCellIndex = 4;
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
              hostComponent.tinyCarouselComponent!.currentCellIndex = 0;
              hostFixture.nativeElement.querySelector('.arrow-left').click();
              expect(hostComponent.tinyCarouselComponent?.currentCellIndex).toBe(4);
            });
          });
        });

        describe('ドットUIの', () => {
          beforeEach(() => {
            hostFixture.detectChanges();
          });
          test.each`
              dotIndex | transform
              ${0}     | ${0}
              ${1}     | ${400}
              ${2}     | ${800}
              ${3}     | ${1200}
              ${4}     | ${1600}
              `('$dotIndex番目をクリックした際、transformは - $transform pxとなる', ({dotIndex, transform}) => {
            hostComponent.tinyCarouselComponent?.container?.nativeElement.querySelector(`.dot:nth-child(${dotIndex + 1})`).click();
            jest.runOnlyPendingTimers();
            expect(hostComponent.tinyCarouselComponent?.cells?.get(0)?.ElementRef.nativeElement.style.transform).toBe(`translateX(-${transform}px)`);
          });
        });
      });

      describe('有効の場合', () => {

        const mockScrollTo = jest.fn();

        beforeEach(() => {
          hostComponent.tinyCarouselComponent!.cellContainer!.nativeElement.scrollTo = mockScrollTo;
          hostComponent.tinyCarouselComponent!.enableDrag                            = true;
          jest.runOnlyPendingTimers();
        });

        describe('次へボタンを押した際', () => {
          describe('末尾の要素でない場合', () => {
            beforeEach(() => {
              hostComponent.tinyCarouselComponent!.currentCellIndex = 0;
              hostFixture.nativeElement.querySelector('.arrow-right').click();
            });
            it('セルコンテナのスクロール量がセル幅分増加される', () => {
              expect(mockScrollTo).toHaveBeenCalledWith(expect.objectContaining({'behavior': 'smooth', 'left': 400}));
            });
          });

          describe('末尾の要素の場合', () => {
            beforeEach(() => {
              hostComponent.tinyCarouselComponent!.currentCellIndex = 4;
            });
            describe('無限スクロールが無効の場合', () => {
              it('セルコンテナのスクロール量がゼロになる', () => {
                hostFixture.nativeElement.querySelector('.arrow-right').click();
                expect(mockScrollTo).toHaveBeenCalledWith(expect.objectContaining({'behavior': 'smooth', 'left': 0}));
              });
            });

            describe('無限スクロールが有効の場合', () => {
              beforeEach(() => {
                hostComponent.tinyCarouselComponent!.enableInfiniteScroll                    = true;
                hostComponent.tinyCarouselComponent!.cellContainer!.nativeElement.scrollLeft = 1600;
                hostFixture.nativeElement.querySelector('.arrow-right').click();
              });
              it('セルコンテナのスクロール量にセル幅が強制的に加算される', () => {
                expect(mockScrollTo).toHaveBeenCalledWith(expect.objectContaining({'behavior': 'smooth', 'left': 2000}));
              });
            });
          });
        });

        describe('戻るボタンを押した際', () => {
          describe('先頭の要素でない場合', () => {
            beforeEach(() => {
              hostComponent.tinyCarouselComponent!.currentCellIndex = 4;
              hostFixture.nativeElement.querySelector('.arrow-left').click();
            });
            it('セルコンテナのスクロール量がセル幅分減算される', () => {
              expect(mockScrollTo).toHaveBeenCalledWith(expect.objectContaining({'behavior': 'smooth', 'left': 1200}));
            });
          });

          describe('先頭の要素の場合', () => {
            beforeEach(() => {
              hostComponent.tinyCarouselComponent!.currentCellIndex = 0;
            });

            describe('無限スクロールが無効の場合', () => {
              it('セルコンテナのスクロール量が最大値になる', () => {
                hostFixture.nativeElement.querySelector('.arrow-left').click();
                expect(mockScrollTo).toHaveBeenCalledWith(expect.objectContaining({'behavior': 'smooth', 'left': 1600}));
              });
            });

            describe('無限スクロールが有効の場合', () => {
              beforeEach(() => {
                hostComponent.tinyCarouselComponent!.enableInfiniteScroll                    = true;
                hostComponent.tinyCarouselComponent!.cellContainer!.nativeElement.scrollLeft = 0;
                hostFixture.nativeElement.querySelector('.arrow-left').click();
              });
              it('セルコンテナのスクロール量からセル幅が強制的に減算される', () => {
                expect(mockScrollTo).toHaveBeenCalledWith(expect.objectContaining({'behavior': 'smooth', 'left': -400}));
              });
            });
          });
        });

        describe('ドットUIの', () => {
          beforeEach(() => {
            hostFixture.detectChanges();
          });
          test.each`
              dotIndex | scrollLeft
              ${0}     | ${0}
              ${1}     | ${400}
              ${2}     | ${800}
              ${3}     | ${1200}
              ${4}     | ${1600}
              `('$dotIndex番目をクリックした際、スクロール量は$scrollLeft pxとなる', ({dotIndex, scrollLeft}) => {
            hostComponent.tinyCarouselComponent?.container?.nativeElement.querySelector(`.dot:nth-child(${dotIndex + 1})`).click();
            expect(mockScrollTo).toHaveBeenCalledWith(expect.objectContaining({'behavior': 'smooth', 'left': scrollLeft}));
          });
        });
      });
    });
  });
});
