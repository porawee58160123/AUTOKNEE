/**
 * Application launcher.
 */

// start app function
function startApp() {
    // gui setup
    atk.gui.setup();

    // main application
    var myapp = new atk.App();
    // initialise the application
    myapp.init({
        "containerDivId": "atk",
        "fitToWindow": true,
        "gui": ["tool", "load", "help", "undo", "version", "tags", "drawList"],   
		// Edited 130518
		"loaders": ["File"],
        "tools": ["WindowLevel", "ZoomAndPan", "Draw", "Filter"],
        "filters": ["Threshold", "Sobel"],
        "shapes": ["Arrow", "Ruler", "Protractor", "Rectangle", "Roi", "Ellipse", "FreeHand"],
        "isMobile": false
    });

    // help
    // TODO Seems accordion only works when at end...
    $("#accordion").accordion({ collapsible: "true", active: "false", heightStyle: "content" });
}

// Image decoders (for web workers)
atk.image.decoderScripts = {
    "jpeg2000": "../../ext/pdfjs/decode-jpeg2000.js",
    "jpeg-lossless": "../../ext/rii-mango/decode-jpegloss.js",
    "jpeg-baseline": "../../ext/pdfjs/decode-jpegbaseline.js"
};

// check browser support
atk.browser.check();
// initialise i18n
atk.i18nInitialise();

// status flags
var domContentLoaded = false;
var i18nLoaded = false;
// launch when both DOM and i18n are ready
function launchApp() {
    if ( domContentLoaded && i18nLoaded ) {
        startApp();
    }
}
// DOM ready?
$(document).ready( function() {
    domContentLoaded = true;
    launchApp();
});
// i18n ready?
atk.i18nOnLoaded( function () {
    i18nLoaded = true;
    launchApp();
});
