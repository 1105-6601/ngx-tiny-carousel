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
  public containerElm?: HTMLDivElement;

  @Input()
  public currentIndex: number = 0;

  @Input()
  public dotCount: number = 0;

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
      setTimeout(() => this.calculateDotSize(ref.nativeElement));
      setTimeout(() => this.tweakDotPosition(ref.nativeElement));
    }
  }

  private calculateDotSize(dotsElm: HTMLElement): void
  {
    if (this.dotStyle === 'dot') {
      this.dotSize   = DotsComponent.BASE_SIZE_FOR_DOT_STYLE;
      this.dotMargin = DotsComponent.BASE_MARGIN_FOR_DOT_STYLE;
    } else {
      this.dotSize = DotsComponent.BASE_SIZE_FOR_BAR_STYLE;
    }

    const totalDotWidth  = (this.dotSize + (this.dotMargin * 2)) * this.dotCount;
    const dotsWidthLimit = dotsElm.clientWidth * 0.95;

    if (totalDotWidth > dotsWidthLimit) {
      if (this.dotStyle === 'dot') {
        let size = dotsWidthLimit / this.dotCount;
        if (size >= DotsComponent.BASE_SIZE_FOR_DOT_STYLE) {
          const remainingWidth = dotsWidthLimit - (DotsComponent.BASE_SIZE_FOR_DOT_STYLE * this.dotCount);
          this.dotSize         = DotsComponent.BASE_SIZE_FOR_DOT_STYLE;
          this.dotMargin       = remainingWidth / this.dotCount / 2;
        } else {
          this.dotSize   = size < 2 ? 1 : size - 1;
          this.dotMargin = 0.5;
        }
      } else {
        this.dotSize = dotsWidthLimit / this.dotCount;
      }
    }
  }

  private tweakDotPosition(dotsElm: HTMLElement): void
  {
    const firstDot = dotsElm.querySelector('.dot') as HTMLElement;
    if (!firstDot || !this.containerElm) {
      return;
    }

    const dotRect       = firstDot.getBoundingClientRect();
    const containerRect = this.containerElm.getBoundingClientRect();
    const diff          = Math.abs(containerRect.bottom - dotRect.bottom);
    const threshold     = DotsComponent.BASE_SIZE_FOR_DOT_STYLE;

    if (diff < threshold) {
      if (this.dotPosition === 'inner') {
        dotsElm.style.bottom = `${diff + (threshold - diff) * 2}%`;
      } else {
        this.containerElm.style.height = `${this.containerElm.clientHeight * 1.15}px`;
        dotsElm.style.bottom = `${15}%`;
      }
    }
  }
}
