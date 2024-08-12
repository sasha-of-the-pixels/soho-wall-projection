#version 150

// Sets the maximum number of iterations per pixel.
// Note: anything above 256 is a waste of energy,
//       because of the limited floating point precision.
const int kIterations = 256;

uniform vec2 uResolution = vec2(1024., 768.);
uniform uint uTime;

in vec2 pos;

out vec4 fragColor;

const int maxColorCount = 10;
const vec4[8] flagColors = vec4[maxColorCount](
    normalize(vec4(233., 51., 35., 255.)),
    normalize(vec4(233., 51., 35., 255.)),
    normalize(vec4(239., 147., 54., 255.)),
    normalize(vec4(252., 239., 79., 255.)),
    normalize(vec4(56., 127., 41., 255.)),
    normalize(vec4(30., 75., 245., 255.)),
    normalize(vec4(126., 24., 135., 255.)),
    normalize(vec4(126., 24., 135., 255.)),
    vec4(-1., 0., 0.),
    vec4(-1., 0., 0.)
    );

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

vec4[maxColorCount] normalizeFlagColors(vec4[maxColorCount] cols) {
    for (int i = 0; i < maxColorCount; i++) {
        cols[i] = normalize(cols[i]);
    }
}

void main()
{
    // Output color.
    vec2 uv = pos; //(pos * 2. - uResolution) / uResolution.y;
    
    float pi = 3.141592654;
    // update this manually
    float maxSumOfSines = 1. + 1. + 0.6 + 0.5 + 0.7 + 0.6;
    float sumOfSines = sin1x(pos) + sin1y(pos) 
                     + sin2x(pos) + sin2y(pos) 
                     + sin3x(pos) + sin3y(pos);
    
    float normalizedSum = sumOfSines / maxSumOfSines / 2. + .5;
    
    for (int i = 0; i < flagColors.length() - 1; i++) {
        float gc = float(flagColors.length() - 1);
        float lowerBound = float(i) / gc;
        float upperBound = lowerBound + 1. / gc;
        
        if (lowerBound <= normalizedSum && normalizedSum <= upperBound) {
            vec4 gradColor = (normalizedSum - lowerBound) * gc * flagColors[i + 1]
            + (upperBound - normalizedSum) * flagColors[i]; // + (upperBound - normalizedSum) * (gc - 1);
            fragColor = gradColor;
        }
    }
    
    // fragColor = vec4( normalizedSum);
}
