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

// Calculate perceptual color distance (weighted RGB)
// Uses human eye sensitivity: more sensitive to green, less to blue
const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number => {
  const rMean = (r1 + r2) / 2;
  const rDiff = r1 - r2;
  const gDiff = g1 - g2;
  const bDiff = b1 - b2;
  
  // Weighted Euclidean distance approximating perceptual difference
  return Math.sqrt(
    (2 + rMean / 256) * rDiff * rDiff +
    4 * gDiff * gDiff +
    (2 + (255 - rMean) / 256) * bDiff * bDiff
  );
};

// Generate accurate color name based on HSL
const generateColorName = (r: number, g: number, b: number): string => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const sum = max + min;
  const lightness = sum / 2 / 255;
  const saturation = diff === 0 ? 0 : diff / (255 - Math.abs(sum - 255));
  
  // Calculate hue
  let hue = 0;
  if (diff !== 0) {
    if (max === r) hue = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
    else if (max === g) hue = ((b - r) / diff + 2) / 6;
    else hue = ((r - g) / diff + 4) / 6;
  }
  hue *= 360;
  
  // Grayscale colors
  if (saturation < 0.1) {
    if (lightness < 0.15) return "Deep Black";
    if (lightness < 0.3) return "Charcoal Gray";
    if (lightness < 0.5) return "Cool Gray";
    if (lightness < 0.7) return "Light Gray";
    if (lightness < 0.9) return "Soft White";
    return "Pure White";
  }
  
  // Chromatic colors with saturation and lightness modifiers
  const intensity = saturation > 0.6 ? (lightness < 0.4 ? "Deep " : lightness < 0.7 ? "Vibrant " : "Bright ") :
                    saturation > 0.3 ? (lightness < 0.4 ? "Dark " : lightness < 0.7 ? "" : "Pale ") : "Muted ";
  
  if (hue >= 0 && hue < 15) return intensity + "Red";
  if (hue >= 15 && hue < 30) return intensity + "Red-Orange";
  if (hue >= 30 && hue < 45) return intensity + "Orange";
  if (hue >= 45 && hue < 60) return intensity + "Golden";
  if (hue >= 60 && hue < 75) return intensity + "Yellow";
  if (hue >= 75 && hue < 105) return intensity + "Lime";
  if (hue >= 105 && hue < 135) return intensity + "Green";
  if (hue >= 135 && hue < 165) return intensity + "Teal";
  if (hue >= 165 && hue < 195) return intensity + "Cyan";
  if (hue >= 195 && hue < 225) return intensity + "Sky Blue";
  if (hue >= 225 && hue < 255) return intensity + "Blue";
  if (hue >= 255 && hue < 285) return intensity + "Indigo";
  if (hue >= 285 && hue < 315) return intensity + "Purple";
  if (hue >= 315 && hue < 330) return intensity + "Magenta";
  if (hue >= 330 && hue < 345) return intensity + "Pink";
  return intensity + "Rose";
};

// Extract dominant colors from image
export const extractColors = async (imageFile: File, colorCount: number = 5): Promise<ColorData[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      try {
        // Resize for better sampling while maintaining performance
        const maxSize = 600;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        if (!ctx) throw new Error('Canvas context not available');

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Improved color quantization with adaptive bucketing
        const colorMap = new Map<string, { count: number; r: number; g: number; b: number }>();

        // Sample every 2nd pixel for better accuracy
        for (let i = 0; i < pixels.length; i += 8) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // Skip transparent and very dark pixels (likely shadows)
          if (a < 128) continue;

          // Adaptive bucketing: finer precision for mid-tones
          const lightness = (r + g + b) / 3;
          const bucketSize = lightness > 40 && lightness < 215 ? 16 : 24;
          
          const bucketR = Math.round(r / bucketSize) * bucketSize;
          const bucketG = Math.round(g / bucketSize) * bucketSize;
          const bucketB = Math.round(b / bucketSize) * bucketSize;

          const key = `${bucketR},${bucketG},${bucketB}`;
          const existing = colorMap.get(key);
          
          if (existing) {
            existing.count++;
            // Track average color for better accuracy
            existing.r = Math.round((existing.r * (existing.count - 1) + r) / existing.count);
            existing.g = Math.round((existing.g * (existing.count - 1) + g) / existing.count);
            existing.b = Math.round((existing.b * (existing.count - 1) + b) / existing.count);
          } else {
            colorMap.set(key, { count: 1, r, g, b });
          }
        }

        // Sort by frequency and filter low-count colors
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1].count - a[1].count)
          .filter(([_, data]) => data.count > 3) // Filter noise
          .slice(0, colorCount * 4); // Get more candidates for diversity

        // Cluster similar colors and pick diverse, vibrant ones
        const finalColors: ColorData[] = [];
        
        for (const [_, data] of sortedColors) {
          const { r, g, b, count } = data;
          
          // Validate RGB values
          if (isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            continue;
          }
          
          // Check if this color is too similar to already selected colors
          // Use tighter threshold for better diversity
          const isSimilar = finalColors.some(existing => {
            const existingRgb = existing.rgb.split(', ').map(Number);
            return colorDistance(r, g, b, existingRgb[0], existingRgb[1], existingRgb[2]) < 45;
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

        // If we didn't get enough colors, relax similarity threshold
        if (finalColors.length < colorCount && sortedColors.length > 0) {
          for (const [_, data] of sortedColors) {
            if (finalColors.length >= colorCount) break;
            
            const { r, g, b, count } = data;
            if (isNaN(r) || isNaN(g) || isNaN(b)) continue;
            
            // Check if we already have this exact color
            const exists = finalColors.some(c => c.rgb === `${r}, ${g}, ${b}`);
            if (!exists) {
              // Relaxed similarity check
              const isTooSimilar = finalColors.some(existing => {
                const existingRgb = existing.rgb.split(', ').map(Number);
                return colorDistance(r, g, b, existingRgb[0], existingRgb[1], existingRgb[2]) < 25;
              });
              
              if (!isTooSimilar) {
                finalColors.push({
                  hex: rgbToHex(r, g, b),
                  rgb: `${r}, ${g}, ${b}`,
                  name: generateColorName(r, g, b),
                  count
                });
              }
            }
          }
        }

        resolve(finalColors.length > 0 ? finalColors : []);
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
