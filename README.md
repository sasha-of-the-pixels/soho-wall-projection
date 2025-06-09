## What is this?
A small app built with the Cinder creative coding library that displays a few of the shaders I've made, in pride colors. I would have used Shadertoy or something but I wanted to actually be able to switch between color palettes with the click of a button, and also add a textbox because why not. Currently there are just two shaders but whenever I feel like making another fun shader in my free time I will also try to pride-ify it.

I made the original version of the "flowie" shader on Shadertoy here: https://www.shadertoy.com/view/XclfRf 

![Screenshot of the first shader](https://github.com/Lumgol/soho-wall-projection/blob/main/app_screenshot.png?raw=true)

## Why the name?
"SoHo" is the nickname of the office of CMU's queer student organizations. As a tribute to the wonderful work by students to maintain and beautify the space, I originally created this app to be able to project these fun animations onto the walls and share little announcements and welcome messages.

## Installation
### Using a Release
The current Releases only work for ARM MacOS, sorry :(
### Building from source
1. Clone the repository
2. Also clone [Cinder](https://github.com/cinder/Cinder)
3. Build both using CMake (I'll assume that Cinder and SohoWallProjection are in the same parent folder):
```
cd cinder_master
mkdir build
cd build
cmake ..
make
cd ../../sohoWallProjection
mkdir build
cd build
cmake ..
make
```
4. Run the resulting executable, which will be found in `build/Debug/sohoWallProjection`. (If you don't have permission to run it, give yourself permission by running `sudo chmod +x [path to your executable]`.

## Controls
Press tab or shift+tab to switch between flags. Press left/right arrow keys to switch between shaders. Just type stuff in order to edit the message and move the textbox around by dragging.

## Future plans
- Figure out how to build the app for more platforms
- Add more flags and shaders!
- Maybe allow switching fonts
