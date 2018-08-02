/**
 * Application launcher.
 */

// start app function
function startApp() {
    // translate page
    atk.i18nPage();

    // main application
    var myapp = new atk.App();

    // display loading time
    var listener = function (event) {
        if (event.type === "load-start") {
            console.time("load-data");
        }
        else {
            console.timeEnd("load-data");
        }
    };
    // before myapp.init since it does the url load
    myapp.addEventListener("load-start", listener);
    myapp.addEventListener("load-end", listener);

    // also available:
    //myapp.addEventListener("load-progress", listener);
    //myapp.addEventListener("draw-create", listener);
    //myapp.addEventListener("draw-move", listener);
    //myapp.addEventListener("draw-change", listener);
    //myapp.addEventListener("draw-delete", listener);
    //myapp.addEventListener("wl-change", listener);
    //myapp.addEventListener("colour-change", listener);
    //myapp.addEventListener("position-change", listener);
    //myapp.addEventListener("slice-change", listener);

    // initialise the application
    myapp.init({
        "containerDivId": "atk",
        "fitToWindow": true,
        "gui": ["tool", "load", "help", "undo", "version", "tags", "drawList"],
		"gui": ["tool", "load", "undo", "version", "tags", "drawList"],
        "loaders": ["File", "Url", "GoogleDrive", "Dropbox"],
        "tools": ["Scroll", "WindowLevel", "ZoomAndPan", "Draw", "Livewire", "Filter", "Floodfill"],
        "filters": ["Threshold", "Sharpen", "Sobel"],
        "shapes": ["Arrow", "Ruler", "Protractor", "Rectangle", "Roi", "Ellipse", "FreeHand"],
        "isMobile": true
        //"defaultCharacterSet": "chinese"
    });

    var size = atk.gui.getWindowSize();
    $(".layerContainer").height(size.height);
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
