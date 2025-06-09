cmake_minimum_required( VERSION 3.5 FATAL_ERROR )
set( CMAKE_VERBOSE_MAKEFILE ON )

project( sohoWallProjection )

get_filename_component( CINDER_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../cinder_master/" ABSOLUTE )
get_filename_component( APP_PATH "${CMAKE_CURRENT_SOURCE_DIR}" ABSOLUTE )

include( "${CINDER_PATH}/proj/cmake/modules/cinderMakeApp.cmake" )


ci_make_app(
    APP_NAME    "sohoWallProjection"
    CINDER_PATH ${CINDER_PATH}
    SOURCES     ${APP_PATH}/src/sohoWallProjectionApp.cpp ${APP_PATH}/src/utils.cpp 
    INCLUDES    ${APP_PATH}/include
    RESOURCES   ${APP_PATH}/resources/vert_shader.vert ${APP_PATH}/resources/sum_of_sines.frag ${APP_PATH}/resources/flowie.frag ${APP_PATH}/resources/yoster.ttf
)

include(CPack)
