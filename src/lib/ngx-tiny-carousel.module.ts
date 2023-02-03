import { NgModule }                 from '@angular/core';
import { BrowserModule }            from '@angular/platform-browser';
import { NgxTinyCarouselComponent } from './ngx-tiny-carousel.component';
import { ArrowLeftComponent }       from './component/arrow-left/arrow-left.component';
import { ArrowRightComponent }      from './component/arrow-right/arrow-right.component';
import { DotsComponent }            from './component/dots/dots.component';

@NgModule({
  declarations: [
    NgxTinyCarouselComponent,
    ArrowLeftComponent,
    ArrowRightComponent,
    DotsComponent,
  ],
  imports:      [
    BrowserModule,
  ],
  exports:      [
    NgxTinyCarouselComponent,
  ],
})
export class NgxTinyCarouselModule
{
}
