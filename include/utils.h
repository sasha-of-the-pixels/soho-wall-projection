#include <cinder/gl/gl.h>

using namespace ci;

const int maxColorCount = 10;

std::vector<vec4> preprocessFlagColors (std::vector<vec4> cols, int colorCount, uint shaderIdx);
