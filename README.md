# NgxTinyCarousel

This library is lightweight carousel plugin for Angular.

# Compatibility

| ngx-tiny-carousel | Angular   |
|-------------------|-----------|
| 0.3.0             | \>=14.2.0 |

# Installation

Add package.

```shell
npm i ngx-tiny-carousel --save
```

Add Module.

```typescript
@NgModule({
  
  ...
    
  imports:   [
    ...
      
    NgxTinyCarouselModule,
  
    ...
  ],
  bootstrap: [...]
})
export class AppModule
{
}
```

# Usage

Please give each `div` element a `cell` class.

```html

<div style="width: 400px;">
  <ngx-tiny-carousel [displayCells]="1" (carouselClick)="onClick($event)">
    <div class="cell">
      ...
    </div>
    <div class="cell">
      ...
    </div>
    <div class="cell">
      ...
    </div>
  </ngx-tiny-carousel>
</div>
```

# Image carousel example

## html

```html

<div style="width: 400px;">
  <ngx-tiny-carousel [displayCells]="1" (carouselClick)="onClick($event)">
    <div class="cell">
      <div class="centralise">
        <img src="https://picsum.photos/300/400" alt="">
      </div>
    </div>
    <div class="cell">
      <div class="centralise">
        <img src="https://picsum.photos/250/400" alt="">
      </div>
    </div>
    <div class="cell">
      <div class="centralise">
        <img src="https://picsum.photos/400/250" alt="">
      </div>
    </div>
    <div class="cell">
      <div class="centralise">
        <img src="https://picsum.photos/400/300" alt="">
      </div>
    </div>
    <div class="cell">
      <div class="centralise">
        <img src="https://picsum.photos/400/400" alt="">
      </div>
    </div>
  </ngx-tiny-carousel>
</div>
```

## scss

```scss
.cell {
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
}
```

# API

## @Input

| @Input         | Type   | Required | Default | Description                                                                                           |
|----------------|--------|----------|---------|-------------------------------------------------------------------------------------------------------|
| [height]       | number | optional | 0       | If unset, it is set to the cell width.                                                                |
| [cellWidth]    | number | optional | 0       | If unset, it is set to the width of the parent element.                                               |
| [displayCells] | number | optional | 1       | Ignored if `cellWidth` is specified. You can specify the number of cells to be displayed at one time. |