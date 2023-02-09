import { AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, Input, OnDestroy, QueryList, ViewChild } from '@angular/core';
import { ArrowLeftComponent }                                                                                              from './component/arrow-left/arrow-left.component';
import { ArrowRightComponent }                                                                                             from './component/arrow-right/arrow-right.component';
import { DotsComponent }                                                                                                   from './component/dots/dots.component';
import { NgxTinyCarouselCellComponent }                                                                                    from './component/ngx-tiny-carousel-cell/ngx-tiny-carousel-cell.component';
import { Subscription }                                                                                                    from 'rxjs';

@Component({
  selector:    'ngx-tiny-carousel',
  templateUrl: './ngx-tiny-carousel.component.html',
  styleUrls:   ['./ngx-tiny-carousel.component.scss'],
})
export class NgxTinyCarouselComponent implements AfterViewInit, AfterContentInit, OnDestroy
{
  private static readonly ARROW_SCALE_BASE_DISTANCE = 400;

  private static readonly CELL_TRANSFORM_DURATION = 400;

  @Input()
  public height: number = 0;

  @Input()
  public cellWidth: number = 0;

  @Input()
  public displayCells: number = 1;

  @ViewChild('container')
  public container?: ElementRef;

  @ViewChild('cells')
  public cells?: ElementRef;

  @ViewChild('arrows')
  public arrows?: ElementRef;

  @ViewChild('arrowLeft')
  public arrowLeft?: ArrowLeftComponent;

  @ViewChild('arrowRight')
  public arrowRight?: ArrowRightComponent;

  @ViewChild('dots')
  public dots?: DotsComponent;

  @ContentChildren(NgxTinyCarouselCellComponent)
  public cellList?: QueryList<NgxTinyCarouselCellComponent>;

  public totalCells: number = 0;

  public currentCellIndex: number = 0;

  public uiScale: number = 0;

  private translateXDistance: number = 0;

  private arrowSelector: string = '.arrow';

  private activeCellClass: string = 'active';

  private contentSubscription?: Subscription;

  private activateTimer: any;

  public ngAfterViewInit(): void
  {
    setTimeout(this.initialize.bind(this));
  }

  public ngAfterContentInit(): void
  {
    const observable = this.cellList?.changes;
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

  public prev(event: MouseEvent): void
  {
    event.stopPropagation();

    const currentIndex = this.currentCellIndex;

    if (this.currentCellIndex === 0) {
      this.currentCellIndex = this.maxCellIndex;
    } else {
      this.currentCellIndex--;
    }

    this.activateCells(currentIndex, this.currentCellIndex);
    this.transform();
  }

  public next(event: MouseEvent): void
  {
    event.stopPropagation();

    const currentIndex = this.currentCellIndex;

    if (this.currentCellIndex >= this.maxCellIndex) {
      this.currentCellIndex = 0;
    } else {
      this.currentCellIndex++;
    }

    this.activateCells(currentIndex, this.currentCellIndex);
    this.transform();
  }

  public jump(cellIndex: number): void
  {
    const currentIndex = this.currentCellIndex;

    this.currentCellIndex = cellIndex;

    this.activateCells(currentIndex, this.currentCellIndex);
    this.transform();
  }

  public activateCells(currentCellIndex: number, targetCellIndex: number): void
  {
    if (this.activateTimer) {
      clearTimeout(this.activateTimer);
    }

    const range = (size: number, startAt: number = 0) => [...Array(size).keys()].map(i => i + startAt);

    let activatedCellIndex: number[] = [];

    if (currentCellIndex < targetCellIndex) {
      activatedCellIndex = range(targetCellIndex - currentCellIndex + 1, currentCellIndex);
    } else {
      activatedCellIndex = range(currentCellIndex - targetCellIndex + 1, targetCellIndex);
    }

    if (this.cellList) {
      Array.from(this.cellList).forEach((cell: NgxTinyCarouselCellComponent, index: number) => {
        if (activatedCellIndex.includes(index)) {
          cell.ElementRef.nativeElement.classList.add(this.activeCellClass);
        }
      });

      this.activateTimer = setTimeout(() => {
        if (this.cellList) {
          Array.from(this.cellList).forEach((cell: NgxTinyCarouselCellComponent, index: number) => {
            if (targetCellIndex !== index) {
              cell.ElementRef.nativeElement.classList.remove(this.activeCellClass);
            }
          });
        }
      }, NgxTinyCarouselComponent.CELL_TRANSFORM_DURATION);
    }
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

  private transform(): void
  {
    setTimeout(() => {
      if (this.cellList) {
        Array.from(this.cellList).forEach((cell: NgxTinyCarouselCellComponent) => {
          cell.ElementRef.nativeElement.style.transform = `translateX(-${this.currentCellIndex * this.translateXDistance}px)`;
        });
      }
    });
  }

  private initialize(): void
  {
    if (!this.cells || !this.cellList) {
      return;
    }

    if (!this.cellWidth) {
      this.cellWidth = this.container?.nativeElement.clientWidth / this.displayCells;
    }

    if (!this.height) {
      this.height = this.cellWidth;
    }

    this.translateXDistance = this.cellWidth;
    this.totalCells         = this.cellList.length;

    const cells = this.cells.nativeElement as HTMLElement;

    cells.style.width = `${this.cellWidth}px`;

    Array.from(this.cellList).forEach((cell: NgxTinyCarouselCellComponent, index: number) => {
      cell.ElementRef.nativeElement.style.width = `${this.cellWidth}px`;
      cell.ElementRef.nativeElement.style.left  = `${this.cellWidth * index}px`;
    });

    this.jump(this.currentCellIndex);

    const arrows = this.arrows?.nativeElement.querySelectorAll(this.arrowSelector) as QueryList<HTMLElement>;

    Array.from(arrows).forEach((arrow: HTMLElement) => {
      arrow.style.top = `${this.height / 2}px`;
    });

    this.setUiScale();
  }

  private setUiScale(): void
  {
    this.uiScale = this.height / NgxTinyCarouselComponent.ARROW_SCALE_BASE_DISTANCE;
  }
}
