export function extractCoverFromFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const view = new DataView(reader.result);
        if (view.getUint8(0) !== 0x49 || view.getUint8(1) !== 0x44 || view.getUint8(2) !== 0x33) {
          resolve(null);
          return;
        }
        const size = ((view.getUint8(6) & 0x7f) << 21) | ((view.getUint8(7) & 0x7f) << 14) | ((view.getUint8(8) & 0x7f) << 7) | (view.getUint8(9) & 0x7f);
        let offset = 10;
        while (offset < size) {
          const frameId = String.fromCharCode(view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2), view.getUint8(offset + 3));
          const frameSize = ((view.getUint8(offset + 4) & 0x7f) << 21) | ((view.getUint8(offset + 5) & 0x7f) << 14) | ((view.getUint8(offset + 6) & 0x7f) << 7) | (view.getUint8(offset + 7) & 0x7f);
          offset += 6;
          if (frameId === 'APIC' && frameSize > 4) {
            let pos = offset + 1;
            while (pos < offset + frameSize && view.getUint8(pos) !== 0) pos++;
            pos++;
            const mimeStart = pos;
            let mimeEnd = pos;
            while (mimeEnd < offset + frameSize && view.getUint8(mimeEnd) !== 0) mimeEnd++;
            const mime = String.fromCharCode(...new Uint8Array(reader.result.slice(mimeStart, mimeEnd)));
            pos = mimeEnd + 2;
            const imgData = new Uint8Array(reader.result.slice(pos, offset + frameSize));
            const blob = new Blob([imgData], { type: mime || 'image/jpeg' });
            resolve(URL.createObjectURL(blob));
            return;
          }
          offset += frameSize;
          if (offset >= size || frameSize === 0) break;
        }
        resolve(null);
      } catch {
        resolve(null);
      }
    };
    reader.onerror = () => resolve(null);
    reader.readAsArrayBuffer(file.slice(0, 256 * 1024));
  });
}
