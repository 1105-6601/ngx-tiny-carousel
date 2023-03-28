import { AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, Input, OnDestroy, QueryList, ViewChild } from '@angular/core';
import { ArrowLeftComponent }                                                                                              from './component/arrow-left/arrow-left.component';
import { ArrowRightComponent }                                                                                             from './component/arrow-right/arrow-right.component';
import { DotPosition, DotsComponent, DotStyle }                                                                            from './component/dots/dots.component';
import { NgxTinyCarouselCellComponent }                                                                                    from './component/ngx-tiny-carousel-cell/ngx-tiny-carousel-cell.component';
import { ArrowStyle }                                                                                                      from './component/arrow/types';
import { Subscription }                                                                                                    from 'rxjs';

type TransformKind = 'jump' | 'next' | 'prev';

@Component({
  selector:    'ngx-tiny-carousel',
  templateUrl: './ngx-tiny-carousel.component.html',
  styleUrls:   ['./ngx-tiny-carousel.component.scss'],
})
export class NgxTinyCarouselComponent implements AfterViewInit, AfterContentInit, OnDestroy
{
  private static readonly ARROW_SCALE_BASE_DISTANCE = 400;

  private static readonly CELL_TRANSFORM_DURATION = 400;

  private static readonly INFINITE_SCROLL_MAX_LOOP_COUNT = 7;

  @Input()
  public displayCells: number = 1;

  @Input()
  public cellHeightScale: number = 1;

  @Input()
  public dotPosition: DotPosition = 'inner';

  @Input()
  public dotStyle: DotStyle = 'dot';

  @Input()
  public arrowStyle: ArrowStyle = 'default';

  @Input()
  public uiScale: number = 0;

  @Input()
  public displayArrows: boolean = true;

  @Input()
  public displayDots: boolean = true;

  @Input()
  public enableDrag: boolean = false;

  @Input()
  public enableInfiniteScroll: boolean = false;

  @Input()
  public cellWidth: number = 0;

  @ViewChild('container')
  public container?: ElementRef;

  @ViewChild('cellContainer')
  public cellContainer?: ElementRef;

  @ViewChild('cellContainerInner')
  public cellContainerInner?: ElementRef;

  @ViewChild('arrows')
  public arrows?: ElementRef;

  @ViewChild('arrowLeft')
  public arrowLeft?: ArrowLeftComponent;

  @ViewChild('arrowRight')
  public arrowRight?: ArrowRightComponent;

  @ViewChild('dots')
  public dots?: DotsComponent;

  @ContentChildren(NgxTinyCarouselCellComponent)
  public cells?: QueryList<NgxTinyCarouselCellComponent>;

  public currentCellIndex: number = 0;

  public containerHeight: number = 0;

  public cellContainerHeight: number = 0;

  private totalCells: number = 0;

  private translateXDistance: number = 0;

  private arrowSelector: string = '.arrow';

  private activeCellClass: string = 'active';

  private contentSubscription?: Subscription;

  private activateTimer: any;

  private transforming: boolean = false;

  private carouselLoopCount: number = 0;

  private dragStarted: boolean = false;

  private mouseMoved: boolean = false;

  private dragStartPosX: number = 0;

  private dragStartScrollLeft: number = 0;

  public ngAfterViewInit(): void
  {
    setTimeout(this.initialize.bind(this));
  }

  public ngAfterContentInit(): void
  {
    const observable = this.cells?.changes;
    if (observable) {
      this.contentSubscription = observable.subscribe((list: QueryList<HTMLElement>) => {
        setTimeout(this.initialize.bind(this));
      });
    }
  }

  public ngOnDestroy(): void
  {
    this.contentSubscription?.unsubscribe();
  }

  public prev(count: number = 1): void
  {
    if (this.transforming) {
      return;
    }

    let targetCellIndex = this.currentCellIndex;

    if (!this.enableDrag) {
      if (targetCellIndex - count < 0) {
        targetCellIndex = this.maxCellIndex + (targetCellIndex - count + 1);
      } else {
        targetCellIndex -= count;
      }
    }

    this.transform(this.currentCellIndex, targetCellIndex, 'prev', count);
  }

  public next(count: number = 1): void
  {
    if (this.transforming) {
      return;
    }

    let targetCellIndex = this.currentCellIndex;

    if (!this.enableDrag) {
      if (targetCellIndex + count > this.maxCellIndex) {
        targetCellIndex = targetCellIndex + count - this.maxCellIndex - 1;
      } else {
        targetCellIndex += count;
      }
    }

    this.transform(this.currentCellIndex, targetCellIndex, 'next', count);
  }

  public jump(cellIndex: number): void
  {
    if (this.transforming) {
      return;
    }

    this.transform(this.currentCellIndex, cellIndex, 'jump');
  }

  public activateCells(currentCellIndex: number, targetCellIndex: number): number[]
  {
    if (this.activateTimer) {
      clearTimeout(this.activateTimer);
    }

    let activatedCellIndex: number[] = [];

    if (currentCellIndex < targetCellIndex) {
      activatedCellIndex = this.range(targetCellIndex - currentCellIndex + this.displayCells, currentCellIndex);
    } else {
      activatedCellIndex = this.range(currentCellIndex - targetCellIndex + this.displayCells, targetCellIndex);
    }

    if (this.cells) {
      Array.from(this.cells).forEach((cell: NgxTinyCarouselCellComponent, index: number) => {
        if (activatedCellIndex.includes(index)) {
          cell.ElementRef.nativeElement.classList.add(this.activeCellClass);
        }
      });

      this.activateTimer = setTimeout(() => {
        if (this.cells) {
          Array.from(this.cells).forEach((cell: NgxTinyCarouselCellComponent, index: number) => {
            if (!this.range(this.displayCells, this.currentCellIndex).includes(index)) {
              cell.ElementRef.nativeElement.classList.remove(this.activeCellClass);
            }
          });
        }
      }, NgxTinyCarouselComponent.CELL_TRANSFORM_DURATION);
    }

    return activatedCellIndex;
  }

  public get dotCount(): number
  {
    const count = this.totalCells - (this.displayCells - 1);

    return count < 0 ? 0 : count;
  }

  private get maxCellIndex(): number
  {
    return (this.totalCells - 1) - (this.displayCells - 1);
  }

  private transform(currentCellIndex: number, targetCellIndex: number, kind: TransformKind = 'jump', count: number = 1): void
  {
    this.transforming = true;

    if (!this.enableDrag) {

      this.activateCells(currentCellIndex, targetCellIndex);

      setTimeout(() => {
        if (this.cells) {
          Array.from(this.cells).forEach((cell: NgxTinyCarouselCellComponent) => {
            cell.ElementRef.nativeElement.style.transform = `translateX(-${targetCellIndex * this.translateXDistance}px)`;
          });
        }
      });

      setTimeout(() => {
        this.transforming = false;
      }, NgxTinyCarouselComponent.CELL_TRANSFORM_DURATION);

      this.currentCellIndex = targetCellIndex;
    }

    if (this.enableDrag && this.cellContainer && this.cellContainerInner) {

      const cellContainerElm      = this.cellContainer.nativeElement;
      const cellContainerInnerElm = this.cellContainerInner.nativeElement;
      const maxScrollLeft         = cellContainerInnerElm.clientWidth - cellContainerElm.clientWidth;
      const infiniteScrollOffset  = this.cellWidth * this.totalCells * this.carouselLoopCount;

      let targetLeft = 0;

      switch (kind) {
        case 'jump':
          targetLeft = Math.round(infiniteScrollOffset + targetCellIndex * this.translateXDistance);
          break;
        case 'next':
          targetLeft = Math.round(infiniteScrollOffset + (this.currentCellIndex + count) * this.translateXDistance);
          if (!this.enableInfiniteScroll) {
            if (targetLeft > maxScrollLeft) {
              targetLeft = targetLeft - maxScrollLeft - this.translateXDistance;
            }
          } else {
            if (this.currentCellIndex >= this.maxCellIndex) {
              targetLeft = Math.floor(cellContainerElm.scrollLeft + (count * this.translateXDistance));
            }
          }
          break;
        case 'prev':
          targetLeft = Math.round(infiniteScrollOffset + (this.currentCellIndex - count) * this.translateXDistance);
          if (!this.enableInfiniteScroll) {
            if (targetLeft < 0) {
              targetLeft = targetLeft + maxScrollLeft + this.translateXDistance;
            }
          } else {
            if (this.currentCellIndex <= 0 || this.currentCellIndex === this.maxCellIndex) {
              targetLeft = Math.floor(cellContainerElm.scrollLeft - (count * this.translateXDistance));
            }
          }
          break;
      }

      this.cellContainer.nativeElement.scrollTo({
        left:     targetLeft,
        behavior: 'smooth',
      });

      const timer = setInterval(() => {
        const threshold = 5;
        if (
          targetLeft - threshold <= cellContainerElm.scrollLeft &&
          targetLeft + threshold >= cellContainerElm.scrollLeft
        ) {
          this.transforming = false;
          clearInterval(timer);
        }
      });
    }
  }

  private initialize(): void
  {
    if (!this.cellContainerInner || !this.cells) {
      return;
    }

    if (!this.cellWidth) {
      this.cellWidth = this.container?.nativeElement.clientWidth / this.displayCells;
    }

    if (!this.cellContainerHeight) {
      this.cellContainerHeight = this.cellWidth * this.cellHeightScale;
    }

    this.translateXDistance = this.cellWidth;
    this.totalCells         = this.cells.length;

    if (this.totalCells < this.displayCells + 2) {
      throw new Error('[displayCells] must be less than or equal to the total number of cells - 2. Please check the number of cells.');
    }

    Array.from(this.cells).forEach((cell: NgxTinyCarouselCellComponent, index: number) => {
      cell.ElementRef.nativeElement.style.width = `${this.cellWidth}px`;
      cell.ElementRef.nativeElement.style.left  = `${index * this.cellWidth}px`;
    });

    if (!this.enableDrag) {
      // Default behavior
      this.jump(this.currentCellIndex);
    } else {
      // Scroll behavior
      this.activateAllCells();
      this.bindHorizontalScrollEvent();
      this.bindDragEvent();

      const cellContainerInnerElm = this.cellContainerInner.nativeElement as HTMLElement;
      const fullWidth             = this.cellWidth * this.totalCells;

      cellContainerInnerElm.style.width = `${fullWidth}px`;

      // When infinite scroll enabled.
      if (this.enableInfiniteScroll) {
        cellContainerInnerElm.style.width = `${fullWidth * NgxTinyCarouselComponent.INFINITE_SCROLL_MAX_LOOP_COUNT}px`;

        setTimeout(() => {
          this.cellContainer?.nativeElement.scrollTo({
            left: (this.cellWidth * this.cells!.length) * (Math.floor(NgxTinyCarouselComponent.INFINITE_SCROLL_MAX_LOOP_COUNT / 2)) + 1,
          });
        });
      }
    }

    if (!this.containerHeight) {
      switch (this.dotPosition) {
        case 'inner':
          this.containerHeight = this.cellContainerHeight;
          break;

        case 'outer':
          this.containerHeight = this.cellContainerHeight + (this.cellContainerHeight * 0.15);
          break;
      }
    }

    const arrows = this.arrows?.nativeElement.querySelectorAll(this.arrowSelector) as QueryList<HTMLElement>;
    if (arrows) {
      Array.from(arrows).forEach((arrow: HTMLElement) => {
        arrow.style.top = `${this.cellContainerHeight / 2}px`;
      });
    }

    // Set UI scale.
    if (!this.uiScale) {
      this.uiScale = this.cellContainerHeight / NgxTinyCarouselComponent.ARROW_SCALE_BASE_DISTANCE;
    }
  }

  private activateAllCells(): void
  {
    if (this.cells) {
      Array.from(this.cells).forEach((cell: NgxTinyCarouselCellComponent) => {
        cell.ElementRef.nativeElement.classList.add(this.activeCellClass);
      });
    }
  }

  private bindHorizontalScrollEvent(): void
  {
    if (this.cellContainer) {
      this.cellContainer.nativeElement.addEventListener('scroll', this.handleCellsVirtually.bind(this));
    }
  }

  private handleCellsVirtually(event: Event): void
  {
    const elm    = event.target as HTMLElement;
    const margin = 1;

    this.carouselLoopCount = Math.floor(elm.scrollLeft / (this.cellWidth * this.totalCells));

    const actualScrollLeft = elm.scrollLeft - (this.cellWidth * this.totalCells * this.carouselLoopCount);

    // Tweak currentCellIndex.
    const cellIndex       = Math.round(actualScrollLeft / Math.floor(this.cellWidth));
    this.currentCellIndex = cellIndex > this.totalCells - this.displayCells ? this.totalCells - this.displayCells : cellIndex;

    if (this.enableInfiniteScroll) {
      if (this.cells) {
        const indexToBeActivate        = this.range(this.displayCells + margin * 2, Math.floor(actualScrollLeft / this.cellWidth) - margin);
        const nativeCellContainerInner = this.cellContainerInner?.nativeElement;
        const nativeCellChildren       = [...nativeCellContainerInner.children];

        Array.from(this.cells).forEach((cell: NgxTinyCarouselCellComponent, index: number) => {

          // Check negative and overflow indices.
          const negativeIndex = index - this.totalCells;
          const overflowIndex = index + this.totalCells;

          if (
            indexToBeActivate.includes(index) ||
            indexToBeActivate.includes(negativeIndex) ||
            indexToBeActivate.includes(overflowIndex)
          ) {
            if (!nativeCellChildren.includes(cell.ElementRef.nativeElement)) {
              nativeCellContainerInner.appendChild(cell.ElementRef.nativeElement);
            }

            let left = `${(this.cellWidth * this.totalCells * this.carouselLoopCount) + (index * this.cellWidth)}px`;
            if (indexToBeActivate.includes(negativeIndex)) {
              left = `${(this.cellWidth * this.totalCells * (this.carouselLoopCount - 1)) + (index * this.cellWidth)}px`;
            }
            if (indexToBeActivate.includes(overflowIndex)) {
              left = `${(this.cellWidth * this.totalCells * (this.carouselLoopCount + 1)) + (index * this.cellWidth)}px`;
            }

            cell.ElementRef.nativeElement.style.left = left;
          } else {
            if (nativeCellChildren.includes(cell.ElementRef.nativeElement)) {
              nativeCellContainerInner.removeChild(cell.ElementRef.nativeElement);
            }
          }
        });
      }

      // Check if the scroll area is nearing the end.
      if (this.cellContainerInner && this.carouselLoopCount > 0) {
        // Increase container width when scrolling is about to end.
        const remainingScrollAmount = this.cellContainerInner.nativeElement.clientWidth - this.cellContainer?.nativeElement.scrollLeft;
        const fullWidth             = this.cellWidth * this.totalCells;

        if (fullWidth > remainingScrollAmount) {
          this.cellContainerInner.nativeElement.style.width = `${this.cellContainerInner?.nativeElement.clientWidth + fullWidth}px`;
        }
      }
    }
  }

  private range(size: number, startAt: number = 0): number[]
  {
    return [...Array(size).keys()].map(i => i + startAt);
  }

  private bindDragEvent(): void
  {
    if (!this.cellContainerInner) {
      return;
    }

    const targetElm = this.cellContainerInner.nativeElement;

    targetElm.addEventListener('mousedown', (event: MouseEvent) => {
      if (this.cellContainer) {
        this.dragStarted         = true;
        this.dragStartPosX       = event.clientX;
        this.dragStartScrollLeft = this.cellContainer.nativeElement.scrollLeft;
      }
    });

    targetElm.addEventListener('mousemove', (event: MouseEvent) => {
      if (this.dragStarted && this.cellContainer) {
        this.mouseMoved = true;
        const distance  = event.clientX - this.dragStartPosX;
        this.cellContainer.nativeElement.scrollTo(this.dragStartScrollLeft - distance, 0);
      }
    });

    targetElm.addEventListener('mouseup', () => {
      setTimeout(() => {
        this.dragStarted = false;
        this.mouseMoved  = false;
      });
    });

    targetElm.addEventListener('mouseleave', () => {
      this.dragStarted = false;
      this.mouseMoved  = false;
    });

    targetElm.addEventListener('click', (event: MouseEvent) => {
      if (this.mouseMoved) {
        event.stopPropagation();
      }
    }, true);
  }
}
