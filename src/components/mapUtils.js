export const hexToRgb = (hex) => {
    let r = 0, g = 0, b = 0;
    // 3자리 HEX 코드 처리
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // 6자리 HEX 코드 처리
    else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return [r, g, b];
};

export const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

export const gradientColorsHex = (steps) => {
    const startHex = "#00FFAE";
    const endHex = "#009DFF";
    const startRGB = hexToRgb(startHex);
    const endRGB = hexToRgb(endHex);

    const interpolateColor = (start, end, factor) => {
        const result = start.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(start[i] + factor * (end[i] - start[i]));
        }
        return rgbToHex(result[0], result[1], result[2]);
    };

    const colors = [];
    for (let i = 0; i < steps; i++) {
        colors.push(interpolateColor(startRGB, endRGB, i / (steps - 1)));
    }

    return colors;
};