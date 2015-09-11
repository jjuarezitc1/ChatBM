// Constants --------------------------
//Web service and external calls
var SERVER = "bmws.bluemessaging.net";
//var SERVER = "localhost:8081/bmws";
var PROCESS_URL = "http://" + SERVER + "/message/process";
var RESPONSE_URL = "http://" + SERVER + "/message/response";
var METADATA_URL = "http://" + SERVER + "/message/meta";
//Credentials
var BMP_DM = "";
var BMP_PR = "";
var BMP_US = "";
var BMP_PS = "";
var TOKEN_SELECTOR = "MO3RN5LT3DZNFZJSQAXCIPFWMOEGMIFB";
var TOKEN_CLIENTE = "FO2HBMZCQMFBCK2WA3E73TA4HUGNBUKW";
var TOKEN_NO_CLIENTE = "KYGEWFVKELBNN65PKFF22AMSX32T4MVF";
var token = TOKEN_SELECTOR;
//Retries
var MAX_MSG_RETRIES = 15;
var MAX_RSP_RETRIES = 45;
var RETRY_DELAY = 200;
var RESPONSE_TIME = 3000;
var MAX_PROCESS_TIME = 10000;
var MAX_RESPONSE_TIME = 30000;
//Timeouts and alerts
var IDLE_TIMEOUT = 10 * 60; //10 minute inactivity timeout
var IDLE_ALERT = IDLE_TIMEOUT - (60);
var MAX_COUNTER = IDLE_TIMEOUT - IDLE_ALERT;
//Controls
var ENTER_KEY = 13;
var DEBUG = true;
//Display
var PROVIDER = "Bankaool";
var BM_INI = "<div class='output-left' id='conv";
var BM_FIN = "'><img src='../img/logo_bankaool_mbl.png' class='who-talks'><div class='bubble'>";
var TYPING_MESSAGE = "<div class='output-left typing_style' id='deleteThis'><img src='../img/logo_bankaool_mbl.png' class='who-talks'><div class='bubble'>Escribiendo..<div></div>";
var USER = "<div class='output-right bubble-r'><font color='#000000'><div>";
var FONT_END = "</font></div>";
var TIME = "<span class='timestamp'>";
var TIME_END = "</span></div>";
//Values
var ORIGIN = "orig";
// Variables -----------------------------
var isMobile = false;
var processRetries = 0;
var responseRetries = 0;
var response_number = 1;
var input_area;
var history_mc;
var history_div;
var scroll = 0;
var initialized = false;
var firstClick = true;
var img;
var maxNum = 100000;
var minNum = 1;
var responseTime = 3000;
var msgId = -1;
var start = new Date().getTime();
var clickTrackerHolder = "{clickUrl}";

//Geolocation variables
var geocoder;
var userLocation = "";
var locationSent = 0;
var _idleSecondsCounter = 0;
var _activeCounter = "";
var _idle = false;
window.setInterval(checkIdleTime, 1000);

/* =============================================================
 *                    GENESIS RELATED CODE
 * =============================================================
 */
var TRIGGER_GENESIS = "CALL_GENESIS";

function callGenesis() {
        // Retrieve information
        var conversationString = "";


        // Fill form and submit
        jQuery('#txtGenesisConversation').val(conversationString);
        setTimeout(function () {
            jQuery('#frmGenesis').submit();
        }, 2000);
    }
    /**
     * Core functions
     *
     */

var InputInterface = {
    _timeBeforeSending: 1000,
    _textBuffer: "",
    _sendTimeoutObj: null,
    sendMessage: function (msg) {
        var json = buildChatJSON(origin, msg);

        getResponse(json);
    },
    _startTimeout: function () {
        this._sendTimeoutObj = setTimeout(function () {
            InputInterface.flush();
        }, this._timeBeforeSending);
    },
    restartTimeout: function () {
        if (this._sendTimeoutObj !== null) {
            clearTimeout(this._sendTimeoutObj);
            this._startTimeout();
        }
    },
    prepareSending: function (msg) {
        this._textBuffer += " " + msg;
        if (this._sendTimeoutObj == null) this._startTimeout();
    },
    flush: function () {
        if (this._textBuffer != "") {
            this.sendMessage(this._textBuffer);
            this._textBuffer = "";
            this._sendTimeoutObj = null;
        }
    }
};

// Chat session notify

function checkIdleTime() {
    _idleSecondsCounter++;
    if (_idleSecondsCounter >= IDLE_TIMEOUT) {
        //show reset
        if (_idle === false) displayIdle();
        _idleSecondsCounter = IDLE_TIMEOUT + 1;
    } else if (_idleSecondsCounter >= IDLE_ALERT) {
        //show alert
        if (_activeCounter == "") displayAlert();
        updateCounterDisplay(MAX_COUNTER - (_idleSecondsCounter - IDLE_ALERT));
    }
}

function displayIdle() {
    history_mc.innerHTML += BM_INI + response_number + BM_FIN + "<i>Tu sesión ha caducado por inactividad.<br/>Escribe un mensaje para comenzar una nueva sesión :) </i>" + TIME + getTimeStamp() + TIME_END + FONT_END;
    convH = jQuery('#conv' + response_number).height();
    var x = document.getElementById("conv" + response_number);
    var y = x.getElementsByTagName("img");
    logoH = y[0].height;
    margintop = (convH - 50) / 2;
    y[0].setAttribute("style", "margin-top:" + margintop.toString() + "px");
    jQuery("#history_div").mCustomScrollbar("update");
    setTimeout(function () {

        jQuery("#history_div").mCustomScrollbar("scrollTo", "#conv" + response_number);
        response_number++;
    }, 250);
    document.getElementById('input_area').focus();
    _idle = true;
}

function displayAlert() {
    history_mc.innerHTML += BM_INI + response_number + BM_FIN + "<i>Tu sesión está a punto de expirar en <div id='idleCounter' style='display:inline'></div> segundos.</i>" + TIME + getTimeStamp() + TIME_END + FONT_END;
    convH = jQuery('#conv' + response_number).height();
    var x = document.getElementById("conv" + response_number);
    var y = x.getElementsByTagName("img");
    logoH = y[0].height;
    margintop = (convH - 50) / 2;
    y[0].setAttribute("style", "margin-top:" + margintop.toString() + "px");

    jQuery("#history_div").mCustomScrollbar("update");
    setTimeout(function () {

        jQuery("#history_div").mCustomScrollbar("scrollTo", "#conv" + response_number);
        response_number++;
    }, 250);
    document.getElementById('input_area').focus();
    _activeCounter = "true";
}

function updateCounterDisplay(newCounter) {
    jQuery("#idleCounter").html("<b>" + newCounter + "</b>");
}

// Chat init
function getOrigin() {
    jQuery.support.cors = true;
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
        var ieversion = new Number(RegExp.jQuery1) // capture x.x portion and store as a number
        if (ieversion == 9 || ieversion == 8) {
            // Use Microsoft XDR
            var xdr = new XDomainRequest();
            xdr.open("get", '//bmws.bluemessaging.net/message/nextOrigin');
            xdr.onload = function () {
                origin = "m_" + xdr.responseText;
                //console.log(origin);
                initialize();
                goToChat();
            };
            xdr.onprogress = function () {};
            xdr.ontimeout = function () {};
            xdr.onerror = function () {
                //console.log("Error:IE" + ieversion)
            };
            setTimeout(function () {
                xdr.send();
            }, 0);
        }
    } else {
        jQuery.get("//bmws.bluemessaging.net/message/nextOrigin", function (data) {
                origin = "m_" + data;
                console.log(origin);
                initialize();
                goToChat();
            })
            .done(function () {}

            )
            .fail(function (jqXHR, textStatus, errorThrown) {
                //console.log("error:" + jqXHR.responseText + ":" + textStatus + ":" + errorThrown);
                jQuery("#offline").show();
            })
            .always(function () {}

            );
    }
}

function initialize() {
        if (window.XDomainRequest) {
            //override functions
            //getMetaData = xdrMetaData;
        }
        //getMetaData();
        history_div = document.getElementById('history_div');
        img = document.getElementById('background_img');
        input_area = document.getElementById('input_area');
        history_mc = document.getElementById('history_mc');
        jQuery("#history_div").on("touchstart", function () {
            jQuery("#input_area").trigger("blur");
            console.log("touchon");
        });
        if (getUrlParameter("isMobile") == "true") {
            goToChat();
        }
        origin;
        jQuery("#history_div").mCustomScrollbar({
            theme: "dark-thick",
        });
        document.getElementById('input_area').focus();
        chat();
    }
    // Function calling chat when you have the banner
function goToChat() {
    origin;
    jQuery(".chat_banner").hide();
    jQuery(".banner-modal-box").slideDown();
    jQuery("#history_div").mCustomScrollbar({
        theme: "dark-thick",
    });
    document.getElementById('input_area').focus();
    chat();
}

function chatHandler(event) {
    // ENTER key
    var key;
    if (window.event) // IE8 and earlier
    {
        key = event.keyCode;
    } else if (event.which) // IE9/Firefox/Chrome/Opera/Safari
    {
        key = event.which;
    }

    InputInterface.restartTimeout();

    if (key == 13) {
        chat();
        jQuery('#input_area').focus();
        event.keyCode = 0;
    }
}

function resetCounter() {
    if (_activeCounter != "") {
        //remove active copunter
        jQuery("#idleCounter").remove();
        _activeCounter = "";
    }
    _idleSecondsCounter = 0;

}

function cambioExperto() {
    window.setTimeout(function () {
        jQuery("#exp").trigger('click');
    }, 4000);

}


function experto(text) {
    //alert("experto function");
    try{
        chatText = text;
        jQuery("#deleteThis").remove();
        InputInterface.prepareSending(chatText);
        setTimeout(function () {
            jQuery("#history_mc").html("");
            history_mc.innerHTML += TYPING_MESSAGE;
            jQuery("#history_div").mCustomScrollbar("scrollTo", "bottom");
        }, 500);    
    }catch(err){
        //alert("error -> "+err);
    }
    
}

function chat() {
    //parent.top.jQuery("#content").addClass("cargando");
    parent.jQuery("#content").addClass("cargando");
    // Build request
    var chatText = "";
    if (!initialized) {
        chatText = "_start";
    } else {
        chatText = input_area.value;
        if (chatText.trim() == "") return;
        var userAnswer = USER + input_area.value + TIME + getTimeStamp() + TIME_END + FONT_END;
        history_mc.innerHTML += userAnswer;

        jQuery("#history_div").mCustomScrollbar("update");
        setTimeout(function () {
            jQuery("#history_div").mCustomScrollbar("scrollTo", "bottom");
        }, 300);
        jQuery(input_area).val("");
        jQuery(input_area).prop('disabled', true);

        if (getUrlParameter("isMobile") == "true") hideKeyboard();

    }

    jQuery("#deleteThis").remove();
    InputInterface.prepareSending(chatText);
    setTimeout(function () {
        history_mc.innerHTML += TYPING_MESSAGE;
        jQuery("#history_div").mCustomScrollbar("scrollTo", "bottom");
    }, 2000);

    if (!initialized) {
        InputInterface.flush();
        initialized = true;
    }
}

//Start calling recursively getMsgId until the retries max out or succesfully get an Id
function getResponse(json) {
    resetCounter();
    _idle = false;
    start = new Date().getTime();
    processRetries = 0;
    responseRetries = 0;
    getMessageId(json);
}

function displayResponse(response) {
        jQuery("#deleteThis").remove();
        if (token == TOKEN_SELECTOR) {
            if (response == 'SI') {
                //alert("respuesta SI");
                token=TOKEN_CLIENTE;
                setTimeout(function(){
                    experto("<experto:soporte>");
                },0);
                //alert("banner -> "+parent.top.jQuery("#banner"));
                try{
                    console.log(parent.top.jQuery("#banner"));
                    parent.jQuery("#banner").hide();
                    parent.jQuery("#banner").finish().fadeOut('slow');   
                    //parent.document.getElementById("banner").style.display = 'none';
                    //alert("no Error"); 
                }catch(err){
                    //alert("Error -> "+err.message);
                }
                
                return;
            } else if (response == 'NO') {
                try{
                token=TOKEN_NO_CLIENTE;
                setTimeout(function(){
                    experto("<experto:general>");
                },0);
                parent.jQuery("#soporte").addClass("hidden");
                parent.jQuery("#general").removeClass("hidden");
                //parent.top.jQuery("#banner").finish().fadeOut('slow');
                parent.document.getElementById("banner").style.display = 'none';
            }catch(err){alert("error");}
                return;
            }

        }
        history_mc.innerHTML += BM_INI + response_number + BM_FIN + response + TIME + getTimeStamp() + TIME_END + FONT_END;
        convH = jQuery('#conv' + response_number).height();
        var x = document.getElementById("conv" + response_number);
        var y = x.getElementsByTagName("img");
        logoH = y[0].height;
        margintop = (convH - 50) / 2;
        y[0].setAttribute("style", "margin-top:" + margintop.toString() + "px");
        jQuery(input_area).prop('disabled', false);
        jQuery("#history_div").mCustomScrollbar("update");
        setTimeout(function () {

            jQuery("#history_div").mCustomScrollbar("scrollTo", "#conv" + response_number);
            response_number++;
            //parent.top.jQuery("#content").removeClass("cargando");
            parent.jQuery("#content").removeClass("cargando");
            links();
            video();
        }, 250);
        document.getElementById('input_area').focus();
        cambioExperto();
    }
    /**
     * Utilities
     *
     */
    //Prepare the JSON object
function buildChatJSON(orig, text) {
        
        var chatData = new Object();
        /*
        chatData.user = BMP_US;
        chatData.password = BMP_PS;
        chatData.domain = BMP_DM;
        chatData.project = BMP_PR;
        chatData.origin = orig;
        chatData.text = text;
        */
        chatData.hash = token;
        chatData.origin = orig;
        chatData.text = text;

        return JSON.stringify(chatData);
    }
    //Get current timestamp for chats
function getTimeStamp() {
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        var timeStamp = hours + ":" + minutes;
        return timeStamp;
    }
    //EndsWith
function strEndsWith(str, suffix) {
        return String(str).match(suffix + "jQuery") == suffix;
    }
    // Util
function hideKeyboard() {
    input_area.setAttribute('readonly', 'readonly');
    input_area.setAttribute('disabled', 'true');
    setTimeout(function () {
        input_area.blur();
        input_area.removeAttribute('readonly');
        input_area.removeAttribute('disabled');
        jQuery("#input_area").trigger("update");
    }, 100);
}

function openPage(url, linkWindow, popUpDimensions) {
        if (linkWindow == "_popup") {
            var dimensions = new Array(800);
            for (var i = 0; i < dimensions.length; i++) {
                dimensions[i] = new Array(600);
            }
            window.open(url + '', 'PopUpWindow', 'width= dimensions[0]',
                ' height= dimensions[1] ', 'toolbar=yes ', 'scrollbars=yes');
        } else {
            linkWindow == "_popup" ? "_blank" : linkWindow;
            var w = linkWindow;
            window.open(url + ',' + w);
        }
    }
    //Get URL params
function getUrlParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|jQuery)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }
    /**
     * External Calls
     * Access external resources
     */

function clickTracker() {
    if (firstClick) {
        firstClick = false;
        clickUrl = getUrlParameter("click");
        if (clickUrl == clickTrackerHolder || clickUrl == null) {
            return;
        }

        callClickTracker(clickUrl);
    }
}

function callClickTracker(url) {
        jQuery.ajax({
            url: url
        });
    }
    //Get metadata from web services
function getMetaData() {
        jQuery.ajax({
            headers: {
                "Accept": "application/json"
            },
            url: METADATA_URL,
            contentType: 'text/plain',
            dataType: 'text',
            success: function (data) {
                data = jQuery.parseJSON(data);
                setMeta(data);
                chat();
            },
            error: function (jqXHR, textStatus) {
                chat();
            }
        });
    }
    //
function setMeta(data) {
        jQuery.each(data, function (key, value) {
            metaData += "_" + key.toUpperCase() + "-" + value + "_";
        });

    }
    //
function logObject(object) {
        for (var a in object) {

        }
    }
    //Process message and get the messageId
function getMessageId(json) {
        jQuery.ajax({
            headers: {
                "Accept": "application/json",
                "Accept-Language": "en-US",
                "X-HTTP-Method-Override": "PUT"
            },
            type: "POST",
            dataType: 'text',
            url: PROCESS_URL,
            data: json,
            contentType: 'text/plain',
            success: function (data) {

                data = jQuery.parseJSON(data);
                getMessageResponse(buildChatJSON(data.id, 'response'));
            },
            error: function (jqXHR, textStatus) {

                var responseTime = new Date().getTime() - start;
                if (processRetries >= MAX_MSG_RETRIES || responseTime > MAX_PROCESS_TIME) {
                    //alert("Error 501: We are sorry, the application did not respond on time or is unable to connect. Please try again later.");
                    jQuery("#offline").show();
                } else {

                    processRetries++;
                    setTimeout(function () {
                        getMessageId(json);
                    }, 100);
                }
            }
        });
    }
    //Get the processed message response
function getMessageResponse(json) {
    jQuery.ajax({
        headers: {
            "Accept": "application/json",
            "Accept-Language": "en-US",
            "X-HTTP-Method-Override": "PUT"
        },
        type: "POST",
        dataType: 'text',
        url: RESPONSE_URL,
        data: json,
        contentType: 'text/plain',
        success: function (data) {

            response = jQuery.parseJSON(data);

            if (response != null && response.indexOf(TRIGGER_GENESIS) >= 0) {
                response = response.replace(TRIGGER_GENESIS, "");
                callGenesis();
            }

            var elapsed = new Date().getTime() - start;
            if (elapsed < RESPONSE_TIME) {
                var sleepTime = RESPONSE_TIME - elapsed;

                setTimeout(function () {
                    displayResponse(response);
                }, sleepTime);
            } else {
                displayResponse(response);
            }
        },
        error: function (jqXHR, textStatus) {

            var responseTime = new Date().getTime() - start;
            if (processRetries >= MAX_RSP_RETRIES || responseTime > MAX_RESPONSE_TIME) {
                //alert("Error 02: We are sorry, the application did not respond on time or is unable to connect. Please try again later.");
                jQuery("#offline").removeClass("hidden");
                jQuery("#offline").show();
                jQuery("#chat_box").hide();
            } else {

                processRetries++;
                setTimeout(function () {
                    getMessageResponse(json);
                }, 100);
            }
        }
    });
}

// Chat Limit characters

jQuery(function () {
    jQuery("textarea[maxlength]").bind('input propertychange', function () {
        var maxLength = jQuery(this).attr('maxlength');
        if (jQuery(this).val().length > maxLength) {
            jQuery(this).val(jQuery(this).val().substring(0, maxLength));
        }
    })
});