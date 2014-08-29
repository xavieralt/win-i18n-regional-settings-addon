"use strict";

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;
const runtime = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime);

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/AddonManager.jsm");

var addon_version = undefined;
AddonManager.getAddonByID("win-i18n-regional-settings@firefox-addons.odoo.com", function(addon) {
  addon_version = addon.version;
});

if (runtime.OS.toLowerCase() == 'winnt') {
  var registry = Components.classes["@mozilla.org/windows-registry-key;1"]
                  .createInstance(Components.interfaces.nsIWindowsRegKey);
}

// HKCU\Control Panel\International

var regional_settings_list = {
  sNegativeSign: 'number_negative_sign',
  sPositiveSign: 'number_positive_sign',
  sDecimal: 'number_decimal_separtor',
  sThousand: 'number_thousand_separator',
  sGrouping: 'number_grouping',
  sLanguage: 'lang',
  sList: 'list_separator',
  sLongDate: 'date_long_format',
  sShortDate: 'date_short_format',
  sTimeFormat: 'time_long_format',
  sShortTime: 'time_short_format'
};

function win_registry_get_regional_settings(win) {
  var settings = {
    __exposedProps__: {}
  };
  var rsl = regional_settings_list,
      skey = undefined;  // regional settings key

  registry.open(registry.ROOT_KEY_CURRENT_USER,
                "Control Panel\\International", registry.ACCESS_READ);
  Object.keys(rsl).forEach(function(reg_key) {
    skey = rsl[reg_key];
    settings[skey] = registry.readStringValue(reg_key);
    settings['__exposedProps__'][skey] = 'r';
  });
  return settings;
}

function WinI18N() {}

WinI18N.prototype = {
  classID: Components.ID("{0b358c80-375d-4bea-87e7-95bbf6cb4e98}"),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIDOMGlobalPropertyInitializer]),

  init: function init(win) {
    // return list of method that will be exposed under `navigator.win_i18n`
    return {
      get version() { return addon_version },
      get_user_regional_settings: function () {
        if (runtime.OS.toLowerCase() != 'winnt') {
          // this currently only work on Windows.
          return undefined;
        }
        return win_registry_get_regional_settings(win);
      },
      // Special internal attribute to define with attribute is exposed to page-script
      // See: https://wiki.mozilla.org/XPConnect_Chrome_Object_Wrappers
      __exposedProps__: {
        version: 'r',
        get_user_regional_settings: 'r'
      }
    };
  }
};

const NSGetFactory = XPCOMUtils.generateNSGetFactory([WinI18N]);
