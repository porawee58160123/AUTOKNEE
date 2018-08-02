// namespaces
var atk = atk || {};
/** @namespace */
atk.gui = atk.gui || {};
/** @namespace */
atk.gui.base = atk.gui.base || {};
/** @namespace */
atk.gui.filter = atk.gui.filter || {};
/** @namespace */
atk.gui.filter.base = atk.gui.filter.base || {};

/**
 * Filter tool base gui.
 * @constructor
 */
atk.gui.base.Filter = function (app)
{
    /**
     * Setup the filter tool HTML.
     */
    this.setup = function (list)
    {
        // filter select
        var filterSelector = atk.html.createHtmlSelect("filterSelect", list, "filter");
        filterSelector.onchange = app.onChangeFilter;

        // filter list element
        var filterLi = atk.html.createHiddenElement("li", "filterLi");
        filterLi.className += " ui-block-b";
        filterLi.appendChild(filterSelector);

        // append element
        var node = app.getElement("toolList").getElementsByTagName("ul")[0];
        atk.html.appendElement(node, filterLi);
    };

    /**
     * Display the tool HTML.
     * @param {Boolean} flag True to display, false to hide.
     */
    this.display = function (flag)
    {
        var node = app.getElement("filterLi");
        atk.html.displayElement(node, flag);
    };

    /**
     * Initialise the tool HTML.
     */
    this.initialise = function ()
    {
        // filter select: reset selected options
        var filterSelector = app.getElement("filterSelect");
        filterSelector.selectedIndex = 0;
        // refresh
        atk.gui.refreshElement(filterSelector);
    };

}; // class atk.gui.base.Filter

/**
 * Threshold filter base gui.
 * @constructor
 */
atk.gui.base.Threshold = function (app)
{
    /**
     * Threshold slider.
     * @private
     * @type Object
     */
    var slider = new atk.gui.Slider(app);

    /**
     * Setup the threshold filter HTML.
     */
    this.setup = function ()
    {
        // threshold list element
        var thresholdLi = atk.html.createHiddenElement("li", "thresholdLi");
        thresholdLi.className += " ui-block-c";

        // node
        var node = app.getElement("toolList").getElementsByTagName("ul")[0];
        // append threshold
        node.appendChild(thresholdLi);
        // threshold slider
        slider.append();
        // refresh
        atk.gui.refreshElement(node);
    };

    /**
     * Clear the threshold filter HTML.
     * @param {Boolean} flag True to display, false to hide.
     */
    this.display = function (flag)
    {
        // only initialise at display time
        // (avoids min/max calculation at startup)
        if (flag) {
            slider.initialise();
        }
        
        var node = app.getElement("thresholdLi");
        atk.html.displayElement(node, flag);
    };

    /**
     * Initialise the threshold filter HTML.
     */
    this.initialise = function ()
    {
        // nothing to do
    };

}; // class atk.gui.base.Threshold

/**
 * Create the apply filter button.
 */
atk.gui.filter.base.createFilterApplyButton = function (app)
{
    var button = document.createElement("button");
    button.id = "runFilterButton";
    button.onclick = app.onRunFilter;
    button.setAttribute("style","width:100%; margin-top:0.5em;");
    button.setAttribute("class","ui-btn ui-btn-b");
    button.appendChild(document.createTextNode(atk.i18n("basics.apply")));
    return button;
};

/**
 * Sharpen filter base gui.
 * @constructor
 */
atk.gui.base.Sharpen = function (app)
{
    /**
     * Setup the sharpen filter HTML.
     */
    this.setup = function ()
    {
        // sharpen list element
        var sharpenLi = atk.html.createHiddenElement("li", "sharpenLi");
        sharpenLi.className += " ui-block-c";
        sharpenLi.appendChild( atk.gui.filter.base.createFilterApplyButton(app) );
        // append element
        var node = app.getElement("toolList").getElementsByTagName("ul")[0];
        atk.html.appendElement(node, sharpenLi);
    };

    /**
     * Display the sharpen filter HTML.
     * @param {Boolean} flag True to display, false to hide.
     */
    this.display = function (flag)
    {
        var node = app.getElement("sharpenLi");
        atk.html.displayElement(node, flag);
    };

}; // class atk.gui.base.Sharpen

/**
 * Sobel filter base gui.
 * @constructor
 */
atk.gui.base.Sobel = function (app)
{
    /**
     * Setup the sobel filter HTML.
     */
    this.setup = function ()
    {
        // sobel list element
        var sobelLi = atk.html.createHiddenElement("li", "sobelLi");
        sobelLi.className += " ui-block-c";
        sobelLi.appendChild( atk.gui.filter.base.createFilterApplyButton(app) );
        // append element
        var node = app.getElement("toolList").getElementsByTagName("ul")[0];
        atk.html.appendElement(node, sobelLi);
    };

    /**
     * Display the sobel filter HTML.
     * @param {Boolean} flag True to display, false to hide.
     */
    this.display = function (flag)
    {
        var node = app.getElement("sobelLi");
        atk.html.displayElement(node, flag);
    };

}; // class atk.gui.base.Sobel
