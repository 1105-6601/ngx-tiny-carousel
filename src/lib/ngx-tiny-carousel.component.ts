import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild } from '@angular/core';
import { ArrowLeftComponent }                                                                      from './component/arrow-left/arrow-left.component';
import { ArrowRightComponent }                                                          from './component/arrow-right/arrow-right.component';
import { DotsComponent }                                                                from './component/dots/dots.component';

@Component({
  selector:    'ngx-tiny-carousel',
  templateUrl: './ngx-tiny-carousel.component.html',
  styleUrls:   ['./ngx-tiny-carousel.component.scss'],
})
export class NgxTinyCarouselComponent implements AfterViewInit
{
  private static readonly ARROW_SCALE_BASE_DISTANCE = 400;

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

  public totalCells: number = 0;

  public currentCellIndex: number = 0;

  public uiScale: number = 0;

  private translateXDistance: number = 0;

  private cellSelector: string = '.cell';

  private arrowSelector: string = '.arrow';

  public ngAfterViewInit(): void
  {
    setTimeout(this.initialize.bind(this));
  }

  public prev(event: MouseEvent): void
  {
    event.stopPropagation();

    if (this.currentCellIndex === 0) {
      this.currentCellIndex = this.maxCellIndex;
    } else {
      this.currentCellIndex--;
    }

    this.transform();
  }

  public next(event: MouseEvent): void
  {
    event.stopPropagation();

    if (this.currentCellIndex >= this.maxCellIndex) {
      this.currentCellIndex = 0;
    } else {
      this.currentCellIndex++;
    }

    this.transform();
  }

  public jump(cellIndex: number): void
  {
    this.currentCellIndex = cellIndex;

    this.transform();
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
    if (this.cells) {
      this.cells.nativeElement.style.transform = `translateX(-${this.translateXDistance * this.currentCellIndex}px)`;
    }
  }

  private initialize(): void
  {
    if (!this.cells) {
      return;
    }

    if (!this.cellWidth) {
      this.cellWidth = this.container?.nativeElement.clientWidth / this.displayCells;
    }

    if (!this.height) {
      this.height = this.cellWidth;
    }

    const cells    = this.cells.nativeElement as HTMLElement;
    const cellList = cells.querySelectorAll<HTMLElement>(this.cellSelector);

    this.translateXDistance = this.cellWidth;
    this.totalCells         = cellList.length;

    cells.style.width = `${this.cellWidth * this.totalCells}px`;

    Array.from(cellList).forEach((cell: HTMLElement, index: number) => {
      cell.style.width = `${this.cellWidth}px`;
      cell.style.left  = `${this.cellWidth * index}px`;
    });

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
