import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ArrowStyle }                                      from '../arrow/types';

@Component({
  selector:    'arrow-right',
  templateUrl: './arrow-right.component.html',
  styleUrls:   ['./arrow-right.component.scss'],
})
export class ArrowRightComponent implements OnInit
{
  @Input()
  public uiScale: number = 1;

  @Input()
  public arrowStyle: ArrowStyle = 'default';

  public size: string = '30px';

  public fill: string = '#fff';

  public ngOnInit(): void
  {
    if (this.arrowStyle === 'circle') {
      this.fill = '#000';
    }
  }

  @ViewChild('svg')
  public set svg(ref: ElementRef)
  {
    if (ref) {
      this.setScale(ref.nativeElement, this.uiScale);
    }
  }

  private setScale(elm: HTMLElement, scale: number): void
  {
    elm.style.transform = `scale(${scale}, ${scale})`;
  }
}
