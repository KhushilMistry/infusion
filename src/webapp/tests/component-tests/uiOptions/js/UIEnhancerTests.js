/*
Copyright 2008-2009 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global fluid, jqUnit, expect, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($) {
    $(document).ready(function () {
        var testSettings = {
            textSize: "1.5",
            textFont: "verdana",
            theme: "bw",
            layout: false
        };
        
        var options = {
            settingsStore: {
                type: "fluid.uiEnhancer.tempStore"
            }
        };
        var tests = new jqUnit.TestCase("UI Enhancer Tests");
        
        tests.test("Initialization", function () {
            expect(13);

            jqUnit.assertEquals("Initially font size classes exist", 3, $(".fl-font-size-90").length);
            jqUnit.assertEquals("Initially layout class exists", 3, $(".fl-layout-linear").length);
            jqUnit.assertEquals("Initially mist class exists", 1, $(".fl-theme-hci").length);
            jqUnit.assertEquals("Initially font-sans class exists", 1, $(".fl-font-sans").length);
            jqUnit.assertEquals("Initially font-arial class exists", 1, $(".fl-font-arial").length);
            jqUnit.assertEquals("Initially text-spacing class exists", 1, $(".fl-font-spacing-3").length);
            fluid.pageEnhancer(options);
            jqUnit.assertEquals("font size classes should not be removed", 3, $(".fl-font-size-90").length);
            jqUnit.assertEquals("layout class is gone", 0, $(".fl-layout-linear").length);
            jqUnit.assertEquals("Fluid theme class is gone", 0, $(".fl-theme-hci").length);
            jqUnit.assertEquals("font sans class is gone", 0, $(".fl-font-sans").length);
            jqUnit.assertEquals("arial class is not set", 0, $(".fl-font-arial").length);
            jqUnit.assertEquals("Things are still styled with 'first-class' ", 3, $(".first-class").length);
            jqUnit.assertEquals("Things are still styled with 'last-class' ", 2, $(".last-class").length);
        });

        tests.test("Settings", function () {
            expect(3);

            var options = {
                savedSettings: testSettings
            };
            var body = $("body");
            var initFontSize = parseFloat(body.css("fontSize"));
            
            var uiEnhancer = fluid.pageEnhancer(options).uiEnhancer;
            
            jqUnit.assertEquals("Large text size is set", initFontSize * uiEnhancer.options.savedSettings.textSize + "px", body.css("fontSize"));
            jqUnit.assertTrue("Verdana font is set", body.hasClass("fl-font-verdana"));
            jqUnit.assertTrue("High contrast is set", body.hasClass("fl-theme-hc"));

        });
        
        tests.test("Cookie", function () {
            var store = fluid.uiEnhancer.cookieStore();
            store.save(testSettings);
            
            // Check that we get back the test settings correctly.
            var result = store.fetch();
            jqUnit.assertDeepEq("The settings are saved and retrieved correctly.", testSettings, result);
            
            // Change the results, save again. It should work again.
            var differentSettings = fluid.copy(testSettings);
            differentSettings.textSize = "2";
            store.save(differentSettings);
            jqUnit.assertEquals("Changed settings are saved correctly.", store.fetch().textSize, "2");
            
            // Let's go check the cookie directly and make sure it's there.
            var cookieNameIndex = document.cookie.indexOf(store.options.cookieName);
            jqUnit.assertTrue("Our cookie should be floating somewhere in the browser.",
                               cookieNameIndex >= 0);
            jqUnit.assertTrue("Our cookie should contain the textSize 2.",
                               document.cookie.indexOf("2") > cookieNameIndex);
                               
            // Now we can create a uiEnhancer and see that the textSize is set to 2
            var enhancer = fluid.pageEnhancer().uiEnhancer;
            jqUnit.assertEquals("The uiEnhancer should have a textSize of 2", "2", enhancer.model.textSize);
            
            // Reset the cookie settings
            store.save(enhancer.options.defaultSiteSettings);
            
        });

        tests.test("Temp store", function () {
            var store = fluid.uiEnhancer.tempStore();
            store.save(testSettings);
            
            // Check that we get back the test settings correctly.
            var result = store.fetch();
            jqUnit.assertDeepEq("The settings are saved and retrieved correctly.", testSettings, result);
            
            // Change the results, save again. It should work again.
            var differentSettings = fluid.copy(testSettings);
            differentSettings.textSize = "32";
            store.save(differentSettings);
            jqUnit.assertEquals("Changed settings are saved correctly.", "32", store.fetch().textSize);
            jqUnit.assertEquals("Theme was saved correctly.", "bw", store.fetch().theme);
                                           
            // Now we can create a uiEnhancer and see that the theme is default not high contrast
            var enhancer = fluid.pageEnhancer().uiEnhancer;
            jqUnit.assertEquals("The uiEnhancer should have a default theme", "default", enhancer.model.theme);
            
        });

    });
})(jQuery);
