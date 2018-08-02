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
atk.utils.decodeQuery = atk.utils.base.decodeQuery;

// Window
atk.gui.getWindowSize = function () {
    return { 'width': ($('#pageMain').width() - 360), 'height': ($('#pageMain').height() - 75) };
};
// Prompt
atk.gui.prompt = atk.gui.base.prompt;
// Progress
atk.gui.displayProgress = function (percent) {
    // jquery-ui progress bar
    if( percent <= 100 ) {
        $("#progressbar").progressbar({ value: percent });
    }
};
// Focus
atk.gui.focusImage = atk.gui.base.focusImage;
// get element
atk.gui.getElement = atk.gui.base.getElement;
// refresh
atk.gui.refreshElement = atk.gui.base.refreshElement;
// Slider
atk.gui.Slider = function (app)
{
    this.append = function ()
    {
        // nothing to do
    };
    this.initialise = function ()
    {
        var min = app.getImage().getDataRange().min;
        var max = app.getImage().getDataRange().max;

        // jquery-ui slider
        $( ".thresholdLi" ).slider({
            range: true,
            min: min,
            max: max,
            values: [ min, max ],
            slide: function( event, ui ) {
                app.onChangeMinMax(
                        {'min':ui.values[0], 'max':ui.values[1]});
            }
        });
    };
};
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

function toggle(dialogId)
{
    if( $(dialogId).dialog('isOpen') ) {
        $(dialogId).dialog('close');
    }
    else {
        $(dialogId).dialog('open');
    }
}
// post process table
atk.gui.postProcessTable = atk.gui.base.postProcessTable;
// Tags table
atk.gui.DicomTags = atk.gui.base.DicomTags;
// DrawList table
atk.gui.DrawList = atk.gui.base.DrawList;

// Loaders
atk.gui.Loadbox = atk.gui.base.Loadbox;
// File loader
atk.gui.FileLoad = atk.gui.base.FileLoad;
// Url loader
atk.gui.UrlLoad =  atk.gui.base.UrlLoad;

// Toolbox
atk.gui.Toolbox = function (app)
{
    var base = new atk.gui.base.Toolbox(app);

    this.setup = function(list)
    {
        base.setup(list);

        // toolbar

        // open
        var openSpan = document.createElement("span");
        openSpan.className = "ui-icon ui-icon-plus";
        var open = document.createElement("button");
        open.appendChild(openSpan);
        open.title = atk.i18n("basics.open");
        open.onclick = function() { toggle(".openData"); };
        // toolbox
        var toolboxSpan = document.createElement("span");
        toolboxSpan.className = "ui-icon ui-icon-wrench";
        var toolbox = document.createElement("button");
        toolbox.appendChild(toolboxSpan);
        toolbox.title = atk.i18n("basics.toolbox");
        toolbox.onclick = function() { toggle(".toolList"); };
        // history
        var historySpan = document.createElement("span");
        historySpan.className = "ui-icon ui-icon-clipboard";
        var history = document.createElement("button");
        history.appendChild(historySpan);
        history.title = atk.i18n("basics.history");
        history.onclick = function() { toggle(".history"); };
        // DICOM tags
        var tagsSpan = document.createElement("span");
        tagsSpan.className = "ui-icon ui-icon-tag";
        var tags = document.createElement("button");
        tags.appendChild(tagsSpan);
        tags.title = atk.i18n("basics.dicomTags");
        tags.onclick = function() { toggle(".tags"); };
        // draw list
        var drawListSpan = document.createElement("span");
        drawListSpan.className = "ui-icon ui-icon-pencil";
        var drawList = document.createElement("button");
        drawList.appendChild(drawListSpan);
        drawList.title = atk.i18n("basics.drawList");
        drawList.onclick = function() { toggle(".drawList"); };
        // image
        var imageSpan = document.createElement("span");
        imageSpan.className = "ui-icon ui-icon-image";
        var image = document.createElement("button");
        image.appendChild(imageSpan);
        image.title = atk.i18n("basics.image");
        image.onclick = function() { toggle(".layerDialog"); };
        // info
        var infoSpan = document.createElement("span");
        infoSpan.className = "ui-icon ui-icon-info";
        var info = document.createElement("button");
        info.appendChild(infoSpan);
        info.title = atk.i18n("basics.info");
        info.onclick = app.onToggleInfoLayer;
        // help
        var helpSpan = document.createElement("span");
        helpSpan.className = "ui-icon ui-icon-help";
        var help = document.createElement("button");
        help.appendChild(helpSpan);
        help.title = atk.i18n("basics.help");
        help.onclick = function() { toggle(".help"); };

        var node = app.getElement("toolbar");
        node.appendChild(open);
        node.appendChild(toolbox);
        node.appendChild(history);
        node.appendChild(tags);
        node.appendChild(drawList);
        node.appendChild(image);
        node.appendChild(info);
        node.appendChild(help);

        // apply button style
        $("button").button();

        // save state button
        var saveButton = document.createElement("button");
        saveButton.appendChild(document.createTextNode(atk.i18n("basics.downloadState")));
        // save state link
        var toggleSaveState = document.createElement("a");
        toggleSaveState.onclick = app.onStateSave;
        toggleSaveState.download = "state.json";
        toggleSaveState.id = "download-state";
        toggleSaveState.className += "download-state";
        toggleSaveState.appendChild(saveButton);
        // add to openData window
        node = app.getElement("openData");
        node.appendChild(toggleSaveState);
    };
    this.display = function (bool)
    {
        base.display(bool);
    };
    this.initialise = function (list)
    {
        base.initialise(list);
    };
};

//Window/level
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

// special setup
atk.gui.setup = function () {
    $(".toggleInfoLayer").button({ icons:
        { primary: "ui-icon-comment" }, text: false,
        appendTo: "#atk"
    });
    // create dialogs
    $(".openData").dialog({ position:
        {my: "left top", at: "left top", of: "#pageMain"},
        appendTo: "#atk"
    });
    $(".toolList").dialog({ position:
        {my: "left top+180", at: "left top", of: "#pageMain"},
        appendTo: "#atk"
    });
    $(".history").dialog({ position:
        {my: "left top+350", at: "left top", of: "#pageMain"},
        appendTo: "#atk"
    });
    $(".tags").dialog({ position:
        {my: "right top", at: "right top", of: "#pageMain"},
        autoOpen: false, width: 500, height: 590,
        appendTo: "#atk"
    });
    $(".drawList").dialog({ position:
        {my: "right top", at: "right top", of: "#pageMain"},
        autoOpen: false, width: 500, height: 590,
        appendTo: "#atk"
    });
    $(".help").dialog({ position:
        {my: "right top", at: "right top", of: "#pageMain"},
        autoOpen: false, width: 500, height: 590,
        appendTo: "#atk"
    });

    // image dialog
    $(".layerDialog").dialog({ position:
        {my: "left+320 top", at: "left top", of: "#pageMain"},
        appendTo: "#atk"
    });
    // default size
    $(".layerDialog").dialog({ width: "auto", resizable: false });
    // Resizable but keep aspect ratio
    // TODO it seems to add a border that bothers getting the cursor position...
    //$("#layerContainer").resizable({ aspectRatio: true });
};
