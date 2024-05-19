#version 150

uniform mat4 ciModelViewProjection;

in vec4 ciPosition;
in vec2 ciTexCoord0;

out vec2 pos;

void main()
{
    // Simply pass the texture coordinate and the position.
    pos = ciTexCoord0;
    gl_Position = ciModelViewProjection * ciPosition;
}
