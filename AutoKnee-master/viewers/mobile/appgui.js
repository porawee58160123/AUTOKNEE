/**
 * Application GUI.
 */

// Default colour maps.
atk.tool.colourMaps = {
    "plain": atk.image.lut.plain,
    "invplain": atk.image.lut.invPlain,
	"hotmetalblue": atk.image.lut.hot_metal_blue,
    "pet": atk.image.lut.pet,
    "pet20step": atk.image.lut.pet_20step
};
// Default window level presets.
atk.tool.defaultpresets = {};

// Default window level presets for CT.
atk.tool.defaultpresets.CT = {
    "mediastinum": {"center": 40, "width": 400},
    "lung": {"center": -500, "width": 1500},
    "bone": {"center": 500, "width": 2000},
    "brain": {"center": 40, "width": 80},
    "head": {"center": 90, "width": 350}
};

//decode query
atk.utils.decodeQuery = function (query, callback)
{
    if (query.type === "gdrive") {
        var gAuth = new atk.google.Auth();
        var gDrive = new atk.google.Drive();
        gDrive.setIds( query.input.split(',') );
        // pipeline
        gAuth.onload = gDrive.load;
        gAuth.onfail = function () {
            $("#popupAuth").popup("open");
            var authorizeButton = document.getElementById('gauth-button');
            // explicit auth from button to allow popup
            authorizeButton.onclick = function() {
                $("#popupAuth").popup("close");
                gAuth.load();
            };
        };
        gDrive.onload = atk.google.getAuthorizedCallback(callback);
        // launch with silent auth
        gAuth.loadSilent();
    }
    else {
        // default
        atk.utils.base.decodeQuery(query, callback);
    }
};

// Window
atk.gui.getWindowSize = function () {
    return { 'width': ($(window).width()), 'height': ($(window).height() - 147) };
};
// Prompt
atk.gui.prompt = atk.gui.base.prompt;
// Progress
/* global NProgress */
atk.gui.displayProgress = function (percent) {
    NProgress.configure({ showSpinner: false });
    if( percent < 100 ) {
        //$.mobile.loading("show", {text: percent+"%", textVisible: true, theme: "b"} );
        NProgress.set(percent/100);
    }
    else if( percent >= 100 ) {
        //$.mobile.loading("hide");
        NProgress.done();
    }
};
// Focus
atk.gui.focusImage = function ()
{
    $.mobile.changePage("#main");
};
// get element
atk.gui.getElement = atk.gui.base.getElement;
// refresh
atk.gui.refreshElement = function (element) {
    if( $(element)[0].nodeName.toLowerCase() === 'select' ) {
        $(element).selectmenu('refresh');
    }
    else {
        $(element).enhanceWithin();
    }
};
// Slider
atk.gui.Slider = atk.gui.base.Slider;
// plot
atk.gui.plot = function (div, data, options)
{
    var plotOptions = {
        "bars": { "show": true },
        "grid": { "backgroundcolor": null },
        "xaxis": { "show": true },
        "yaxis": { "show": false }
    };
    if (typeof options !== "undefined" &&
        typeof options.markings !== "undefined") {
        plotOptions.grid.markings = options.markings;
    }
    $.plot(div, [ data ], plotOptions);
};
// Post process table
atk.gui.postProcessTable = function (table)
{
    var tableClass = table.className;
    // css
    table.className += " table-stripe ui-responsive";
    // add columntoggle
    table.setAttribute("data-role", "table");
    table.setAttribute("data-mode", "columntoggle");
    table.setAttribute("data-column-btn-text", atk.i18n("basics.columns") + "...");
    // add priority columns for columntoggle
    var addDataPriority = function (cell) {
        var text = cell.firstChild.data;
        if ( tableClass === "tagsTable" ) {
            if ( text !== "value" && text !== "name" ) {
                cell.setAttribute("data-priority", "5");
            }
        }
        else if ( tableClass === "drawsTable" ) {
            if ( text === "description" ) {
                cell.setAttribute("data-priority", "1");
            }
            else if ( text === "frame" || text === "slice" ) {
                cell.setAttribute("data-priority", "5");
            }

        }
    };
    if (table.rows.length !== 0) {
        var hCells = table.rows.item(0).cells;
        for (var c = 0; c < hCells.length; ++c) {
            addDataPriority(hCells[c]);
        }
    }
    // return
    return table;
};
// Tags table
atk.gui.DicomTags = atk.gui.base.DicomTags;
// DrawList table
atk.gui.DrawList = atk.gui.base.DrawList;

// Loaders
atk.gui.Loadbox = atk.gui.base.Loadbox;
// File loader
atk.gui.FileLoad = atk.gui.base.FileLoad;
atk.gui.FileLoad.prototype.onchange = function (/*event*/) {
    $("#popupOpen").popup("close");
};
// Url loader
atk.gui.UrlLoad = atk.gui.base.UrlLoad;
atk.gui.UrlLoad.prototype.onchange = function (/*event*/) {
    $("#popupOpen").popup("close");
};

// Toolbox
atk.gui.Toolbox = function (app)
{
    var base = new atk.gui.base.Toolbox(app);

    this.setup = function (list)
    {
        base.setup(list);

        // toolbar
        var buttonClass = "ui-btn ui-btn-inline ui-btn-icon-notext ui-mini";

        var open = document.createElement("a");
        open.href = "#popupOpen";
        open.setAttribute("class", buttonClass + " ui-icon-plus");
        open.setAttribute("data-rel", "popup");
        open.setAttribute("data-position-to", "window");

        var undo = document.createElement("a");
        undo.setAttribute("class", buttonClass + " ui-icon-back");
        undo.onclick = app.onUndo;

        var redo = document.createElement("a");
        redo.setAttribute("class", buttonClass + " ui-icon-forward");
        redo.onclick = app.onRedo;

        var toggleInfo = document.createElement("a");
        toggleInfo.setAttribute("class", buttonClass + " ui-icon-info");
        toggleInfo.onclick = app.onToggleInfoLayer;

        var toggleSaveState = document.createElement("a");
        toggleSaveState.setAttribute("class", buttonClass + " download-state ui-icon-action");
        toggleSaveState.onclick = app.onStateSave;
        toggleSaveState.download = "state.json";

        var tags = document.createElement("a");
        tags.href = "#tags_page";
        tags.setAttribute("class", buttonClass + " ui-icon-grid");

        var drawList = document.createElement("a");
        drawList.href = "#drawList_page";
        drawList.setAttribute("class", buttonClass + " ui-icon-edit");

        var node = app.getElement("toolbar");
        node.appendChild(open);
        node.appendChild(undo);
        node.appendChild(redo);
        node.appendChild(toggleInfo);
        node.appendChild(toggleSaveState);
        node.appendChild(tags);
        node.appendChild(drawList);
        atk.gui.refreshElement(node);
    };
    this.display = function (flag)
    {
        base.display(flag);
    };
    this.initialise = function (list)
    {
        base.initialise(list);
    };
};

// Window/level
atk.gui.WindowLevel = atk.gui.base.WindowLevel;
// Draw
atk.gui.Draw = atk.gui.base.Draw;
// ColourTool
atk.gui.ColourTool = atk.gui.base.ColourTool;
// ZoomAndPan
atk.gui.ZoomAndPan = atk.gui.base.ZoomAndPan;
// Scroll
atk.gui.Scroll = atk.gui.base.Scroll;
// Filter
atk.gui.Filter = atk.gui.base.Filter;

// Filter: threshold
atk.gui.Threshold = atk.gui.base.Threshold;
// Filter: sharpen
atk.gui.Sharpen = atk.gui.base.Sharpen;
// Filter: sobel
atk.gui.Sobel = atk.gui.base.Sobel;

// Undo/redo
atk.gui.Undo = atk.gui.base.Undo;
// Help
atk.gui.appendHelpHtml = atk.gui.base.appendHelpHtml;
// Version
atk.gui.appendVersionHtml = atk.gui.base.appendVersionHtml;
