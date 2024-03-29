import { NgModule }                     from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { NgxTinyCarouselComponent }     from './ngx-tiny-carousel.component';
import { ArrowLeftComponent }           from './component/arrow-left/arrow-left.component';
import { ArrowRightComponent }          from './component/arrow-right/arrow-right.component';
import { DotsComponent }                from './component/dots/dots.component';
import { NgxTinyCarouselCellComponent } from './component/ngx-tiny-carousel-cell/ngx-tiny-carousel-cell.component';
import { LazyContentDirective }         from './directive/lazy-content.directive';

@NgModule({
  declarations: [
    NgxTinyCarouselComponent,
    NgxTinyCarouselCellComponent,
    ArrowLeftComponent,
    ArrowRightComponent,
    DotsComponent,
    LazyContentDirective,
  ],
  imports:      [
    CommonModule,
  ],
  exports:      [
    NgxTinyCarouselComponent,
    NgxTinyCarouselCellComponent,
    LazyContentDirective,
  ],
})
export class NgxTinyCarouselModule
{
}
