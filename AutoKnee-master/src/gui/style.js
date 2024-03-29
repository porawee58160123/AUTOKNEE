// namespaces
var atk = atk || {};
atk.html = atk.html || {};

/**
 * Style class.
 * @constructor
 */
atk.html.Style = function ()
{
    /**
     * Font size.
     * @private
     * @type Number
     */
    var fontSize = 12;
    /**
     * Font family.
     * @private
     * @type String
     */
    var fontFamily = "Verdana";
    /**
     * Text colour.
     * @private
     * @type String
     */
    var textColour = "#fff";
    /**
     * Line colour.
     * @private
     * @type String
     */
    var lineColour = "#ffff80";
    /**
     * Display scale.
     * @private
     * @type Number
     */
    var displayScale = 1;
    /**
     * Stroke width.
     * @private
     * @type Number
     */
    var strokeWidth = 2;

    /**
     * Get the font family.
     * @return {String} The font family.
     */
    this.getFontFamily = function () { return fontFamily; };

    /**
     * Get the font size.
     * @return {Number} The font size.
     */
    this.getFontSize = function () { return fontSize; };

    /**
     * Get the stroke width.
     * @return {Number} The stroke width.
     */
    this.getStrokeWidth = function () { return strokeWidth; };

    /**
     * Get the text colour.
     * @return {String} The text colour.
     */
    this.getTextColour = function () { return textColour; };

    /**
     * Get the line colour.
     * @return {String} The line colour.
     */
    this.getLineColour = function () { return lineColour; };

    /**
     * Set the line colour.
     * @param {String} colour The line colour.
     */
    this.setLineColour = function (colour) { lineColour = colour; };

    /**
     * Set the display scale.
     * @param {String} scale The display scale.
     */
    this.setScale = function (scale) { displayScale = scale; };

    /**
     * Scale an input value.
     * @param {Number} value The value to scale.
     */
    this.scale = function (value) { return value / displayScale; };
};

/**
 * Get the font definition string.
 * @return {String} The font definition string.
 */
atk.html.Style.prototype.getFontStr = function ()
{
    return ("normal " + this.getFontSize() + "px sans-serif");
};

/**
 * Get the line height.
 * @return {Number} The line height.
 */
atk.html.Style.prototype.getLineHeight = function ()
{
    return ( this.getFontSize() + this.getFontSize() / 5 );
};

/**
 * Get the font size scaled to the display.
 * @return {Number} The scaled font size.
 */
atk.html.Style.prototype.getScaledFontSize = function ()
{
    return this.scale( this.getFontSize() );
};

/**
 * Get the stroke width scaled to the display.
 * @return {Number} The scaled stroke width.
 */
atk.html.Style.prototype.getScaledStrokeWidth = function ()
{
    return this.scale( this.getStrokeWidth() );
};
