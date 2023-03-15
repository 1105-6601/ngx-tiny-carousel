import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ArrowStyle }                                      from '../../ngx-tiny-carousel.component';

@Component({
  selector:    'arrow-left',
  templateUrl: './arrow-left.component.html',
  styleUrls:   ['./arrow-left.component.scss'],
})
export class ArrowLeftComponent implements OnInit
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
      this.size = '15px';
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

  public setScale(elm: HTMLElement, scale: number): void
  {
    elm.style.transform = `scale(${scale}, ${scale})`;
  }
}
