--
-- DICOM Web Viewer (atk) lua script for integration in a Conquest PACS server.
--
-- Usage:
-- 1. copy this file onto your web server
-- 2. in the 'dicom.ini' of your web server, create the atk viewer:
-- >> [atk-simple]
-- >> source = atk-simple.lua
-- And set it as the default viewer:
-- >> [webdefaults]
-- >> ...
-- >> viewer = atk-simple
-- 3. copy the atk distribution files in a 'atk' folder
-- in the web folder of your web server. It should be accessible
-- via '[server address]/atk'.
--
-- This script relies on the 'kFactorFile', 'ACRNemaMap' and 'Dictionary'
-- variables being set correctly.

-- Get ids

local patientid = string.gsub(series2, ':.*$', '')
local seriesuid = string.gsub(series2, '^.*:', '')

-- Functions declaration

function getstudyuid()
  local a, b, s
  s = servercommand('get_param:MyACRNema')
  b = newdicomobject()
  b.PatientID = patientid
  b.SeriesInstanceUID = seriesuid
  b.StudyInstanceUID = ''
  a = dicomquery(s, 'SERIES', b)
  return a[0].StudyInstanceUID
end

function queryimages()
  local images, imaget, b, s
  s = servercommand('get_param:MyACRNema')
  b = newdicomobject()
  b.PatientID = patientid
  b.SeriesInstanceUID = seriesuid
  b.SOPInstanceUID = ''
  images = dicomquery(s, 'IMAGE', b)

  imaget={}
  for k=0,#images-1 do
    imaget[k+1]={}
    imaget[k+1].SOPInstanceUID = images[k].SOPInstanceUID
  end
  table.sort(imaget, function(a,b) return a.SOPInstanceUID < b.SOPInstanceUID end)

  return imaget
end

-- Main

local studyuid = getstudyuid()
local images = queryimages()
-- create the url lua array
local urlRoot = webscriptadress
urlRoot = urlRoot .. '?requestType=WADO&contentType=application/dicom'
urlRoot = urlRoot .. '&seriesUID=' .. seriesuid
urlRoot = urlRoot .. '&studyUID=' .. studyuid
local urls = {}
for i=1, #images do
  urls[i] = urlRoot .. '&objectUID=' .. images[i].SOPInstanceUID
end

-- Generate html

HTML('Content-type: text/html\n\n')

-- paths with extra /atk
print([[
<!DOCTYPE html>
<html>

<head>
<title>DICOM Web Viewer</title>
<meta charset="UTF-8">
<link type="text/css" rel="stylesheet" href="/atk/css/style.css">
<link type="text/css" rel="stylesheet" href="/atk/ext/jquery-mobile/jquery.mobile-1.4.5.min.css">
]])

print([[
<!-- Third party -->
<script type="text/javascript" src="/atk/ext/jquery/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="/atk/ext/jquery-mobile/jquery.mobile-1.4.5.min.js"></script>
<script type="text/javascript" src="/atk/ext/pdfjs/jpx.js"></script>
<script type="text/javascript" src="/atk/ext/pdfjs/util.js"></script>
<script type="text/javascript" src="/atk/ext/pdfjs/arithmetic_decoder.js"></script>
<script type="text/javascript" src="/atk/ext/pdfjs/jpg.js"></script>
<script type="text/javascript" src="/atk/ext/rii-mango/lossless-min.js"></script>

<!-- Local -->
<script type="text/javascript" src="/atk/atk-0.20.0-beta.min.js"></script>
<!-- Launch the app -->
<script type="text/javascript" src="/atk/viewers/simple/appgui.js"></script>
]])

print([[
<script type="text/javascript">
// check browser support
atk.browser.check();
// launch when page is loaded
$(document).ready( function()
{
    // main application
    var myapp = new atk.App();
    // initialise the application
    myapp.init({
        "containerDivId": "atk",
        "fitToWindow": true,
        "tools": ["Scroll", "Zoom/Pan", "Window/Level"],
        "gui": ["tool"],
        "isMobile": true,
        "skipLoadUrl": true
    });
    atk.gui.appendResetHtml(myapp);
]])
-- create javascript url array
print([[
    var inputUrls = [
]])
for i=1, #images do
  print('      "'..urls[i]..'",')
end
print([[
    ];
]])
-- load data
print([[
    if( inputUrls && inputUrls.length > 0 ) myapp.loadURL(inputUrls);
}); // end $(document).ready
</script>
]])

print([[
</head>

<body>

<!-- Main page -->
<div data-role="page" data-theme="b">

<!-- Main content -->
<div data-role="content">

<!-- atk -->
<div id="atk">

<!-- Toolbar -->
<div class="toolbar"></div>

<!-- Layer Container -->
<div class="layerContainer">
<canvas class="imageLayer">Only for HTML5 compatible browsers...</canvas>
</div><!-- /layerContainer -->

</div><!-- /atk -->

</div><!-- /content -->

</div><!-- /page -->

</body>
</html>
]])
