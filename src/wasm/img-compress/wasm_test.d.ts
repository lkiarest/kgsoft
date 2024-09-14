/* tslint:disable */
/* eslint-disable */
/**
* @param {string} name
*/
export function greet(name: string): void;
/**
* @param {Uint8Array} img_buffer
* @param {number} length
* @returns {Uint8Array}
*/
export function compress(img_buffer: Uint8Array, length: number): Uint8Array;
/**
* @param {Uint8Array} img_buffer
* @param {number} length
* @param {number} quality
* @returns {Uint8Array}
*/
export function compress_with_quality(img_buffer: Uint8Array, length: number, quality: number): Uint8Array;
/**
* @param {Uint8Array} img_buffer
* @param {number} length
* @param {number} quality
* @param {number | undefined} [width]
* @param {number | undefined} [height]
* @returns {Uint8Array}
*/
export function compress_with_resize(img_buffer: Uint8Array, length: number, quality: number, width?: number, height?: number): Uint8Array;
/**
* Sample position for subsampled chroma
*/
export enum ChromaSamplePosition {
/**
* The source video transfer function must be signaled
* outside the AV1 bitstream.
*/
  Unknown = 0,
/**
* Horizontally co-located with (0, 0) luma sample, vertically positioned
* in the middle between two luma samples.
*/
  Vertical = 1,
/**
* Co-located with (0, 0) luma sample.
*/
  Colocated = 2,
}
/**
* Allowed pixel value range
*
* C.f. `VideoFullRangeFlag` variable specified in ISO/IEC 23091-4/ITU-T H.273
*/
export enum PixelRange {
/**
* Studio swing representation
*/
  Limited = 0,
/**
* Full swing representation
*/
  Full = 1,
}
/**
* Chroma subsampling format
*/
export enum ChromaSampling {
/**
* Both vertically and horizontally subsampled.
*/
  Cs420 = 0,
/**
* Horizontally subsampled.
*/
  Cs422 = 1,
/**
* Not subsampled.
*/
  Cs444 = 2,
/**
* Monochrome.
*/
  Cs400 = 3,
}
/**
*/
export enum Tune {
  Psnr = 0,
  Psychovisual = 1,
}
