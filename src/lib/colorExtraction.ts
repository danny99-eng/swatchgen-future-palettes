export interface ColorData {
  hex: string;
  rgb: string;
  name: string;
  count: number;
}

// Convert RGB to HEX
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};

// Convert HEX to RGB
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Calculate color distance
const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number => {
  return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
};

// Generate color name based on hue
const generateColorName = (r: number, g: number, b: number): string => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  if (diff < 20) {
    if (max < 50) return "Deep Black";
    if (max < 128) return "Cool Gray";
    if (max < 200) return "Light Gray";
    return "Pure White";
  }
  
  if (r > g && r > b) return g > b ? "Warm Orange" : "Vibrant Red";
  if (g > r && g > b) return b > r ? "Ocean Blue" : "Fresh Green";
  if (b > r && b > g) return r > g ? "Royal Purple" : "Electric Blue";
  
  return "Mixed Tone";
};

// Extract dominant colors from image
export const extractColors = async (imageFile: File, colorCount: number = 5): Promise<ColorData[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      try {
        // Resize for performance
        const maxSize = 400;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        if (!ctx) throw new Error('Canvas context not available');

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Color quantization using simple bucketing
        const colorMap = new Map<string, number>();

        for (let i = 0; i < pixels.length; i += 16) { // Sample every 4th pixel for speed
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // Skip transparent pixels
          if (a < 128) continue;

          // Bucket colors (reduce precision)
          const bucketR = Math.round(r / 32) * 32;
          const bucketG = Math.round(g / 32) * 32;
          const bucketB = Math.round(b / 32) * 32;

          const key = `${bucketR},${bucketG},${bucketB}`;
          colorMap.set(key, (colorMap.get(key) || 0) + 1);
        }

        // Sort by frequency
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, colorCount * 3); // Get more candidates

        // Cluster similar colors and pick diverse ones
        const finalColors: ColorData[] = [];
        
        for (const [color, count] of sortedColors) {
          const [r, g, b] = color.split(',').map(Number);
          
          // Check if this color is too similar to already selected colors
          const isSimilar = finalColors.some(existing => {
            const existingRgb = existing.rgb.split(', ').map(Number);
            return colorDistance(r, g, b, existingRgb[0], existingRgb[1], existingRgb[2]) < 60;
          });

          if (!isSimilar) {
            finalColors.push({
              hex: rgbToHex(r, g, b),
              rgb: `${r}, ${g}, ${b}`,
              name: generateColorName(r, g, b),
              count
            });
          }

          if (finalColors.length >= colorCount) break;
        }

        resolve(finalColors);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(imageFile);
  });
};

// Generate warm palette variation
export const generateWarmPalette = (colors: ColorData[]): ColorData[] => {
  return colors.map(color => {
    const rgb = hexToRgb(color.hex);
    // Increase red, slightly increase green, decrease blue
    const r = Math.min(255, Math.round(rgb.r * 1.15));
    const g = Math.min(255, Math.round(rgb.g * 1.05));
    const b = Math.max(0, Math.round(rgb.b * 0.85));
    
    return {
      hex: rgbToHex(r, g, b),
      rgb: `${r}, ${g}, ${b}`,
      name: generateColorName(r, g, b),
      count: color.count
    };
  });
};

// Generate cool palette variation
export const generateCoolPalette = (colors: ColorData[]): ColorData[] => {
  return colors.map(color => {
    const rgb = hexToRgb(color.hex);
    // Decrease red, slightly increase green, increase blue
    const r = Math.max(0, Math.round(rgb.r * 0.85));
    const g = Math.min(255, Math.round(rgb.g * 1.05));
    const b = Math.min(255, Math.round(rgb.b * 1.15));
    
    return {
      hex: rgbToHex(r, g, b),
      rgb: `${r}, ${g}, ${b}`,
      name: generateColorName(r, g, b),
      count: color.count
    };
  });
};

// Export palette as PNG
export const exportPaletteAsPNG = (colors: ColorData[], filename: string = 'palette.png') => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Canvas context not available');

  const swatchWidth = 200;
  const swatchHeight = 150;
  const textHeight = 80;
  const padding = 20;

  canvas.width = swatchWidth * colors.length + padding * 2;
  canvas.height = swatchHeight + textHeight + padding * 2;

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw each color swatch
  colors.forEach((color, index) => {
    const x = padding + index * swatchWidth;
    const y = padding;

    // Color swatch
    ctx.fillStyle = color.hex;
    ctx.fillRect(x, y, swatchWidth - 10, swatchHeight);

    // Text
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(color.name, x, y + swatchHeight + 25);

    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(color.hex, x, y + swatchHeight + 45);
    ctx.fillText(`RGB: ${color.rgb}`, x, y + swatchHeight + 65);
  });

  // Download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
};
