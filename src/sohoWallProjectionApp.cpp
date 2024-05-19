#include "cinder/app/App.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"
#include "cinder/Camera.h"
#include "cinder/Easing.h"
#include "cinder/ImageIo.h"

#include "Resources.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class sohoWallProjectionApp : public App {
public:
    static void prepareSettings( Settings *settings );

    void setup() override;
    void draw() override;

    gl::GlslProgRef mGlsl;
    const string message = "meow";

};

void sohoWallProjectionApp::prepareSettings( Settings *settings )
{
    settings->setWindowSize( 1024, 768 );
    settings->disableFrameRate();
    settings->setFullScreen( false );
}

void sohoWallProjectionApp::setup()
{
    //! Load shader from the resources.
    mGlsl = gl::GlslProg::create( loadResource( RES_VERT_GLSL ), loadResource( RES_FRAG_GLSL ) );
}

void sohoWallProjectionApp::draw()
{
    //! Clear the window.
    gl::clear();
    gl::setMatricesWindow( getWindowSize() );

    //! Render the MandelBrot set by running the shader
    //! for every pixel in the window.
    gl::ScopedGlslProg glslScp( mGlsl );
    mGlsl->uniform("uResolution", vec2((float) getWindowWidth(), (float) getWindowHeight()));
    mGlsl->uniform("uTime", getElapsedFrames());
    gl::drawSolidRect( getWindowBounds() );
    
//    gl::drawString(message, vec2(10., 50.));
}

CINDER_APP( sohoWallProjectionApp, RendererGl( RendererGl::Options().msaa( 16 ) ), &sohoWallProjectionApp::prepareSettings )
