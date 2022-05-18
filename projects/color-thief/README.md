# ColorThief

This library was adapted from [ColorThief](https://github.com/lokesh/color-thief), adjust to an Angular service for usage.

## Installation

**Install with [npm](https://www.npmjs.com/):**
```sh
npm i @soarlin/angular-color-thief
```

Install with [yarn](https://yarnpkg.com/):
```sh
yarn add @soarlin/angular-color-thief
```

## API methods

```js
getPaletteFromUrl(imageUrl: string, count = 5, quality = 10): Promise<number[][]>
```
**getPaletteFromUrl**
* imageUrl: image url
* count: palette size
* quality: quality number, bigger than 0

```js
getPalette(img: HTMLImageElement, colorCount: number, quality = 10): number[][]
```
**getPalette**
* img: an [HTMLImageElement](https://developer.mozilla.org/zh-TW/docs/Web/API/HTMLImageElement)
* colorCount: palette size
* quality: quality number, bigger than 0


```js
getColor(img: HTMLImageElement, quality = 10): number[]
```
**getColor**
* img: an [HTMLImageElement](https://developer.mozilla.org/zh-TW/docs/Web/API/HTMLImageElement)
* quality: quality number, bigger than 0


## Usage

1. import to your component
2. inject and usage in your component

**my-component.component.ts**
```typescript
import { ColorThiefService } from '@soarlin/angular-color-thief';

@Component({
  selector: 'app-my-component',
  // ...
})
export class MyComponent implements OnInit {
  // ...

  constructor(private colorThiefService: ColorThiefService) { }

  ngOnInit(): void {
    // method 1: get the dominant color from an image
    const image = new Image();
    image.src = 'path-to-your-local-image';
    image.onload = () => {
      const color = this.colorThiefService.getColor(image);
      // color is an array of [r, g, b] values
      console.log(color);
    };

    // method 2: get palette colors from an image
    const image2 = new Image();
    image2.src = 'path-to-your-local-image';
    image2.onload = () => {
      const palette = this.colorThiefService.getPalette(image2, 5);
      // palette is an array of [[r, g, b], [r, g, b], ...] values
      console.log(palette);
    };

    // method 3: get palette colors from image url
    const imgUrl = 'path-to-your-local-image-url';
    this.colorThiefService.getPaletteFromUrl(imgUrl, 5)
      .then(palette => {
        // palette is an array of [[r, g, b], [r, g, b], ...] values
        console.log(palette);
      }).catch(err => {
        console.log(err);
      });
  }
}
```

## References
* [Color Thief](https://github.com/lokesh/color-thief)
* [quantize](https://github.com/olivierlesnicki/quantize)
