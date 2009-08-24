YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({

    name: "Controls in repeat (also tests setvalue/getvalue)",

    repeatRebuildWorker: function(controlId) {
        var fullId = controlId + XFORMS_SEPARATOR_1 + "1";
        YAHOO.util.Assert.areEqual("true", ORBEON.xforms.Document.getValue(fullId));
        ORBEON.util.Test.executeCausingAjaxRequest(this, function() {
            ORBEON.xforms.Document.setValue("repeat-shown", "false");
        }, function() {
            ORBEON.util.Test.executeCausingAjaxRequest(this, function() {
                ORBEON.xforms.Document.setValue("repeat-shown", "true");
            }, function() {
                YAHOO.util.Assert.areEqual("true", ORBEON.xforms.Document.getValue(fullId));
            });
        });
   },
   
   testInput: function() { this.repeatRebuildWorker("input"); },
   testTextarea: function() { this.repeatRebuildWorker("textarea"); },
   testSecret: function() { this.repeatRebuildWorker("secret"); },
   testInputBoolean: function() { this.repeatRebuildWorker("input-boolean"); }
   
}));

YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({

    name: "xforms:select1 appearance=full",

    dateValueInputId: "date-value" + XFORMS_SEPARATOR_1 + "1$xforms-input-1",

    getSelect: function(controlId) {
        var control = YAHOO.util.Dom.get(controlId);
        return ORBEON.util.Utils.getProperty(NEW_XHTML_LAYOUT_PROPERTY)
            ? control.getElementsByTagName("select")[0]
            : control;
    },

    testAddToItemset: function() {
        // Get initial value for flavor and carrier
        var flavorSelect1 = YAHOO.util.Dom.get("flavor-select1-full" + XFORMS_SEPARATOR_1 + "1");
        var carrierSelect1 = YAHOO.util.Dom.get("carrier-select1-full" + XFORMS_SEPARATOR_1 + "1");
        var initialFlavorValue = ORBEON.xforms.Controls.getCurrentValue(flavorSelect1);
        var initialCarrierValue = ORBEON.xforms.Controls.getCurrentValue(carrierSelect1);
        ORBEON.util.Test.executeCausingAjaxRequest(this, function() {
            // Click on text field
            var addTrigger = YAHOO.util.Dom.get("add-flavor-carrier" + XFORMS_SEPARATOR_1 + "1");
            YAHOO.util.UserAction.click(addTrigger);
        }, function() {
            // Check that the values didn't change
            YAHOO.util.Assert.areEqual(initialFlavorValue, ORBEON.xforms.Controls.getCurrentValue(flavorSelect1));
            YAHOO.util.Assert.areEqual(initialCarrierValue, ORBEON.xforms.Controls.getCurrentValue(carrierSelect1));
       });
    },
    
    testUpdateRadio: function() {
         ORBEON.util.Test.executeCausingAjaxRequest(this, function() {
             // Click on DHL radio
             YAHOO.util.UserAction.click("carrier-select1-full" + XFORMS_SEPARATOR_1 + "1-opsitem2");
         }, function() {
             // Check DHL checkbox is checked, and DHL item in lists is selected
             YAHOO.util.Assert.isTrue(YAHOO.util.Dom.get("carrier-select-full" + XFORMS_SEPARATOR_1 + "1-opsitem2").checked);
             YAHOO.util.Assert.isTrue(this.getSelect("carrier-select1-compact" + XFORMS_SEPARATOR_1 + "1").options[2].selected);
             YAHOO.util.Assert.isTrue(this.getSelect("carrier-select-compact" + XFORMS_SEPARATOR_1 + "1").options[2].selected);
        });
    },
    
    testUpdateList: function() {
         ORBEON.util.Test.executeCausingAjaxRequest(this, function() {
             // Set value in list to TNT
             var select1List = this.getSelect("carrier-select1-compact" + XFORMS_SEPARATOR_1 + "1");
             select1List.value = select1List.options[3].value;
             ORBEON.xforms.Events.change({target: select1List});
         }, function() {
             // Check TNT radio button and checkbox is checked, and TNT item in list is selected
             YAHOO.util.Assert.isTrue(YAHOO.util.Dom.get("carrier-select1-full" + XFORMS_SEPARATOR_1 + "1-opsitem3").checked);
             YAHOO.util.Assert.isTrue(YAHOO.util.Dom.get("carrier-select-full" + XFORMS_SEPARATOR_1 + "1-opsitem3").checked);
             YAHOO.util.Assert.isTrue(this.getSelect("carrier-select-compact" + XFORMS_SEPARATOR_1 + "1").options[3].selected);
        });
    },
    
    testUpdateCheckbox: function() {
         ORBEON.util.Test.executeCausingAjaxRequest(this, function() {
             // Click on DHL checkbox (in addition to already selected TNT)
             YAHOO.util.UserAction.click("carrier-select-full" + XFORMS_SEPARATOR_1 + "1-opsitem2");
         }, function() {
             // Check DHL and TNT are selected in the list
             YAHOO.util.Assert.isTrue(this.getSelect("carrier-select-compact" + XFORMS_SEPARATOR_1 + "1").options[2].selected);
             YAHOO.util.Assert.isTrue(this.getSelect("carrier-select-compact" + XFORMS_SEPARATOR_1 + "1").options[3].selected);
        });
    }
}));

YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({

    name: "xforms:input type xs:date",

    dateValueControlId: "date-value" + XFORMS_SEPARATOR_1 + "1",
    dateValueInputId: "date-value" + XFORMS_SEPARATOR_1 + "1$xforms-input-1",

    testOpenHideCalendar: function() {
        // Click on text field
        YAHOO.util.UserAction.click(this.dateValueInputId);
        // Check calendar div shown
        YAHOO.util.Assert.areEqual("block", document.getElementById("orbeon-calendar-div").style.display);
        // Click on body
        YAHOO.util.UserAction.click(document.body);
        // Check calendar div is hidden
        YAHOO.util.Assert.areEqual("none", document.getElementById("orbeon-calendar-div").style.display);
    },

    testCantOpenReadonly: function() {
        ORBEON.util.Test.executeCausingAjaxRequest(this, function() {
            ORBEON.xforms.Document.setValue("readonly", "true");
        }, function() {
            // Check input field has been disabled
            YAHOO.util.Assert.areEqual(true, document.getElementById(this.dateValueInputId).disabled);
            // Click on text field
            YAHOO.util.UserAction.click(this.dateValueInputId);
            // Check that the div is still hidden
            YAHOO.util.Assert.areEqual("none", document.getElementById("orbeon-calendar-div").style.display);
            // Restore read-only = false
            ORBEON.util.Test.executeCausingAjaxRequest(this, function() {
                ORBEON.xforms.Document.setValue("readonly", "false");
            }, function() {});
        });
    },

    checkDateConversion: function(twoDigits, fourDigits) {
        ORBEON.util.Test.executeCausingAjaxRequest(this, function() {
            // This year taken in the 21th century
            ORBEON.xforms.Document.setValue(this.dateValueControlId, "1/1/" + twoDigits);
        }, function() {
            YAHOO.util.Assert.areEqual(fourDigits + "-01-01", ORBEON.xforms.Document.getValue(this.dateValueControlId));
       });
    },

    testTwoDigitClose: function() { this.checkDateConversion ("02", "2002"); },
    testTwoDigitTwentyFirst: function() { this.checkDateConversion ("40", "2040"); },
    testTwoDigitTwentieth: function() { this.checkDateConversion ("85", "1985"); }
}));

YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({

    name: "xforms:input type xs:time",

    timeValueId: "time-value" + XFORMS_SEPARATOR_1 + "1",
    timeValueInputId: "time-value" + XFORMS_SEPARATOR_1 + "1$xforms-input-1",
    dateValueId: "date-value" + XFORMS_SEPARATOR_1 + "1",
    dateValueInputId: "date-value" + XFORMS_SEPARATOR_1 + "1$xforms-input-1",

    workerTimeParsing: function(typedValue, expectedValue) {
        ORBEON.util.Test.executeCausingAjaxRequest(this, function() {
            ORBEON.xforms.Document.setValue(this.timeValueId, typedValue);
        }, function() {
            YAHOO.util.Assert.areEqual(expectedValue, YAHOO.util.Dom.get(this.timeValueInputId).value);
        });
    },

    // Test for: Regression: dateTime field is always invalid when "p.m." is entered
    // http://forge.objectweb.org/tracker/?func=detail&atid=350207&aid=313427&group_id=168
    testParsing: function() {
        var parsedTime = ORBEON.util.DateTime.magicTimeToJSDate("6:00:00 p");
        YAHOO.util.Assert.isNotNull(parsedTime);
    },

    testFirstHourShort:     function() { this.workerTimeParsing("12 am",        "0:00:00 a.m."); },
    testFirstHourMedium:    function() { this.workerTimeParsing("12:30 am",     "0:30:00 a.m."); },
    testFirstHourLong:      function() { this.workerTimeParsing("12:30:40 am",  "0:30:40 a.m."); },
    testNoAmPmShort:        function() { this.workerTimeParsing("12",           "12:00:00 p.m."); },
    testNoAmPmMedium:       function() { this.workerTimeParsing("12:30",        "12:30:00 p.m."); },
    testNoAmPmLong:         function() { this.workerTimeParsing("12:30:40",     "12:30:40 p.m."); },

    testNextYear: function() {
        ORBEON.util.Test.executeCausingAjaxRequest(this, function() {
            ORBEON.xforms.Document.setValue(this.dateValueId, "10/20/2030");
        }, function() {
            // Click on Next Year
            ORBEON.xforms.Events.click({target: YAHOO.util.Dom.get(this.dateValueInputId) });
            var nextYear = YAHOO.util.Dom.getElementsByClassName("calyearright", null, "orbeon-calendar-div")[0];
            YAHOO.util.UserAction.click(nextYear);
            this.wait(function() {
                var monthYear = YAHOO.util.Dom.getElementsByClassName("calnav", null, "orbeon-calendar-div")[0];
                // Check we are no in 2031
                YAHOO.util.Assert.areEqual("October 2031", monthYear.innerHTML);
                // Click previous year twice
                var previousYear = YAHOO.util.Dom.getElementsByClassName("calyearleft", null, "orbeon-calendar-div")[0];
                YAHOO.util.UserAction.click(previousYear);
                YAHOO.util.UserAction.click(previousYear);
                this.wait(function() {
                    // Check we are no in 2029
                    monthYear = YAHOO.util.Dom.getElementsByClassName("calnav", null, "orbeon-calendar-div")[0];
                    YAHOO.util.Assert.areEqual("October 2029", monthYear.innerHTML);
                    YAHOO.util.UserAction.click(document.body);
                }, XFORMS_INTERNAL_SHORT_DELAY_IN_MS);
            }, XFORMS_INTERNAL_SHORT_DELAY_IN_MS);
        });

    }
}));

/*
YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({

    name: "xforms:output appearance=\"xxforms:download\"",

    outputFileId: "output-file-value" + XFORMS_SEPARATOR_1 + "1",

    // Test that the control is correctly restored when the iteration is recreated
    // http://forge.objectweb.org/tracker/index.php?func=detail&aid=313369&group_id=168&atid=350207
    testRepeatCreate: function() {
        ORBEON.util.Test.executeCausingAjaxRequest(this, function() {
            ORBEON.xforms.Document.setValue("repeat-shown", "false");
        }, function() {
            ORBEON.util.Test.executeCausingAjaxRequest(this, function() {
                ORBEON.xforms.Document.setValue("repeat-shown", "true");
            }, function() {
                var control = document.getElementById(this.outputFileId);
                var children = YAHOO.util.Dom.getChildren(control);
                // Check we still have the link
                YAHOO.util.Assert.areEqual(1, children.length);
                var a = children[0];
                // The link points to a dynamic resource
                YAHOO.util.Assert.areNotEqual(-1, a.href.indexOf("/orbeon/xforms-server/dynamic/"));
                // The text for the link is still the same
                YAHOO.util.Assert.areEqual("Download file", ORBEON.util.Dom.getStringValue(a));
            });
        });
    }
}));
*/

ORBEON.xforms.Events.orbeonLoadedEvent.subscribe(function() {
    if (parent && parent.TestManager) {
        parent.TestManager.load();
    } else {
        new YAHOO.tool.TestLogger();
        YAHOO.tool.TestRunner.run();
    }
});