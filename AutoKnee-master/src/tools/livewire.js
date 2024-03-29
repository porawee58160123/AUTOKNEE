// namespaces
var atk = atk || {};
atk.tool = atk.tool || {};

/**
 * Livewire painting tool.
 * @constructor
 * @param {Object} app The associated application.
 */
atk.tool.Livewire = function(app)
{
    /**
     * Closure to self: to be used by event handlers.
     * @private
     * @type WindowLevel
     */
    var self = this;
    /**
     * Livewire GUI.
     * @type Object
     */
    var gui = null;
    /**
     * Interaction start flag.
     * @type Boolean
     */
    this.started = false;

    /**
     * Draw command.
     * @private
     * @type Object
     */
    var command = null;
    /**
     * Current shape group.
     * @private
     * @type Object
     */
    var shapeGroup = null;
    /**
     * Drawing style.
     * @type Style
     */
    this.style = new atk.html.Style();
    // init with the app window scale
    this.style.setScale(app.getWindowScale());

    /**
     * Path storage. Paths are stored in reverse order.
     * @private
     * @type Path
     */
    var path = new atk.math.Path();
    /**
     * Current path storage. Paths are stored in reverse order.
     * @private
     * @type Path
     */
    var currentPath = new atk.math.Path();
    /**
     * List of parent points.
     * @private
     * @type Array
     */
    var parentPoints = [];
    /**
     * Tolerance.
     * @private
     * @type Number
     */
    var tolerance = 5;

    /**
     * Event listeners.
     * @private
     */
    var listeners = [];

    /**
     * Clear the parent points list.
     * @private
     */
    function clearParentPoints() {
        var nrows = app.getImage().getGeometry().getSize().getNumberOfRows();
        for( var i = 0; i < nrows; ++i ) {
            parentPoints[i] = [];
        }
    }

    /**
     * Clear the stored paths.
     * @private
     */
    function clearPaths() {
        path = new atk.math.Path();
        currentPath = new atk.math.Path();
    }

    /**
     * Scissor representation.
     * @private
     * @type Scissors
     */
    var scissors = new atk.math.Scissors();

    /**
     * Handle mouse down event.
     * @param {Object} event The mouse down event.
     */
    this.mousedown = function(event){
        // first time
        if( !self.started ) {
            self.started = true;
            self.x0 = event._x;
            self.y0 = event._y;
            // clear vars
            clearPaths();
            clearParentPoints();
            // do the training from the first point
            var p = new atk.math.FastPoint2D(event._x, event._y);
            scissors.doTraining(p);
            // add the initial point to the path
            var p0 = new atk.math.Point2D(event._x, event._y);
            path.addPoint(p0);
            path.addControlPoint(p0);
        }
        else {
            // final point: at 'tolerance' of the initial point
            if( (Math.abs(event._x - self.x0) < tolerance) && (Math.abs(event._y - self.y0) < tolerance) ) {
                // draw
                self.mousemove(event);
                // listen
                command.onExecute = fireEvent;
                command.onUndo = fireEvent;
                // debug
                console.log("Done.");
                // save command in undo stack
                app.addToUndoStack(command);
                // set flag
                self.started = false;
            }
            // anchor point
            else {
                path = currentPath;
                clearParentPoints();
                var pn = new atk.math.FastPoint2D(event._x, event._y);
                scissors.doTraining(pn);
                path.addControlPoint(currentPath.getPoint(0));
            }
        }
    };

    /**
     * Handle mouse move event.
     * @param {Object} event The mouse move event.
     */
    this.mousemove = function(event){
        if (!self.started)
        {
            return;
        }
        // set the point to find the path to
        var p = new atk.math.FastPoint2D(event._x, event._y);
        scissors.setPoint(p);
        // do the work
        var results = 0;
        var stop = false;
        while( !parentPoints[p.y][p.x] && !stop)
        {
            console.log("Getting ready...");
            results = scissors.doWork();

            if( results.length === 0 ) {
                stop = true;
            }
            else {
                // fill parents
                for( var i = 0; i < results.length-1; i+=2 ) {
                    var _p = results[i];
                    var _q = results[i+1];
                    parentPoints[_p.y][_p.x] = _q;
                }
            }
        }
        console.log("Ready!");

        // get the path
        currentPath = new atk.math.Path();
        stop = false;
        while (p && !stop) {
            currentPath.addPoint(new atk.math.Point2D(p.x, p.y));
            if(!parentPoints[p.y]) {
                stop = true;
            }
            else {
                if(!parentPoints[p.y][p.x]) {
                    stop = true;
                }
                else {
                    p = parentPoints[p.y][p.x];
                }
            }
        }
        currentPath.appenPath(path);

        // remove previous draw
        if ( shapeGroup ) {
            shapeGroup.destroy();
        }
        // create shape
        var factory = new atk.tool.RoiFactory();
        shapeGroup = factory.create(currentPath.pointArray, self.style);
        shapeGroup.id( atk.math.guid() );
        // draw shape command
        command = new atk.tool.DrawGroupCommand(shapeGroup, "livewire", app.getCurrentDrawLayer());
        // draw
        command.execute();
    };

    /**
     * Handle mouse up event.
     * @param {Object} event The mouse up event.
     */
    this.mouseup = function(/*event*/){
        // nothing to do
    };

    /**
     * Handle mouse out event.
     * @param {Object} event The mouse out event.
     */
    this.mouseout = function(event){
        // treat as mouse up
        self.mouseup(event);
    };

    /**
     * Handle double click event.
     * @param {Object} event The double click event.
     */
    this.dblclick = function(/*event*/){
        console.log("dblclick");
        // save command in undo stack
        app.addToUndoStack(command);
        // set flag
        self.started = false;
    };

    /**
     * Handle touch start event.
     * @param {Object} event The touch start event.
     */
    this.touchstart = function(event){
        // treat as mouse down
        self.mousedown(event);
    };

    /**
     * Handle touch move event.
     * @param {Object} event The touch move event.
     */
    this.touchmove = function(event){
        // treat as mouse move
        self.mousemove(event);
    };

    /**
     * Handle touch end event.
     * @param {Object} event The touch end event.
     */
    this.touchend = function(event){
        // treat as mouse up
        self.mouseup(event);
    };

    /**
     * Handle key down event.
     * @param {Object} event The key down event.
     */
    this.keydown = function(event){
        app.onKeydown(event);
    };

    /**
     * Setup the tool GUI.
     */
    this.setup = function ()
    {
        gui = new atk.gui.ColourTool(app, "lw");
        gui.setup();
    };

    /**
     * Enable the tool.
     * @param {Boolean} bool The flag to enable or not.
     */
    this.display = function(bool){
        if ( gui ) {
            gui.display(bool);
        }
        // start scissors if displayed
        if (bool) {
            //scissors = new atk.math.Scissors();
            var size = app.getImage().getGeometry().getSize();
            scissors.setDimensions(
                    size.getNumberOfColumns(),
                    size.getNumberOfRows() );
            scissors.setData(app.getImageData().data);
        }
    };

    /**
     * Initialise the tool.
     */
    this.init = function()
    {
        if ( gui ) {
            // init with the app window scale
            this.style.setScale(app.getWindowScale());
            // set the default to the first in the list
            this.setLineColour(this.style.getLineColour());
            // init html
            gui.initialise();
        }

        return true;
    };

    /**
     * Add an event listener on the app.
     * @param {Object} listener The method associated with the provided event type.
     */
    this.addEventListener = function (listener)
    {
        listeners.push(listener);
    };

    /**
     * Remove an event listener from the app.
     * @param {Object} listener The method associated with the provided event type.
     */
    this.removeEventListener = function (listener)
    {
        for ( var i = 0; i < listeners.length; ++i )
        {
            if ( listeners[i] === listener ) {
                listeners.splice(i,1);
            }
        }
    };

    // Private Methods -----------------------------------------------------------

    /**
     * Fire an event: call all associated listeners.
     * @param {Object} event The event to fire.
     */
    function fireEvent (event)
    {
        for ( var i=0; i < listeners.length; ++i )
        {
            listeners[i](event);
        }
    }

}; // Livewire class

/**
 * Help for this tool.
 * @return {Object} The help content.
 */
atk.tool.Livewire.prototype.getHelp = function()
{
    return {
        "title": atk.i18n("tool.Livewire.name"),
        "brief": atk.i18n("tool.Livewire.brief")
    };
};

/**
 * Set the line colour of the drawing.
 * @param {String} colour The colour to set.
 */
atk.tool.Livewire.prototype.setLineColour = function(colour)
{
    // set style var
    this.style.setLineColour(colour);
};
