import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

function crc32(buf) {
  let c;
  const table = crc32.table ??= (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function buildPng(size) {
  const navy = [0x0b, 0x1e, 0x3d];
  const accent = [0xff, 0x8a, 0x3d];
  const line = [0x14, 0x2d, 0x52];

  const raw = Buffer.alloc(size * (1 + size * 3));
  const margin = Math.round(size * 0.14);
  const gridSize = size - margin * 2;
  const cell = gridSize / 5;
  const centerLo = margin + cell * 2;
  const centerHi = margin + cell * 3;

  for (let y = 0; y < size; y++) {
    const rowStart = y * (1 + size * 3);
    raw[rowStart] = 0; // filter type: none
    for (let x = 0; x < size; x++) {
      let color = navy;
      const inGrid = x >= margin && x < size - margin && y >= margin && y < size - margin;
      if (inGrid) {
        const gx = (x - margin) % cell;
        const gy = (y - margin) % cell;
        const onLine = gx < size * 0.012 || gy < size * 0.012;
        const inCenter = x >= centerLo && x < centerHi && y >= centerLo && y < centerHi;
        if (inCenter) color = accent;
        else if (onLine) color = line;
      }
      const px = rowStart + 1 + x * 3;
      raw[px] = color[0];
      raw[px + 1] = color[1];
      raw[px + 2] = color[2];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = deflateSync(raw);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

writeFileSync(new URL("../public/icon-192.png", import.meta.url), buildPng(192));
writeFileSync(new URL("../public/icon-512.png", import.meta.url), buildPng(512));
console.log("icons generated");
