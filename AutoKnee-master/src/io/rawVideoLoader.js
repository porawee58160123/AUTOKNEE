// namespaces
var atk = atk || {};
atk.io = atk.io || {};

/**
 * Raw video loader.
 * url example (cors enabled):
 *   https://raw.githubusercontent.com/clappr/clappr/master/test/fixtures/SampleVideo_360x240_1mb.mp4
 */
atk.io.RawVideoLoader = function ()
{
    // closure to self
    var self = this;

    /**
     * Set the loader options.
     * @param {Object} opt The input options.
     */
    this.setOptions = function () {
        // does nothing
    };

    /**
     * Create a Data URI from an HTTP request response.
     * @param {Object} response The HTTP request response.
     * @param {String} dataType The data type.
     */
    function createDataUri(response, dataType) {
        // image data as string
        var bytes = new Uint8Array(response);
        var videoDataStr = '';
        for( var i = 0; i < bytes.byteLength; ++i ) {
            videoDataStr += String.fromCharCode(bytes[i]);
        }
        // create uri
        var uri = "data:video/" + dataType + ";base64," + window.btoa(videoDataStr);
        return uri;
    }

    /**
     * Internal Data URI load.
     * @param {Object} dataUri The data URI.
     * @param {String} origin The data origin.
     * @param {Number} index The data index.
     */
    this.load = function ( dataUri, origin, index ) {
        // create a DOM video
        var video = document.createElement('video');
        video.src = dataUri;
        // storing values to pass them on
        video.file = origin;
        video.index = index;
        // onload handler
        video.onloadedmetadata = function (/*event*/) {
            try {
                atk.image.getViewFromDOMVideo(this,
                    self.onload, self.onprogress, self.onloadend, index);
            } catch (error) {
                self.onerror(error);
            }
        };
    };

    /**
     * Get a file load handler.
     * @param {Object} file The file to load.
     * @param {Number} index The index 'id' of the file.
     * @return {Function} A file load handler.
     */
    this.getFileLoadHandler = function (file, index) {
        return function (event) {
            self.load(event.target.result, file, index);
        };
    };

    /**
     * Get a url load handler.
     * @param {String} url The url to load.
     * @param {Number} index The index 'id' of the url.
     * @return {Function} A url load handler.
     */
    this.getUrlLoadHandler = function (url, index) {
        return function (/*event*/) {
            // check response status
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Response_codes
            // status 200: "OK"; status 0: "debug"
            if (this.status !== 200 && this.status !== 0) {
                self.onerror({'name': "RequestError",
                    'message': "Error status: " + this.status +
                    " while loading '" + url + "' [RawVideoLoader]" });
                return;
            }
            // load
            var ext = url.split('.').pop().toLowerCase();
            self.load(createDataUri(this.response, ext), url, index);
        };
    };

    /**
     * Get an error handler.
     * @param {String} origin The file.name/url at the origin of the error.
     * @return {Function} An error handler.
     */
    this.getErrorHandler = function (origin) {
        return function (event) {
            var message = "";
            if (typeof event.getMessage !== "undefined") {
                message = event.getMessage();
            } else if (typeof this.status !== "undefined") {
                message = "http status: " + this.status;
            }
            self.onerror( {'name': "RequestError",
                'message': "An error occurred while reading '" + origin +
                "' (" + message + ") [RawVideoLoader]" } );
        };
    };

}; // class RawVideoLoader

/**
 * Check if the loader can load the provided file.
 * @param {Object} file The file to check.
 * @return True if the file can be loaded.
 */
atk.io.RawVideoLoader.prototype.canLoadFile = function (file) {
    return file.type.match("video.*");
};

/**
 * Check if the loader can load the provided url.
 * @param {String} url The url to check.
 * @return True if the url can be loaded.
 */
atk.io.RawVideoLoader.prototype.canLoadUrl = function (url) {
    var ext = url.split('.').pop().toLowerCase();
    return (ext === "mp4") || (ext === "ogg") ||
            (ext === "webm");
};

/**
 * Get the file content type needed by the loader.
 * @return One of the 'atk.io.fileContentTypes'.
 */
atk.io.RawVideoLoader.prototype.loadFileAs = function () {
    return atk.io.fileContentTypes.DataURL;
};

/**
 * Get the url content type needed by the loader.
 * @return One of the 'atk.io.urlContentTypes'.
 */
atk.io.RawVideoLoader.prototype.loadUrlAs = function () {
    return atk.io.urlContentTypes.ArrayBuffer;
};

/**
 * Handle a load event.
 * @param {Object} event The load event, 'event.target'
 *  should be the loaded data.
 * Default does nothing.
 */
atk.io.RawVideoLoader.prototype.onload = function (/*event*/) {};
/**
 * Handle an load end event.
 * Default does nothing.
 */
atk.io.RawVideoLoader.prototype.onloadend = function () {};
/**
 * Handle an error event.
 * @param {Object} event The error event, 'event.message'
 *  should be the error message.
 * Default does nothing.
 */
atk.io.RawVideoLoader.prototype.onerror = function (/*event*/) {};
/**
 * Handle a progress event.
 * @param {Object} event The progress event.
 * Default does nothing.
 */
atk.io.RawVideoLoader.prototype.onprogress = function (/*event*/) {};

/**
 * Add to Loader list.
 */
atk.io.loaderList = atk.io.loaderList || [];
atk.io.loaderList.push( "RawVideoLoader" );
