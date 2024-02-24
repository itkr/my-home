const hsvToHsl = (h: number, s: number, v: number) => {
  let l = ((2 - s) * v) / 2;
  if (l !== 0) {
    if (l === 1) {
      s = 0;
    } else if (l < 0.5) {
      s = (s * v) / (l * 2);
    } else {
      s = (s * v) / (2 - l * 2);
    }
  }
  // return [h, s, l];
  return `hsl(${h}, ${s * 100}%, ${l * 100}%)`;
};

const convertHue = (hue: number) => (hue / 65535) * 360;
const normalizeHue = (hue: number) => Math.round((hue / 360) * 65535);

const makeHueGradient = (split: number = 12) => {
  var gradient = `linear-gradient(to right,`;
  for (let i = 0; i < split; i++) {
    gradient += `${hsvToHsl((i * 360) / split, 1, 1)} ${(i / split) * 100}%,`;
  }
  gradient += `${hsvToHsl(360, 1, 1)} 100%)`;
  return gradient;
};

export { hsvToHsl, convertHue, normalizeHue, makeHueGradient };
