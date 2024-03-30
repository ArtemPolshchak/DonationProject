import {Injectable} from '@angular/core';
import {DOC_ORIENTATION, NgxImageCompressService} from "ngx-image-compress";

@Injectable({
    providedIn: 'root'
})
export class ImageProcessorService {
    image?: string;
    ratio: number = 100;
    quality: number = 100;
    maxWidth: number = 1400;
    maxHeight: number = 1400;

    constructor(private imageCompress: NgxImageCompressService) {
    }

    compress(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.imageCompress.compressFile(reader.result as string, DOC_ORIENTATION.Default,
                    this.ratio, this.quality, this.maxWidth, this.maxHeight)
                    .then(r => {resolve(r)});
            });
            reader.readAsDataURL(file);
        })
    }

    setParams(ratio?: number, quality?: number, maxWidth?: number, maxHeight?: number) {
        ratio ? this.ratio = ratio : {};
        quality ? this.quality = quality : {};
        maxWidth ? this.maxWidth = maxWidth : {};
        maxHeight ? this.maxHeight = maxHeight : {};
    }
}
