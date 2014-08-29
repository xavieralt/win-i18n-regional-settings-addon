Win I18N Regional Settings Addon
============================

This firefox addon expose the currently logged-in Windows user's regional settings to JavaScript. This can be used to adapt webapp behaviour/rendering to be more user-friendly.

_Example:_

```javascript
var rs = navigator.win_i18n.get_user_regional_settings()
if (rs) {
  console.log(rs.number_decimal_separator);
}

```

Currently exposed regional settings _(should be self-explanatory)_:

 * number_negative_sign
 * number_positive_sign
 * number_decimal_separtor
 * number_thousand_separator
 * number_grouping
 * lang
 * list_separator
 * date_long_format
 * date_short_format
 * time_long_format
 * time_short_format

