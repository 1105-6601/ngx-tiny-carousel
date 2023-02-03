import { NgModule }                 from '@angular/core';
import { NgxTinyCarouselComponent } from './ngx-tiny-carousel.component';
import { ArrowLeftComponent }       from './component/arrow-left/arrow-left.component';
import { ArrowRightComponent }      from './component/arrow-right/arrow-right.component';
import { DotsComponent }            from './component/dots/dots.component';
import { CommonModule }             from '@angular/common';

@NgModule({
  declarations: [
    NgxTinyCarouselComponent,
    ArrowLeftComponent,
    ArrowRightComponent,
    DotsComponent,
  ],
  imports:      [
    CommonModule,
  ],
  exports:      [
    NgxTinyCarouselComponent,
  ],
})
export class NgxTinyCarouselModule
{
}
