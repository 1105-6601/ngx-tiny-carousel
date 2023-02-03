import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector:    'dots',
  templateUrl: './dots.component.html',
  styleUrls:   ['./dots.component.scss'],
})
export class DotsComponent
{
  @Input()
  public currentIndex: number = 0;

  @Input()
  public dotCount: number = 0;

  @Input()
  public uiScale: number = 1;

  @Output()
  public dotSelect: EventEmitter<number> = new EventEmitter();

  @ViewChild('dots')
  public set dots(ref: ElementRef)
  {
    if (ref) {
      this.setScale(ref.nativeElement, this.uiScale * 1.3);
    }
  }

  public setScale(elm: HTMLElement, scale: number): void
  {
    elm.style.transform = `scale(${scale}, ${scale})`;
  }
}
