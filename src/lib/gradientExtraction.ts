import { ColorData, hexToRgb, rgbToHex } from './colorExtraction';

export interface GradientData {
  id: string;
  colors: string[];
  angle: number;
  css: string;
  name: string;
}

// Generate gradients from extracted colors
export const generateGradientsFromColors = (colors: ColorData[]): GradientData[] => {
  if (colors.length < 2) return [];

  const gradients: GradientData[] = [];

  // Two-color gradients (main combinations)
  for (let i = 0; i < Math.min(colors.length - 1, 3); i++) {
    for (let j = i + 1; j < Math.min(colors.length, 4); j++) {
      const color1 = colors[i].hex;
      const color2 = colors[j].hex;
      
      // Linear gradient (45deg)
      gradients.push({
        id: `linear-${i}-${j}`,
        colors: [color1, color2],
        angle: 45,
        css: `linear-gradient(45deg, ${color1} 0%, ${color2} 100%)`,
        name: `${colors[i].name} to ${colors[j].name}`
      });

      // Linear gradient (135deg)
      gradients.push({
        id: `linear-135-${i}-${j}`,
        colors: [color1, color2],
        angle: 135,
        css: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
        name: `${colors[i].name} diagonal ${colors[j].name}`
      });
    }
  }

  // Three-color gradients
  if (colors.length >= 3) {
    for (let i = 0; i < Math.min(colors.length - 2, 2); i++) {
      const color1 = colors[i].hex;
      const color2 = colors[i + 1].hex;
      const color3 = colors[i + 2].hex;
      
      gradients.push({
        id: `triple-${i}`,
        colors: [color1, color2, color3],
        angle: 90,
        css: `linear-gradient(90deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`,
        name: `Triple blend ${i + 1}`
      });
    }
  }

  // Radial gradients
  if (colors.length >= 2) {
    const color1 = colors[0].hex;
    const color2 = colors[1].hex;
    
    gradients.push({
      id: 'radial-center',
      colors: [color1, color2],
      angle: 0,
      css: `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`,
      name: 'Radial burst'
    });
  }

  return gradients.slice(0, 6); // Return top 6 gradients
};

// Generate complementary gradient
export const generateComplementaryGradient = (color: ColorData): GradientData => {
  const rgb = hexToRgb(color.hex);
  
  // Calculate complementary color (opposite on color wheel)
  const compR = 255 - rgb.r;
  const compG = 255 - rgb.g;
  const compB = 255 - rgb.b;
  
  const complementary = rgbToHex(compR, compG, compB);
  
  return {
    id: 'complementary',
    colors: [color.hex, complementary],
    angle: 90,
    css: `linear-gradient(90deg, ${color.hex} 0%, ${complementary} 100%)`,
    name: 'Complementary harmony'
  };
};

// Generate analogous gradients
export const generateAnalogousGradients = (colors: ColorData[]): GradientData[] => {
  if (colors.length < 2) return [];
  
  const gradients: GradientData[] = [];
  const sortedByHue = [...colors].sort((a, b) => {
    const rgbA = hexToRgb(a.hex);
    const rgbB = hexToRgb(b.hex);
    return getHue(rgbA.r, rgbA.g, rgbA.b) - getHue(rgbB.r, rgbB.g, rgbB.b);
  });

  for (let i = 0; i < Math.min(sortedByHue.length - 1, 3); i++) {
    gradients.push({
      id: `analogous-${i}`,
      colors: [sortedByHue[i].hex, sortedByHue[i + 1].hex],
      angle: 120,
      css: `linear-gradient(120deg, ${sortedByHue[i].hex} 0%, ${sortedByHue[i + 1].hex} 100%)`,
      name: `Analogous ${i + 1}`
    });
  }

  return gradients;
};

// Calculate hue from RGB
const getHue = (r: number, g: number, b: number): number => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta === 0) return 0;

  let hue = 0;
  if (max === r) {
    hue = ((g - b) / delta) % 6;
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }

  hue *= 60;
  if (hue < 0) hue += 360;

  return hue;
};
