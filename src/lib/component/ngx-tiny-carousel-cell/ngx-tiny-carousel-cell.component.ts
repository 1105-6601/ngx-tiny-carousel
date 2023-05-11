import { Component, ContentChild, ElementRef, TemplateRef } from '@angular/core';
import { LazyContentDirective }                             from '../../directive/lazy-content.directive';

@Component({
  selector:    'ngx-tiny-carousel-cell',
  templateUrl: './ngx-tiny-carousel-cell.component.html',
  styleUrls:   ['./ngx-tiny-carousel-cell.component.scss'],
})
export class NgxTinyCarouselCellComponent
{
  @ContentChild(LazyContentDirective, {read: TemplateRef, static: true})
  public lazyTemplate?: TemplateRef<any>;

  public lazyContent: TemplateRef<any> | null = null;

  public set isInViewport(value: boolean)
  {
    if (value && this.lazyTemplate && !this.lazyContent) {
      this.lazyContent = this.lazyTemplate;
    }
  }

  public get isLazy(): boolean
  {
    return !!this.lazyTemplate;
  }

  public constructor(
    public ElementRef: ElementRef,
  )
  {
  }
}
