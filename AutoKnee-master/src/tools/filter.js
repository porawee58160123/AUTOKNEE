// namespaces
var atk = atk || {};
atk.tool = atk.tool || {};
/** @namespace */
atk.tool.filter = atk.tool.filter || {};

/**
 * Filter tool.
 * @constructor
 * @param {Array} filterList The list of filter objects.
 * @param {Object} app The associated app.
 */
atk.tool.Filter = function ( filterList, app )
{
    /**
     * Filter GUI.
     * @type Object
     */
    var gui = null;
    /**
     * Filter list
     * @type Object
     */
    this.filterList = filterList;
    /**
     * Selected filter.
     * @type Object
     */
    this.selectedFilter = 0;
    /**
     * Default filter name.
     * @type String
     */
    this.defaultFilterName = 0;
    /**
     * Display Flag.
     * @type Boolean
     */
    this.displayed = false;

    /**
     * Setup the filter GUI.
     */
    this.setup = function ()
    {
        if ( Object.keys(this.filterList).length !== 0 ) {
            gui = new atk.gui.Filter(app);
            gui.setup(this.filterList);
            for( var key in this.filterList ){
                this.filterList[key].setup();
            }
        }
    };

    /**
     * Enable the filter.
     * @param {Boolean} bool Flag to enable or not.
     */
    this.display = function (bool)
    {
        if ( gui ) {
            gui.display(bool);
        }
        this.displayed = bool;
        // display the selected filter
        this.selectedFilter.display(bool);
    };

    /**
     * Initialise the filter.
     */
    this.init = function ()
    {
        // set the default to the first in the list
        for( var key in this.filterList ){
            this.defaultFilterName = key;
            break;
        }
        this.setSelectedFilter(this.defaultFilterName);
        // init all filters
        for( key in this.filterList ) {
            this.filterList[key].init();
        }
        // init html
        if ( gui ) {
            gui.initialise();
        }
        return true;
    };

    /**
     * Handle keydown event.
     * @param {Object} event The keydown event.
     */
    this.keydown = function (event)
    {
        app.onKeydown(event);
    };

}; // class atk.tool.Filter

/**
 * Help for this tool.
 * @return {Object} The help content.
 */
atk.tool.Filter.prototype.getHelp = function ()
{
    return {
        "title": atk.i18n("tool.Filter.name"),
        "brief": atk.i18n("tool.Filter.brief")
    };
};

/**
 * Get the selected filter.
 * @return {Object} The selected filter.
 */
atk.tool.Filter.prototype.getSelectedFilter = function ()
{
    return this.selectedFilter;
};

/**
 * Set the selected filter.
 * @return {String} The name of the filter to select.
 */
atk.tool.Filter.prototype.setSelectedFilter = function (name)
{
    // check if we have it
    if( !this.hasFilter(name) )
    {
        throw new Error("Unknown filter: '" + name + "'");
    }
    // hide last selected
    if( this.displayed )
    {
        this.selectedFilter.display(false);
    }
    // enable new one
    this.selectedFilter = this.filterList[name];
    // display the selected filter
    if( this.displayed )
    {
        this.selectedFilter.display(true);
    }
};

/**
 * Get the list of filters.
 * @return {Array} The list of filter objects.
 */
atk.tool.Filter.prototype.getFilterList = function ()
{
    return this.filterList;
};

/**
 * Check if a filter is in the filter list.
 * @param {String} name The name to check.
 * @return {String} The filter list element for the given name.
 */
atk.tool.Filter.prototype.hasFilter = function (name)
{
    return this.filterList[name];
};

/**
 * Threshold filter tool.
 * @constructor
 * @param {Object} app The associated application.
 */
atk.tool.filter.Threshold = function ( app )
{
    /**
     * Filter GUI.
     * @type Object
     */
    var gui = new atk.gui.Threshold(app);

    /**
     * Setup the filter GUI.
     */
    this.setup = function ()
    {
        gui.setup();
    };

    /**
     * Display the filter.
     * @param {Boolean} bool Flag to display or not.
     */
    this.display = function (bool)
    {
        gui.display(bool);
    };

    /**
     * Initialise the filter.
     */
    this.init = function ()
    {
        gui.initialise();
    };

    /**
     * Run the filter.
     * @param {Mixed} args The filter arguments.
     */
    this.run = function (args)
    {
        var filter = new atk.image.filter.Threshold();
        filter.setMin(args.min);
        filter.setMax(args.max);
        var command = new atk.tool.RunFilterCommand(filter, app);
        command.execute();
        // save command in undo stack
        app.addToUndoStack(command);
    };

}; // class atk.tool.filter.Threshold


/**
 * Sharpen filter tool.
 * @constructor
 * @param {Object} app The associated application.
 */
atk.tool.filter.Sharpen = function ( app )
{
    /**
     * Filter GUI.
     * @type Object
     */
    var gui = new atk.gui.Sharpen(app);

    /**
     * Setup the filter GUI.
     */
    this.setup = function ()
    {
        gui.setup();
    };

    /**
     * Display the filter.
     * @param {Boolean} bool Flag to enable or not.
     */
    this.display = function (bool)
    {
        gui.display(bool);
    };

    /**
     * Initialise the filter.
     */
    this.init = function()
    {
        // nothing to do...
    };

    /**
     * Run the filter.
     * @param {Mixed} args The filter arguments.
     */
    this.run = function(/*args*/)
    {
        var filter = new atk.image.filter.Sharpen();
        var command = new atk.tool.RunFilterCommand(filter, app);
        command.execute();
        // save command in undo stack
        app.addToUndoStack(command);
    };

}; // atk.tool.filter.Sharpen

/**
 * Sobel filter tool.
 * @constructor
 * @param {Object} app The associated application.
 */
atk.tool.filter.Sobel = function ( app )
{
    /**
     * Filter GUI.
     * @type Object
     */
    var gui = new atk.gui.Sobel(app);

    /**
     * Setup the filter GUI.
     */
    this.setup = function ()
    {
        gui.setup();
    };

    /**
     * Enable the filter.
     * @param {Boolean} bool Flag to enable or not.
     */
    this.display = function(bool)
    {
        gui.display(bool);
    };

    /**
     * Initialise the filter.
     */
    this.init = function()
    {
        // nothing to do...
    };

    /**
     * Run the filter.
     * @param {Mixed} args The filter arguments.
     */
    atk.tool.filter.Sobel.prototype.run = function(/*args*/)
    {
        var filter = new atk.image.filter.Sobel();
        var command = new atk.tool.RunFilterCommand(filter, app);
        command.execute();
        // save command in undo stack
        app.addToUndoStack(command);
    };

}; // class atk.tool.filter.Sobel

/**
 * Run filter command.
 * @constructor
 * @param {Object} filter The filter to run.
 * @param {Object} app The associated application.
 */
atk.tool.RunFilterCommand = function (filter, app) {

    /**
     * Get the command name.
     * @return {String} The command name.
     */
    this.getName = function () { return "Filter-" + filter.getName(); };

    /**
     * Execute the command.
     */
    this.execute = function ()
    {
        filter.setOriginalImage(app.getImage());
        app.setImage(filter.update());
        app.render();
    };
    /**
     * Undo the command.
     */
    this.undo = function () {
        app.setImage(filter.getOriginalImage());
        app.render();
    };

}; // RunFilterCommand class
