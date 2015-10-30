/*
 * Based on init.js, by John Resig, his original comment:
 *
 * This code searches for all the <script type="application/processing" target="canvasid">
 * in your page and loads each script in the target canvas with the proper id.
 * It is useful to smooth the process of adding Processing code in your page and starting
 * the Processing.js engine.
 *
 * And a warning from Florian:
 *
 * If you plan to add your own init script please make sure to test against and
 * handle running in the Envjs debugger (see "if (canvas) ..." below ),
 * otherwise you might freeze the PDE on export.
 *
 * http://github.com/fjenett/processingjstool
 */

// TODO: have a look at:
// http://wiki.github.com/jeresig/processing-js/improved-initjs

if ( window.addEventListener )
{
    window.addEventListener("load", function()
    {
        var scripts = document.getElementsByTagName("script");
        
        for ( var i = 0; i < scripts.length; i++ )
        {
            if ( scripts[i].type == "application/processing" )
            {
                var src = scripts[i].src, canvas = scripts[i].nextSibling;
    
                if ( src && src.indexOf("#") )
                {
                    canvas = document.getElementById( src.substr( src.indexOf("#") + 1 ) );
                }
                else
                {
                    while ( canvas && canvas.nodeName.toUpperCase() != "CANVAS" )
                        canvas = canvas.nextSibling;
                }

                if ( canvas )
                {
                    // testing if we are inside the debugger ..
                    // the "RUNN.." variable is set in the debugger environment.
                    var runningInEnvjsDebugger =
                        navigator.appCodeName.indexOf( "Envjs" ) != -1 &&
                        RUNNING_PROCESSING_JS_EXPORT_TOOL_DEBUGGER;
                        
                    if ( !runningInEnvjsDebugger )
                        var p = Processing(canvas, scripts[i].text);
                    else
                    {
                        // inside the debugger we want draw()
                        // to run just once, otherwise it would
                        // never finish and freeze the PDE.
                        
                        var p = Processing(canvas, ""); // no src
                        p.init( scripts[i].text ); 		// init with src
                        var oldDrawFunc = p.draw; 		// grab draw() impl
                        p.draw = function () { 			// add our own
                            oldDrawFunc(); 				// call default draw()
                            p.noLoop(); 				// stop looping
                        }
                    }
                }
            }
        }
        
    }, false);
}