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
    void mouseDrag(MouseEvent event) override;
    void render();

    gl::GlslProgRef mGlsl;
    const string message = "Welcome to SoHo!";
    gl::TextureRef mTextTexture;
    vec2 mSize;
    vec2 mPadding = vec2(-1., 1.);
    Font mFont;

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
    
    mFont = Font( loadResource(SNIPPLETWEAK), 54 );
    
    render();
}

void sohoWallProjectionApp::mouseDrag( MouseEvent event )
{
    mPadding = vec2(event.getPos().x, -event.getPos().y);
    render();
}

void sohoWallProjectionApp::render()
{
    TextBox tbox = TextBox().alignment( TextBox::CENTER ).font(mFont).size( ivec2( getWindowWidth(), getWindowHeight() )).text( message );
    tbox.setColor( Color( 1., 1., 1. ) );
    mTextTexture = gl::Texture2d::create( tbox.render(mPadding) );
}

void sohoWallProjectionApp::draw()
{
    //! Clear the window.
    gl::clear();
    gl::setMatricesWindow( getWindowSize() );

    //! Render the gay by running the shader
    //! for every pixel in the window.
    gl::ScopedGlslProg glslScp( mGlsl );
    mGlsl->uniform("uResolution", vec2((float) getWindowWidth(), (float) getWindowHeight()));
    mGlsl->uniform("uTime", getElapsedFrames());
    gl::drawSolidRect( getWindowBounds() );
    
    if( mTextTexture )
            gl::draw( mTextTexture );
}

CINDER_APP( sohoWallProjectionApp, RendererGl( RendererGl::Options().msaa( 16 ) ), &sohoWallProjectionApp::prepareSettings )
