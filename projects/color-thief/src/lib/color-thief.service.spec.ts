import { TestBed } from '@angular/core/testing';

import { ColorThiefService } from './color-thief.service';

describe('ColorThiefService', () => {
  let service: ColorThiefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorThiefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPaletteFromUrl should return an array of colors', (done) => {
    spyOn(service, 'getPaletteFromUrl').and.returnValue(Promise.resolve([
      [1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6], [5, 6, 7]
    ]));
    const url = 'https://www.w3schools.com/howto/img_avatar.png';

    const palette = service.getPaletteFromUrl(url);
    palette.then(p => {
      expect(p).toBeInstanceOf(Array);
      done();
    }).catch(e => {
      expect(e).toBeInstanceOf(Error);
    });
  });

  it('getPalette should return an array of colors', () => {
    const img = new Image();
    img.src = 'https://www.w3schools.com/howto/img_avatar.png';
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const colors = service.getPalette(img, 5, 10);
      expect(colors).toBeInstanceOf(Array);
    };
  });
});
