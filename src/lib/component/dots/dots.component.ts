import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

export type DotPosition = 'inner' | 'outer';

export type DotStyle = 'dot' | 'bar';

@Component({
  selector:    'dots',
  templateUrl: './dots.component.html',
  styleUrls:   ['./dots.component.scss'],
})
export class DotsComponent
{
  private static readonly BASE_SIZE_FOR_DOT_STYLE: number = 10;

  private static readonly BASE_SIZE_FOR_BAR_STYLE: number = 20;

  private static readonly BASE_MARGIN_FOR_DOT_STYLE: number = 5;

  @Input()
  public currentIndex: number = 0;

  @Input()
  public dotCount: number = 0;

  @Input()
  public uiScale: number = 1;

  @Input()
  public dotPosition: DotPosition = 'inner';

  @Input()
  public dotStyle: DotStyle = 'dot';

  @Output()
  public dotSelect: EventEmitter<number> = new EventEmitter();

  public dotSize: number = 0;

  public dotMargin: number = 0;

  @ViewChild('dots')
  public set dots(ref: ElementRef)
  {
    if (ref) {
      setTimeout(() => {
        this.setScale(ref.nativeElement, this.uiScale * 1.3);
        this.calculateDotSize(ref.nativeElement);
      });
    }
  }

  private setScale(elm: HTMLElement, scale: number): void
  {
    elm.style.transform = `scale(${scale}, ${scale})`;
  }

  private calculateDotSize(containerElm: HTMLElement): void
  {
    if (this.dotStyle === 'dot') {
      this.dotSize = DotsComponent.BASE_SIZE_FOR_DOT_STYLE;
    } else {
      this.dotSize = DotsComponent.BASE_SIZE_FOR_BAR_STYLE;
    }

    this.dotMargin = DotsComponent.BASE_MARGIN_FOR_DOT_STYLE;

    const dotsWidthLimit = containerElm.clientWidth * 0.75;

    if (this.dotSize * this.dotCount > dotsWidthLimit) {
      if (this.dotStyle === 'dot') {
        const size     = Math.floor(dotsWidthLimit / this.dotCount);
        this.dotSize   = size < 2 ? 1 : size - 1;
        this.dotMargin = 0.5;
      } else {
        this.dotSize = Math.floor(dotsWidthLimit / this.dotCount);
      }
    }
  }
}
