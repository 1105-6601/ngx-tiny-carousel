# NgxTinyCarousel

This library is lightweight carousel plugin for Angular.

# Demo

https://1105-6601.github.io/ngx-tiny-carousel-demo/

# Compatibility

| ngx-tiny-carousel | Angular   |
|-------------------|-----------|
| \>=0.4.0          | \>=14.2.0 |

# Installation

Add package.

```shell
npm i ngx-tiny-carousel --save
```

Add Module.

```typescript
@NgModule({
  //
  imports: [
    //
    NgxTinyCarouselModule,
    //
  ],

  bootstrap: [
    //
  ],
})
export class AppModule
{
}
```

# Usage

```html

<div style="width: 400px;">
  <ngx-tiny-carousel [displayCells]="1">
    <ngx-tiny-carousel-cell>
      ...
    </ngx-tiny-carousel-cell>
    <ngx-tiny-carousel-cell>
      ...
    </ngx-tiny-carousel-cell>
    <ngx-tiny-carousel-cell>
      ...
    </ngx-tiny-carousel-cell>
  </ngx-tiny-carousel>
</div>
```

# Image carousel example

## ts

```typescript
@Component({
  selector:    'app',
  templateUrl: './app.component.html',
})
export class CarouselComponent
{
  public imageSources = [
    'https://picsum.photos/400/400',
    'https://picsum.photos/300/400',
    'https://picsum.photos/250/400',
    'https://picsum.photos/400/250',
    'https://picsum.photos/400/300',
  ];
}
```

## html

```html
<div style="width: 400px;">
  <ngx-tiny-carousel [displayCells]="1">
    <ngx-tiny-carousel-cell *ngFor="let src of imageSources">
      <div class="centralise">
        <img [src]="src" alt="">
      </div>
    </ngx-tiny-carousel-cell>
  </ngx-tiny-carousel>
</div>
```

## scss

```scss
.centralise {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
```

# Lazy load content

```html
<ngx-tiny-carousel [displayCells]="1">
  <ngx-tiny-carousel-cell *ngFor="let src of imageSources">
    <div class="centralise" *lazyContent>
      <img [src]="src" alt="">
    </div>
  </ngx-tiny-carousel-cell>
</ngx-tiny-carousel>
```

# API

## @Input

| @Input                 | Type    | Required | Default   | Description                                                                                                                                                                                                 |
|------------------------|---------|----------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [displayCells]         | number  | optional | 1         | Cell count to be displayed at once.                                                                                                                                                                         |
| [cellHeightScale]      | number  | optional | 1         | Specifies the ratio of the cell height to the cell width.                                                                                                                                                   |
| [dotPosition]          | string  | optional | 'inner'   | 'inner' or 'outer'.                                                                                                                                                                                         |
| [dotStyle]             | string  | optional | 'dot'     | 'dot' or 'bar'.                                                                                                                                                                                             |
| [arrowStyle]           | string  | optional | 'default' | 'default' or 'circle'.                                                                                                                                                                                      |
| [uiScale]              | number  | optional | none      | UI scale of dots and arrows. This will be calculated in response to container element height automatically.                                                                                                 |
| [displayArrows]        | boolean | optional | true      | Decide to display arrows or not.                                                                                                                                                                            |
| [displayDots]          | boolean | optional | true      | Decide to display dots or not.                                                                                                                                                                              |
| [enableDrag]           | boolean | optional | false     | If set true, The carousel becomes draggable.                                                                                                                                                                |
| [enableInfiniteScroll] | boolean | optional | false     | Must be used with the `enableDrag` option. If set true, The carousel becomes infinite scroll.                                                                                                               |
| [cellWidth]            | number  | optional | 0 (auto)  | Basically calculated automatically. However, this option may be useful if you nest `ngx-tiny-carousel` inside a carousel cell that has drag and infinite scroll enabled.                                    |
| [virtualCellMargin]    | number  | optional | 1         | If `enableInfiniteScroll` is enabled, cell elements are virtualized. In this case, the cells before and after the visible cell can be pre-rendered by the number of cells specified in `virtualCellMargin`. |

## Functions

| Definition              | Description                                                 |
|-------------------------|-------------------------------------------------------------|
| next(count: number = 1) | Move to positive direction as much as specified cell count. |
| prev(count: number = 1) | Move to negative direction as much as specified cell count. |
| jump(cellIndex: number) | Move to specific cell index.                                |
