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

float aspectRatio = uResolution.y / uResolution.x;

const int numPetals = 5;

// sdEgg from Inigo Quilez's website
float sdEgg( in vec2 p, in float he, in float ra, in float rb, vec2 up )
{
    float ce = 0.5*(he*he-(ra-rb)*(ra-rb))/(ra-rb);
    
    vec2 side = vec2(-up.y, up.x);
    vec2 newp = vec2(dot(p, side), dot(p, up) );
    newp.x = abs(newp.x);
    

    if( newp.y<0.0 )                return length(newp)-ra;
    if( newp.y*ce-newp.x*he>he*ce ) return length(vec2(newp.x,newp.y-he))-rb;
                                    return length(vec2(newp.x+ce,newp.y))-(ce+ra);
}

float largePetalOffset = 0.5;
float largePetalHe = 0.6;
float largePetalRadius1 = 0.3;

float smallPetalOffset = 0.3;
float smallPetalHe = 0.5;
float smallPetalRadius1 = 0.2;

float makeLargePetal(in vec2 uv, in float theta, in float swell) {
    vec2 up = vec2(cos(theta), sin(theta));
    float egg = sdEgg(uv - largePetalOffset * up, 
                      largePetalHe + swell, 
                      largePetalRadius1 + 0.3 * swell, 
                      0.02, 
                      up);
    float wiggle = 0.07 * cos(2. * float(numPetals) * atan(uv.y, uv.x));
    return egg+wiggle;
}

float makeSmallPetal(in vec2 uv, in float theta, in float swell) {
    theta += radians(360. / float(numPetals) / 2.);
    vec2 up = vec2(cos(theta), sin(theta));
    float egg = sdEgg(uv - smallPetalOffset * up, 
                      smallPetalHe + swell, 
                      smallPetalRadius1 + 0.3 * swell, 
                      0.02, 
                      up);
    float wiggle = 0.05 * cos(3. * float(numPetals) * atan(uv.y, uv.x));
    return egg + wiggle;
}

// This function and rgbToOklab adapted from "OklabExperiments.js" by user earthbound19:
// https://gist.github.com/earthbound19/e7fe15fdf8ca3ef814750a61bc75b5ce
vec4 oklabToSRGB(vec4 lab) {
    float L = lab.x, a = lab.y, b = lab.z;
    float l = L + a * +0.3963377774 + b * +0.2158037573;
    float m = L + a * -0.1055613458 + b * -0.0638541728;
    float s = L + a * -0.0894841775 + b * -1.2914855480;
    l = pow(l, 3); m = pow(m, 3); s = pow(s, 3);
    float r = l * +4.0767416621 + m * -3.3077115913 + s * +0.2309699292;
    float g = l * -1.2684380046 + m * +2.6097574011 + s * -0.3413193965;
    float bb = l * -0.0041960863 + m * -0.7034186147 + s * +1.7076147010;
    return vec4(r, g, bb, lab.w);
}

void main()
{
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = vec2(pos.x, pos.y * aspectRatio);
    uv = 3. * (uv - vec2(0.5, 0.5*aspectRatio));
    vec2 uv2 = uv * 0.6;
    uv = 1.5 * uv;
    float checker = mod(floor(uv.x) + floor(uv.y), 2.);
    uv = 2.7*(fract(uv) - 0.5);
    
    float baseRotationSpeed  = (1./3.) * uTime / float(kIterations);
    float largeRotationSpeed =           baseRotationSpeed + radians(180. * checker);
    float smallRotationSpeed = (5./3.) * baseRotationSpeed + radians(180. * checker);
    
    float swell = 0.4 * cos(5./3. * baseRotationSpeed) * (checker-0.5);
    float largeFlower = makeLargePetal(uv, 0. + largeRotationSpeed, swell);
    float smallFlower = makeSmallPetal(uv, 0. - smallRotationSpeed, swell);
    float hugeFlower = makeLargePetal(uv2, 0. + baseRotationSpeed, 0.);
    for (int i = 1; i < numPetals; i++) {
        float theta = radians(float(i) * (360. / float(numPetals)));
        largeFlower = min(largeFlower, 
                          makeLargePetal(uv, theta + largeRotationSpeed, swell));
        smallFlower = min(smallFlower, 
                          makeSmallPetal(uv, theta - smallRotationSpeed, swell));
        hugeFlower = min(hugeFlower, 
                         makeLargePetal(uv2, theta + baseRotationSpeed, 0.));
    }
    float largeFlowerStep = smoothstep(-0.02, 0.02, largeFlower);
    float smallFlowerStep = smoothstep(-0.06, 0.06, smallFlower);
    
    float axes = step(0.99, 1. - abs(uv.x));
    
    float largeRadius = largePetalOffset + largePetalHe + largePetalRadius1 + 0.02;
    float smallRadius = smallPetalOffset + 0.5 + 0.2 + 0.02;
    
    vec4 red    = vec4(0.7, 0.1, 0.4, 1.);
    vec4 orange = vec4(0.9, 0.4, 0.3, 1.);
    vec4 yellow = vec4(0.9, 0.9, 0.1, 1.);
    vec4 green  = vec4(0.1, 0.7, 0.4, 1.);
    vec4 blue   = vec4(0.3, 0.1, 0.9, 1.);
    vec4 purple = vec4(0.5, 0.2, 0.7, 1.);
    
    
    
    vec4 smallColor1 = checker < 0.5 ? uFlagColors[0]              : uFlagColors[4 % colorCount];
    vec4 smallColor2 = checker < 0.5 ? uFlagColors[1 % colorCount] : uFlagColors[5 % colorCount];
    vec4 largeColor1 = checker < 0.5 ? uFlagColors[2 % colorCount] : uFlagColors[6 % colorCount];
    vec4 largeColor2 = checker < 0.5 ? uFlagColors[3 % colorCount] : uFlagColors[7 % colorCount];
    
    
    vec4 largeFlowerBlend = mix(largeColor2, largeColor1, 3. * abs(largeFlower));
    vec4 smallFlowerBlend = mix(smallColor2, smallColor1, 4. * abs(smallFlower));
    float mask = 1. - abs(hugeFlower);
    vec4 hugeFlowerBlend  = mix(vec4(0.1, 0.3, -0.4, 1.), vec4(1., 0., 0., 1.), 0.5*sin(30.*mask) + 0.5);
    vec4 tiling = mix(
                      (1. - largeFlowerStep) * largeFlowerBlend, 
                      (1. - smallFlowerStep) * smallFlowerBlend, 
                       1. - smallFlowerStep
                  );
    vec4 ghost = vec4(vec3(.8 - abs(hugeFlower)), 1.) * hugeFlowerBlend;

    tiling = oklabToSRGB(tiling);
    ghost = oklabToSRGB(ghost);
    ghost *= length(uv2) < 0.3 ? length(uv2) / 0.3 : 1.;
    
    fragColor = tiling + ghost;
    // fragColor = tiling.x + tiling.y + tiling.z >= 1.5 ? 2.*ghost*tiling : 1. - 2.*(1.-ghost)*(1.-tiling);
    // (1. - 2.*tiling) * ghost*ghost + 2.*ghost*tiling;
    //((tiling.x + tiling.y + tiling.z) >= 1.5 ? 2.*ghost*tiling : 1. - 2.*(1.-ghost)*(1.-tiling));
} 