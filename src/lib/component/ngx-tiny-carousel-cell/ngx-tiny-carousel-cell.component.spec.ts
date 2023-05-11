import { ComponentFixture, TestBed }    from '@angular/core/testing';
import { Component, ViewChild }         from '@angular/core';
import { NgxTinyCarouselCellComponent } from './ngx-tiny-carousel-cell.component';
import { LazyContentDirective }         from '../../directive/lazy-content.directive';

@Component({
  template: '<ngx-tiny-carousel-cell>Hello World</ngx-tiny-carousel-cell>',
})
class TestHostComponent
{
  @ViewChild(NgxTinyCarouselCellComponent)
  public NgxTinyCarouselCellComponent!: NgxTinyCarouselCellComponent;
}

@Component({
  template: '<ngx-tiny-carousel-cell><div *lazyContent>Hello World</div></ngx-tiny-carousel-cell>',
})
class TestHostComponentWithLazyContent
{
  @ViewChild(NgxTinyCarouselCellComponent)
  public NgxTinyCarouselCellComponent!: NgxTinyCarouselCellComponent;
}

describe('NgxTinyCarouselCellComponent', () => {

  describe('作成されたコンポーネントに', () => {

    let component: NgxTinyCarouselCellComponent;
    let fixture: ComponentFixture<NgxTinyCarouselCellComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [
          NgxTinyCarouselCellComponent,
        ],
      }).compileComponents();

      fixture   = TestBed.createComponent(NgxTinyCarouselCellComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('要素の参照が注入されている', () => {
      expect(component.ElementRef).toBeTruthy();
    });
  });

  describe('LazyContentDirectiveが', () => {

    describe('検出されなかった場合', () => {

      let component: TestHostComponent;
      let fixture: ComponentFixture<TestHostComponent>;

      beforeEach(async () => {
        await TestBed.configureTestingModule({
          declarations: [
            TestHostComponent,
            NgxTinyCarouselCellComponent,
          ],
        }).compileComponents();

        fixture   = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('lazyTemplateはnullである', () => {
        expect(component.NgxTinyCarouselCellComponent.lazyTemplate).toBeUndefined();
      });

      it('コンテンツが即座にレンダリングされる', () => {
        expect(component.NgxTinyCarouselCellComponent.ElementRef.nativeElement.innerHTML).toContain('Hello World');
      });
    });

    describe('検出された場合', () => {

        let component: TestHostComponentWithLazyContent;
        let fixture: ComponentFixture<TestHostComponentWithLazyContent>;

        beforeEach(async () => {
          await TestBed.configureTestingModule({
            declarations: [
              TestHostComponentWithLazyContent,
              NgxTinyCarouselCellComponent,
              LazyContentDirective,
            ],
          }).compileComponents();

          fixture   = TestBed.createComponent(TestHostComponentWithLazyContent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });

        it('lazyTemplateが注入される', () => {
          expect(component.NgxTinyCarouselCellComponent.lazyTemplate).toBeTruthy();
        });

        it('コンテンツがレンダリングされない', () => {
          expect(component.NgxTinyCarouselCellComponent.ElementRef.nativeElement.innerHTML).not.toContain('Hello World');
        });

        describe('isInViewportが', () => {

          it('trueになった場合、コンテンツがレンダリングされる', () => {
            component.NgxTinyCarouselCellComponent.isInViewport = true;
            fixture.detectChanges();
            expect(component.NgxTinyCarouselCellComponent.ElementRef.nativeElement.innerHTML).toContain('Hello World');
          });

          it('falseになった場合、コンテンツがレンダリングされない', () => {
            component.NgxTinyCarouselCellComponent.isInViewport = false;
            fixture.detectChanges();
            expect(component.NgxTinyCarouselCellComponent.ElementRef.nativeElement.innerHTML).not.toContain('Hello World');
          });
        });
    });
  });
});
