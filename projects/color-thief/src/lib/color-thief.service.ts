import { Injectable } from '@angular/core';
import * as quantize from 'quantize';

interface ColorValidateOptions {
  colorCount: number;
  quality: number;
}

@Injectable({
  providedIn: 'root'
})
export class ColorThiefService {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor() {
  }

  private initCanvasImage(image: HTMLImageElement): void {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width = image.naturalWidth;
    this.height = this.canvas.height = image.naturalHeight;
    this.context.drawImage(image, 0, 0, this.width, this.height);
  }

  private getCanvasImageData(): ImageData {
    return this.context.getImageData(0, 0, this.width, this.height);
  }

  private createPixelArray(imgData, pixelCount, quality): any[] {
    const pixels = imgData.data;
    const pixelArray = [];

    for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
      offset = i * 4;
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a = pixels[offset + 3];

      // If pixel is mostly opaque and not white
      if (typeof a === 'undefined' || a >= 125) {
        if (!(r > 250 && g > 250 && b > 250)) {
          pixelArray.push([r, g, b]);
        }
      }
    }
    return pixelArray;
  }

  private validateOptions(options): ColorValidateOptions {
    let { colorCount, quality } = options;

    if (typeof colorCount === 'undefined' || !Number.isInteger(colorCount)) {
      colorCount = 10;
    } else if (colorCount === 1 ) {
      throw new Error('colorCount should be between 2 and 20. To get one color, call getColor() instead of getPalette()');
    } else {
      colorCount = Math.max(colorCount, 2);
      colorCount = Math.min(colorCount, 20);
    }

    if (typeof quality === 'undefined' || !Number.isInteger(quality) || quality < 1) {
      quality = 10;
    }

    return {
      colorCount,
      quality
    };
  }

  getColor(img: HTMLImageElement, quality = 10): number[] {
    const palettle = this.getPalette(img, 5, quality);
    return palettle[0];
  }

  getPalette(img: HTMLImageElement, colorCount: number, quality = 10): number[][] {
    const options = this.validateOptions({
      colorCount,
      quality
    });

    this.initCanvasImage(img);
    const imgData = this.getCanvasImageData();
    const pixelCount = this.width * this.height;
    const pixelArray = this.createPixelArray(imgData, pixelCount, options.quality);
    const cmap = quantize(pixelArray, options.colorCount);
    const palette = cmap ? cmap.palette() : null;
    return palette;
  }

  getPaletteFromUrl(imageUrl: string, count = 5, quality = 10): Promise<number[][]> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        resolve(this.getPalette(img, count, quality));
      };
      img.onerror = reject;
    });
  }
}
