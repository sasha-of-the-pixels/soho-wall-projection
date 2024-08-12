#include "cinder/app/App.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"
#include "cinder/Camera.h"
#include "cinder/Easing.h"
#include "cinder/ImageIo.h"

#include "Resources.h"
#include "utils.h"

using namespace ci;
using namespace ci::app;
using namespace std;

// const int maxColorCount = 10;

class sohoWallProjectionApp : public App {
public:
    static void prepareSettings( Settings *settings );

    void setup() override;
    void draw() override;
    void mouseDrag(MouseEvent event) override;
    void keyDown( KeyEvent event ) override;
    void render();

    gl::GlslProgRef mGlsl;
    string message;
    gl::TextureRef mTextTexture;
    vec2 mSize;
    ivec2 mPadding = ivec2(1, 1);
    vec2 mOffset;
    Font mFont;

    vec4 *mFlagColors = (vec4*) calloc(maxColorCount, sizeof(vec4));
    int mColorCount = maxColorCount;
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
    
    mFont = Font( loadResource(JACQUARDA_BASTARDA_9), 54 );
    mOffset = vec2(20., -20.);
    message = "Welcome to SoHo!";

    vec4 classicRainbow[maxColorCount] = {
        vec4(228., 1., 4., 255.),
        vec4(255., 140., 0., 255.),
        vec4(255., 237., 0., 255.),
        vec4(0., 129., 39., 255.),
        vec4(0., 77., 254., 255.),
        vec4(117., 8., 135., 255.),
        vec4(-1., 0., 0., 0.),
        vec4(-1., 0., 0., 0.),
        vec4(-1., 0., 0., 0.),
        vec4(-1., 0., 0., 0.)
    };
    vec4 lesbianFlag[maxColorCount] = {
        vec4(214., 41., 0., 255.),
        vec4(255., 155., 85., 255.),
        // vec4(255., 255., 255., 255.),
        vec4(212., 98., 166., 255.),
        vec4(165., 0., 98., 255.),
        vec4(-1., 0., 0., 0.),
        vec4(-1., 0., 0., 0.),
        vec4(-1., 0., 0., 0.),
        vec4(-1., 0., 0., 0.),
        vec4(-1., 0., 0., 0.)
    };
    for(int i = 0; i < maxColorCount; i++) {
        mFlagColors[i] = lesbianFlag[i];
    }
    mFlagColors = preprocessFlagColors(mFlagColors);
    mColorCount = 4;

    render();
}

void sohoWallProjectionApp::keyDown( KeyEvent event )
{
    if ((event.getCode() == KeyEvent::KEY_BACKSPACE || event.getCode() == KeyEvent::KEY_DELETE) && message.length() > 0) {
        
        message.pop_back();
        render();
        return;
    }
    
    if( event.getCharUtf32() ) {
        std::string str( 1, event.getCharUtf32() );
        
        message += str;
        render();
    }
}

void sohoWallProjectionApp::mouseDrag( MouseEvent event )
{
    mOffset = vec2(event.getPos().x, -event.getPos().y);
    render();
}

void sohoWallProjectionApp::render()
{
    TextBox tbox = TextBox().alignment( TextBox::LEFT ).font(mFont).size( getWindowSize() - ivec2(20, 20) ).text( message );
    tbox.setColor( Color( 1., 1., 1. ) );
    mTextTexture = gl::Texture2d::create( tbox.render(mOffset) );
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
    mGlsl->uniform("colorCount", mColorCount+2);
    mGlsl->uniform("uFlagColors", mFlagColors, maxColorCount);
    gl::drawSolidRect( getWindowBounds() );
    
    if( mTextTexture )
            gl::draw( mTextTexture );
}

CINDER_APP( sohoWallProjectionApp, RendererGl( RendererGl::Options().msaa( 16 ) ), &sohoWallProjectionApp::prepareSettings )
