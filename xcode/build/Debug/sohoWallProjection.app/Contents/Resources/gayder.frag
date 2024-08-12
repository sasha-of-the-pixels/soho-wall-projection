#version 150

// Sets the maximum number of iterations per pixel.
// Note: anything above 256 is a waste of energy,
//       because of the limited floating point precision.
const int kIterations = 128;
const float pi = 3.141592654;
const float maxSumOfSines = 1. + 1. + 0.6 + 0.5 + 0.7 + 0.6;

uniform vec2 uResolution = vec2(1024., 768.);
uniform uint uTime;
uniform int colorCount;

in vec2 pos;

out vec4 fragColor;

const int maxColorCount = 10;
uniform vec4[maxColorCount] uFlagColors;

float waveScale = 10.;
float timeScale = 0.02;

float sin1x(vec2 p) {
    return sin(waveScale * p.x + timeScale * uTime);
}
float sin1y(vec2 p) {
    return sin(1.2 * waveScale * p.y + p.x * sin(timeScale * uTime));
}
float sin2x(vec2 p) {
    return 0.6 * sin(2.2 * waveScale * p.x + 1.5 * timeScale * uTime);
}
float sin2y(vec2 p) {
    return 0.5 * sin(1.9 * waveScale * p.y - p.x * sin(1.5 * timeScale * uTime));
}
float sin3x(vec2 p) {
    return 0.7 * sin(0.4 * waveScale * p.x + 0.5 * timeScale * uTime);
}
float sin3y(vec2 p) {
    return 0.6 * sin(0.3 * waveScale * p.y + 0.4 * timeScale * uTime);
}

// vec4[maxColorCount] preprocessFlagColors(vec4[maxColorCount] cols) {
//     vec4[maxColorCount] res;
//     res[0] = vec4(normalize(cols[0].xyz), 1.);
//     for (int i = 1; i < maxColorCount - 1; i++) {
//         res[i] = vec4(normalize(cols[i].xyz), 1.);
//         if (cols[i+1].x < 0) {
//             res[i+1] = cols[i];
//             for (int j = i + 2; j < maxColorCount; j++) {
//                 res[j] = cols[j];
//             }
//             break;
//         }
//     }
//     return res;
// }
// vec4[maxColorCount] flagColors = uFlagColors;

vec4 oklabToSRGB(vec4 lab) {
    float L = lab.x, a = lab.y, b = lab.z;
    float l = L + a * +0.3963377774 + b * +0.2158037573;
    float m = L + a * -0.1055613458 + b * -0.0638541728;
    float s = L + a * -0.0894841775 + b * -1.2914855480;
    // The ** operator here cubes; same as l_*l_*l_ in the C++ example:
    l = pow(l, 3); m = pow(m, 3); s = pow(s, 3);
    float r = l * +4.0767416621 + m * -3.3077115913 + s * +0.2309699292;
    float g = l * -1.2684380046 + m * +2.6097574011 + s * -0.3413193965;
    float bb = l * -0.0041960863 + m * -0.7034186147 + s * +1.7076147010;
    // Convert linear RGB values returned from oklab math to sRGB for our use before returning them:
    // r = 255 * linearToGamma(r); g = 255 * linearToGamma(g); b = 255 * linearToGamma(b);
    // OPTION: clamp r g and b values to the range 0-255; but if you use the values immediately to draw, JavaScript clamps them on use:
    // r = clamp(r, 0, 255); g = clamp(g, 0, 255); b = clamp(b, 0, 255);
    // OPTION: round the values. May not be necessary if you use them immediately for rendering in JavaScript, as JavaScript (also) discards decimals on render:
    // r = Math.round(r); g = Math.round(g); b = Math.round(b);
    return vec4(r, g, bb, lab.w);
}

void main()
{
    // Output color.
    vec2 uv = pos; //(pos * 2. - uResolution) / uResolution.y;
    
    // update this manually
    float sumOfSines = sin1x(pos) + sin1y(pos) 
                     + sin2x(pos) + sin2y(pos) 
                     + sin3x(pos) + sin3y(pos);
    
    float normalizedSum = sumOfSines / maxSumOfSines / 2. + .5;
    
    float gc = float(colorCount - 1);
    for (int i = 0; i < colorCount - 1; i++) {
        float lowerBound = float(i) / gc;
        float upperBound = lowerBound + 1. / gc;
        
        if (lowerBound <= normalizedSum && normalizedSum <= upperBound) {
            vec4 gradColor = (normalizedSum - lowerBound) * gc * uFlagColors[i + 1]
            + (upperBound - normalizedSum) * (gc / 2.) * uFlagColors[i]; // + (upperBound - normalizedSum) * (gc - 1);
            fragColor = oklabToSRGB(gradColor);
        }
    }
    
    // fragColor = vec4( normalizedSum);
}
