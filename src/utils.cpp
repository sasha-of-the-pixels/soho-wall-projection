#include "../include/utils.h"

// This function and OklabToSRGB adapted from "OklabExperiments.js" by user earthbound19:
// https://gist.github.com/earthbound19/e7fe15fdf8ca3ef814750a61bc75b5ce
vec4 rgbToOklab(vec4 rgb) {
    float l = 0.4122214708 * rgb.r + 0.5363325363 * rgb.g + 0.0514459929 * rgb.b;
    float m = 0.2119034982 * rgb.r + 0.6806995451 * rgb.g + 0.1073969566 * rgb.b;
    float s = 0.0883024619 * rgb.r + 0.2817188376 * rgb.g + 0.6299787005 * rgb.b;
    l = cbrt(l); m = cbrt(m); s = cbrt(s);
    float L = l * +0.2104542553 + m * +0.7936177850 + s * -0.0040720468;
    float a = l * +1.9779984951 + m * -2.4285922050 + s * +0.4505937099;
    float b = l * +0.0259040371 + m * +0.7827717662 + s * -0.8086757660;
    return vec4(L, a, b, rgb.a);
}

vec4 *preprocessFlagColors(vec4 *cols, int colorCount) {
    vec4 *res = (vec4 *) calloc(maxColorCount, sizeof(vec4));

    res[0] = cols[0] / 255.f;
    res[0] = rgbToOklab(res[0]);

    for (int i = 1; i < colorCount + 1; i++) {
        res[i] = rgbToOklab(cols[i-1]/255.f);
    }
    res[colorCount + 1] = res[colorCount];

    free(cols);
    return res;
}