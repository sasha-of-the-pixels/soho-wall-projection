#include "../include/utils.h"

vec4 *preprocessFlagColors(vec4 *cols) {
    vec4 *res = (vec4 *) calloc(maxColorCount, sizeof(vec4));
    res[0] = vec4(cols[0][0] / 255., cols[0][1]/255., cols[0][2] / 255., cols[0][3] / 255.);
    for (int i = 1; i < maxColorCount; i++) {
        res[i] = vec4(cols[i-1][0] / 255., cols[i-1][1]/255., cols[i-1][2] / 255., cols[i-1][3] / 255.);
        if (cols[i].x < 0) {
            res[i+1] = res[i];
            for (int j = i + 2; j < maxColorCount; j++) {
                res[j] = cols[j];
            }
            break;
        }
    }
    free(cols);
    return res;
}