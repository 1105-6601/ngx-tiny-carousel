import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector:    'arrow-right',
  templateUrl: './arrow-right.component.html',
  styleUrls:   ['./arrow-right.component.scss'],
})
export class ArrowRightComponent
{
  @Input()
  public uiScale: number = 1;

  @ViewChild('svg')
  public set svg(ref: ElementRef)
  {
    if (ref) {
      this.setScale(ref.nativeElement, this.uiScale);
    }
  }

  public setScale(elm: HTMLElement, scale: number): void
  {
    elm.style.transform = `scale(${scale}, ${scale})`;
  }
}
