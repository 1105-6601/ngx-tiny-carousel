import { Component, ElementRef } from '@angular/core';

@Component({
  selector:    'ngx-tiny-carousel-cell',
  templateUrl: './ngx-tiny-carousel-cell.component.html',
  styleUrls:   ['./ngx-tiny-carousel-cell.component.scss'],
})
export class NgxTinyCarouselCellComponent
{
  public constructor(
    public ElementRef: ElementRef,
  )
  {
  }
}
