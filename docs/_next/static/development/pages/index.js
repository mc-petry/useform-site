(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["static\\development\\pages\\index.js"],{

/***/ "../validate/dist/index.js":
/*!*********************************!*\
  !*** ../validate/dist/index.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __webpack_require__(/*! react */ "./node_modules/react/index.js");
const INITIAL_FORM_OPTIONS = {
    validateOnBlur: true,
    validateOnChange: false
};
const INITIAL_FIELD_STATE = {
    dirty: false,
    touched: false,
    error: null,
    warn: null,
    value: undefined,
};
function useForm(getInitialOptions) {
    const [, setState] = react_1.useState(true);
    const forceUpdate = react_1.useCallback(() => setState(s => !s), []);
    const res = react_1.useMemo(() => {
        const options = getInitialOptions ? getInitialOptions() : {};
        const _defs = (options.fields || {});
        const _opts = {
            ...INITIAL_FORM_OPTIONS,
            ...options
        };
        const _fields = {};
        const fieldNames = () => Object.keys(_fields);
        const transformError = (field, error) => {
            const transformers = _opts.transformers;
            return error
                ? transformers && transformers.error
                    ? transformers.error(error, field)
                    : error
                : null;
        };
        const validateField = (name) => {
            const field = _fields[name];
            const def = _defs[name];
            const validateFn = def.validate;
            const warnFn = def.warn;
            if (validateFn) {
                field.error = transformError(field, validateFn(field.value));
            }
            if (warnFn) {
                field.warn = transformError(field, warnFn(field.value));
            }
            // Validate dependent fields
            let dependent = def.dependent;
            if (dependent) {
                if (typeof dependent === 'string') {
                    dependent = [dependent];
                }
                for (const dep of dependent) {
                    if (_fields[dep].touched) {
                        validateField(dep);
                    }
                }
            }
        };
        const handleChange = (name, value) => {
            const field = _fields[name];
            field.value = value;
            field.dirty = true;
            const def = _defs[name];
            // Validate
            const validateOnChange = def.validateOnChange != null
                ? def.validateOnChange
                : _opts.validateOnChange;
            if (validateOnChange) {
                validateField(name);
            }
            // Handle changed event
            if (def.changed) {
                def.changed(value);
            }
            forceUpdate();
        };
        const handleFocus = (name) => {
            const field = _fields[name];
            field.touched = true;
            forceUpdate();
        };
        const handleBlur = (name) => {
            if (!_fields[name].dirty) {
                return;
            }
            const def = _defs[name];
            const validateOnBlur = def.validateOnBlur != null
                ? def.validateOnBlur
                : _opts.validateOnBlur;
            if (validateOnBlur) {
                validateField(name);
            }
            forceUpdate();
        };
        const proxy = new Proxy(_fields, {
            get(target, name) {
                if (!target[name]) {
                    target[name] = {
                        ref: react_1.createRef(),
                        name,
                        label: undefined,
                        ...INITIAL_FIELD_STATE,
                        onChange: value => handleChange(name, value),
                        onFocus: () => handleFocus(name),
                        onBlur: () => handleBlur(name)
                    };
                    if (!_defs[name]) {
                        _defs[name] = _opts.fieldConfig && _opts.fieldConfig(name) || {};
                    }
                }
                return target[name];
            }
        });
        /**
         * Gets a value that indicates whether the form has error
         */
        const hasError = (fields = fieldNames()) => {
            if (typeof fields === 'string') {
                fields = [fields];
            }
            for (const name of fields) {
                if (_fields[name].error) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Gets a value that indicates whether the form has error
         */
        const hasWarn = (fields = fieldNames()) => {
            if (typeof fields === 'string') {
                fields = [fields];
            }
            for (const name of fields) {
                if (_fields[name].warn) {
                    return true;
                }
            }
            return false;
        };
        const focusInvalidField = () => {
            for (const name of fieldNames()) {
                const field = _fields[name];
                if (field.error) {
                    if (field.ref.current) {
                        field.ref.current.focus();
                    }
                    return;
                }
            }
        };
        /**
         * Validates specific field(s)
         * @returns `true` when form validates successfully
         */
        const validate = async (fields = fieldNames()) => {
            if (typeof fields === 'string') {
                fields = [fields];
            }
            for (const field of fields) {
                validateField(field);
            }
            const err = hasError(fields);
            if (err) {
                focusInvalidField();
            }
            forceUpdate();
            return !err;
        };
        /**
         * Gets a value that indicates whether some field is touched
         */
        const touched = () => {
            for (const name of fieldNames()) {
                if (_fields[name].touched) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Gets a value that indicates whether some field is dirty
         */
        const dirty = () => {
            for (const name of fieldNames()) {
                if (_fields[name].dirty) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Gets form values
         */
        const getValues = () => {
            const data = {};
            fieldNames().forEach(name => {
                data[name] = _fields[name].value;
            });
            return data;
        };
        /**
         * Sets form values
         */
        const setValues = (values) => {
            for (const name of Object.keys(values)) {
                _fields[name].value = values[name];
            }
            forceUpdate();
        };
        /**
         * Handles form submit. Typically should be passed into `<form>`
         */
        const handleSubmit = (e) => {
            e.preventDefault();
            validate()
                .then(success => {
                if (success && _opts.submit) {
                    _opts.submit(getValues());
                }
            });
        };
        /**
         * Resets fields to their initial state
         */
        const reset = (fields = fieldNames()) => {
            for (const name of fields) {
                _fields[name] = {
                    ..._fields[name],
                    ...INITIAL_FIELD_STATE
                };
            }
            forceUpdate();
        };
        /**
         * Adds the dynamic fields.
         */
        const add = (fields) => {
            for (const name of Object.keys(fields)) {
                _defs[name] = fields[name];
            }
            forceUpdate();
        };
        /**
         * Removes the fields. Useful for dynamic fields
         */
        const remove = (fields) => {
            if (typeof fields === 'string') {
                fields = [fields];
            }
            fields.forEach(name => {
                delete _fields[name];
            });
            forceUpdate();
        };
        return {
            fields: proxy,
            validate,
            handleSubmit,
            hasError,
            hasWarn,
            touched,
            dirty,
            getValues,
            setValues,
            reset,
            remove,
            add
        };
    }, []);
    return res;
}
exports.useForm = useForm;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/core-js/array/is-array.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/core-js/array/is-array.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js/library/fn/array/is-array */ "./node_modules/core-js/library/fn/array/is-array.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/core-js/get-iterator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/core-js/get-iterator.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js/library/fn/get-iterator */ "./node_modules/core-js/library/fn/get-iterator.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/core-js/json/stringify.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/core-js/json/stringify.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js/library/fn/json/stringify */ "./node_modules/core-js/library/fn/json/stringify.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/core-js/object/assign.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/core-js/object/assign.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js/library/fn/object/assign */ "./node_modules/core-js/library/fn/object/assign.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/core-js/object/define-property.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/core-js/object/define-property.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js/library/fn/object/define-property */ "./node_modules/core-js/library/fn/object/define-property.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-descriptor.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-descriptor.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js/library/fn/object/get-own-property-descriptor */ "./node_modules/core-js/library/fn/object/get-own-property-descriptor.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js/library/fn/object/get-own-property-symbols */ "./node_modules/core-js/library/fn/object/get-own-property-symbols.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/core-js/object/keys.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/core-js/object/keys.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js/library/fn/object/keys */ "./node_modules/core-js/library/fn/object/keys.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/helpers/esm/arrayWithHoles.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/helpers/esm/arrayWithHoles.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _arrayWithHoles; });
/* harmony import */ var _core_js_array_is_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core-js/array/is-array */ "./node_modules/@babel/runtime-corejs2/core-js/array/is-array.js");
/* harmony import */ var _core_js_array_is_array__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_array_is_array__WEBPACK_IMPORTED_MODULE_0__);

function _arrayWithHoles(arr) {
  if (_core_js_array_is_array__WEBPACK_IMPORTED_MODULE_0___default()(arr)) return arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _defineProperty; });
/* harmony import */ var _core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core-js/object/define-property */ "./node_modules/@babel/runtime-corejs2/core-js/object/define-property.js");
/* harmony import */ var _core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0__);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    _core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0___default()(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/helpers/esm/extends.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/helpers/esm/extends.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _extends; });
/* harmony import */ var _core_js_object_assign__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core-js/object/assign */ "./node_modules/@babel/runtime-corejs2/core-js/object/assign.js");
/* harmony import */ var _core_js_object_assign__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_object_assign__WEBPACK_IMPORTED_MODULE_0__);

function _extends() {
  _extends = _core_js_object_assign__WEBPACK_IMPORTED_MODULE_0___default.a || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/helpers/esm/iterableToArrayLimit.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/helpers/esm/iterableToArrayLimit.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _iterableToArrayLimit; });
/* harmony import */ var _core_js_get_iterator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core-js/get-iterator */ "./node_modules/@babel/runtime-corejs2/core-js/get-iterator.js");
/* harmony import */ var _core_js_get_iterator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_0__);

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = _core_js_get_iterator__WEBPACK_IMPORTED_MODULE_0___default()(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/helpers/esm/nonIterableRest.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/helpers/esm/nonIterableRest.js ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _nonIterableRest; });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectSpread.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/helpers/esm/objectSpread.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _objectSpread; });
/* harmony import */ var _core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core-js/object/get-own-property-descriptor */ "./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-descriptor.js");
/* harmony import */ var _core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core-js/object/get-own-property-symbols */ "./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js");
/* harmony import */ var _core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_object_keys__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core-js/object/keys */ "./node_modules/@babel/runtime-corejs2/core-js/object/keys.js");
/* harmony import */ var _core_js_object_keys__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_object_keys__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");




function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    var ownKeys = _core_js_object_keys__WEBPACK_IMPORTED_MODULE_2___default()(source);

    if (typeof _core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_1___default.a === 'function') {
      ownKeys = ownKeys.concat(_core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_1___default()(source).filter(function (sym) {
        return _core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0___default()(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      Object(_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(target, key, source[key]);
    });
  }

  return target;
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _objectWithoutProperties; });
/* harmony import */ var _core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core-js/object/get-own-property-symbols */ "./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js");
/* harmony import */ var _core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objectWithoutPropertiesLoose */ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutPropertiesLoose.js");


function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = Object(_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(source, excluded);
  var key, i;

  if (_core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_0___default.a) {
    var sourceSymbolKeys = _core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_0___default()(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutPropertiesLoose.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutPropertiesLoose.js ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _objectWithoutPropertiesLoose; });
/* harmony import */ var _core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core-js/object/keys */ "./node_modules/@babel/runtime-corejs2/core-js/object/keys.js");
/* harmony import */ var _core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__);

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};

  var sourceKeys = _core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default()(source);

  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _slicedToArray; });
/* harmony import */ var _arrayWithHoles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles */ "./node_modules/@babel/runtime-corejs2/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit */ "./node_modules/@babel/runtime-corejs2/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _nonIterableRest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nonIterableRest */ "./node_modules/@babel/runtime-corejs2/helpers/esm/nonIterableRest.js");



function _slicedToArray(arr, i) {
  return Object(_arrayWithHoles__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || Object(_iterableToArrayLimit__WEBPACK_IMPORTED_MODULE_1__["default"])(arr, i) || Object(_nonIterableRest__WEBPACK_IMPORTED_MODULE_2__["default"])();
}

/***/ }),

/***/ "./node_modules/@emotion/cache/dist/cache.browser.esm.js":
/*!***************************************************************!*\
  !*** ./node_modules/@emotion/cache/dist/cache.browser.esm.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_sheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/sheet */ "./node_modules/@emotion/sheet/dist/sheet.browser.esm.js");
/* harmony import */ var _emotion_stylis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/stylis */ "./node_modules/@emotion/stylis/dist/stylis.browser.esm.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js");




// https://github.com/thysultan/stylis.js/tree/master/plugins/rule-sheet
// inlined to avoid umd wrapper and peerDep warnings/installing stylis
// since we use stylis after closure compiler
var delimiter = '/*|*/';
var needle = delimiter + '}';

function toSheet(block) {
  if (block) {
    Sheet.current.insert(block + '}');
  }
}

var Sheet = {
  current: null
};
var ruleSheet = function ruleSheet(context, content, selectors, parents, line, column, length, ns, depth, at) {
  switch (context) {
    // property
    case 1:
      {
        switch (content.charCodeAt(0)) {
          case 64:
            {
              // @import
              Sheet.current.insert(content + ';');
              return '';
            }
          // charcode for l

          case 108:
            {
              // charcode for b
              // this ignores label
              if (content.charCodeAt(2) === 98) {
                return '';
              }
            }
        }

        break;
      }
    // selector

    case 2:
      {
        if (ns === 0) return content + delimiter;
        break;
      }
    // at-rule

    case 3:
      {
        switch (ns) {
          // @font-face, @page
          case 102:
          case 112:
            {
              Sheet.current.insert(selectors[0] + content);
              return '';
            }

          default:
            {
              return content + (at === 0 ? delimiter : '');
            }
        }
      }

    case -2:
      {
        content.split(needle).forEach(toSheet);
      }
  }
};

var createCache = function createCache(options) {
  if (options === undefined) options = {};
  var key = options.key || 'css';
  var stylisOptions;

  if (options.prefix !== undefined) {
    stylisOptions = {
      prefix: options.prefix
    };
  }

  var stylis = new _emotion_stylis__WEBPACK_IMPORTED_MODULE_1__["default"](stylisOptions);

  if (true) {
    // $FlowFixMe
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {}; // $FlowFixMe

  var container;

  {
    container = options.container || document.head;
    var nodes = document.querySelectorAll("style[data-emotion-" + key + "]");
    Array.prototype.forEach.call(nodes, function (node) {
      var attrib = node.getAttribute("data-emotion-" + key); // $FlowFixMe

      attrib.split(' ').forEach(function (id) {
        inserted[id] = true;
      });

      if (node.parentNode !== container) {
        container.appendChild(node);
      }
    });
  }

  var _insert;

  {
    stylis.use(options.stylisPlugins)(ruleSheet);

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      var name = serialized.name;
      Sheet.current = sheet;

      if ( true && serialized.map !== undefined) {
        var map = serialized.map;
        Sheet.current = {
          insert: function insert(rule) {
            sheet.insert(rule + map);
          }
        };
      }

      stylis(selector, serialized.styles);

      if (shouldCache) {
        cache.inserted[name] = true;
      }
    };
  }

  if (true) {
    // https://esbench.com/bench/5bf7371a4cd7e6009ef61d0a
    var commentStart = /\/\*/g;
    var commentEnd = /\*\//g;
    stylis.use(function (context, content) {
      switch (context) {
        case -1:
          {
            while (commentStart.test(content)) {
              commentEnd.lastIndex = commentStart.lastIndex;

              if (commentEnd.test(content)) {
                commentStart.lastIndex = commentEnd.lastIndex;
                continue;
              }

              throw new Error('Your styles have an unterminated comment ("/*" without corresponding "*/").');
            }

            commentStart.lastIndex = 0;
            break;
          }
      }
    });
    stylis.use(function (context, content, selectors) {
      switch (context) {
        case -1:
          {
            var flag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';
            var unsafePseudoClasses = content.match(/(:first|:nth|:nth-last)-child/g);

            if (unsafePseudoClasses) {
              unsafePseudoClasses.forEach(function (unsafePseudoClass) {
                var ignoreRegExp = new RegExp(unsafePseudoClass + ".*\\/\\* " + flag + " \\*\\/");
                var ignore = ignoreRegExp.test(content);

                if (unsafePseudoClass && !ignore) {
                  console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
                }
              });
            }

            break;
          }
      }
    });
  }

  var cache = {
    key: key,
    sheet: new _emotion_sheet__WEBPACK_IMPORTED_MODULE_0__["StyleSheet"]({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  return cache;
};

/* harmony default export */ __webpack_exports__["default"] = (createCache);


/***/ }),

/***/ "./node_modules/@emotion/core/dist/core.browser.esm.js":
/*!*************************************************************!*\
  !*** ./node_modules/@emotion/core/dist/core.browser.esm.js ***!
  \*************************************************************/
/*! exports provided: css, withEmotionCache, CacheProvider, ThemeContext, jsx, Global, keyframes, ClassNames */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withEmotionCache", function() { return withEmotionCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CacheProvider", function() { return CacheProvider; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThemeContext", function() { return ThemeContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jsx", function() { return jsx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Global", function() { return Global; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keyframes", function() { return keyframes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClassNames", function() { return ClassNames; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/cache */ "./node_modules/@emotion/cache/dist/cache.browser.esm.js");
/* harmony import */ var _emotion_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/utils */ "./node_modules/@emotion/utils/dist/utils.browser.esm.js");
/* harmony import */ var _emotion_serialize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/serialize */ "./node_modules/@emotion/serialize/dist/serialize.browser.esm.js");
/* harmony import */ var _emotion_sheet__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/sheet */ "./node_modules/@emotion/sheet/dist/sheet.browser.esm.js");
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "css", function() { return _emotion_css__WEBPACK_IMPORTED_MODULE_5__["default"]; });









function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var EmotionCacheContext = Object(react__WEBPACK_IMPORTED_MODULE_0__["createContext"])(Object(_emotion_cache__WEBPACK_IMPORTED_MODULE_1__["default"])());
var ThemeContext = Object(react__WEBPACK_IMPORTED_MODULE_0__["createContext"])({});
var CacheProvider = EmotionCacheContext.Provider;

var withEmotionCache = function withEmotionCache(func) {
  var render = function render(props, ref) {
    return Object(react__WEBPACK_IMPORTED_MODULE_0__["createElement"])(EmotionCacheContext.Consumer, null, function ( // $FlowFixMe we know it won't be null
    cache) {
      return func(props, cache, ref);
    });
  }; // $FlowFixMe


  return Object(react__WEBPACK_IMPORTED_MODULE_0__["forwardRef"])(render);
};

var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
var labelPropName = '__EMOTION_LABEL_PLEASE_DO_NOT_USE__';
var hasOwnProperty = Object.prototype.hasOwnProperty;

var render = function render(cache, props, theme, ref) {
  var type = props[typePropName];
  var registeredStyles = [];
  var className = '';
  var cssProp = theme === null ? props.css : props.css(theme); // so that using `css` from `emotion` and passing the result to the css prop works
  // not passing the registered cache to serializeStyles because it would
  // make certain babel optimisations not possible

  if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
    cssProp = cache.registered[cssProp];
  }

  registeredStyles.push(cssProp);

  if (props.className !== undefined) {
    className = Object(_emotion_utils__WEBPACK_IMPORTED_MODULE_2__["getRegisteredStyles"])(cache.registered, registeredStyles, props.className);
  }

  var serialized = Object(_emotion_serialize__WEBPACK_IMPORTED_MODULE_3__["serializeStyles"])(registeredStyles);

  if ( true && serialized.name.indexOf('-') === -1) {
    var labelFromStack = props[labelPropName];

    if (labelFromStack) {
      serialized = Object(_emotion_serialize__WEBPACK_IMPORTED_MODULE_3__["serializeStyles"])([serialized, 'label:' + labelFromStack + ';']);
    }
  }

  var rules = Object(_emotion_utils__WEBPACK_IMPORTED_MODULE_2__["insertStyles"])(cache, serialized, typeof type === 'string');
  className += cache.key + "-" + serialized.name;
  var newProps = {};

  for (var key in props) {
    if (hasOwnProperty.call(props, key) && key !== 'css' && key !== typePropName && ( false || key !== labelPropName)) {
      newProps[key] = props[key];
    }
  }

  newProps.ref = ref;
  newProps.className = className;
  var ele = Object(react__WEBPACK_IMPORTED_MODULE_0__["createElement"])(type, newProps);

  return ele;
};

var Emotion = withEmotionCache(function (props, cache, ref) {
  // use Context.read for the theme when it's stable
  if (typeof props.css === 'function') {
    return Object(react__WEBPACK_IMPORTED_MODULE_0__["createElement"])(ThemeContext.Consumer, null, function (theme) {
      return render(cache, props, theme, ref);
    });
  }

  return render(cache, props, null, ref);
});

if (true) {
  Emotion.displayName = 'EmotionCssPropInternal';
} // $FlowFixMe


var jsx = function jsx(type, props) {
  var args = arguments;

  if (props == null || props.css == null) {
    // $FlowFixMe
    return react__WEBPACK_IMPORTED_MODULE_0__["createElement"].apply(undefined, args);
  }

  if ( true && typeof props.css === 'string' && // check if there is a css declaration
  props.css.indexOf(':') !== -1) {
    throw new Error("Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/css' like this: css`" + props.css + "`");
  }

  var argsLength = args.length;
  var createElementArgArray = new Array(argsLength);
  createElementArgArray[0] = Emotion;
  var newProps = {};

  for (var key in props) {
    if (hasOwnProperty.call(props, key)) {
      newProps[key] = props[key];
    }
  }

  newProps[typePropName] = type;

  if (true) {
    var error = new Error();

    if (error.stack) {
      // chrome
      var match = error.stack.match(/at jsx.*\n\s+at ([A-Z][A-Za-z]+) /);

      if (!match) {
        // safari and firefox
        match = error.stack.match(/^.*\n([A-Z][A-Za-z]+)@/);
      }

      if (match) {
        newProps[labelPropName] = match[1];
      }
    }
  }

  createElementArgArray[1] = newProps;

  for (var i = 2; i < argsLength; i++) {
    createElementArgArray[i] = args[i];
  } // $FlowFixMe


  return react__WEBPACK_IMPORTED_MODULE_0__["createElement"].apply(null, createElementArgArray);
};

var warnedAboutCssPropForGlobal = false;
var Global =
/* #__PURE__ */
withEmotionCache(function (props, cache) {
  if ( true && !warnedAboutCssPropForGlobal && ( // check for className as well since the user is
  // probably using the custom createElement which
  // means it will be turned into a className prop
  // $FlowFixMe I don't really want to add it to the type since it shouldn't be used
  props.className || props.css)) {
    console.error("It looks like you're using the css prop on Global, did you mean to use the styles prop instead?");
    warnedAboutCssPropForGlobal = true;
  }

  var styles = props.styles;

  if (typeof styles === 'function') {
    return Object(react__WEBPACK_IMPORTED_MODULE_0__["createElement"])(ThemeContext.Consumer, null, function (theme) {
      var serialized = Object(_emotion_serialize__WEBPACK_IMPORTED_MODULE_3__["serializeStyles"])([styles(theme)]);
      return Object(react__WEBPACK_IMPORTED_MODULE_0__["createElement"])(InnerGlobal, {
        serialized: serialized,
        cache: cache
      });
    });
  }

  var serialized = Object(_emotion_serialize__WEBPACK_IMPORTED_MODULE_3__["serializeStyles"])([styles]);
  return Object(react__WEBPACK_IMPORTED_MODULE_0__["createElement"])(InnerGlobal, {
    serialized: serialized,
    cache: cache
  });
});

// maintain place over rerenders.
// initial render from browser, insertBefore context.sheet.tags[0] or if a style hasn't been inserted there yet, appendChild
// initial client-side render from SSR, use place of hydrating tag
var InnerGlobal =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(InnerGlobal, _React$Component);

  function InnerGlobal(props, context, updater) {
    return _React$Component.call(this, props, context, updater) || this;
  }

  var _proto = InnerGlobal.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.sheet = new _emotion_sheet__WEBPACK_IMPORTED_MODULE_4__["StyleSheet"]({
      key: this.props.cache.key + "-global",
      nonce: this.props.cache.sheet.nonce,
      container: this.props.cache.sheet.container
    }); // $FlowFixMe

    var node = document.querySelector("style[data-emotion-" + this.props.cache.key + "=\"" + this.props.serialized.name + "\"]");

    if (node !== null) {
      this.sheet.tags.push(node);
    }

    if (this.props.cache.sheet.tags.length) {
      this.sheet.before = this.props.cache.sheet.tags[0];
    }

    this.insertStyles();
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.serialized.name !== this.props.serialized.name) {
      this.insertStyles();
    }
  };

  _proto.insertStyles = function insertStyles$$1() {
    if (this.props.serialized.next !== undefined) {
      // insert keyframes
      Object(_emotion_utils__WEBPACK_IMPORTED_MODULE_2__["insertStyles"])(this.props.cache, this.props.serialized.next, true);
    }

    if (this.sheet.tags.length) {
      // if this doesn't exist then it will be null so the style element will be appended
      var element = this.sheet.tags[this.sheet.tags.length - 1].nextElementSibling;
      this.sheet.before = element;
      this.sheet.flush();
    }

    this.props.cache.insert("", this.props.serialized, this.sheet, false);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.sheet.flush();
  };

  _proto.render = function render() {

    return null;
  };

  return InnerGlobal;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

var keyframes = function keyframes() {
  var insertable = _emotion_css__WEBPACK_IMPORTED_MODULE_5__["default"].apply(void 0, arguments);
  var name = "animation-" + insertable.name; // $FlowFixMe

  return {
    name: name,
    styles: "@keyframes " + name + "{" + insertable.styles + "}",
    anim: 1,
    toString: function toString() {
      return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
    }
  };
};

var classnames = function classnames(args) {
  var len = args.length;
  var i = 0;
  var cls = '';

  for (; i < len; i++) {
    var arg = args[i];
    if (arg == null) continue;
    var toAdd = void 0;

    switch (typeof arg) {
      case 'boolean':
        break;

      case 'object':
        {
          if (Array.isArray(arg)) {
            toAdd = classnames(arg);
          } else {
            toAdd = '';

            for (var k in arg) {
              if (arg[k] && k) {
                toAdd && (toAdd += ' ');
                toAdd += k;
              }
            }
          }

          break;
        }

      default:
        {
          toAdd = arg;
        }
    }

    if (toAdd) {
      cls && (cls += ' ');
      cls += toAdd;
    }
  }

  return cls;
};

function merge(registered, css$$1, className) {
  var registeredStyles = [];
  var rawClassName = Object(_emotion_utils__WEBPACK_IMPORTED_MODULE_2__["getRegisteredStyles"])(registered, registeredStyles, className);

  if (registeredStyles.length < 2) {
    return className;
  }

  return rawClassName + css$$1(registeredStyles);
}

var ClassNames = withEmotionCache(function (props, context) {
  return Object(react__WEBPACK_IMPORTED_MODULE_0__["createElement"])(ThemeContext.Consumer, null, function (theme) {
    var hasRendered = false;

    var css$$1 = function css$$1() {
      if (hasRendered && "development" !== 'production') {
        throw new Error('css can only be used during render');
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var serialized = Object(_emotion_serialize__WEBPACK_IMPORTED_MODULE_3__["serializeStyles"])(args, context.registered);

      {
        Object(_emotion_utils__WEBPACK_IMPORTED_MODULE_2__["insertStyles"])(context, serialized, false);
      }

      return context.key + "-" + serialized.name;
    };

    var cx = function cx() {
      if (hasRendered && "development" !== 'production') {
        throw new Error('cx can only be used during render');
      }

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return merge(context.registered, css$$1, classnames(args));
    };

    var content = {
      css: css$$1,
      cx: cx,
      theme: theme
    };
    var ele = props.children(content);
    hasRendered = true;

    return ele;
  });
});




/***/ }),

/***/ "./node_modules/@emotion/css/dist/css.browser.esm.js":
/*!***********************************************************!*\
  !*** ./node_modules/@emotion/css/dist/css.browser.esm.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_serialize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/serialize */ "./node_modules/@emotion/serialize/dist/serialize.browser.esm.js");


function css() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return Object(_emotion_serialize__WEBPACK_IMPORTED_MODULE_0__["serializeStyles"])(args);
}

/* harmony default export */ __webpack_exports__["default"] = (css);


/***/ }),

/***/ "./node_modules/@emotion/hash/dist/hash.browser.esm.js":
/*!*************************************************************!*\
  !*** ./node_modules/@emotion/hash/dist/hash.browser.esm.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* eslint-disable */
// murmurhash2 via https://github.com/garycourt/murmurhash-js/blob/master/murmurhash2_gc.js
function murmurhash2_32_gc(str) {
  var l = str.length,
      h = l ^ l,
      i = 0,
      k;

  while (l >= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    k ^= k >>> 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;
    l -= 4;
    ++i;
  }

  switch (l) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  }

  h ^= h >>> 13;
  h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  h ^= h >>> 15;
  return (h >>> 0).toString(36);
}

/* harmony default export */ __webpack_exports__["default"] = (murmurhash2_32_gc);


/***/ }),

/***/ "./node_modules/@emotion/memoize/dist/memoize.browser.esm.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@emotion/memoize/dist/memoize.browser.esm.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function memoize(fn) {
  var cache = {};
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

/* harmony default export */ __webpack_exports__["default"] = (memoize);


/***/ }),

/***/ "./node_modules/@emotion/serialize/dist/serialize.browser.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@emotion/serialize/dist/serialize.browser.esm.js ***!
  \***********************************************************************/
/*! exports provided: serializeStyles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "serializeStyles", function() { return serializeStyles; });
/* harmony import */ var _emotion_hash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/hash */ "./node_modules/@emotion/hash/dist/hash.browser.esm.js");
/* harmony import */ var _emotion_unitless__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/unitless */ "./node_modules/@emotion/unitless/dist/unitless.browser.esm.js");
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/memoize.browser.esm.js");




var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
var processStyleName = Object(_emotion_memoize__WEBPACK_IMPORTED_MODULE_2__["default"])(function (styleName) {
  return styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  if (value == null || typeof value === 'boolean') {
    return '';
  }

  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          value = value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (_emotion_unitless__WEBPACK_IMPORTED_MODULE_1__["default"][key] !== 1 && key.charCodeAt(1) !== 45 && // custom properties
  typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

if (true) {
  var contentValuePattern = /(attr|calc|counters?|url)\(/;
  var contentValues = ['normal', 'none', 'counter', 'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;
  var msPattern = /^-ms-/;
  var hyphenPattern = /-(.)/g;
  var hyphenatedCache = {};

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        console.error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue(key, value);
    var isCssVariable = key.charCodeAt(1) === 45;

    if (processed !== '' && !isCssVariable && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
      hyphenatedCache[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, char) {
        return char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

var shouldWarnAboutInterpolatingClassNameFromCss = true;

function handleInterpolation(mergedProps, registered, interpolation, couldBeSelectorInterpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {
    if ( true && interpolation.toString() === 'NO_COMPONENT_SELECTOR') {
      throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
    }

    return interpolation;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }

        if (interpolation.styles !== undefined) {
          var next = interpolation.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = interpolation.styles;

          if ( true && interpolation.map !== undefined) {
            styles += interpolation.map;
          }

          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result, couldBeSelectorInterpolation);
        } else if (true) {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }
      }
    // eslint-disable-next-line no-fallthrough

    default:
      {
        if (registered == null) {
          return interpolation;
        }

        var cached = registered[interpolation];

        if ( true && couldBeSelectorInterpolation && shouldWarnAboutInterpolatingClassNameFromCss && cached !== undefined) {
          console.error('Interpolating a className from css`` is not recommended and will cause problems with composition.\n' + 'Interpolating a className from css`` will be completely unsupported in a future major version of Emotion');
          shouldWarnAboutInterpolatingClassNameFromCss = false;
        }

        return cached !== undefined && !couldBeSelectorInterpolation ? cached : interpolation;
      }
  }
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i], false);
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + "{" + registered[value] + "}";
        } else {
          string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
        }
      } else {
        if (_key === 'NO_COMPONENT_SELECTOR' && "development" !== 'production') {
          throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
          }
        } else {
          string += _key + "{" + handleInterpolation(mergedProps, registered, value, false) + "}";
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;\n{]+)\s*;/g;
var sourceMapPattern;

if (true) {
  sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//;
} // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list


var cursor;
var serializeStyles = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings, false);
  } else {
    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i], styles.charCodeAt(styles.length - 1) === 46);

    if (stringMode) {
      styles += strings[i];
    }
  }

  var sourceMap;

  if (true) {
    styles = styles.replace(sourceMapPattern, function (match) {
      sourceMap = match;
      return '';
    });
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + // $FlowFixMe we know it's not null
    match[1];
  }

  var name = Object(_emotion_hash__WEBPACK_IMPORTED_MODULE_0__["default"])(styles) + identifierName;

  if (true) {
    return {
      name: name,
      styles: styles,
      map: sourceMap,
      next: cursor
    };
  }

  return {
    name: name,
    styles: styles,
    next: cursor
  };
};




/***/ }),

/***/ "./node_modules/@emotion/sheet/dist/sheet.browser.esm.js":
/*!***************************************************************!*\
  !*** ./node_modules/@emotion/sheet/dist/sheet.browser.esm.js ***!
  \***************************************************************/
/*! exports provided: StyleSheet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StyleSheet", function() { return StyleSheet; });
/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  return tag;
}

var StyleSheet =
/*#__PURE__*/
function () {
  function StyleSheet(options) {
    this.isSpeedy = options.speedy === undefined ? "development" === 'production' : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      var _tag = createStyleElement(this);

      var before;

      if (this.tags.length === 0) {
        before = this.before;
      } else {
        before = this.tags[this.tags.length - 1].nextSibling;
      }

      this.container.insertBefore(_tag, before);
      this.tags.push(_tag);
    }

    var tag = this.tags[this.tags.length - 1];

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is a really hot path
        // we check the second character first because having "i"
        // as the second character will happen less often than
        // having "@" as the first character
        var isImportRule = rule.charCodeAt(1) === 105 && rule.charCodeAt(0) === 64; // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools

        sheet.insertRule(rule, // we need to insert @import rules before anything else
        // otherwise there will be an error
        // technically this means that the @import rules will
        // _usually_(not always since there could be multiple style tags)
        // be the first ones in prod and generally later in dev
        // this shouldn't really matter in the real world though
        // @import is generally only used for font faces from google fonts and etc.
        // so while this could be technically correct then it would be slower and larger
        // for a tiny bit of correctness that won't matter in the real world
        isImportRule ? 0 : sheet.cssRules.length);
      } catch (e) {
        if (true) {
          console.warn("There was a problem inserting the following rule: \"" + rule + "\"", e);
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;
  };

  return StyleSheet;
}();




/***/ }),

/***/ "./node_modules/@emotion/stylis/dist/stylis.browser.esm.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@emotion/stylis/dist/stylis.browser.esm.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function stylis_min (W) {
  function M(d, c, e, h, a) {
    for (var m = 0, b = 0, v = 0, n = 0, q, g, x = 0, K = 0, k, u = k = q = 0, l = 0, r = 0, I = 0, t = 0, B = e.length, J = B - 1, y, f = '', p = '', F = '', G = '', C; l < B;) {
      g = e.charCodeAt(l);
      l === J && 0 !== b + n + v + m && (0 !== b && (g = 47 === b ? 10 : 47), n = v = m = 0, B++, J++);

      if (0 === b + n + v + m) {
        if (l === J && (0 < r && (f = f.replace(N, '')), 0 < f.trim().length)) {
          switch (g) {
            case 32:
            case 9:
            case 59:
            case 13:
            case 10:
              break;

            default:
              f += e.charAt(l);
          }

          g = 59;
        }

        switch (g) {
          case 123:
            f = f.trim();
            q = f.charCodeAt(0);
            k = 1;

            for (t = ++l; l < B;) {
              switch (g = e.charCodeAt(l)) {
                case 123:
                  k++;
                  break;

                case 125:
                  k--;
                  break;

                case 47:
                  switch (g = e.charCodeAt(l + 1)) {
                    case 42:
                    case 47:
                      a: {
                        for (u = l + 1; u < J; ++u) {
                          switch (e.charCodeAt(u)) {
                            case 47:
                              if (42 === g && 42 === e.charCodeAt(u - 1) && l + 2 !== u) {
                                l = u + 1;
                                break a;
                              }

                              break;

                            case 10:
                              if (47 === g) {
                                l = u + 1;
                                break a;
                              }

                          }
                        }

                        l = u;
                      }

                  }

                  break;

                case 91:
                  g++;

                case 40:
                  g++;

                case 34:
                case 39:
                  for (; l++ < J && e.charCodeAt(l) !== g;) {
                  }

              }

              if (0 === k) break;
              l++;
            }

            k = e.substring(t, l);
            0 === q && (q = (f = f.replace(ca, '').trim()).charCodeAt(0));

            switch (q) {
              case 64:
                0 < r && (f = f.replace(N, ''));
                g = f.charCodeAt(1);

                switch (g) {
                  case 100:
                  case 109:
                  case 115:
                  case 45:
                    r = c;
                    break;

                  default:
                    r = O;
                }

                k = M(c, r, k, g, a + 1);
                t = k.length;
                0 < A && (r = X(O, f, I), C = H(3, k, r, c, D, z, t, g, a, h), f = r.join(''), void 0 !== C && 0 === (t = (k = C.trim()).length) && (g = 0, k = ''));
                if (0 < t) switch (g) {
                  case 115:
                    f = f.replace(da, ea);

                  case 100:
                  case 109:
                  case 45:
                    k = f + '{' + k + '}';
                    break;

                  case 107:
                    f = f.replace(fa, '$1 $2');
                    k = f + '{' + k + '}';
                    k = 1 === w || 2 === w && L('@' + k, 3) ? '@-webkit-' + k + '@' + k : '@' + k;
                    break;

                  default:
                    k = f + k, 112 === h && (k = (p += k, ''));
                } else k = '';
                break;

              default:
                k = M(c, X(c, f, I), k, h, a + 1);
            }

            F += k;
            k = I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
            break;

          case 125:
          case 59:
            f = (0 < r ? f.replace(N, '') : f).trim();
            if (1 < (t = f.length)) switch (0 === u && (q = f.charCodeAt(0), 45 === q || 96 < q && 123 > q) && (t = (f = f.replace(' ', ':')).length), 0 < A && void 0 !== (C = H(1, f, c, d, D, z, p.length, h, a, h)) && 0 === (t = (f = C.trim()).length) && (f = '\x00\x00'), q = f.charCodeAt(0), g = f.charCodeAt(1), q) {
              case 0:
                break;

              case 64:
                if (105 === g || 99 === g) {
                  G += f + e.charAt(l);
                  break;
                }

              default:
                58 !== f.charCodeAt(t - 1) && (p += P(f, q, g, f.charCodeAt(2)));
            }
            I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
        }
      }

      switch (g) {
        case 13:
        case 10:
          47 === b ? b = 0 : 0 === 1 + q && 107 !== h && 0 < f.length && (r = 1, f += '\x00');
          0 < A * Y && H(0, f, c, d, D, z, p.length, h, a, h);
          z = 1;
          D++;
          break;

        case 59:
        case 125:
          if (0 === b + n + v + m) {
            z++;
            break;
          }

        default:
          z++;
          y = e.charAt(l);

          switch (g) {
            case 9:
            case 32:
              if (0 === n + m + b) switch (x) {
                case 44:
                case 58:
                case 9:
                case 32:
                  y = '';
                  break;

                default:
                  32 !== g && (y = ' ');
              }
              break;

            case 0:
              y = '\\0';
              break;

            case 12:
              y = '\\f';
              break;

            case 11:
              y = '\\v';
              break;

            case 38:
              0 === n + b + m && (r = I = 1, y = '\f' + y);
              break;

            case 108:
              if (0 === n + b + m + E && 0 < u) switch (l - u) {
                case 2:
                  112 === x && 58 === e.charCodeAt(l - 3) && (E = x);

                case 8:
                  111 === K && (E = K);
              }
              break;

            case 58:
              0 === n + b + m && (u = l);
              break;

            case 44:
              0 === b + v + n + m && (r = 1, y += '\r');
              break;

            case 34:
            case 39:
              0 === b && (n = n === g ? 0 : 0 === n ? g : n);
              break;

            case 91:
              0 === n + b + v && m++;
              break;

            case 93:
              0 === n + b + v && m--;
              break;

            case 41:
              0 === n + b + m && v--;
              break;

            case 40:
              if (0 === n + b + m) {
                if (0 === q) switch (2 * x + 3 * K) {
                  case 533:
                    break;

                  default:
                    q = 1;
                }
                v++;
              }

              break;

            case 64:
              0 === b + v + n + m + u + k && (k = 1);
              break;

            case 42:
            case 47:
              if (!(0 < n + m + v)) switch (b) {
                case 0:
                  switch (2 * g + 3 * e.charCodeAt(l + 1)) {
                    case 235:
                      b = 47;
                      break;

                    case 220:
                      t = l, b = 42;
                  }

                  break;

                case 42:
                  47 === g && 42 === x && t + 2 !== l && (33 === e.charCodeAt(t + 2) && (p += e.substring(t, l + 1)), y = '', b = 0);
              }
          }

          0 === b && (f += y);
      }

      K = x;
      x = g;
      l++;
    }

    t = p.length;

    if (0 < t) {
      r = c;
      if (0 < A && (C = H(2, p, r, d, D, z, t, h, a, h), void 0 !== C && 0 === (p = C).length)) return G + p + F;
      p = r.join(',') + '{' + p + '}';

      if (0 !== w * E) {
        2 !== w || L(p, 2) || (E = 0);

        switch (E) {
          case 111:
            p = p.replace(ha, ':-moz-$1') + p;
            break;

          case 112:
            p = p.replace(Q, '::-webkit-input-$1') + p.replace(Q, '::-moz-$1') + p.replace(Q, ':-ms-input-$1') + p;
        }

        E = 0;
      }
    }

    return G + p + F;
  }

  function X(d, c, e) {
    var h = c.trim().split(ia);
    c = h;
    var a = h.length,
        m = d.length;

    switch (m) {
      case 0:
      case 1:
        var b = 0;

        for (d = 0 === m ? '' : d[0] + ' '; b < a; ++b) {
          c[b] = Z(d, c[b], e, m).trim();
        }

        break;

      default:
        var v = b = 0;

        for (c = []; b < a; ++b) {
          for (var n = 0; n < m; ++n) {
            c[v++] = Z(d[n] + ' ', h[b], e, m).trim();
          }
        }

    }

    return c;
  }

  function Z(d, c, e) {
    var h = c.charCodeAt(0);
    33 > h && (h = (c = c.trim()).charCodeAt(0));

    switch (h) {
      case 38:
        return c.replace(F, '$1' + d.trim());

      case 58:
        return d.trim() + c.replace(F, '$1' + d.trim());

      default:
        if (0 < 1 * e && 0 < c.indexOf('\f')) return c.replace(F, (58 === d.charCodeAt(0) ? '' : '$1') + d.trim());
    }

    return d + c;
  }

  function P(d, c, e, h) {
    var a = d + ';',
        m = 2 * c + 3 * e + 4 * h;

    if (944 === m) {
      d = a.indexOf(':', 9) + 1;
      var b = a.substring(d, a.length - 1).trim();
      b = a.substring(0, d).trim() + b + ';';
      return 1 === w || 2 === w && L(b, 1) ? '-webkit-' + b + b : b;
    }

    if (0 === w || 2 === w && !L(a, 1)) return a;

    switch (m) {
      case 1015:
        return 97 === a.charCodeAt(10) ? '-webkit-' + a + a : a;

      case 951:
        return 116 === a.charCodeAt(3) ? '-webkit-' + a + a : a;

      case 963:
        return 110 === a.charCodeAt(5) ? '-webkit-' + a + a : a;

      case 1009:
        if (100 !== a.charCodeAt(4)) break;

      case 969:
      case 942:
        return '-webkit-' + a + a;

      case 978:
        return '-webkit-' + a + '-moz-' + a + a;

      case 1019:
      case 983:
        return '-webkit-' + a + '-moz-' + a + '-ms-' + a + a;

      case 883:
        if (45 === a.charCodeAt(8)) return '-webkit-' + a + a;
        if (0 < a.indexOf('image-set(', 11)) return a.replace(ja, '$1-webkit-$2') + a;
        break;

      case 932:
        if (45 === a.charCodeAt(4)) switch (a.charCodeAt(5)) {
          case 103:
            return '-webkit-box-' + a.replace('-grow', '') + '-webkit-' + a + '-ms-' + a.replace('grow', 'positive') + a;

          case 115:
            return '-webkit-' + a + '-ms-' + a.replace('shrink', 'negative') + a;

          case 98:
            return '-webkit-' + a + '-ms-' + a.replace('basis', 'preferred-size') + a;
        }
        return '-webkit-' + a + '-ms-' + a + a;

      case 964:
        return '-webkit-' + a + '-ms-flex-' + a + a;

      case 1023:
        if (99 !== a.charCodeAt(8)) break;
        b = a.substring(a.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
        return '-webkit-box-pack' + b + '-webkit-' + a + '-ms-flex-pack' + b + a;

      case 1005:
        return ka.test(a) ? a.replace(aa, ':-webkit-') + a.replace(aa, ':-moz-') + a : a;

      case 1e3:
        b = a.substring(13).trim();
        c = b.indexOf('-') + 1;

        switch (b.charCodeAt(0) + b.charCodeAt(c)) {
          case 226:
            b = a.replace(G, 'tb');
            break;

          case 232:
            b = a.replace(G, 'tb-rl');
            break;

          case 220:
            b = a.replace(G, 'lr');
            break;

          default:
            return a;
        }

        return '-webkit-' + a + '-ms-' + b + a;

      case 1017:
        if (-1 === a.indexOf('sticky', 9)) break;

      case 975:
        c = (a = d).length - 10;
        b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a).substring(d.indexOf(':', 7) + 1).trim();

        switch (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0)) {
          case 203:
            if (111 > b.charCodeAt(8)) break;

          case 115:
            a = a.replace(b, '-webkit-' + b) + ';' + a;
            break;

          case 207:
          case 102:
            a = a.replace(b, '-webkit-' + (102 < m ? 'inline-' : '') + 'box') + ';' + a.replace(b, '-webkit-' + b) + ';' + a.replace(b, '-ms-' + b + 'box') + ';' + a;
        }

        return a + ';';

      case 938:
        if (45 === a.charCodeAt(5)) switch (a.charCodeAt(6)) {
          case 105:
            return b = a.replace('-items', ''), '-webkit-' + a + '-webkit-box-' + b + '-ms-flex-' + b + a;

          case 115:
            return '-webkit-' + a + '-ms-flex-item-' + a.replace(ba, '') + a;

          default:
            return '-webkit-' + a + '-ms-flex-line-pack' + a.replace('align-content', '').replace(ba, '') + a;
        }
        break;

      case 973:
      case 989:
        if (45 !== a.charCodeAt(3) || 122 === a.charCodeAt(4)) break;

      case 931:
      case 953:
        if (!0 === la.test(d)) return 115 === (b = d.substring(d.indexOf(':') + 1)).charCodeAt(0) ? P(d.replace('stretch', 'fill-available'), c, e, h).replace(':fill-available', ':stretch') : a.replace(b, '-webkit-' + b) + a.replace(b, '-moz-' + b.replace('fill-', '')) + a;
        break;

      case 962:
        if (a = '-webkit-' + a + (102 === a.charCodeAt(5) ? '-ms-' + a : '') + a, 211 === e + h && 105 === a.charCodeAt(13) && 0 < a.indexOf('transform', 10)) return a.substring(0, a.indexOf(';', 27) + 1).replace(ma, '$1-webkit-$2') + a;
    }

    return a;
  }

  function L(d, c) {
    var e = d.indexOf(1 === c ? ':' : '{'),
        h = d.substring(0, 3 !== c ? e : 10);
    e = d.substring(e + 1, d.length - 1);
    return R(2 !== c ? h : h.replace(na, '$1'), e, c);
  }

  function ea(d, c) {
    var e = P(c, c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2));
    return e !== c + ';' ? e.replace(oa, ' or ($1)').substring(4) : '(' + c + ')';
  }

  function H(d, c, e, h, a, m, b, v, n, q) {
    for (var g = 0, x = c, w; g < A; ++g) {
      switch (w = S[g].call(B, d, x, e, h, a, m, b, v, n, q)) {
        case void 0:
        case !1:
        case !0:
        case null:
          break;

        default:
          x = w;
      }
    }

    if (x !== c) return x;
  }

  function T(d) {
    switch (d) {
      case void 0:
      case null:
        A = S.length = 0;
        break;

      default:
        if ('function' === typeof d) S[A++] = d;else if ('object' === typeof d) for (var c = 0, e = d.length; c < e; ++c) {
          T(d[c]);
        } else Y = !!d | 0;
    }

    return T;
  }

  function U(d) {
    d = d.prefix;
    void 0 !== d && (R = null, d ? 'function' !== typeof d ? w = 1 : (w = 2, R = d) : w = 0);
    return U;
  }

  function B(d, c) {
    var e = d;
    33 > e.charCodeAt(0) && (e = e.trim());
    V = e;
    e = [V];

    if (0 < A) {
      var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
      void 0 !== h && 'string' === typeof h && (c = h);
    }

    var a = M(O, e, c, 0, 0);
    0 < A && (h = H(-2, a, e, e, D, z, a.length, 0, 0, 0), void 0 !== h && (a = h));
    V = '';
    E = 0;
    z = D = 1;
    return a;
  }

  var ca = /^\0+/g,
      N = /[\0\r\f]/g,
      aa = /: */g,
      ka = /zoo|gra/,
      ma = /([,: ])(transform)/g,
      ia = /,\r+?/g,
      F = /([\t\r\n ])*\f?&/g,
      fa = /@(k\w+)\s*(\S*)\s*/,
      Q = /::(place)/g,
      ha = /:(read-only)/g,
      G = /[svh]\w+-[tblr]{2}/,
      da = /\(\s*(.*)\s*\)/g,
      oa = /([\s\S]*?);/g,
      ba = /-self|flex-/g,
      na = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
      la = /stretch|:\s*\w+\-(?:conte|avail)/,
      ja = /([^-])(image-set\()/,
      z = 1,
      D = 1,
      E = 0,
      w = 1,
      O = [],
      S = [],
      A = 0,
      R = null,
      Y = 0,
      V = '';
  B.use = T;
  B.set = U;
  void 0 !== W && U(W);
  return B;
}

/* harmony default export */ __webpack_exports__["default"] = (stylis_min);


/***/ }),

/***/ "./node_modules/@emotion/unitless/dist/unitless.browser.esm.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@emotion/unitless/dist/unitless.browser.esm.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

/* harmony default export */ __webpack_exports__["default"] = (unitlessKeys);


/***/ }),

/***/ "./node_modules/@emotion/utils/dist/utils.browser.esm.js":
/*!***************************************************************!*\
  !*** ./node_modules/@emotion/utils/dist/utils.browser.esm.js ***!
  \***************************************************************/
/*! exports provided: getRegisteredStyles, insertStyles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRegisteredStyles", function() { return getRegisteredStyles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "insertStyles", function() { return insertStyles; });
var isBrowser = "object" !== 'undefined';
function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className]);
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser === false && cache.compat !== undefined) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }

  if (cache.inserted[serialized.name] === undefined) {
    var current = serialized;

    do {
      var maybeStyles = cache.insert("." + className, current, cache.sheet, true);

      current = current.next;
    } while (current !== undefined);
  }
};




/***/ }),

/***/ "./node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var weakMemoize = function weakMemoize(func) {
  // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

/* harmony default export */ __webpack_exports__["default"] = (weakMemoize);


/***/ }),

/***/ "./node_modules/core-js/library/fn/array/is-array.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/library/fn/array/is-array.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.array.is-array */ "./node_modules/core-js/library/modules/es6.array.is-array.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Array.isArray;


/***/ }),

/***/ "./node_modules/core-js/library/fn/get-iterator.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/fn/get-iterator.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../modules/web.dom.iterable */ "./node_modules/core-js/library/modules/web.dom.iterable.js");
__webpack_require__(/*! ../modules/es6.string.iterator */ "./node_modules/core-js/library/modules/es6.string.iterator.js");
module.exports = __webpack_require__(/*! ../modules/core.get-iterator */ "./node_modules/core-js/library/modules/core.get-iterator.js");


/***/ }),

/***/ "./node_modules/core-js/library/fn/json/stringify.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/library/fn/json/stringify.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js");
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),

/***/ "./node_modules/core-js/library/fn/object/assign.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/assign.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.assign */ "./node_modules/core-js/library/modules/es6.object.assign.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object.assign;


/***/ }),

/***/ "./node_modules/core-js/library/fn/object/define-property.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/define-property.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.define-property */ "./node_modules/core-js/library/modules/es6.object.define-property.js");
var $Object = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),

/***/ "./node_modules/core-js/library/fn/object/get-own-property-descriptor.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/get-own-property-descriptor.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.get-own-property-descriptor */ "./node_modules/core-js/library/modules/es6.object.get-own-property-descriptor.js");
var $Object = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object;
module.exports = function getOwnPropertyDescriptor(it, key) {
  return $Object.getOwnPropertyDescriptor(it, key);
};


/***/ }),

/***/ "./node_modules/core-js/library/fn/object/get-own-property-symbols.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/get-own-property-symbols.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.symbol */ "./node_modules/core-js/library/modules/es6.symbol.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object.getOwnPropertySymbols;


/***/ }),

/***/ "./node_modules/core-js/library/fn/object/keys.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/keys.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.keys */ "./node_modules/core-js/library/modules/es6.object.keys.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object.keys;


/***/ }),

/***/ "./node_modules/core-js/library/modules/_a-function.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_a-function.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_add-to-unscopables.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_add-to-unscopables.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),

/***/ "./node_modules/core-js/library/modules/_an-object.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_an-object.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_array-includes.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_array-includes.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/library/modules/_to-length.js");
var toAbsoluteIndex = __webpack_require__(/*! ./_to-absolute-index */ "./node_modules/core-js/library/modules/_to-absolute-index.js");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_classof.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_classof.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/library/modules/_cof.js");
var TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_cof.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_cof.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_core.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_core.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "./node_modules/core-js/library/modules/_ctx.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_ctx.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/library/modules/_a-function.js");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_defined.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_defined.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_descriptors.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_descriptors.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/library/modules/_dom-create.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_dom-create.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js");
var document = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_enum-bug-keys.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_enum-bug-keys.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "./node_modules/core-js/library/modules/_enum-keys.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_enum-keys.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js");
var gOPS = __webpack_require__(/*! ./_object-gops */ "./node_modules/core-js/library/modules/_object-gops.js");
var pIE = __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/library/modules/_object-pie.js");
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_export.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_export.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js");
var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js");
var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/library/modules/_ctx.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js");
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "./node_modules/core-js/library/modules/_fails.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_fails.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_global.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_global.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "./node_modules/core-js/library/modules/_has.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_has.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_hide.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_hide.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js");
module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_html.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_html.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "./node_modules/core-js/library/modules/_ie8-dom-define.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_ie8-dom-define.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") && !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function () {
  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/library/modules/_dom-create.js")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/library/modules/_iobject.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iobject.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/library/modules/_cof.js");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_is-array.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_is-array.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/library/modules/_cof.js");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_is-object.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_is-object.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-create.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iter-create.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(/*! ./_object-create */ "./node_modules/core-js/library/modules/_object-create.js");
var descriptor = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js");
var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/library/modules/_set-to-string-tag.js");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js")(IteratorPrototype, __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-define.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iter-define.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(/*! ./_library */ "./node_modules/core-js/library/modules/_library.js");
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");
var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/library/modules/_redefine.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js");
var $iterCreate = __webpack_require__(/*! ./_iter-create */ "./node_modules/core-js/library/modules/_iter-create.js");
var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/library/modules/_set-to-string-tag.js");
var getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ "./node_modules/core-js/library/modules/_object-gpo.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-step.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iter-step.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_iterators.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iterators.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_library.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_library.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),

/***/ "./node_modules/core-js/library/modules/_meta.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_meta.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/library/modules/_uid.js")('meta');
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js");
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js");
var setDesc = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js").f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-assign.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-assign.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js");
var gOPS = __webpack_require__(/*! ./_object-gops */ "./node_modules/core-js/library/modules/_object-gops.js");
var pIE = __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/library/modules/_object-pie.js");
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/library/modules/_to-object.js");
var IObject = __webpack_require__(/*! ./_iobject */ "./node_modules/core-js/library/modules/_iobject.js");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-create.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-create.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js");
var dPs = __webpack_require__(/*! ./_object-dps */ "./node_modules/core-js/library/modules/_object-dps.js");
var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/library/modules/_enum-bug-keys.js");
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/library/modules/_dom-create.js")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(/*! ./_html */ "./node_modules/core-js/library/modules/_html.js").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-dp.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-dp.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "./node_modules/core-js/library/modules/_ie8-dom-define.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/library/modules/_to-primitive.js");
var dP = Object.defineProperty;

exports.f = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-dps.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-dps.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js");
var getKeys = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js");

module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gopd.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gopd.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/library/modules/_object-pie.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/library/modules/_to-primitive.js");
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "./node_modules/core-js/library/modules/_ie8-dom-define.js");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gopn-ext.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gopn-ext.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js");
var gOPN = __webpack_require__(/*! ./_object-gopn */ "./node_modules/core-js/library/modules/_object-gopn.js").f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gopn.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gopn.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(/*! ./_object-keys-internal */ "./node_modules/core-js/library/modules/_object-keys-internal.js");
var hiddenKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/library/modules/_enum-bug-keys.js").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gops.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gops.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gpo.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gpo.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js");
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/library/modules/_to-object.js");
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-keys-internal.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-keys-internal.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js");
var arrayIndexOf = __webpack_require__(/*! ./_array-includes */ "./node_modules/core-js/library/modules/_array-includes.js")(false);
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-keys.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-keys.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(/*! ./_object-keys-internal */ "./node_modules/core-js/library/modules/_object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/library/modules/_enum-bug-keys.js");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-pie.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-pie.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-sap.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-sap.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");
var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js");
var fails = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_property-desc.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_property-desc.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_redefine.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_redefine.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js");


/***/ }),

/***/ "./node_modules/core-js/library/modules/_set-to-string-tag.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_set-to-string-tag.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js").f;
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js");
var TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_shared-key.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_shared-key.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/library/modules/_shared.js")('keys');
var uid = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/library/modules/_uid.js");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_shared.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_shared.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(/*! ./_library */ "./node_modules/core-js/library/modules/_library.js") ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "./node_modules/core-js/library/modules/_string-at.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_string-at.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/library/modules/_to-integer.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/library/modules/_defined.js");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-absolute-index.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-absolute-index.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/library/modules/_to-integer.js");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-integer.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-integer.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-iobject.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-iobject.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(/*! ./_iobject */ "./node_modules/core-js/library/modules/_iobject.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/library/modules/_defined.js");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-length.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-length.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/library/modules/_to-integer.js");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-object.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-object.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/library/modules/_defined.js");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-primitive.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-primitive.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_uid.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_uid.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_wks-define.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_wks-define.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js");
var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js");
var LIBRARY = __webpack_require__(/*! ./_library */ "./node_modules/core-js/library/modules/_library.js");
var wksExt = __webpack_require__(/*! ./_wks-ext */ "./node_modules/core-js/library/modules/_wks-ext.js");
var defineProperty = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js").f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_wks-ext.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_wks-ext.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js");


/***/ }),

/***/ "./node_modules/core-js/library/modules/_wks.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_wks.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/library/modules/_shared.js")('wks');
var uid = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/library/modules/_uid.js");
var Symbol = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "./node_modules/core-js/library/modules/core.get-iterator-method.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/core.get-iterator-method.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(/*! ./_classof */ "./node_modules/core-js/library/modules/_classof.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator');
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js");
module.exports = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/core.get-iterator.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/core.get-iterator.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js");
var get = __webpack_require__(/*! ./core.get-iterator-method */ "./node_modules/core-js/library/modules/core.get-iterator-method.js");
module.exports = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js").getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.array.is-array.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.array.is-array.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");

$export($export.S, 'Array', { isArray: __webpack_require__(/*! ./_is-array */ "./node_modules/core-js/library/modules/_is-array.js") });


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.array.iterator.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.array.iterator.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(/*! ./_add-to-unscopables */ "./node_modules/core-js/library/modules/_add-to-unscopables.js");
var step = __webpack_require__(/*! ./_iter-step */ "./node_modules/core-js/library/modules/_iter-step.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(/*! ./_iter-define */ "./node_modules/core-js/library/modules/_iter-define.js")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.assign.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.assign.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(/*! ./_object-assign */ "./node_modules/core-js/library/modules/_object-assign.js") });


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.define-property.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.define-property.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js"), 'Object', { defineProperty: __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js").f });


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.get-own-property-descriptor.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.get-own-property-descriptor.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js");
var $getOwnPropertyDescriptor = __webpack_require__(/*! ./_object-gopd */ "./node_modules/core-js/library/modules/_object-gopd.js").f;

__webpack_require__(/*! ./_object-sap */ "./node_modules/core-js/library/modules/_object-sap.js")('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.keys.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.keys.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/library/modules/_to-object.js");
var $keys = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js");

__webpack_require__(/*! ./_object-sap */ "./node_modules/core-js/library/modules/_object-sap.js")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.string.iterator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.string.iterator.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(/*! ./_string-at */ "./node_modules/core-js/library/modules/_string-at.js")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(/*! ./_iter-define */ "./node_modules/core-js/library/modules/_iter-define.js")(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.symbol.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.symbol.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js");
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js");
var DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js");
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");
var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/library/modules/_redefine.js");
var META = __webpack_require__(/*! ./_meta */ "./node_modules/core-js/library/modules/_meta.js").KEY;
var $fails = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js");
var shared = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/library/modules/_shared.js");
var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/library/modules/_set-to-string-tag.js");
var uid = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/library/modules/_uid.js");
var wks = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js");
var wksExt = __webpack_require__(/*! ./_wks-ext */ "./node_modules/core-js/library/modules/_wks-ext.js");
var wksDefine = __webpack_require__(/*! ./_wks-define */ "./node_modules/core-js/library/modules/_wks-define.js");
var enumKeys = __webpack_require__(/*! ./_enum-keys */ "./node_modules/core-js/library/modules/_enum-keys.js");
var isArray = __webpack_require__(/*! ./_is-array */ "./node_modules/core-js/library/modules/_is-array.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js");
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/library/modules/_to-primitive.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js");
var _create = __webpack_require__(/*! ./_object-create */ "./node_modules/core-js/library/modules/_object-create.js");
var gOPNExt = __webpack_require__(/*! ./_object-gopn-ext */ "./node_modules/core-js/library/modules/_object-gopn-ext.js");
var $GOPD = __webpack_require__(/*! ./_object-gopd */ "./node_modules/core-js/library/modules/_object-gopd.js");
var $DP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js");
var $keys = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js");
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(/*! ./_object-gopn */ "./node_modules/core-js/library/modules/_object-gopn.js").f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/library/modules/_object-pie.js").f = $propertyIsEnumerable;
  __webpack_require__(/*! ./_object-gops */ "./node_modules/core-js/library/modules/_object-gops.js").f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(/*! ./_library */ "./node_modules/core-js/library/modules/_library.js")) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js")($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),

/***/ "./node_modules/core-js/library/modules/web.dom.iterable.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/web.dom.iterable.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./es6.array.iterator */ "./node_modules/core-js/library/modules/es6.array.iterator.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js");
var TO_STRING_TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),

/***/ "./node_modules/next/dist/build/webpack/loaders/next-client-pages-loader.js?page=%2F&absolutePagePath=E%3A%5Cgithub%5Cvalidate-site%5Cpages%5Cindex.tsx!./":
/*!**************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-client-pages-loader.js?page=%2F&absolutePagePath=E%3A%5Cgithub%5Cvalidate-site%5Cpages%5Cindex.tsx ***!
  \**************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


    (window.__NEXT_P=window.__NEXT_P||[]).push(["/", function() {
      var page = __webpack_require__(/*! ./pages/index.tsx */ "./pages/index.tsx")
      if(true) {
        module.hot.accept(/*! ./pages/index.tsx */ "./pages/index.tsx", function() {
          if(!next.router.components["/"]) return
          var updatedPage = __webpack_require__(/*! ./pages/index.tsx */ "./pages/index.tsx")
          next.router.update("/", updatedPage.default || updatedPage)
        })
      }
      return { page: page.default || page }
    }]);
  

/***/ }),

/***/ "./node_modules/prismjs/components/prism-typescript.js":
/*!*************************************************************!*\
  !*** ./node_modules/prismjs/components/prism-typescript.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Prism.languages.typescript = Prism.languages.extend('javascript', {
	// From JavaScript Prism keyword list and TypeScript language spec: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#221-reserved-words
	'keyword': /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,
	'builtin': /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/,
});

Prism.languages.ts = Prism.languages.typescript;


/***/ }),

/***/ "./node_modules/prismjs/prism.js":
/*!***************************************!*\
  !*** ./node_modules/prismjs/prism.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function (_self){

// Private helper vars
var lang = /\blang(?:uage)?-([\w-]+)\b/i;
var uniqueId = 0;

var _ = {
	manual: _self.Prism && _self.Prism.manual,
	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (Array.isArray(tokens)) {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).slice(8, -1);
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function deepClone(o, visited) {
			var clone, id, type = _.util.type(o);
			visited = visited || {};

			switch (type) {
				case 'Object':
					id = _.util.objId(o);
					if (visited[id]) {
						return visited[id];
					}
					clone = {};
					visited[id] = clone;

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = deepClone(o[key], visited);
						}
					}

					return clone;

				case 'Array':
					id = _.util.objId(o);
					if (visited[id]) {
						return visited[id];
					}
					clone = [];
					visited[id] = clone;

					o.forEach(function (v, i) {
						clone[i] = deepClone(v, visited);
					});

					return clone;

				default:
					return o;
			}
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need an object and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];
			var ret = {};

			for (var token in grammar) {
				if (grammar.hasOwnProperty(token)) {

					if (token == before) {
						for (var newToken in insert) {
							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					// Do not insert token which also occur in insert. See #1525
					if (!insert.hasOwnProperty(token)) {
						ret[token] = grammar[token];
					}
				}
			}

			var old = root[inside];
			root[inside] = ret;

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === old && key != inside) {
					this[key] = ret;
				}
			});

			return ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function DFS(o, callback, type, visited) {
			visited = visited || {};

			var objId = _.util.objId;

			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					var property = o[i],
					    propertyType = _.util.type(property);

					if (propertyType === 'Object' && !visited[objId(property)]) {
						visited[objId(property)] = true;
						DFS(property, callback, null, visited);
					}
					else if (propertyType === 'Array' && !visited[objId(property)]) {
						visited[objId(property)] = true;
						DFS(property, callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		_.highlightAllUnder(document, async, callback);
	},

	highlightAllUnder: function(container, async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || container.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		if (element.parentNode) {
			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		var insertHighlightedCode = function (highlightedCode) {
			env.highlightedCode = highlightedCode;

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
			callback && callback.call(env.element);
		}

		_.hooks.run('before-sanity-check', env);

		if (!env.code) {
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (!env.grammar) {
			insertHighlightedCode(_.util.encode(env.code));
			return;
		}

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				insertHighlightedCode(evt.data);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
		}
	},

	highlight: function (text, grammar, language) {
		var env = {
			code: text,
			grammar: grammar,
			language: language
		};
		_.hooks.run('before-tokenize', env);
		env.tokens = _.tokenize(env.code, env.grammar);
		_.hooks.run('after-tokenize', env);
		return Token.stringify(_.util.encode(env.tokens), env.language);
	},

	matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
		for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			if (token == target) {
				return;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						return;
					}

					if (str instanceof Token) {
						continue;
					}

					if (greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						var match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						// If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						if (strarr[i] instanceof Token) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					} else {
						pattern.lastIndex = 0;

						var match = pattern.exec(str),
							delNum = 1;
					}

					if (!match) {
						if (oneshot) {
							break;
						}

						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1] ? match[1].length : 0;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						++i;
						pos += before.length;
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);

					if (delNum != 1)
						_.matchGrammar(text, strarr, grammar, i, pos, true, token);

					if (oneshot)
						break;
				}
			}
		}
	},

	tokenize: function(text, grammar) {
		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		_.matchGrammar(text, strarr, grammar, 0, 0, false);

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	},

	Token: Token
};

_self.Prism = _;

function Token(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
}

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (Array.isArray(o)) {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (o.alias) {
		var aliases = Array.isArray(o.alias) ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _;
	}

	if (!_.disableWorkerMessageHandler) {
		// In worker
		_self.addEventListener('message', function (evt) {
			var message = JSON.parse(evt.data),
				lang = message.language,
				code = message.code,
				immediateClose = message.immediateClose;

			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);
	}

	return _;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (!_.manual && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _;

})(_self);

if ( true && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\s\S]*?-->/,
	'prolog': /<\?[\s\S]+?\?>/,
	'doctype': /<!DOCTYPE[\s\S]+?>/i,
	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
		greedy: true,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
				inside: {
					'punctuation': [
						/^=/,
						{
							pattern: /^(\s*)["']|["']$/,
							lookbehind: true
						}
					]
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
	Prism.languages.markup['entity'];

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
	/**
	 * Adds an inlined language to markup.
	 *
	 * An example of an inlined language is CSS with `<style>` tags.
	 *
	 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
	 * case insensitive.
	 * @param {string} lang The language key.
	 * @example
	 * addInlined('style', 'css');
	 */
	value: function addInlined(tagName, lang) {
		var includedCdataInside = {};
		includedCdataInside['language-' + lang] = {
			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
			lookbehind: true,
			inside: Prism.languages[lang]
		};
		includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

		var inside = {
			'included-cdata': {
				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
				inside: includedCdataInside
			}
		};
		inside['language-' + lang] = {
			pattern: /[\s\S]+/,
			inside: Prism.languages[lang]
		};

		var def = {};
		def[tagName] = {
			pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(/__/g, tagName), 'i'),
			lookbehind: true,
			greedy: true,
			inside: inside
		};

		Prism.languages.insertBefore('markup', 'cdata', def);
	}
});

Prism.languages.xml = Prism.languages.extend('markup', {});
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

(function (Prism) {

	var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;

	Prism.languages.css = {
		'comment': /\/\*[\s\S]*?\*\//,
		'atrule': {
			pattern: /@[\w-]+?[\s\S]*?(?:;|(?=\s*\{))/i,
			inside: {
				'rule': /@[\w-]+/
				// See rest below
			}
		},
		'url': RegExp('url\\((?:' + string.source + '|.*?)\\)', 'i'),
		'selector': RegExp('[^{}\\s](?:[^{};"\']|' + string.source + ')*?(?=\\s*\\{)'),
		'string': {
			pattern: string,
			greedy: true
		},
		'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
		'important': /!important\b/i,
		'function': /[-a-z0-9]+(?=\()/i,
		'punctuation': /[(){};:,]/
	};

	Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

	var markup = Prism.languages.markup;
	if (markup) {
		markup.tag.addInlined('style', 'css');

		Prism.languages.insertBefore('inside', 'attr-value', {
			'style-attr': {
				pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
				inside: {
					'attr-name': {
						pattern: /^\s*style/i,
						inside: markup.tag.inside
					},
					'punctuation': /^\s*=\s*['"]|['"]\s*$/,
					'attr-value': {
						pattern: /.+/i,
						inside: Prism.languages.css
					}
				},
				alias: 'language-css'
			}
		}, markup.tag);
	}

}(Prism));


/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true,
			greedy: true
		}
	],
	'string': {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /[.\\]/
		}
	},
	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(?:true|false)\b/,
	'function': /\w+(?=\()/,
	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'class-name': [
		Prism.languages.clike['class-name'],
		{
			pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
			lookbehind: true
		}
	],
	'keyword': [
		{
			pattern: /((?:^|})\s*)(?:catch|finally)\b/,
			lookbehind: true
		},
		{
			pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
			lookbehind: true
		},
	],
	'number': /\b(?:(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+)n?|\d+n|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
	'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
});

Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
		lookbehind: true,
		greedy: true
	},
	// This must be declared before keyword because we use "function" inside the look-forward
	'function-variable': {
		pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
		alias: 'function'
	},
	'parameter': [
		{
			pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
			lookbehind: true,
			inside: Prism.languages.javascript
		},
		{
			pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
			inside: Prism.languages.javascript
		},
		{
			pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
			lookbehind: true,
			inside: Prism.languages.javascript
		},
		{
			pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
			lookbehind: true,
			inside: Prism.languages.javascript
		}
	],
	'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\${[^}]+}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\${|}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.markup.tag.addInlined('script', 'javascript');
}

Prism.languages.js = Prism.languages.javascript;


/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	/**
	 * @param {Element} [container=document]
	 */
	self.Prism.fileHighlight = function(container) {
		container = container || document;

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		Array.prototype.slice.call(container.querySelectorAll('pre[data-src]')).forEach(function (pre) {
			// ignore if already loaded
			if (pre.hasAttribute('data-src-loaded')) {
				return;
			}

			// load current
			var src = pre.getAttribute('data-src');

			var language, parent = pre;
			var lang = /\blang(?:uage)?-([\w-]+)\b/i;
			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (pre.className.match(lang) || [, ''])[1];
			}

			if (!language) {
				var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
				language = Extensions[extension] || extension;
			}

			var code = document.createElement('code');
			code.className = 'language-' + language;

			pre.textContent = '';

			code.textContent = 'Loading…';

			pre.appendChild(code);

			var xhr = new XMLHttpRequest();

			xhr.open('GET', src, true);

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {

					if (xhr.status < 400 && xhr.responseText) {
						code.textContent = xhr.responseText;

						Prism.highlightElement(code);
						// mark as loaded
						pre.setAttribute('data-src-loaded', '');
					}
					else if (xhr.status >= 400) {
						code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
					}
					else {
						code.textContent = '✖ Error: File does not exist or is empty';
					}
				}
			};

			xhr.send(null);
		});

		if (Prism.plugins.toolbar) {
			Prism.plugins.toolbar.registerButton('download-file', function (env) {
				var pre = env.element.parentNode;
				if (!pre || !/pre/i.test(pre.nodeName) || !pre.hasAttribute('data-src') || !pre.hasAttribute('data-download-link')) {
					return;
				}
				var src = pre.getAttribute('data-src');
				var a = document.createElement('a');
				a.textContent = pre.getAttribute('data-download-link-label') || 'Download';
				a.setAttribute('download', '');
				a.href = src;
				return a;
			});
		}

	};

	document.addEventListener('DOMContentLoaded', function () {
		// execute inside handler, for dropping Event as argument
		self.Prism.fileHighlight();
	});

})();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/react/index.js":
/*!*******************************************************************************************!*\
  !*** delegated ./node_modules/react/index.js from dll-reference dll_1aef2d0bbc0d334d831c ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(/*! dll-reference dll_1aef2d0bbc0d334d831c */ "dll-reference dll_1aef2d0bbc0d334d831c"))("./node_modules/react/index.js");

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!******************************************************************************************************!*\
  !*** delegated ./node_modules/webpack/buildin/global.js from dll-reference dll_1aef2d0bbc0d334d831c ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(/*! dll-reference dll_1aef2d0bbc0d334d831c */ "dll-reference dll_1aef2d0bbc0d334d831c"))("./node_modules/webpack/buildin/global.js");

/***/ }),

/***/ "./pages/index.tsx":
/*!*************************!*\
  !*** ./pages/index.tsx ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Home; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _src_demos__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/demos */ "./src/demos/index.tsx");
/* harmony import */ var _src_pages_home_intro__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/pages/home/intro */ "./src/pages/home/intro/index.tsx");
/* harmony import */ var _src_pages_home_logo__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/pages/home/logo */ "./src/pages/home/logo/index.tsx");
/* harmony import */ var _src_ui_layout__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/ui/layout */ "./src/ui/layout/index.tsx");
/* harmony import */ var _src_ui_layout_body__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/ui/layout/body */ "./src/ui/layout/body/index.tsx");
/* harmony import */ var _src_ui_sidebar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/ui/sidebar */ "./src/ui/sidebar/index.tsx");

var _jsxFileName = "E:\\github\\validate-site\\pages\\index.tsx";









function Home() {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(false),
      _useState2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
      rendered = _useState2[0],
      setRendered = _useState2[1];

  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    setRendered(true);
  });
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_src_ui_layout__WEBPACK_IMPORTED_MODULE_6__["Layout"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_src_pages_home_logo__WEBPACK_IMPORTED_MODULE_5__["HomeLogo"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_src_ui_layout_body__WEBPACK_IMPORTED_MODULE_7__["LayoutBody"], {
    sidebar: Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_src_ui_sidebar__WEBPACK_IMPORTED_MODULE_8__["Sidebar"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 18
      },
      __self: this
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_src_pages_home_intro__WEBPACK_IMPORTED_MODULE_4__["HomeIntro"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    },
    __self: this
  }), rendered && Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_src_demos__WEBPACK_IMPORTED_MODULE_3__["Demos"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: this
  })));
}

/***/ }),

/***/ "./src/demos/_result/index.tsx":
/*!*************************************!*\
  !*** ./src/demos/_result/index.tsx ***!
  \*************************************/
/*! exports provided: DemosResult */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DemosResult", function() { return DemosResult; });
/* harmony import */ var _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/core-js/json/stringify */ "./node_modules/@babel/runtime-corejs2/core-js/json/stringify.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles */ "./src/demos/_result/styles.ts");

var _jsxFileName = "E:\\github\\validate-site\\src\\demos\\_result\\index.tsx";



function DemosResult(_ref) {
  var result = _ref.result;
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])("pre", {
    css: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].result,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 4
    },
    __self: this
  }, result === undefined ? '' : _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_0___default()(result, null, 2));
}

/***/ }),

/***/ "./src/demos/_result/styles.ts":
/*!*************************************!*\
  !*** ./src/demos/_result/styles.ts ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");

/* harmony default export */ __webpack_exports__["default"] = ({
  result:  false ? undefined : {
    name: "7iiqi7-result",
    styles: "color:#aaa;margin:20px 0;padding:16px;border:1px solid rgba(0,0,0,.2);border-radius:4px;background:#051937;label:result;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcZGVtb3NcXF9yZXN1bHRcXHN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHYSIsImZpbGUiOiJFOlxcZ2l0aHViXFx2YWxpZGF0ZS1zaXRlXFxzcmNcXGRlbW9zXFxfcmVzdWx0XFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICByZXN1bHQ6IGNzc2BcclxuICAgIGNvbG9yOiAjYWFhO1xyXG4gICAgbWFyZ2luOiAyMHB4IDA7XHJcbiAgICBwYWRkaW5nOiAxNnB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLDAsMCwuMik7XHJcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgICBiYWNrZ3JvdW5kOiAjMDUxOTM3O1xyXG4gIGBcclxufVxyXG4iXX0= */"
  }
});

/***/ }),

/***/ "./src/demos/_wrapper/index.tsx":
/*!**************************************!*\
  !*** ./src/demos/_wrapper/index.tsx ***!
  \**************************************/
/*! exports provided: DemosWrapper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DemosWrapper", function() { return DemosWrapper; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _ui_code__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ui/code */ "./src/ui/code/index.tsx");
/* harmony import */ var _ui_split__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../ui/split */ "./src/ui/split/index.tsx");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles */ "./src/demos/_wrapper/styles.ts");
var _jsxFileName = "E:\\github\\validate-site\\src\\demos\\_wrapper\\index.tsx";





function DemosWrapper(_ref) {
  var header = _ref.header,
      src = _ref.src,
      url = _ref.url,
      children = _ref.children;
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_4__["default"].wrapper,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_4__["default"].header,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  }, header), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])(_ui_split__WEBPACK_IMPORTED_MODULE_3__["Split"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, children)), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_4__["default"].source,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])(_ui_code__WEBPACK_IMPORTED_MODULE_2__["Code"], {
    css: _styles__WEBPACK_IMPORTED_MODULE_4__["default"].code,
    url: url,
    src: src,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: this
  }))));
}

/***/ }),

/***/ "./src/demos/_wrapper/styles.ts":
/*!**************************************!*\
  !*** ./src/demos/_wrapper/styles.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var _theme_media__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../theme/media */ "./src/theme/media.ts");


/* harmony default export */ __webpack_exports__["default"] = ({
  wrapper:  false ? undefined : {
    name: "164xq00-wrapper",
    styles: "margin:0 0 60px;label:wrapper;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcZGVtb3NcXF93cmFwcGVyXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSWMiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFxkZW1vc1xcX3dyYXBwZXJcXHN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1xIH0gZnJvbSAnQGFwcC90aGVtZS9tZWRpYSdcclxuaW1wb3J0IGNzcyBmcm9tICdAZW1vdGlvbi9jc3MnXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgd3JhcHBlcjogY3NzYFxyXG4gICAgbWFyZ2luOiAwIDAgNjBweDtcclxuICBgLFxyXG5cclxuICBoZWFkZXI6IGNzc2BcclxuICAgIGNvbG9yOiAjNTU1O1xyXG4gICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlMWUxZTE7XHJcbiAgICBwYWRkaW5nOiAwIDAgOHB4O1xyXG4gICAgbWFyZ2luOiAwIDAgMzJweDtcclxuICBgLFxyXG5cclxuICBzb3VyY2U6IGNzc2BcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgcGFkZGluZzogMjJweCAwIDA7XHJcbiAgYCxcclxuXHJcbiAgY29kZTogY3NzYFxyXG4gICAgZmxleDogMSAwIDA7XHJcbiAgICBtYXJnaW46IDAgMCAyMHB4O1xyXG5cclxuICAgICR7bXEubW9iaWxlfSB7XHJcbiAgICAgIG1pbi1oZWlnaHQ6IDUwdmg7XHJcbiAgICB9XHJcbiAgYFxyXG59XHJcbiJdfQ== */"
  },
  header:  false ? undefined : {
    name: "16oaddc-header",
    styles: "color:#555;font-size:20px;border-bottom:1px solid #e1e1e1;padding:0 0 8px;margin:0 0 32px;label:header;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcZGVtb3NcXF93cmFwcGVyXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUWEiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFxkZW1vc1xcX3dyYXBwZXJcXHN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1xIH0gZnJvbSAnQGFwcC90aGVtZS9tZWRpYSdcclxuaW1wb3J0IGNzcyBmcm9tICdAZW1vdGlvbi9jc3MnXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgd3JhcHBlcjogY3NzYFxyXG4gICAgbWFyZ2luOiAwIDAgNjBweDtcclxuICBgLFxyXG5cclxuICBoZWFkZXI6IGNzc2BcclxuICAgIGNvbG9yOiAjNTU1O1xyXG4gICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlMWUxZTE7XHJcbiAgICBwYWRkaW5nOiAwIDAgOHB4O1xyXG4gICAgbWFyZ2luOiAwIDAgMzJweDtcclxuICBgLFxyXG5cclxuICBzb3VyY2U6IGNzc2BcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgcGFkZGluZzogMjJweCAwIDA7XHJcbiAgYCxcclxuXHJcbiAgY29kZTogY3NzYFxyXG4gICAgZmxleDogMSAwIDA7XHJcbiAgICBtYXJnaW46IDAgMCAyMHB4O1xyXG5cclxuICAgICR7bXEubW9iaWxlfSB7XHJcbiAgICAgIG1pbi1oZWlnaHQ6IDUwdmg7XHJcbiAgICB9XHJcbiAgYFxyXG59XHJcbiJdfQ== */"
  },
  source:  false ? undefined : {
    name: "44c6wu-source",
    styles: "display:flex;flex-direction:column;padding:22px 0 0;label:source;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcZGVtb3NcXF93cmFwcGVyXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZ0JhIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcZGVtb3NcXF93cmFwcGVyXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtcSB9IGZyb20gJ0BhcHAvdGhlbWUvbWVkaWEnXHJcbmltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHdyYXBwZXI6IGNzc2BcclxuICAgIG1hcmdpbjogMCAwIDYwcHg7XHJcbiAgYCxcclxuXHJcbiAgaGVhZGVyOiBjc3NgXHJcbiAgICBjb2xvcjogIzU1NTtcclxuICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTFlMWUxO1xyXG4gICAgcGFkZGluZzogMCAwIDhweDtcclxuICAgIG1hcmdpbjogMCAwIDMycHg7XHJcbiAgYCxcclxuXHJcbiAgc291cmNlOiBjc3NgXHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIHBhZGRpbmc6IDIycHggMCAwO1xyXG4gIGAsXHJcblxyXG4gIGNvZGU6IGNzc2BcclxuICAgIGZsZXg6IDEgMCAwO1xyXG4gICAgbWFyZ2luOiAwIDAgMjBweDtcclxuXHJcbiAgICAke21xLm1vYmlsZX0ge1xyXG4gICAgICBtaW4taGVpZ2h0OiA1MHZoO1xyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */"
  },
  code:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])("flex:1 0 0;margin:0 0 20px;", _theme_media__WEBPACK_IMPORTED_MODULE_1__["mq"].mobile, "{min-height:50vh;}label:code;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcZGVtb3NcXF93cmFwcGVyXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBc0JXIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcZGVtb3NcXF93cmFwcGVyXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtcSB9IGZyb20gJ0BhcHAvdGhlbWUvbWVkaWEnXHJcbmltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHdyYXBwZXI6IGNzc2BcclxuICAgIG1hcmdpbjogMCAwIDYwcHg7XHJcbiAgYCxcclxuXHJcbiAgaGVhZGVyOiBjc3NgXHJcbiAgICBjb2xvcjogIzU1NTtcclxuICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTFlMWUxO1xyXG4gICAgcGFkZGluZzogMCAwIDhweDtcclxuICAgIG1hcmdpbjogMCAwIDMycHg7XHJcbiAgYCxcclxuXHJcbiAgc291cmNlOiBjc3NgXHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIHBhZGRpbmc6IDIycHggMCAwO1xyXG4gIGAsXHJcblxyXG4gIGNvZGU6IGNzc2BcclxuICAgIGZsZXg6IDEgMCAwO1xyXG4gICAgbWFyZ2luOiAwIDAgMjBweDtcclxuXHJcbiAgICAke21xLm1vYmlsZX0ge1xyXG4gICAgICBtaW4taGVpZ2h0OiA1MHZoO1xyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */"))
});

/***/ }),

/***/ "./src/demos/dynamic/index.tsx":
/*!*************************************!*\
  !*** ./src/demos/dynamic/index.tsx ***!
  \*************************************/
/*! exports provided: DemosDynamic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DemosDynamic", function() { return DemosDynamic; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _ui_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../ui/button */ "./src/ui/button/index.tsx");
/* harmony import */ var _ui_forms_text_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../ui/forms/text-field */ "./src/ui/forms/text-field/index.tsx");
/* harmony import */ var _mc_petry_useform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mc-petry/useform */ "../validate/dist/index.js");
/* harmony import */ var _mc_petry_useform__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_mc_petry_useform__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _result__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../_result */ "./src/demos/_result/index.tsx");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./styles */ "./src/demos/dynamic/styles.ts");

var _jsxFileName = "E:\\github\\validate-site\\src\\demos\\dynamic\\index.tsx";








var dynamicFieldName = 'dynamic';
function DemosDynamic() {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(true),
      _useState2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
      show = _useState2[0],
      setShow = _useState2[1];

  var _useForm = Object(_mc_petry_useform__WEBPACK_IMPORTED_MODULE_5__["useForm"])(function () {
    return {
      fieldConfig: function fieldConfig(field) {
        if (field === dynamicFieldName) {
          return {
            validate: function validate(value) {
              return !value && 'Required' || value.length < 10 && 'Address length must be at least 10 symbols';
            }
          };
        }
      }
    };
  }),
      fields = _useForm.fields,
      handleSubmit = _useForm.handleSubmit,
      remove = _useForm.remove,
      getValues = _useForm.getValues;

  var handleAddField = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function () {
    return setShow(true);
  }, []);
  var handleRemoveField = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function () {
    remove(dynamicFieldName);
    setShow(false);
  }, []);
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])("form", {
    onSubmit: handleSubmit,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_forms_text_field__WEBPACK_IMPORTED_MODULE_4__["TextField"], {
    label: 'Name',
    field: fields.name,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }), show ? Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_7__["default"].group,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_forms_text_field__WEBPACK_IMPORTED_MODULE_4__["TextField"], {
    label: 'Dynamic',
    field: fields[dynamicFieldName],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_button__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    css: _styles__WEBPACK_IMPORTED_MODULE_7__["default"].remove,
    onClick: handleRemoveField,
    children: 'Remove',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  })) : Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_button__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    onClick: handleAddField,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, 'Add dynamic'), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_result__WEBPACK_IMPORTED_MODULE_6__["DemosResult"], {
    result: getValues(),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47
    },
    __self: this
  }));
}

/***/ }),

/***/ "./src/demos/dynamic/styles.ts":
/*!*************************************!*\
  !*** ./src/demos/dynamic/styles.ts ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");

/* harmony default export */ __webpack_exports__["default"] = ({
  group:  false ? undefined : {
    name: "1nz7rzv-group",
    styles: "display:flex;label:group;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcZGVtb3NcXGR5bmFtaWNcXHN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHWSIsImZpbGUiOiJFOlxcZ2l0aHViXFx2YWxpZGF0ZS1zaXRlXFxzcmNcXGRlbW9zXFxkeW5hbWljXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBncm91cDogY3NzYFxyXG4gICAgZGlzcGxheTogZmxleDtcclxuICBgLFxyXG5cclxuICByZW1vdmU6IGNzc2BcclxuICAgIG1hcmdpbjogMjJweCAwIDIwcHggMjBweDtcclxuICBgXHJcbn1cclxuIl19 */"
  },
  remove:  false ? undefined : {
    name: "tbivw5-remove",
    styles: "margin:22px 0 20px 20px;label:remove;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcZGVtb3NcXGR5bmFtaWNcXHN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPYSIsImZpbGUiOiJFOlxcZ2l0aHViXFx2YWxpZGF0ZS1zaXRlXFxzcmNcXGRlbW9zXFxkeW5hbWljXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBncm91cDogY3NzYFxyXG4gICAgZGlzcGxheTogZmxleDtcclxuICBgLFxyXG5cclxuICByZW1vdmU6IGNzc2BcclxuICAgIG1hcmdpbjogMjJweCAwIDIwcHggMjBweDtcclxuICBgXHJcbn1cclxuIl19 */"
  }
});

/***/ }),

/***/ "./src/demos/index.tsx":
/*!*****************************!*\
  !*** ./src/demos/index.tsx ***!
  \*****************************/
/*! exports provided: Demos */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Demos", function() { return Demos; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _ui_typography_h2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ui/typography/h2 */ "./src/ui/typography/h2/index.tsx");
/* harmony import */ var _wrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_wrapper */ "./src/demos/_wrapper/index.tsx");
/* harmony import */ var _dynamic__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dynamic */ "./src/demos/dynamic/index.tsx");
/* harmony import */ var _simple__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./simple */ "./src/demos/simple/index.tsx");
var _jsxFileName = "E:\\github\\validate-site\\src\\demos\\index.tsx";






function Demos() {
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])(_ui_typography_h2__WEBPACK_IMPORTED_MODULE_2__["H2"], {
    id: "demos",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, "Demos"), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])(_wrapper__WEBPACK_IMPORTED_MODULE_3__["DemosWrapper"], {
    header: "Simple form",
    src: "https://raw.githubusercontent.com/mc-petry/redux-handler/master/src/middleware.ts",
    url: "https://raw.githubusercontent.com/mc-petry/redux-handler/master/src/middleware.ts",
    children: Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])(_simple__WEBPACK_IMPORTED_MODULE_5__["DemosSimple"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 14
      },
      __self: this
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  }), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])(_wrapper__WEBPACK_IMPORTED_MODULE_3__["DemosWrapper"], {
    header: "Dynamic field",
    src: "https://raw.githubusercontent.com/mc-petry/redux-handler/master/src/middleware.ts",
    url: "https://raw.githubusercontent.com/mc-petry/redux-handler/master/src/middleware.ts",
    children: Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])(_dynamic__WEBPACK_IMPORTED_MODULE_4__["DemosDynamic"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 21
      },
      __self: this
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }));
}

/***/ }),

/***/ "./src/demos/simple/index.tsx":
/*!************************************!*\
  !*** ./src/demos/simple/index.tsx ***!
  \************************************/
/*! exports provided: DemosSimple */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DemosSimple", function() { return DemosSimple; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _ui_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../ui/button */ "./src/ui/button/index.tsx");
/* harmony import */ var _ui_forms_number_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../ui/forms/number-field */ "./src/ui/forms/number-field/index.tsx");
/* harmony import */ var _ui_forms_text_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../ui/forms/text-field */ "./src/ui/forms/text-field/index.tsx");
/* harmony import */ var _mc_petry_useform__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mc-petry/useform */ "../validate/dist/index.js");
/* harmony import */ var _mc_petry_useform__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_mc_petry_useform__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _result__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../_result */ "./src/demos/_result/index.tsx");

var _jsxFileName = "E:\\github\\validate-site\\src\\demos\\simple\\index.tsx";








function DemosSimple() {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(),
      _useState2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
      result = _useState2[0],
      setResult = _useState2[1];

  var _useForm = Object(_mc_petry_useform__WEBPACK_IMPORTED_MODULE_6__["useForm"])(function () {
    return {
      fields: {
        name: {
          validate: function validate(value) {
            return !value && 'Name is required' || value.length < 2 && 'Name too short';
          }
        },
        age: {
          validate: function validate(value) {
            return value == null && 'Age is required' || value < 18 && 'You are too young';
          }
        }
      },
      submit: function submit(values) {
        return setResult(values);
      }
    };
  }),
      fields = _useForm.fields,
      handleSubmit = _useForm.handleSubmit;

  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])("form", {
    onSubmit: handleSubmit,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_forms_text_field__WEBPACK_IMPORTED_MODULE_5__["TextField"], {
    field: fields.name,
    label: 'Name',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_forms_number_field__WEBPACK_IMPORTED_MODULE_4__["NumberField"], {
    field: fields.age,
    label: 'Age',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_forms_text_field__WEBPACK_IMPORTED_MODULE_5__["TextField"], {
    field: fields.email,
    label: 'Email',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_button__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    type: "submit",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }, 'Submit'), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_result__WEBPACK_IMPORTED_MODULE_7__["DemosResult"], {
    result: result,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: this
  }));
}

/***/ }),

/***/ "./src/pages/home/intro/index.tsx":
/*!****************************************!*\
  !*** ./src/pages/home/intro/index.tsx ***!
  \****************************************/
/*! exports provided: HomeIntro */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeIntro", function() { return HomeIntro; });
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _theme_media__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../theme/media */ "./src/theme/media.ts");
/* harmony import */ var _ui_code__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../ui/code */ "./src/ui/code/index.tsx");
/* harmony import */ var _ui_typography_h2__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../ui/typography/h2 */ "./src/ui/typography/h2/index.tsx");
/* harmony import */ var _ui_typography_h3__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../ui/typography/h3 */ "./src/ui/typography/h3/index.tsx");
/* harmony import */ var _ui_typography_text__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../ui/typography/text */ "./src/ui/typography/text/index.tsx");

var _jsxFileName = "E:\\github\\validate-site\\src\\pages\\home\\intro\\index.tsx";







var styles = {
  wrapper:  false ? undefined : {
    name: "a0qxff-wrapper",
    styles: "label:wrapper;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xccGFnZXNcXGhvbWVcXGludHJvXFxpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUWMiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFxwYWdlc1xcaG9tZVxcaW50cm9cXGluZGV4LnRzeCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1xIH0gZnJvbSAnQGFwcC90aGVtZS9tZWRpYSdcclxuaW1wb3J0IHsgQ29kZSwgQ29kZUxhbmcgfSBmcm9tICdAYXBwL3VpL2NvZGUnXHJcbmltcG9ydCB7IEgyIH0gZnJvbSAnQGFwcC91aS90eXBvZ3JhcGh5L2gyJ1xyXG5pbXBvcnQgeyBIMyB9IGZyb20gJ0BhcHAvdWkvdHlwb2dyYXBoeS9oMydcclxuaW1wb3J0IHsgVGV4dCB9IGZyb20gJ0BhcHAvdWkvdHlwb2dyYXBoeS90ZXh0J1xyXG5pbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICB3cmFwcGVyOiBjc3NgXHJcbiAgYCxcclxuXHJcbiAgY29kZTogY3NzYFxyXG4gICAgbWF4LWhlaWdodDogMzAwcHg7XHJcblxyXG4gICAgJHttcS5tb2JpbGV9IHtcclxuICAgICAgbWF4LWhlaWdodDogNTB2aDtcclxuICAgIH1cclxuICBgXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIb21lSW50cm8oKSB7XHJcbiAgcmV0dXJuIDxkaXYgY3NzPXtzdHlsZXMud3JhcHBlcn0+XHJcbiAgICA8SDIgaWQ9XCJxdWljay1zdGFydFwiPlF1aWNrIHN0YXJ0PC9IMj5cclxuICAgIDxUZXh0PlxyXG4gICAgICA8SDM+SW5zdGFsbCB0aGUgbGlicmFyeTwvSDM+XHJcbiAgICAgIDxDb2RlIGxhbmc9e0NvZGVMYW5nLk1hcmt1cH0+XHJcbiAgICAgICAgeyducG0gaSBAbWMtcGV0cnkvdXNlZm9ybSd9XHJcbiAgICAgIDwvQ29kZT5cclxuICAgICAgPEgzPkNyZWF0ZSBjdXN0b20gZmllbGQ8L0gzPlxyXG4gICAgICA8Q29kZVxyXG4gICAgICAgIHVybD1cImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9tYy1wZXRyeS9yZWR1eC1oYW5kbGVyL21hc3Rlci9zcmMvbWlkZGxld2FyZS50c1wiXHJcbiAgICAgICAgY3NzPXtzdHlsZXMuY29kZX1cclxuICAgICAgPntgaW1wb3J0IHsgQ2hhbmdlRXZlbnQsIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSAncmVhY3QtdXNlZm9ybSdcclxuXHJcbmZ1bmN0aW9uIFRleHRGaWVsZCh7IGZpZWxkIH06IHsgZmllbGQ6IEZpZWxkIH0pIHtcclxuICBjb25zdCBvbkNoYW5nZSA9IHVzZUNhbGxiYWNrKChlOiBDaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT5cclxuICAgIGZpZWxkLm9uQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKSxcclxuICAgIFtdXHJcbiAgKVxyXG5cclxuICByZXR1cm4gPGRpdj5cclxuICAgIDxpbnB1dFxyXG4gICAgICByZWY9e2ZpZWxkLnJlZiBhcyBhbnl9XHJcbiAgICAgIHZhbHVlPXtmaWVsZC52YWx1ZSB8fCAnJ31cclxuICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICBvbkJsdXI9e2ZpZWxkLm9uQmx1cn1cclxuICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgLz5cclxuICA8L2Rpdj5cclxufWB9XHJcbiAgICAgIDwvQ29kZT5cclxuICAgICAgPHA+Rm9yIGVhY2ggZmllbGQgdHlwZSB5b3UgbXVzdCBjcmVhdGUgeW91ciBvd24gY29tcG9uZW50IG9yIHdyYXAgY29tcG9uZW50IGZyb20gdGhpcmQtcGFydHkgbGlicmFyeS48L3A+XHJcbiAgICA8L1RleHQ+XHJcbiAgPC9kaXY+XHJcbn1cclxuIl19 */"
  },
  code:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])("max-height:300px;", _theme_media__WEBPACK_IMPORTED_MODULE_3__["mq"].mobile, "{max-height:50vh;}label:code;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xccGFnZXNcXGhvbWVcXGludHJvXFxpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBV1ciLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFxwYWdlc1xcaG9tZVxcaW50cm9cXGluZGV4LnRzeCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1xIH0gZnJvbSAnQGFwcC90aGVtZS9tZWRpYSdcclxuaW1wb3J0IHsgQ29kZSwgQ29kZUxhbmcgfSBmcm9tICdAYXBwL3VpL2NvZGUnXHJcbmltcG9ydCB7IEgyIH0gZnJvbSAnQGFwcC91aS90eXBvZ3JhcGh5L2gyJ1xyXG5pbXBvcnQgeyBIMyB9IGZyb20gJ0BhcHAvdWkvdHlwb2dyYXBoeS9oMydcclxuaW1wb3J0IHsgVGV4dCB9IGZyb20gJ0BhcHAvdWkvdHlwb2dyYXBoeS90ZXh0J1xyXG5pbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICB3cmFwcGVyOiBjc3NgXHJcbiAgYCxcclxuXHJcbiAgY29kZTogY3NzYFxyXG4gICAgbWF4LWhlaWdodDogMzAwcHg7XHJcblxyXG4gICAgJHttcS5tb2JpbGV9IHtcclxuICAgICAgbWF4LWhlaWdodDogNTB2aDtcclxuICAgIH1cclxuICBgXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIb21lSW50cm8oKSB7XHJcbiAgcmV0dXJuIDxkaXYgY3NzPXtzdHlsZXMud3JhcHBlcn0+XHJcbiAgICA8SDIgaWQ9XCJxdWljay1zdGFydFwiPlF1aWNrIHN0YXJ0PC9IMj5cclxuICAgIDxUZXh0PlxyXG4gICAgICA8SDM+SW5zdGFsbCB0aGUgbGlicmFyeTwvSDM+XHJcbiAgICAgIDxDb2RlIGxhbmc9e0NvZGVMYW5nLk1hcmt1cH0+XHJcbiAgICAgICAgeyducG0gaSBAbWMtcGV0cnkvdXNlZm9ybSd9XHJcbiAgICAgIDwvQ29kZT5cclxuICAgICAgPEgzPkNyZWF0ZSBjdXN0b20gZmllbGQ8L0gzPlxyXG4gICAgICA8Q29kZVxyXG4gICAgICAgIHVybD1cImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9tYy1wZXRyeS9yZWR1eC1oYW5kbGVyL21hc3Rlci9zcmMvbWlkZGxld2FyZS50c1wiXHJcbiAgICAgICAgY3NzPXtzdHlsZXMuY29kZX1cclxuICAgICAgPntgaW1wb3J0IHsgQ2hhbmdlRXZlbnQsIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSAncmVhY3QtdXNlZm9ybSdcclxuXHJcbmZ1bmN0aW9uIFRleHRGaWVsZCh7IGZpZWxkIH06IHsgZmllbGQ6IEZpZWxkIH0pIHtcclxuICBjb25zdCBvbkNoYW5nZSA9IHVzZUNhbGxiYWNrKChlOiBDaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT5cclxuICAgIGZpZWxkLm9uQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKSxcclxuICAgIFtdXHJcbiAgKVxyXG5cclxuICByZXR1cm4gPGRpdj5cclxuICAgIDxpbnB1dFxyXG4gICAgICByZWY9e2ZpZWxkLnJlZiBhcyBhbnl9XHJcbiAgICAgIHZhbHVlPXtmaWVsZC52YWx1ZSB8fCAnJ31cclxuICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICBvbkJsdXI9e2ZpZWxkLm9uQmx1cn1cclxuICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgLz5cclxuICA8L2Rpdj5cclxufWB9XHJcbiAgICAgIDwvQ29kZT5cclxuICAgICAgPHA+Rm9yIGVhY2ggZmllbGQgdHlwZSB5b3UgbXVzdCBjcmVhdGUgeW91ciBvd24gY29tcG9uZW50IG9yIHdyYXAgY29tcG9uZW50IGZyb20gdGhpcmQtcGFydHkgbGlicmFyeS48L3A+XHJcbiAgICA8L1RleHQ+XHJcbiAgPC9kaXY+XHJcbn1cclxuIl19 */"))
};
function HomeIntro() {
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])("div", {
    css: styles.wrapper,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_typography_h2__WEBPACK_IMPORTED_MODULE_5__["H2"], {
    id: "quick-start",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }, "Quick start"), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_typography_text__WEBPACK_IMPORTED_MODULE_7__["Text"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_typography_h3__WEBPACK_IMPORTED_MODULE_6__["H3"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, "Install the library"), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_code__WEBPACK_IMPORTED_MODULE_4__["Code"], {
    lang: _ui_code__WEBPACK_IMPORTED_MODULE_4__["CodeLang"].Markup,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }, 'npm i @mc-petry/useform'), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_typography_h3__WEBPACK_IMPORTED_MODULE_6__["H3"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  }, "Create custom field"), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_ui_code__WEBPACK_IMPORTED_MODULE_4__["Code"], {
    url: "https://raw.githubusercontent.com/mc-petry/redux-handler/master/src/middleware.ts",
    css: styles.code,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  }, "import { ChangeEvent, useCallback } from 'react'\nimport { Field } from 'react-useform'\n\nfunction TextField({ field }: { field: Field }) {\n  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) =>\n    field.onChange(e.target.value),\n    []\n  )\n\n  return <div>\n    <input\n      ref={field.ref as any}\n      value={field.value || ''}\n      onChange={onChange}\n      onBlur={field.onBlur}\n      type=\"text\"\n    />\n  </div>\n}"), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    },
    __self: this
  }, "For each field type you must create your own component or wrap component from third-party library.")));
}

/***/ }),

/***/ "./src/pages/home/logo/index.tsx":
/*!***************************************!*\
  !*** ./src/pages/home/logo/index.tsx ***!
  \***************************************/
/*! exports provided: HomeLogo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeLogo", function() { return HomeLogo; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _ui_layout_container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../ui/layout/container */ "./src/ui/layout/container/index.tsx");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles */ "./src/pages/home/logo/styles.ts");
var _jsxFileName = "E:\\github\\validate-site\\src\\pages\\home\\logo\\index.tsx";




function HomeLogo() {
  var blocks = 10;
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].wrapper,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].blocks,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, Array(blocks).fill(0).map(function (_, i) {
    return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
      key: i,
      css: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].block,
      style: {
        transform: "rotate(".concat(90 / blocks * i, "deg)"),
        opacity: .15 / blocks
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 10
      },
      __self: this
    });
  })), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])(_ui_layout_container__WEBPACK_IMPORTED_MODULE_2__["LayoutContainer"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].logo,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: this
  }, "use"), "form"), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].slogan,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }, "A TypeScript library for building forms using React")));
}

/***/ }),

/***/ "./src/pages/home/logo/styles.ts":
/*!***************************************!*\
  !*** ./src/pages/home/logo/styles.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var _theme_media__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../theme/media */ "./src/theme/media.ts");


/* harmony default export */ __webpack_exports__["default"] = ({
  wrapper:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])("padding:210px 0 210px;color:#000;font-weight:300;position:relative;overflow:hidden;text-align:center;border-bottom:1px solid #e2e8ec;", _theme_media__WEBPACK_IMPORTED_MODULE_1__["mq"].mobile, "{padding:38vh 0 0;height:calc(100vh - 60px);text-align:left;}label:wrapper;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xccGFnZXNcXGhvbWVcXGxvZ29cXHN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJYyIsImZpbGUiOiJFOlxcZ2l0aHViXFx2YWxpZGF0ZS1zaXRlXFxzcmNcXHBhZ2VzXFxob21lXFxsb2dvXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtcSB9IGZyb20gJ0BhcHAvdGhlbWUvbWVkaWEnXHJcbmltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHdyYXBwZXI6IGNzc2BcclxuICAgIHBhZGRpbmc6IDIxMHB4IDAgMjEwcHg7XHJcbiAgICBjb2xvcjogIzAwMDtcclxuICAgIGZvbnQtd2VpZ2h0OiAzMDA7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlMmU4ZWM7XHJcblxyXG4gICAgJHttcS5tb2JpbGV9IHtcclxuICAgICAgcGFkZGluZzogMzh2aCAwIDA7XHJcbiAgICAgIGhlaWdodDogY2FsYygxMDB2aCAtIDYwcHgpO1xyXG4gICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gICAgfVxyXG4gIGAsXHJcblxyXG4gIGxvZ286IGNzc2BcclxuICAgIGZvbnQtc2l6ZTogNjhweDtcclxuICAgIG1hcmdpbjogMCAwIDIwcHg7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuXHJcbiAgICBzcGFuIHtcclxuICAgICAgY29sb3I6IHJnYmEoMCwwLDAsLjYpO1xyXG4gICAgfVxyXG5cclxuICAgICR7bXEubW9iaWxlfSB7XHJcbiAgICAgIGZvbnQtc2l6ZTogNDhweDtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICBzbG9nYW46IGNzc2BcclxuICAgIGZvbnQtc2l6ZTogMzBweDtcclxuXHJcbiAgICAke21xLm1vYmlsZX0ge1xyXG4gICAgICBmb250LXNpemU6IDIwcHg7XHJcbiAgICB9XHJcbiAgYCxcclxuXHJcbiAgYmxvY2tzOiBjc3NgXHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgYCxcclxuXHJcbiAgYmxvY2s6IGNzc2BcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDAsNTAsMTMwKTtcclxuICBgXHJcbn1cclxuIl19 */")),
  logo:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])("font-size:68px;margin:0 0 20px;font-weight:bold;span{color:rgba(0,0,0,.6);}", _theme_media__WEBPACK_IMPORTED_MODULE_1__["mq"].mobile, "{font-size:48px;}label:logo;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xccGFnZXNcXGhvbWVcXGxvZ29cXHN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFvQlciLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFxwYWdlc1xcaG9tZVxcbG9nb1xcc3R5bGVzLnRzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbXEgfSBmcm9tICdAYXBwL3RoZW1lL21lZGlhJ1xyXG5pbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB3cmFwcGVyOiBjc3NgXHJcbiAgICBwYWRkaW5nOiAyMTBweCAwIDIxMHB4O1xyXG4gICAgY29sb3I6ICMwMDA7XHJcbiAgICBmb250LXdlaWdodDogMzAwO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTJlOGVjO1xyXG5cclxuICAgICR7bXEubW9iaWxlfSB7XHJcbiAgICAgIHBhZGRpbmc6IDM4dmggMCAwO1xyXG4gICAgICBoZWlnaHQ6IGNhbGMoMTAwdmggLSA2MHB4KTtcclxuICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICBsb2dvOiBjc3NgXHJcbiAgICBmb250LXNpemU6IDY4cHg7XHJcbiAgICBtYXJnaW46IDAgMCAyMHB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcblxyXG4gICAgc3BhbiB7XHJcbiAgICAgIGNvbG9yOiByZ2JhKDAsMCwwLC42KTtcclxuICAgIH1cclxuXHJcbiAgICAke21xLm1vYmlsZX0ge1xyXG4gICAgICBmb250LXNpemU6IDQ4cHg7XHJcbiAgICB9XHJcbiAgYCxcclxuXHJcbiAgc2xvZ2FuOiBjc3NgXHJcbiAgICBmb250LXNpemU6IDMwcHg7XHJcblxyXG4gICAgJHttcS5tb2JpbGV9IHtcclxuICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgfVxyXG4gIGAsXHJcblxyXG4gIGJsb2NrczogY3NzYFxyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHRvcDogMDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gIGAsXHJcblxyXG4gIGJsb2NrOiBjc3NgXHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYigwLDUwLDEzMCk7XHJcbiAgYFxyXG59XHJcbiJdfQ== */")),
  slogan:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])("font-size:30px;", _theme_media__WEBPACK_IMPORTED_MODULE_1__["mq"].mobile, "{font-size:20px;}label:slogan;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xccGFnZXNcXGhvbWVcXGxvZ29cXHN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFrQ2EiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFxwYWdlc1xcaG9tZVxcbG9nb1xcc3R5bGVzLnRzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbXEgfSBmcm9tICdAYXBwL3RoZW1lL21lZGlhJ1xyXG5pbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB3cmFwcGVyOiBjc3NgXHJcbiAgICBwYWRkaW5nOiAyMTBweCAwIDIxMHB4O1xyXG4gICAgY29sb3I6ICMwMDA7XHJcbiAgICBmb250LXdlaWdodDogMzAwO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTJlOGVjO1xyXG5cclxuICAgICR7bXEubW9iaWxlfSB7XHJcbiAgICAgIHBhZGRpbmc6IDM4dmggMCAwO1xyXG4gICAgICBoZWlnaHQ6IGNhbGMoMTAwdmggLSA2MHB4KTtcclxuICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICBsb2dvOiBjc3NgXHJcbiAgICBmb250LXNpemU6IDY4cHg7XHJcbiAgICBtYXJnaW46IDAgMCAyMHB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcblxyXG4gICAgc3BhbiB7XHJcbiAgICAgIGNvbG9yOiByZ2JhKDAsMCwwLC42KTtcclxuICAgIH1cclxuXHJcbiAgICAke21xLm1vYmlsZX0ge1xyXG4gICAgICBmb250LXNpemU6IDQ4cHg7XHJcbiAgICB9XHJcbiAgYCxcclxuXHJcbiAgc2xvZ2FuOiBjc3NgXHJcbiAgICBmb250LXNpemU6IDMwcHg7XHJcblxyXG4gICAgJHttcS5tb2JpbGV9IHtcclxuICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgfVxyXG4gIGAsXHJcblxyXG4gIGJsb2NrczogY3NzYFxyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHRvcDogMDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gIGAsXHJcblxyXG4gIGJsb2NrOiBjc3NgXHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYigwLDUwLDEzMCk7XHJcbiAgYFxyXG59XHJcbiJdfQ== */")),
  blocks:  false ? undefined : {
    name: "mfric0-blocks",
    styles: "position:absolute;left:0;top:0;width:100%;height:100%;label:blocks;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xccGFnZXNcXGhvbWVcXGxvZ29cXHN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUEwQ2EiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFxwYWdlc1xcaG9tZVxcbG9nb1xcc3R5bGVzLnRzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbXEgfSBmcm9tICdAYXBwL3RoZW1lL21lZGlhJ1xyXG5pbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB3cmFwcGVyOiBjc3NgXHJcbiAgICBwYWRkaW5nOiAyMTBweCAwIDIxMHB4O1xyXG4gICAgY29sb3I6ICMwMDA7XHJcbiAgICBmb250LXdlaWdodDogMzAwO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTJlOGVjO1xyXG5cclxuICAgICR7bXEubW9iaWxlfSB7XHJcbiAgICAgIHBhZGRpbmc6IDM4dmggMCAwO1xyXG4gICAgICBoZWlnaHQ6IGNhbGMoMTAwdmggLSA2MHB4KTtcclxuICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICBsb2dvOiBjc3NgXHJcbiAgICBmb250LXNpemU6IDY4cHg7XHJcbiAgICBtYXJnaW46IDAgMCAyMHB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcblxyXG4gICAgc3BhbiB7XHJcbiAgICAgIGNvbG9yOiByZ2JhKDAsMCwwLC42KTtcclxuICAgIH1cclxuXHJcbiAgICAke21xLm1vYmlsZX0ge1xyXG4gICAgICBmb250LXNpemU6IDQ4cHg7XHJcbiAgICB9XHJcbiAgYCxcclxuXHJcbiAgc2xvZ2FuOiBjc3NgXHJcbiAgICBmb250LXNpemU6IDMwcHg7XHJcblxyXG4gICAgJHttcS5tb2JpbGV9IHtcclxuICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgfVxyXG4gIGAsXHJcblxyXG4gIGJsb2NrczogY3NzYFxyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHRvcDogMDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gIGAsXHJcblxyXG4gIGJsb2NrOiBjc3NgXHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYigwLDUwLDEzMCk7XHJcbiAgYFxyXG59XHJcbiJdfQ== */"
  },
  block:  false ? undefined : {
    name: "qwjlnr-block",
    styles: "position:absolute;width:100%;height:100%;background:rgb(0,50,130);label:block;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xccGFnZXNcXGhvbWVcXGxvZ29cXHN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFrRFkiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFxwYWdlc1xcaG9tZVxcbG9nb1xcc3R5bGVzLnRzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbXEgfSBmcm9tICdAYXBwL3RoZW1lL21lZGlhJ1xyXG5pbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB3cmFwcGVyOiBjc3NgXHJcbiAgICBwYWRkaW5nOiAyMTBweCAwIDIxMHB4O1xyXG4gICAgY29sb3I6ICMwMDA7XHJcbiAgICBmb250LXdlaWdodDogMzAwO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTJlOGVjO1xyXG5cclxuICAgICR7bXEubW9iaWxlfSB7XHJcbiAgICAgIHBhZGRpbmc6IDM4dmggMCAwO1xyXG4gICAgICBoZWlnaHQ6IGNhbGMoMTAwdmggLSA2MHB4KTtcclxuICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICBsb2dvOiBjc3NgXHJcbiAgICBmb250LXNpemU6IDY4cHg7XHJcbiAgICBtYXJnaW46IDAgMCAyMHB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcblxyXG4gICAgc3BhbiB7XHJcbiAgICAgIGNvbG9yOiByZ2JhKDAsMCwwLC42KTtcclxuICAgIH1cclxuXHJcbiAgICAke21xLm1vYmlsZX0ge1xyXG4gICAgICBmb250LXNpemU6IDQ4cHg7XHJcbiAgICB9XHJcbiAgYCxcclxuXHJcbiAgc2xvZ2FuOiBjc3NgXHJcbiAgICBmb250LXNpemU6IDMwcHg7XHJcblxyXG4gICAgJHttcS5tb2JpbGV9IHtcclxuICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgfVxyXG4gIGAsXHJcblxyXG4gIGJsb2NrczogY3NzYFxyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHRvcDogMDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gIGAsXHJcblxyXG4gIGJsb2NrOiBjc3NgXHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYigwLDUwLDEzMCk7XHJcbiAgYFxyXG59XHJcbiJdfQ== */"
  }
});

/***/ }),

/***/ "./src/theme/media.ts":
/*!****************************!*\
  !*** ./src/theme/media.ts ***!
  \****************************/
/*! exports provided: mqList, mq */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mqList", function() { return mqList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mq", function() { return mq; });
var mqList = [['mobile', "(max-width: 768px)"]];
var mq = mqList.reduce(function (prev, next) {
  prev[next[0]] = "@media ".concat(next[1]);
  return prev;
}, {});

/***/ }),

/***/ "./src/ui/button/index.tsx":
/*!*********************************!*\
  !*** ./src/ui/button/index.tsx ***!
  \*********************************/
/*! exports provided: Button */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Button", function() { return Button; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/extends */ "./node_modules/@babel/runtime-corejs2/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles */ "./src/ui/button/styles.ts");


var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\button\\index.tsx";



function Button(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'button' : _ref$type,
      rest = Object(_babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, ["type"]);

  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_3__["jsx"])("button", Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, rest, {
    css: _styles__WEBPACK_IMPORTED_MODULE_4__["default"].btn,
    type: type,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }));
}

/***/ }),

/***/ "./src/ui/button/styles.ts":
/*!*********************************!*\
  !*** ./src/ui/button/styles.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");

/* harmony default export */ __webpack_exports__["default"] = ({
  btn:  false ? undefined : {
    name: "1skiqvo-btn",
    styles: "height:40px;border:1px solid transparent;border-radius:4px;background:#4e5b6f;color:#fff;padding:0 16px;transition:all .15s;&:hover{cursor:pointer;background:#051937;}&:focus{outline:none;border-color:rgba(0,0,0,.25);box-shadow:0 1px 3px rgba(0,0,0,.35);}label:btn;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGJ1dHRvblxcc3R5bGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdVIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGJ1dHRvblxcc3R5bGVzLnRzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNzcyBmcm9tICdAZW1vdGlvbi9jc3MnXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgYnRuOiBjc3NgXHJcbiAgICBoZWlnaHQ6IDQwcHg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICAgIGJhY2tncm91bmQ6ICM0ZTViNmY7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgIHBhZGRpbmc6IDAgMTZweDtcclxuICAgIHRyYW5zaXRpb246IGFsbCAuMTVzO1xyXG5cclxuICAgICY6aG92ZXIge1xyXG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgIGJhY2tncm91bmQ6ICMwNTE5Mzc7XHJcbiAgICB9XHJcblxyXG4gICAgJjpmb2N1cyB7XHJcbiAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgIGJvcmRlci1jb2xvcjogcmdiYSgwLDAsMCwuMjUpO1xyXG4gICAgICBib3gtc2hhZG93OiAwIDFweCAzcHggcmdiYSgwLDAsMCwuMzUpO1xyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */"
  }
});

/***/ }),

/***/ "./src/ui/code/index.tsx":
/*!*******************************!*\
  !*** ./src/ui/code/index.tsx ***!
  \*******************************/
/*! exports provided: CodeLang, Code */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CodeLang", function() { return CodeLang; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Code", function() { return Code; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/extends */ "./node_modules/@babel/runtime-corejs2/helpers/esm/extends.js");
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var prismjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! prismjs */ "./node_modules/prismjs/prism.js");
/* harmony import */ var prismjs__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(prismjs__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var prismjs_components_prism_typescript__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! prismjs/components/prism-typescript */ "./node_modules/prismjs/components/prism-typescript.js");
/* harmony import */ var prismjs_components_prism_typescript__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(prismjs_components_prism_typescript__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var prismjs_themes_prism_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! prismjs/themes/prism.css */ "./node_modules/prismjs/themes/prism.css");
/* harmony import */ var prismjs_themes_prism_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(prismjs_themes_prism_css__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./styles */ "./src/ui/code/styles.ts");




var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\code\\index.tsx";







var CodeLang;

(function (CodeLang) {
  CodeLang["TS"] = "typescript";
  CodeLang["Markup"] = "markup";
})(CodeLang || (CodeLang = {}));

function Code(_ref) {
  var children = _ref.children,
      src = _ref.src,
      url = _ref.url,
      _ref$lang = _ref.lang,
      lang = _ref$lang === void 0 ? CodeLang.TS : _ref$lang,
      css = Object(_babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref, ["children", "src", "url", "lang"]);

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(''),
      _useState2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useState, 2),
      source = _useState2[0],
      setSource = _useState2[1];

  var highlight = Object(react__WEBPACK_IMPORTED_MODULE_4__["useCallback"])(function (text) {
    return setSource(prismjs__WEBPACK_IMPORTED_MODULE_6___default.a.highlight(text, prismjs__WEBPACK_IMPORTED_MODULE_6___default.a.languages[lang], lang));
  }, [lang]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (children) {
      highlight(children);
    }
  }, [children]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (src && !children) {
      fetch(src).then(function (value) {
        return value.text();
      }).then(function (text) {
        return highlight(text);
      });
    }
  }, []);
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_5__["jsx"])(react__WEBPACK_IMPORTED_MODULE_4___default.a.Fragment, null, url && Object(_emotion_core__WEBPACK_IMPORTED_MODULE_5__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_9__["default"].sourceLabel,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_5__["jsx"])("a", {
    css: _styles__WEBPACK_IMPORTED_MODULE_9__["default"].sourceLink,
    href: url,
    target: "_blank",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, "Source")), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_5__["jsx"])("div", Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css:
    /*#__PURE__*/
    Object(_emotion_css__WEBPACK_IMPORTED_MODULE_1__["default"])([_styles__WEBPACK_IMPORTED_MODULE_9__["default"].wrapper, lang === CodeLang.Markup && _styles__WEBPACK_IMPORTED_MODULE_9__["default"].langMarkup], "label:Code;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGNvZGVcXGluZGV4LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUErQ1MiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFx1aVxcY29kZVxcaW5kZXgudHN4Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByaXNtIGZyb20gJ3ByaXNtanMnXHJcbmltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLXR5cGVzY3JpcHQnXHJcbmltcG9ydCAncHJpc21qcy90aGVtZXMvcHJpc20uY3NzJ1xyXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vc3R5bGVzJ1xyXG5cclxuZXhwb3J0IGVudW0gQ29kZUxhbmcge1xyXG4gIFRTID0gJ3R5cGVzY3JpcHQnLFxyXG4gIE1hcmt1cCA9ICdtYXJrdXAnXHJcbn1cclxuXHJcbmludGVyZmFjZSBQcm9wcyB7XHJcbiAgY2hpbGRyZW4/OiBzdHJpbmdcclxuICBsYW5nPzogQ29kZUxhbmdcclxuICB1cmw/OiBzdHJpbmdcclxuXHJcbiAgLyoqXHJcbiAgICogUGF0aCB0byByYXcgZmlsZVxyXG4gICAqL1xyXG4gIHNyYz86IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ29kZSh7IGNoaWxkcmVuLCBzcmMsIHVybCwgbGFuZyA9IENvZGVMYW5nLlRTLCAuLi5jc3MgfTogUHJvcHMpIHtcclxuICBjb25zdCBbc291cmNlLCBzZXRTb3VyY2VdID0gdXNlU3RhdGUoJycpXHJcblxyXG4gIGNvbnN0IGhpZ2hsaWdodCA9IHVzZUNhbGxiYWNrKCh0ZXh0OiBzdHJpbmcpID0+IHNldFNvdXJjZShQcmlzbS5oaWdobGlnaHQodGV4dCwgUHJpc20ubGFuZ3VhZ2VzW2xhbmddLCBsYW5nKSksIFtsYW5nXSlcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChjaGlsZHJlbikge1xyXG4gICAgICBoaWdobGlnaHQoY2hpbGRyZW4pXHJcbiAgICB9XHJcbiAgfSwgW2NoaWxkcmVuXSlcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChzcmMgJiYgIWNoaWxkcmVuKSB7XHJcbiAgICAgIGZldGNoKHNyYylcclxuICAgICAgICAudGhlbih2YWx1ZSA9PiB2YWx1ZS50ZXh0KCkpXHJcbiAgICAgICAgLnRoZW4odGV4dCA9PiBoaWdobGlnaHQodGV4dCkpXHJcbiAgICB9XHJcbiAgfSwgW10pXHJcblxyXG4gIHJldHVybiA8PlxyXG4gICAge3VybCAmJlxyXG4gICAgICA8ZGl2IGNzcz17c3R5bGVzLnNvdXJjZUxhYmVsfT5cclxuICAgICAgICA8YSBjc3M9e3N0eWxlcy5zb3VyY2VMaW5rfSBocmVmPXt1cmx9IHRhcmdldD1cIl9ibGFua1wiPlNvdXJjZTwvYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbiAgICA8ZGl2IGNzcz17W3N0eWxlcy53cmFwcGVyLCBsYW5nID09PSBDb2RlTGFuZy5NYXJrdXAgJiYgc3R5bGVzLmxhbmdNYXJrdXBdfSB7Li4uY3NzfT5cclxuICAgICAgPHByZSBjc3M9e3N0eWxlcy5jb2RlfT5cclxuICAgICAgICA8Y29kZSBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IHNvdXJjZSB9fSAvPlxyXG4gICAgICA8L3ByZT5cclxuICAgIDwvZGl2PlxyXG4gIDwvPlxyXG59XHJcbiJdfQ== */"))
  }, css, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_5__["jsx"])("pre", {
    css: _styles__WEBPACK_IMPORTED_MODULE_9__["default"].code,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_5__["jsx"])("code", {
    dangerouslySetInnerHTML: {
      __html: source
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: this
  }))));
}

/***/ }),

/***/ "./src/ui/code/styles.ts":
/*!*******************************!*\
  !*** ./src/ui/code/styles.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");

var code =  false ? undefined : {
  name: "1qvj3om-code",
  styles: "margin:0;padding:16px;overflow:auto;label:code;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGNvZGVcXHN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFZ0IiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFx1aVxcY29kZVxcc3R5bGVzLnRzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNzcyBmcm9tICdAZW1vdGlvbi9jc3MnXHJcblxyXG5jb25zdCBjb2RlID0gY3NzYFxyXG4gIG1hcmdpbjogMDtcclxuICBwYWRkaW5nOiAxNnB4O1xyXG4gIG92ZXJmbG93OiBhdXRvO1xyXG5gXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgd3JhcHBlcjogY3NzYFxyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG5cclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNlMWUxZTE7XHJcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgICBvdmVyZmxvdzogYXV0bztcclxuICBgLFxyXG5cclxuICBjb2RlLFxyXG5cclxuICBzb3VyY2VMYWJlbDogY3NzYFxyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIGAsXHJcblxyXG4gIHNvdXJjZUxpbms6IGNzc2BcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgdG9wOiAtMjBweDtcclxuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIGNvbG9yOiAjMDA5ZmZmO1xyXG5cclxuICAgIDphZnRlciB7XHJcbiAgICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICB3aWR0aDogMTJweDtcclxuICAgICAgaGVpZ2h0OiAxMnB4O1xyXG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjgzLjkyMiAyODMuOTIyXCI+PGcgZmlsbD1cIiUyMzAwOWZmZlwiPjxwYXRoIGQ9XCJNMjY2LjQyMiwwaC05Ny42MjVjLTkuNjUsMC0xNy41LDcuODUxLTE3LjUsMTcuNWMwLDkuNjQ5LDcuODUsMTcuNSwxNy41LDE3LjVoNTUuMzc3bC05Mi4zNzUsOTIuMzc0Yy0zLjMwNywzLjMwNS01LjEyNyw3LjY5OS01LjEyNywxMi4zNzVjMCw0LjY3NiwxLjgxOSw5LjA2OSw1LjEyNSwxMi4zNzFjMy4zMDYsMy4zMDksNy42OTksNS4xMywxMi4zNzUsNS4xM2M0LjY3NCwwLDkuMDY5LTEuODIsMTIuMzc2LTUuMTI3bDkyLjM3NC05Mi4zNzV2NTUuMzc3YzAsOS42NDksNy44NTEsMTcuNSwxNy41LDE3LjVjOS42NDksMCwxNy41LTcuODUxLDE3LjUtMTcuNVYxNy41QzI4My45MjIsNy44NTEsMjc2LjA3MSwwLDI2Ni40MjIsMHpcIi8+PHBhdGggZD1cIk0yMDEuMTM3LDI1My45MjJIMzBWODIuNzg1aDEyOC43MTFsMzAtMzBIMTVjLTguMjg0LDAtMTUsNi43MTYtMTUsMTV2MjAxLjEzN2MwLDguMjg0LDYuNzE2LDE1LDE1LDE1aDIwMS4xMzdjOC4yODQsMCwxNS02LjcxNiwxNS0xNVY5NS4yMTFsLTMwLDMwVjI1My45MjJ6XCIvPjwvZz48L3N2Zz4nKTtcclxuICAgICAgYmFja2dyb3VuZC1zaXplOiBjb250YWluO1xyXG4gICAgICBtYXJnaW46IDAgMCAwIDZweDtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICBsYW5nTWFya3VwOiBjc3NgXHJcbiAgICAuY3NzLSR7Y29kZS5uYW1lfSB7XHJcbiAgICAgIGJhY2tncm91bmQ6ICMwNTE5Mzc7XHJcbiAgICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */"
};
/* harmony default export */ __webpack_exports__["default"] = ({
  wrapper:  false ? undefined : {
    name: "wabjnu-wrapper",
    styles: "position:relative;border:1px solid #e1e1e1;border-radius:4px;overflow:auto;label:wrapper;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGNvZGVcXHN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTYyIsImZpbGUiOiJFOlxcZ2l0aHViXFx2YWxpZGF0ZS1zaXRlXFxzcmNcXHVpXFxjb2RlXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmNvbnN0IGNvZGUgPSBjc3NgXHJcbiAgbWFyZ2luOiAwO1xyXG4gIHBhZGRpbmc6IDE2cHg7XHJcbiAgb3ZlcmZsb3c6IGF1dG87XHJcbmBcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB3cmFwcGVyOiBjc3NgXHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcblxyXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2UxZTFlMTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICAgIG92ZXJmbG93OiBhdXRvO1xyXG4gIGAsXHJcblxyXG4gIGNvZGUsXHJcblxyXG4gIHNvdXJjZUxhYmVsOiBjc3NgXHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgYCxcclxuXHJcbiAgc291cmNlTGluazogY3NzYFxyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICB0b3A6IC0yMHB4O1xyXG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgY29sb3I6ICMwMDlmZmY7XHJcblxyXG4gICAgOmFmdGVyIHtcclxuICAgICAgY29udGVudDogXCJcIjtcclxuICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgIHdpZHRoOiAxMnB4O1xyXG4gICAgICBoZWlnaHQ6IDEycHg7XHJcbiAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyODMuOTIyIDI4My45MjJcIj48ZyBmaWxsPVwiJTIzMDA5ZmZmXCI+PHBhdGggZD1cIk0yNjYuNDIyLDBoLTk3LjYyNWMtOS42NSwwLTE3LjUsNy44NTEtMTcuNSwxNy41YzAsOS42NDksNy44NSwxNy41LDE3LjUsMTcuNWg1NS4zNzdsLTkyLjM3NSw5Mi4zNzRjLTMuMzA3LDMuMzA1LTUuMTI3LDcuNjk5LTUuMTI3LDEyLjM3NWMwLDQuNjc2LDEuODE5LDkuMDY5LDUuMTI1LDEyLjM3MWMzLjMwNiwzLjMwOSw3LjY5OSw1LjEzLDEyLjM3NSw1LjEzYzQuNjc0LDAsOS4wNjktMS44MiwxMi4zNzYtNS4xMjdsOTIuMzc0LTkyLjM3NXY1NS4zNzdjMCw5LjY0OSw3Ljg1MSwxNy41LDE3LjUsMTcuNWM5LjY0OSwwLDE3LjUtNy44NTEsMTcuNS0xNy41VjE3LjVDMjgzLjkyMiw3Ljg1MSwyNzYuMDcxLDAsMjY2LjQyMiwwelwiLz48cGF0aCBkPVwiTTIwMS4xMzcsMjUzLjkyMkgzMFY4Mi43ODVoMTI4LjcxMWwzMC0zMEgxNWMtOC4yODQsMC0xNSw2LjcxNi0xNSwxNXYyMDEuMTM3YzAsOC4yODQsNi43MTYsMTUsMTUsMTVoMjAxLjEzN2M4LjI4NCwwLDE1LTYuNzE2LDE1LTE1Vjk1LjIxMWwtMzAsMzBWMjUzLjkyMnpcIi8+PC9nPjwvc3ZnPicpO1xyXG4gICAgICBiYWNrZ3JvdW5kLXNpemU6IGNvbnRhaW47XHJcbiAgICAgIG1hcmdpbjogMCAwIDAgNnB4O1xyXG4gICAgfVxyXG4gIGAsXHJcblxyXG4gIGxhbmdNYXJrdXA6IGNzc2BcclxuICAgIC5jc3MtJHtjb2RlLm5hbWV9IHtcclxuICAgICAgYmFja2dyb3VuZDogIzA1MTkzNztcclxuICAgICAgY29sb3I6ICNmZmY7XHJcbiAgICB9XHJcbiAgYFxyXG59XHJcbiJdfQ== */"
  },
  code: code,
  sourceLabel:  false ? undefined : {
    name: "1g2v2ay-sourceLabel",
    styles: "position:relative;label:sourceLabel;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGNvZGVcXHN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFtQmtCIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGNvZGVcXHN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5cclxuY29uc3QgY29kZSA9IGNzc2BcclxuICBtYXJnaW46IDA7XHJcbiAgcGFkZGluZzogMTZweDtcclxuICBvdmVyZmxvdzogYXV0bztcclxuYFxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHdyYXBwZXI6IGNzc2BcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZTFlMWUxO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gICAgb3ZlcmZsb3c6IGF1dG87XHJcbiAgYCxcclxuXHJcbiAgY29kZSxcclxuXHJcbiAgc291cmNlTGFiZWw6IGNzc2BcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBgLFxyXG5cclxuICBzb3VyY2VMaW5rOiBjc3NgXHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICByaWdodDogMDtcclxuICAgIHRvcDogLTIwcHg7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICBjb2xvcjogIzAwOWZmZjtcclxuXHJcbiAgICA6YWZ0ZXIge1xyXG4gICAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgd2lkdGg6IDEycHg7XHJcbiAgICAgIGhlaWdodDogMTJweDtcclxuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI4My45MjIgMjgzLjkyMlwiPjxnIGZpbGw9XCIlMjMwMDlmZmZcIj48cGF0aCBkPVwiTTI2Ni40MjIsMGgtOTcuNjI1Yy05LjY1LDAtMTcuNSw3Ljg1MS0xNy41LDE3LjVjMCw5LjY0OSw3Ljg1LDE3LjUsMTcuNSwxNy41aDU1LjM3N2wtOTIuMzc1LDkyLjM3NGMtMy4zMDcsMy4zMDUtNS4xMjcsNy42OTktNS4xMjcsMTIuMzc1YzAsNC42NzYsMS44MTksOS4wNjksNS4xMjUsMTIuMzcxYzMuMzA2LDMuMzA5LDcuNjk5LDUuMTMsMTIuMzc1LDUuMTNjNC42NzQsMCw5LjA2OS0xLjgyLDEyLjM3Ni01LjEyN2w5Mi4zNzQtOTIuMzc1djU1LjM3N2MwLDkuNjQ5LDcuODUxLDE3LjUsMTcuNSwxNy41YzkuNjQ5LDAsMTcuNS03Ljg1MSwxNy41LTE3LjVWMTcuNUMyODMuOTIyLDcuODUxLDI3Ni4wNzEsMCwyNjYuNDIyLDB6XCIvPjxwYXRoIGQ9XCJNMjAxLjEzNywyNTMuOTIySDMwVjgyLjc4NWgxMjguNzExbDMwLTMwSDE1Yy04LjI4NCwwLTE1LDYuNzE2LTE1LDE1djIwMS4xMzdjMCw4LjI4NCw2LjcxNiwxNSwxNSwxNWgyMDEuMTM3YzguMjg0LDAsMTUtNi43MTYsMTUtMTVWOTUuMjExbC0zMCwzMFYyNTMuOTIyelwiLz48L2c+PC9zdmc+Jyk7XHJcbiAgICAgIGJhY2tncm91bmQtc2l6ZTogY29udGFpbjtcclxuICAgICAgbWFyZ2luOiAwIDAgMCA2cHg7XHJcbiAgICB9XHJcbiAgYCxcclxuXHJcbiAgbGFuZ01hcmt1cDogY3NzYFxyXG4gICAgLmNzcy0ke2NvZGUubmFtZX0ge1xyXG4gICAgICBiYWNrZ3JvdW5kOiAjMDUxOTM3O1xyXG4gICAgICBjb2xvcjogI2ZmZjtcclxuICAgIH1cclxuICBgXHJcbn1cclxuIl19 */"
  },
  sourceLink:  false ? undefined : {
    name: "mjan5w-sourceLink",
    styles: "position:absolute;right:0;top:-20px;display:inline-flex;text-decoration:none;text-transform:uppercase;color:#009fff;:after{content:\"\";display:block;width:12px;height:12px;background-image:url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 283.922 283.922\"><g fill=\"%23009fff\"><path d=\"M266.422,0h-97.625c-9.65,0-17.5,7.851-17.5,17.5c0,9.649,7.85,17.5,17.5,17.5h55.377l-92.375,92.374c-3.307,3.305-5.127,7.699-5.127,12.375c0,4.676,1.819,9.069,5.125,12.371c3.306,3.309,7.699,5.13,12.375,5.13c4.674,0,9.069-1.82,12.376-5.127l92.374-92.375v55.377c0,9.649,7.851,17.5,17.5,17.5c9.649,0,17.5-7.851,17.5-17.5V17.5C283.922,7.851,276.071,0,266.422,0z\"/><path d=\"M201.137,253.922H30V82.785h128.711l30-30H15c-8.284,0-15,6.716-15,15v201.137c0,8.284,6.716,15,15,15h201.137c8.284,0,15-6.716,15-15V95.211l-30,30V253.922z\"/></g></svg>');background-size:contain;margin:0 0 0 6px;}label:sourceLink;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGNvZGVcXHN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF1QmlCIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGNvZGVcXHN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5cclxuY29uc3QgY29kZSA9IGNzc2BcclxuICBtYXJnaW46IDA7XHJcbiAgcGFkZGluZzogMTZweDtcclxuICBvdmVyZmxvdzogYXV0bztcclxuYFxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHdyYXBwZXI6IGNzc2BcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZTFlMWUxO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gICAgb3ZlcmZsb3c6IGF1dG87XHJcbiAgYCxcclxuXHJcbiAgY29kZSxcclxuXHJcbiAgc291cmNlTGFiZWw6IGNzc2BcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBgLFxyXG5cclxuICBzb3VyY2VMaW5rOiBjc3NgXHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICByaWdodDogMDtcclxuICAgIHRvcDogLTIwcHg7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICBjb2xvcjogIzAwOWZmZjtcclxuXHJcbiAgICA6YWZ0ZXIge1xyXG4gICAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgd2lkdGg6IDEycHg7XHJcbiAgICAgIGhlaWdodDogMTJweDtcclxuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI4My45MjIgMjgzLjkyMlwiPjxnIGZpbGw9XCIlMjMwMDlmZmZcIj48cGF0aCBkPVwiTTI2Ni40MjIsMGgtOTcuNjI1Yy05LjY1LDAtMTcuNSw3Ljg1MS0xNy41LDE3LjVjMCw5LjY0OSw3Ljg1LDE3LjUsMTcuNSwxNy41aDU1LjM3N2wtOTIuMzc1LDkyLjM3NGMtMy4zMDcsMy4zMDUtNS4xMjcsNy42OTktNS4xMjcsMTIuMzc1YzAsNC42NzYsMS44MTksOS4wNjksNS4xMjUsMTIuMzcxYzMuMzA2LDMuMzA5LDcuNjk5LDUuMTMsMTIuMzc1LDUuMTNjNC42NzQsMCw5LjA2OS0xLjgyLDEyLjM3Ni01LjEyN2w5Mi4zNzQtOTIuMzc1djU1LjM3N2MwLDkuNjQ5LDcuODUxLDE3LjUsMTcuNSwxNy41YzkuNjQ5LDAsMTcuNS03Ljg1MSwxNy41LTE3LjVWMTcuNUMyODMuOTIyLDcuODUxLDI3Ni4wNzEsMCwyNjYuNDIyLDB6XCIvPjxwYXRoIGQ9XCJNMjAxLjEzNywyNTMuOTIySDMwVjgyLjc4NWgxMjguNzExbDMwLTMwSDE1Yy04LjI4NCwwLTE1LDYuNzE2LTE1LDE1djIwMS4xMzdjMCw4LjI4NCw2LjcxNiwxNSwxNSwxNWgyMDEuMTM3YzguMjg0LDAsMTUtNi43MTYsMTUtMTVWOTUuMjExbC0zMCwzMFYyNTMuOTIyelwiLz48L2c+PC9zdmc+Jyk7XHJcbiAgICAgIGJhY2tncm91bmQtc2l6ZTogY29udGFpbjtcclxuICAgICAgbWFyZ2luOiAwIDAgMCA2cHg7XHJcbiAgICB9XHJcbiAgYCxcclxuXHJcbiAgbGFuZ01hcmt1cDogY3NzYFxyXG4gICAgLmNzcy0ke2NvZGUubmFtZX0ge1xyXG4gICAgICBiYWNrZ3JvdW5kOiAjMDUxOTM3O1xyXG4gICAgICBjb2xvcjogI2ZmZjtcclxuICAgIH1cclxuICBgXHJcbn1cclxuIl19 */"
  },
  langMarkup:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])(".css-", code.name, "{background:#051937;color:#fff;}label:langMarkup;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGNvZGVcXHN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUEyQ2lCIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGNvZGVcXHN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5cclxuY29uc3QgY29kZSA9IGNzc2BcclxuICBtYXJnaW46IDA7XHJcbiAgcGFkZGluZzogMTZweDtcclxuICBvdmVyZmxvdzogYXV0bztcclxuYFxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHdyYXBwZXI6IGNzc2BcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZTFlMWUxO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gICAgb3ZlcmZsb3c6IGF1dG87XHJcbiAgYCxcclxuXHJcbiAgY29kZSxcclxuXHJcbiAgc291cmNlTGFiZWw6IGNzc2BcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBgLFxyXG5cclxuICBzb3VyY2VMaW5rOiBjc3NgXHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICByaWdodDogMDtcclxuICAgIHRvcDogLTIwcHg7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICBjb2xvcjogIzAwOWZmZjtcclxuXHJcbiAgICA6YWZ0ZXIge1xyXG4gICAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgd2lkdGg6IDEycHg7XHJcbiAgICAgIGhlaWdodDogMTJweDtcclxuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI4My45MjIgMjgzLjkyMlwiPjxnIGZpbGw9XCIlMjMwMDlmZmZcIj48cGF0aCBkPVwiTTI2Ni40MjIsMGgtOTcuNjI1Yy05LjY1LDAtMTcuNSw3Ljg1MS0xNy41LDE3LjVjMCw5LjY0OSw3Ljg1LDE3LjUsMTcuNSwxNy41aDU1LjM3N2wtOTIuMzc1LDkyLjM3NGMtMy4zMDcsMy4zMDUtNS4xMjcsNy42OTktNS4xMjcsMTIuMzc1YzAsNC42NzYsMS44MTksOS4wNjksNS4xMjUsMTIuMzcxYzMuMzA2LDMuMzA5LDcuNjk5LDUuMTMsMTIuMzc1LDUuMTNjNC42NzQsMCw5LjA2OS0xLjgyLDEyLjM3Ni01LjEyN2w5Mi4zNzQtOTIuMzc1djU1LjM3N2MwLDkuNjQ5LDcuODUxLDE3LjUsMTcuNSwxNy41YzkuNjQ5LDAsMTcuNS03Ljg1MSwxNy41LTE3LjVWMTcuNUMyODMuOTIyLDcuODUxLDI3Ni4wNzEsMCwyNjYuNDIyLDB6XCIvPjxwYXRoIGQ9XCJNMjAxLjEzNywyNTMuOTIySDMwVjgyLjc4NWgxMjguNzExbDMwLTMwSDE1Yy04LjI4NCwwLTE1LDYuNzE2LTE1LDE1djIwMS4xMzdjMCw4LjI4NCw2LjcxNiwxNSwxNSwxNWgyMDEuMTM3YzguMjg0LDAsMTUtNi43MTYsMTUtMTVWOTUuMjExbC0zMCwzMFYyNTMuOTIyelwiLz48L2c+PC9zdmc+Jyk7XHJcbiAgICAgIGJhY2tncm91bmQtc2l6ZTogY29udGFpbjtcclxuICAgICAgbWFyZ2luOiAwIDAgMCA2cHg7XHJcbiAgICB9XHJcbiAgYCxcclxuXHJcbiAgbGFuZ01hcmt1cDogY3NzYFxyXG4gICAgLmNzcy0ke2NvZGUubmFtZX0ge1xyXG4gICAgICBiYWNrZ3JvdW5kOiAjMDUxOTM3O1xyXG4gICAgICBjb2xvcjogI2ZmZjtcclxuICAgIH1cclxuICBgXHJcbn1cclxuIl19 */"))
});

/***/ }),

/***/ "./src/ui/forms/field-message/index.tsx":
/*!**********************************************!*\
  !*** ./src/ui/forms/field-message/index.tsx ***!
  \**********************************************/
/*! exports provided: FieldMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FieldMessage", function() { return FieldMessage; });
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles */ "./src/ui/forms/field-message/styles.ts");

var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\forms\\field-message\\index.tsx";



function FieldMessage(_ref) {
  var field = _ref.field;

  if (!field.error && !field.warn) {
    return null;
  }

  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])("div", {
    css:
    /*#__PURE__*/
    Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])([_styles__WEBPACK_IMPORTED_MODULE_3__["default"].message, field.error && _styles__WEBPACK_IMPORTED_MODULE_3__["default"].error || field.warn && _styles__WEBPACK_IMPORTED_MODULE_3__["default"].warn], "label:FieldMessage;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFxmaWVsZC1tZXNzYWdlXFxpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBYUkiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFx1aVxcZm9ybXNcXGZpZWxkLW1lc3NhZ2VcXGluZGV4LnRzeCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZpZWxkIH0gZnJvbSAnQG1jLXBldHJ5L3VzZWZvcm0nXHJcbmltcG9ydCBzdHlsZXMgZnJvbSAnLi9zdHlsZXMnXHJcblxyXG5pbnRlcmZhY2UgUHJvcHMge1xyXG4gIGZpZWxkOiBGaWVsZFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRmllbGRNZXNzYWdlKHsgZmllbGQgfTogUHJvcHMpIHtcclxuICBpZiAoIWZpZWxkLmVycm9yICYmICFmaWVsZC53YXJuKSB7XHJcbiAgICByZXR1cm4gbnVsbFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIDxkaXZcclxuICAgIGNzcz17W1xyXG4gICAgICBzdHlsZXMubWVzc2FnZSxcclxuICAgICAgZmllbGQuZXJyb3IgJiYgc3R5bGVzLmVycm9yIHx8IGZpZWxkLndhcm4gJiYgc3R5bGVzLndhcm5cclxuICAgIF19XHJcbiAgPlxyXG4gICAge2ZpZWxkLmVycm9yIHx8IGZpZWxkLndhcm59XHJcbiAgPC9kaXY+XHJcbn1cclxuIl19 */")),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, field.error || field.warn);
}

/***/ }),

/***/ "./src/ui/forms/field-message/styles.ts":
/*!**********************************************!*\
  !*** ./src/ui/forms/field-message/styles.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");

/* harmony default export */ __webpack_exports__["default"] = ({
  message:  false ? undefined : {
    name: "aswei5-message",
    styles: "font-size:12px;margin:8px 0 0;label:message;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFxmaWVsZC1tZXNzYWdlXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR2MiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFx1aVxcZm9ybXNcXGZpZWxkLW1lc3NhZ2VcXHN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIG1lc3NhZ2U6IGNzc2BcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIG1hcmdpbjogOHB4IDAgMDtcclxuICBgLFxyXG5cclxuICBlcnJvcjogY3NzYFxyXG4gICAgY29sb3I6ICNjMDg4N2Q7XHJcbiAgYCxcclxuXHJcbiAgd2FybjogY3NzYFxyXG4gICAgY29sb3I6ICNkMTlkMzY7XHJcbiAgYFxyXG59XHJcbiJdfQ== */"
  },
  error:  false ? undefined : {
    name: "172kjfz-error",
    styles: "color:#c0887d;label:error;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFxmaWVsZC1tZXNzYWdlXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUVkiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFx1aVxcZm9ybXNcXGZpZWxkLW1lc3NhZ2VcXHN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIG1lc3NhZ2U6IGNzc2BcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIG1hcmdpbjogOHB4IDAgMDtcclxuICBgLFxyXG5cclxuICBlcnJvcjogY3NzYFxyXG4gICAgY29sb3I6ICNjMDg4N2Q7XHJcbiAgYCxcclxuXHJcbiAgd2FybjogY3NzYFxyXG4gICAgY29sb3I6ICNkMTlkMzY7XHJcbiAgYFxyXG59XHJcbiJdfQ== */"
  },
  warn:  false ? undefined : {
    name: "sgjtam-warn",
    styles: "color:#d19d36;label:warn;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFxmaWVsZC1tZXNzYWdlXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBWVciLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFx1aVxcZm9ybXNcXGZpZWxkLW1lc3NhZ2VcXHN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIG1lc3NhZ2U6IGNzc2BcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIG1hcmdpbjogOHB4IDAgMDtcclxuICBgLFxyXG5cclxuICBlcnJvcjogY3NzYFxyXG4gICAgY29sb3I6ICNjMDg4N2Q7XHJcbiAgYCxcclxuXHJcbiAgd2FybjogY3NzYFxyXG4gICAgY29sb3I6ICNkMTlkMzY7XHJcbiAgYFxyXG59XHJcbiJdfQ== */"
  }
});

/***/ }),

/***/ "./src/ui/forms/number-field/index.tsx":
/*!*********************************************!*\
  !*** ./src/ui/forms/number-field/index.tsx ***!
  \*********************************************/
/*! exports provided: NumberField */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NumberField", function() { return NumberField; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/extends */ "./node_modules/@babel/runtime-corejs2/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectSpread */ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectSpread.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _text_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../text-field */ "./src/ui/forms/text-field/index.tsx");



var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\forms\\number-field\\index.tsx";




function NumberField(_ref) {
  var field = _ref.field,
      rest = Object(_babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref, ["field"]);

  var handleOnChange = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (value) {
    if (!/^\d*$/.test(value)) {
      return;
    }

    field.onChange(+value);
  }, [field]);

  var proxy = Object(_babel_runtime_corejs2_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_1__["default"])({}, field, {
    onChange: handleOnChange,
    value: field.value ? field.value.toString() : undefined
  });

  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_4__["jsx"])(_text_field__WEBPACK_IMPORTED_MODULE_5__["TextField"], Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    field: proxy
  }, rest, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }));
}

/***/ }),

/***/ "./src/ui/forms/text-field/index.tsx":
/*!*******************************************!*\
  !*** ./src/ui/forms/text-field/index.tsx ***!
  \*******************************************/
/*! exports provided: TextField */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextField", function() { return TextField; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/extends */ "./node_modules/@babel/runtime-corejs2/helpers/esm/extends.js");
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _field_message__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../field-message */ "./src/ui/forms/field-message/index.tsx");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./styles */ "./src/ui/forms/text-field/styles.ts");



var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\forms\\text-field\\index.tsx";





function TextField(_ref) {
  var field = _ref.field,
      label = _ref.label,
      css = Object(_babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref, ["field", "label"]);

  var onChange = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (e) {
    return field.onChange(e.target.value);
  }, []);
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_4__["jsx"])("div", {
    css:
    /*#__PURE__*/
    Object(_emotion_css__WEBPACK_IMPORTED_MODULE_1__["default"])([_styles__WEBPACK_IMPORTED_MODULE_6__["default"].field, field.error && _styles__WEBPACK_IMPORTED_MODULE_6__["default"].error || field.warn && _styles__WEBPACK_IMPORTED_MODULE_6__["default"].warn], "label:TextField;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFx0ZXh0LWZpZWxkXFxpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBa0JJIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFx0ZXh0LWZpZWxkXFxpbmRleC50c3giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGaWVsZCB9IGZyb20gJ0BtYy1wZXRyeS91c2Vmb3JtJ1xyXG5pbXBvcnQgeyBDaGFuZ2VFdmVudCwgUmVmT2JqZWN0LCB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBGaWVsZE1lc3NhZ2UgfSBmcm9tICcuLi9maWVsZC1tZXNzYWdlJ1xyXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vc3R5bGVzJ1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUZXh0RmllbGRQcm9wcyB7XHJcbiAgZmllbGQ6IEZpZWxkPHN0cmluZz5cclxuICBsYWJlbD86IHN0cmluZ1xyXG4gIGRpc2FibGVkPzogYm9vbGVhblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVGV4dEZpZWxkKHsgZmllbGQsIGxhYmVsLCAuLi5jc3MgfTogVGV4dEZpZWxkUHJvcHMpIHtcclxuICBjb25zdCBvbkNoYW5nZSA9IHVzZUNhbGxiYWNrKChlOiBDaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT5cclxuICAgIGZpZWxkLm9uQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKSxcclxuICAgIFtdXHJcbiAgKVxyXG5cclxuICByZXR1cm4gPGRpdlxyXG4gICAgY3NzPXtbXHJcbiAgICAgIHN0eWxlcy5maWVsZCxcclxuICAgICAgZmllbGQuZXJyb3IgJiYgc3R5bGVzLmVycm9yIHx8IGZpZWxkLndhcm4gJiYgc3R5bGVzLndhcm5cclxuICAgIF19XHJcbiAgPlxyXG4gICAge2xhYmVsICYmIDxkaXYgY3NzPXtzdHlsZXMubGFiZWx9PntsYWJlbH08L2Rpdj59XHJcbiAgICA8aW5wdXRcclxuICAgICAgY3NzPXtzdHlsZXMuaW5wdXR9XHJcbiAgICAgIHJlZj17ZmllbGQucmVmIGFzIFJlZk9iamVjdDxIVE1MSW5wdXRFbGVtZW50Pn1cclxuICAgICAgdmFsdWU9e2ZpZWxkLnZhbHVlIHx8ICcnfVxyXG4gICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XHJcbiAgICAgIG9uQmx1cj17ZmllbGQub25CbHVyfVxyXG4gICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgIHsuLi5jc3N9XHJcbiAgICAvPlxyXG4gICAgPEZpZWxkTWVzc2FnZSBmaWVsZD17ZmllbGR9IC8+XHJcbiAgPC9kaXY+XHJcbn1cclxuIl19 */")),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, label && Object(_emotion_core__WEBPACK_IMPORTED_MODULE_4__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_6__["default"].label,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }, label), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_4__["jsx"])("input", Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: _styles__WEBPACK_IMPORTED_MODULE_6__["default"].input,
    ref: field.ref,
    value: field.value || '',
    onChange: onChange,
    onBlur: field.onBlur,
    type: "text"
  }, css, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  })), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_4__["jsx"])(_field_message__WEBPACK_IMPORTED_MODULE_5__["FieldMessage"], {
    field: field,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: this
  }));
}

/***/ }),

/***/ "./src/ui/forms/text-field/styles.ts":
/*!*******************************************!*\
  !*** ./src/ui/forms/text-field/styles.ts ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");

var input =  false ? undefined : {
  name: "d9k5dy-input",
  styles: "border:1px solid #dddee4;border-radius:4px;background:transparent;height:40px;padding:0 16px;color:#99a4b3;transition:all .15s;width:100%;&:focus{border-color:#33b6c6;box-shadow:inset 0 15px 15px -15px rgba(51,182,198,.2);outline:none;}&:disabled{background:#f9f9fb;}label:input;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFx0ZXh0LWZpZWxkXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRWlCIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFx0ZXh0LWZpZWxkXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmNvbnN0IGlucHV0ID0gY3NzYFxyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGRlZTQ7XHJcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gIGhlaWdodDogNDBweDtcclxuICBwYWRkaW5nOiAwIDE2cHg7XHJcbiAgY29sb3I6ICM5OWE0YjM7XHJcbiAgdHJhbnNpdGlvbjogYWxsIC4xNXM7XHJcbiAgd2lkdGg6IDEwMCU7XHJcblxyXG4gICY6Zm9jdXMge1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjMzNiNmM2O1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAxNXB4IDE1cHggLTE1cHggcmdiYSg1MSwxODIsMTk4LC4yKTtcclxuICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgfVxyXG5cclxuICAmOmRpc2FibGVkIHtcclxuICAgIGJhY2tncm91bmQ6ICNmOWY5ZmI7XHJcbiAgfVxyXG5gXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZmllbGQ6IGNzc2BcclxuICAgIG1hcmdpbjogMCAwIDIwcHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICBgLFxyXG5cclxuICBsYWJlbDogY3NzYFxyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIGNvbG9yOiAjNjg3NTg5O1xyXG4gICAgbWFyZ2luOiAwIDAgOHB4O1xyXG4gIGAsXHJcblxyXG4gIGlucHV0LFxyXG5cclxuICBlcnJvcjogY3NzYFxyXG4gICAgLmNzcy0ke2lucHV0Lm5hbWV9IHtcclxuICAgICAgY29sb3I6ICM0MTUxNjA7XHJcbiAgICAgIGJvcmRlci1jb2xvcjogI2NiOGQ4MjtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICB3YXJuOiBjc3NgXHJcbiAgICAuY3NzLSR7aW5wdXQubmFtZX0ge1xyXG4gICAgICBjb2xvcjogIzQxNTE2MDtcclxuICAgICAgYm9yZGVyLWNvbG9yOiAjZWJkMDk5O1xyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */"
};
/* harmony default export */ __webpack_exports__["default"] = ({
  field:  false ? undefined : {
    name: "wu0uim-field",
    styles: "margin:0 0 20px;width:100%;label:field;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFx0ZXh0LWZpZWxkXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBd0JZIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFx0ZXh0LWZpZWxkXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmNvbnN0IGlucHV0ID0gY3NzYFxyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGRlZTQ7XHJcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gIGhlaWdodDogNDBweDtcclxuICBwYWRkaW5nOiAwIDE2cHg7XHJcbiAgY29sb3I6ICM5OWE0YjM7XHJcbiAgdHJhbnNpdGlvbjogYWxsIC4xNXM7XHJcbiAgd2lkdGg6IDEwMCU7XHJcblxyXG4gICY6Zm9jdXMge1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjMzNiNmM2O1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAxNXB4IDE1cHggLTE1cHggcmdiYSg1MSwxODIsMTk4LC4yKTtcclxuICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgfVxyXG5cclxuICAmOmRpc2FibGVkIHtcclxuICAgIGJhY2tncm91bmQ6ICNmOWY5ZmI7XHJcbiAgfVxyXG5gXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZmllbGQ6IGNzc2BcclxuICAgIG1hcmdpbjogMCAwIDIwcHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICBgLFxyXG5cclxuICBsYWJlbDogY3NzYFxyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIGNvbG9yOiAjNjg3NTg5O1xyXG4gICAgbWFyZ2luOiAwIDAgOHB4O1xyXG4gIGAsXHJcblxyXG4gIGlucHV0LFxyXG5cclxuICBlcnJvcjogY3NzYFxyXG4gICAgLmNzcy0ke2lucHV0Lm5hbWV9IHtcclxuICAgICAgY29sb3I6ICM0MTUxNjA7XHJcbiAgICAgIGJvcmRlci1jb2xvcjogI2NiOGQ4MjtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICB3YXJuOiBjc3NgXHJcbiAgICAuY3NzLSR7aW5wdXQubmFtZX0ge1xyXG4gICAgICBjb2xvcjogIzQxNTE2MDtcclxuICAgICAgYm9yZGVyLWNvbG9yOiAjZWJkMDk5O1xyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */"
  },
  label:  false ? undefined : {
    name: "17ay255-label",
    styles: "text-transform:uppercase;color:#687589;margin:0 0 8px;label:label;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFx0ZXh0LWZpZWxkXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBNkJZIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFx0ZXh0LWZpZWxkXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmNvbnN0IGlucHV0ID0gY3NzYFxyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGRlZTQ7XHJcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gIGhlaWdodDogNDBweDtcclxuICBwYWRkaW5nOiAwIDE2cHg7XHJcbiAgY29sb3I6ICM5OWE0YjM7XHJcbiAgdHJhbnNpdGlvbjogYWxsIC4xNXM7XHJcbiAgd2lkdGg6IDEwMCU7XHJcblxyXG4gICY6Zm9jdXMge1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjMzNiNmM2O1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAxNXB4IDE1cHggLTE1cHggcmdiYSg1MSwxODIsMTk4LC4yKTtcclxuICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgfVxyXG5cclxuICAmOmRpc2FibGVkIHtcclxuICAgIGJhY2tncm91bmQ6ICNmOWY5ZmI7XHJcbiAgfVxyXG5gXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZmllbGQ6IGNzc2BcclxuICAgIG1hcmdpbjogMCAwIDIwcHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICBgLFxyXG5cclxuICBsYWJlbDogY3NzYFxyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIGNvbG9yOiAjNjg3NTg5O1xyXG4gICAgbWFyZ2luOiAwIDAgOHB4O1xyXG4gIGAsXHJcblxyXG4gIGlucHV0LFxyXG5cclxuICBlcnJvcjogY3NzYFxyXG4gICAgLmNzcy0ke2lucHV0Lm5hbWV9IHtcclxuICAgICAgY29sb3I6ICM0MTUxNjA7XHJcbiAgICAgIGJvcmRlci1jb2xvcjogI2NiOGQ4MjtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICB3YXJuOiBjc3NgXHJcbiAgICAuY3NzLSR7aW5wdXQubmFtZX0ge1xyXG4gICAgICBjb2xvcjogIzQxNTE2MDtcclxuICAgICAgYm9yZGVyLWNvbG9yOiAjZWJkMDk5O1xyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */"
  },
  input: input,
  error:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])(".css-", input.name, "{color:#415160;border-color:#cb8d82;}label:error;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFx0ZXh0LWZpZWxkXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBcUNZIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFx0ZXh0LWZpZWxkXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmNvbnN0IGlucHV0ID0gY3NzYFxyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGRlZTQ7XHJcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gIGhlaWdodDogNDBweDtcclxuICBwYWRkaW5nOiAwIDE2cHg7XHJcbiAgY29sb3I6ICM5OWE0YjM7XHJcbiAgdHJhbnNpdGlvbjogYWxsIC4xNXM7XHJcbiAgd2lkdGg6IDEwMCU7XHJcblxyXG4gICY6Zm9jdXMge1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjMzNiNmM2O1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAxNXB4IDE1cHggLTE1cHggcmdiYSg1MSwxODIsMTk4LC4yKTtcclxuICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgfVxyXG5cclxuICAmOmRpc2FibGVkIHtcclxuICAgIGJhY2tncm91bmQ6ICNmOWY5ZmI7XHJcbiAgfVxyXG5gXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZmllbGQ6IGNzc2BcclxuICAgIG1hcmdpbjogMCAwIDIwcHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICBgLFxyXG5cclxuICBsYWJlbDogY3NzYFxyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIGNvbG9yOiAjNjg3NTg5O1xyXG4gICAgbWFyZ2luOiAwIDAgOHB4O1xyXG4gIGAsXHJcblxyXG4gIGlucHV0LFxyXG5cclxuICBlcnJvcjogY3NzYFxyXG4gICAgLmNzcy0ke2lucHV0Lm5hbWV9IHtcclxuICAgICAgY29sb3I6ICM0MTUxNjA7XHJcbiAgICAgIGJvcmRlci1jb2xvcjogI2NiOGQ4MjtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICB3YXJuOiBjc3NgXHJcbiAgICAuY3NzLSR7aW5wdXQubmFtZX0ge1xyXG4gICAgICBjb2xvcjogIzQxNTE2MDtcclxuICAgICAgYm9yZGVyLWNvbG9yOiAjZWJkMDk5O1xyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */")),
  warn:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])(".css-", input.name, "{color:#415160;border-color:#ebd099;}label:warn;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFx0ZXh0LWZpZWxkXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBNENXIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGZvcm1zXFx0ZXh0LWZpZWxkXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmNvbnN0IGlucHV0ID0gY3NzYFxyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGRlZTQ7XHJcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gIGhlaWdodDogNDBweDtcclxuICBwYWRkaW5nOiAwIDE2cHg7XHJcbiAgY29sb3I6ICM5OWE0YjM7XHJcbiAgdHJhbnNpdGlvbjogYWxsIC4xNXM7XHJcbiAgd2lkdGg6IDEwMCU7XHJcblxyXG4gICY6Zm9jdXMge1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjMzNiNmM2O1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAxNXB4IDE1cHggLTE1cHggcmdiYSg1MSwxODIsMTk4LC4yKTtcclxuICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgfVxyXG5cclxuICAmOmRpc2FibGVkIHtcclxuICAgIGJhY2tncm91bmQ6ICNmOWY5ZmI7XHJcbiAgfVxyXG5gXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZmllbGQ6IGNzc2BcclxuICAgIG1hcmdpbjogMCAwIDIwcHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICBgLFxyXG5cclxuICBsYWJlbDogY3NzYFxyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIGNvbG9yOiAjNjg3NTg5O1xyXG4gICAgbWFyZ2luOiAwIDAgOHB4O1xyXG4gIGAsXHJcblxyXG4gIGlucHV0LFxyXG5cclxuICBlcnJvcjogY3NzYFxyXG4gICAgLmNzcy0ke2lucHV0Lm5hbWV9IHtcclxuICAgICAgY29sb3I6ICM0MTUxNjA7XHJcbiAgICAgIGJvcmRlci1jb2xvcjogI2NiOGQ4MjtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICB3YXJuOiBjc3NgXHJcbiAgICAuY3NzLSR7aW5wdXQubmFtZX0ge1xyXG4gICAgICBjb2xvcjogIzQxNTE2MDtcclxuICAgICAgYm9yZGVyLWNvbG9yOiAjZWJkMDk5O1xyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */"))
});

/***/ }),

/***/ "./src/ui/layout/body/index.tsx":
/*!**************************************!*\
  !*** ./src/ui/layout/body/index.tsx ***!
  \**************************************/
/*! exports provided: LayoutBody */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayoutBody", function() { return LayoutBody; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../container */ "./src/ui/layout/container/index.tsx");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles */ "./src/ui/layout/body/styles.ts");
var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\layout\\body\\index.tsx";




function LayoutBody(_ref) {
  var sidebar = _ref.sidebar,
      children = _ref.children;
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])(_container__WEBPACK_IMPORTED_MODULE_2__["LayoutContainer"], {
    css: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].wrapper,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].children,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }, children), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].sidebar,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, sidebar));
}

/***/ }),

/***/ "./src/ui/layout/body/styles.ts":
/*!**************************************!*\
  !*** ./src/ui/layout/body/styles.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var _theme_media__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../theme/media */ "./src/theme/media.ts");


/* harmony default export */ __webpack_exports__["default"] = ({
  wrapper:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])("display:flex;flex-direction:row-reverse;", _theme_media__WEBPACK_IMPORTED_MODULE_1__["mq"].mobile, "{flex-direction:column-reverse;}label:wrapper;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcYm9keVxcc3R5bGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUljIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcYm9keVxcc3R5bGVzLnRzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbXEgfSBmcm9tICdAYXBwL3RoZW1lL21lZGlhJ1xyXG5pbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB3cmFwcGVyOiBjc3NgXHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdy1yZXZlcnNlO1xyXG5cclxuICAgICR7bXEubW9iaWxlfSB7XHJcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW4tcmV2ZXJzZTtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICBzaWRlYmFyOiBjc3NgXHJcbiAgICBmbGV4OiAwIDAgMjgwcHg7XHJcbiAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjZTJlOGVjO1xyXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KC05MGRlZywgI2VmZjdmYywgdHJhbnNwYXJlbnQpO1xyXG5cclxuICAgICR7bXEubW9iaWxlfSB7XHJcbiAgICAgIGZsZXg6IDE7XHJcbiAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlMmU4ZWM7XHJcbiAgICAgIGJhY2tncm91bmQ6IG5vbmU7XHJcbiAgICB9XHJcbiAgYCxcclxuXHJcbiAgY2hpbGRyZW46IGNzc2BcclxuICAgIG1heC13aWR0aDogY2FsYygxMDAlIC0gMjgwcHgpO1xyXG4gICAgcGFkZGluZzogMjBweCAwIDAgNDhweDtcclxuXHJcbiAgICAke21xLm1vYmlsZX0ge1xyXG4gICAgICBtYXgtd2lkdGg6IG5vbmU7XHJcbiAgICAgIHBhZGRpbmc6IDA7XHJcbiAgICB9XHJcbiAgYFxyXG59XHJcbiJdfQ== */")),
  sidebar:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])("flex:0 0 280px;border-right:1px solid #e2e8ec;background:linear-gradient(-90deg,#eff7fc,transparent);", _theme_media__WEBPACK_IMPORTED_MODULE_1__["mq"].mobile, "{flex:1;border:none;border-bottom:1px solid #e2e8ec;background:none;}label:sidebar;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcYm9keVxcc3R5bGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWFjIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcYm9keVxcc3R5bGVzLnRzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbXEgfSBmcm9tICdAYXBwL3RoZW1lL21lZGlhJ1xyXG5pbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB3cmFwcGVyOiBjc3NgXHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdy1yZXZlcnNlO1xyXG5cclxuICAgICR7bXEubW9iaWxlfSB7XHJcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW4tcmV2ZXJzZTtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICBzaWRlYmFyOiBjc3NgXHJcbiAgICBmbGV4OiAwIDAgMjgwcHg7XHJcbiAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjZTJlOGVjO1xyXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KC05MGRlZywgI2VmZjdmYywgdHJhbnNwYXJlbnQpO1xyXG5cclxuICAgICR7bXEubW9iaWxlfSB7XHJcbiAgICAgIGZsZXg6IDE7XHJcbiAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlMmU4ZWM7XHJcbiAgICAgIGJhY2tncm91bmQ6IG5vbmU7XHJcbiAgICB9XHJcbiAgYCxcclxuXHJcbiAgY2hpbGRyZW46IGNzc2BcclxuICAgIG1heC13aWR0aDogY2FsYygxMDAlIC0gMjgwcHgpO1xyXG4gICAgcGFkZGluZzogMjBweCAwIDAgNDhweDtcclxuXHJcbiAgICAke21xLm1vYmlsZX0ge1xyXG4gICAgICBtYXgtd2lkdGg6IG5vbmU7XHJcbiAgICAgIHBhZGRpbmc6IDA7XHJcbiAgICB9XHJcbiAgYFxyXG59XHJcbiJdfQ== */")),
  children:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])("max-width:calc(100% - 280px);padding:20px 0 0 48px;", _theme_media__WEBPACK_IMPORTED_MODULE_1__["mq"].mobile, "{max-width:none;padding:0;}label:children;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcYm9keVxcc3R5bGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQTBCZSIsImZpbGUiOiJFOlxcZ2l0aHViXFx2YWxpZGF0ZS1zaXRlXFxzcmNcXHVpXFxsYXlvdXRcXGJvZHlcXHN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1xIH0gZnJvbSAnQGFwcC90aGVtZS9tZWRpYSdcclxuaW1wb3J0IGNzcyBmcm9tICdAZW1vdGlvbi9jc3MnXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgd3JhcHBlcjogY3NzYFxyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3ctcmV2ZXJzZTtcclxuXHJcbiAgICAke21xLm1vYmlsZX0ge1xyXG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uLXJldmVyc2U7XHJcbiAgICB9XHJcbiAgYCxcclxuXHJcbiAgc2lkZWJhcjogY3NzYFxyXG4gICAgZmxleDogMCAwIDI4MHB4O1xyXG4gICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgI2UyZThlYztcclxuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgtOTBkZWcsICNlZmY3ZmMsIHRyYW5zcGFyZW50KTtcclxuXHJcbiAgICAke21xLm1vYmlsZX0ge1xyXG4gICAgICBmbGV4OiAxO1xyXG4gICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTJlOGVjO1xyXG4gICAgICBiYWNrZ3JvdW5kOiBub25lO1xyXG4gICAgfVxyXG4gIGAsXHJcblxyXG4gIGNoaWxkcmVuOiBjc3NgXHJcbiAgICBtYXgtd2lkdGg6IGNhbGMoMTAwJSAtIDI4MHB4KTtcclxuICAgIHBhZGRpbmc6IDIwcHggMCAwIDQ4cHg7XHJcblxyXG4gICAgJHttcS5tb2JpbGV9IHtcclxuICAgICAgbWF4LXdpZHRoOiBub25lO1xyXG4gICAgICBwYWRkaW5nOiAwO1xyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */"))
});

/***/ }),

/***/ "./src/ui/layout/container/index.tsx":
/*!*******************************************!*\
  !*** ./src/ui/layout/container/index.tsx ***!
  \*******************************************/
/*! exports provided: LayoutContainer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayoutContainer", function() { return LayoutContainer; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/extends */ "./node_modules/@babel/runtime-corejs2/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles */ "./src/ui/layout/container/styles.ts");


var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\layout\\container\\index.tsx";



function LayoutContainer(_ref) {
  var children = _ref.children,
      css = Object(_babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, ["children"]);

  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_3__["jsx"])("div", Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: _styles__WEBPACK_IMPORTED_MODULE_4__["default"].container
  }, css, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 5
    },
    __self: this
  }), children);
}

/***/ }),

/***/ "./src/ui/layout/container/styles.ts":
/*!*******************************************!*\
  !*** ./src/ui/layout/container/styles.ts ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var _theme_media__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../theme/media */ "./src/theme/media.ts");


/* harmony default export */ __webpack_exports__["default"] = ({
  container:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])("max-width:1140px;margin:0 auto;padding:0 32px;", _theme_media__WEBPACK_IMPORTED_MODULE_1__["mq"].mobile, "{width:100%;}label:container;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcY29udGFpbmVyXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSWdCIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcY29udGFpbmVyXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtcSB9IGZyb20gJ0BhcHAvdGhlbWUvbWVkaWEnXHJcbmltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGNvbnRhaW5lcjogY3NzYFxyXG4gICAgbWF4LXdpZHRoOiAxMTQwcHg7XHJcbiAgICBtYXJnaW46IDAgYXV0bztcclxuICAgIHBhZGRpbmc6IDAgMzJweDtcclxuXHJcbiAgICAke21xLm1vYmlsZX0ge1xyXG4gICAgICB3aWR0aDogMTAwJTtcclxuICAgIH1cclxuICBgXHJcbn1cclxuIl19 */"))
});

/***/ }),

/***/ "./src/ui/layout/header/index.tsx":
/*!****************************************!*\
  !*** ./src/ui/layout/header/index.tsx ***!
  \****************************************/
/*! exports provided: LayoutHeader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayoutHeader", function() { return LayoutHeader; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../container */ "./src/ui/layout/container/index.tsx");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles */ "./src/ui/layout/header/styles.ts");
var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\layout\\header\\index.tsx";




function LayoutHeader() {
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].header,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 5
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])(_container__WEBPACK_IMPORTED_MODULE_2__["LayoutContainer"], {
    css: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].container,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("a", {
    css: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].git,
    href: "https://github.com/mc-petry/useform",
    target: "_blank",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("svg", {
    height: "32",
    viewBox: "0 0 16 16",
    width: "32",
    "aria-hidden": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("path", {
    d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  })))));
}

/***/ }),

/***/ "./src/ui/layout/header/styles.ts":
/*!****************************************!*\
  !*** ./src/ui/layout/header/styles.ts ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");

/* harmony default export */ __webpack_exports__["default"] = ({
  header:  false ? undefined : {
    name: "ir7f96-header",
    styles: "position:absolute;left:0;right:0;z-index:10;label:header;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcaGVhZGVyXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR2EiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFx1aVxcbGF5b3V0XFxoZWFkZXJcXHN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGhlYWRlcjogY3NzYFxyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgei1pbmRleDogMTA7XHJcbiAgYCxcclxuXHJcbiAgY29udGFpbmVyOiBjc3NgXHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIHBhZGRpbmctdG9wOiAxNnB4O1xyXG4gIGAsXHJcblxyXG4gIGxpbms6IGNzc2BcclxuICAgIGZvbnQtc2l6ZTogMThweDtcclxuICAgIGNvbG9yOiByZ2JhKDAsMCwwLC43KTtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgIHRyYW5zaXRpb246IGFsbCAuMTVzO1xyXG5cclxuICAgIDpob3ZlciB7XHJcbiAgICAgIGNvbG9yOiAjMmQ1Njk2O1xyXG4gICAgfVxyXG5cclxuICAgIDpub3QoOmxhc3Qtb2YtdHlwZSkge1xyXG4gICAgICBtYXJnaW4tcmlnaHQ6IDQwcHg7XHJcbiAgICB9XHJcbiAgYCxcclxuXHJcbiAgZ2l0OiBjc3NgXHJcbiAgICBmaWxsOiByZ2JhKDAsMCwwLC43KTtcclxuICAgIHRyYW5zaXRpb246IGFsbCAuMTVzO1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIG1hcmdpbjogMCAwIDAgYXV0bztcclxuICAgIHRyYW5zaXRpb246IGFsbCAuMTVzO1xyXG5cclxuICAgIDpob3ZlciB7XHJcbiAgICAgIGZpbGw6ICMyZDU2OTY7XHJcbiAgICB9XHJcbiAgYFxyXG59XHJcbiJdfQ== */"
  },
  container:  false ? undefined : {
    name: "1c7n0aw-container",
    styles: "display:flex;align-items:center;padding-top:16px;label:container;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcaGVhZGVyXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVWdCIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcaGVhZGVyXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBoZWFkZXI6IGNzc2BcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIHotaW5kZXg6IDEwO1xyXG4gIGAsXHJcblxyXG4gIGNvbnRhaW5lcjogY3NzYFxyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBwYWRkaW5nLXRvcDogMTZweDtcclxuICBgLFxyXG5cclxuICBsaW5rOiBjc3NgXHJcbiAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgICBjb2xvcjogcmdiYSgwLDAsMCwuNyk7XHJcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjE1cztcclxuXHJcbiAgICA6aG92ZXIge1xyXG4gICAgICBjb2xvcjogIzJkNTY5NjtcclxuICAgIH1cclxuXHJcbiAgICA6bm90KDpsYXN0LW9mLXR5cGUpIHtcclxuICAgICAgbWFyZ2luLXJpZ2h0OiA0MHB4O1xyXG4gICAgfVxyXG4gIGAsXHJcblxyXG4gIGdpdDogY3NzYFxyXG4gICAgZmlsbDogcmdiYSgwLDAsMCwuNyk7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjE1cztcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBtYXJnaW46IDAgMCAwIGF1dG87XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjE1cztcclxuXHJcbiAgICA6aG92ZXIge1xyXG4gICAgICBmaWxsOiAjMmQ1Njk2O1xyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */"
  },
  link:  false ? undefined : {
    name: "il0rlo-link",
    styles: "font-size:18px;color:rgba(0,0,0,.7);text-decoration:none;transition:all .15s;:hover{color:#2d5696;}:not(:last-of-type){margin-right:40px;}label:link;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcaGVhZGVyXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZ0JXIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcaGVhZGVyXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBoZWFkZXI6IGNzc2BcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIHotaW5kZXg6IDEwO1xyXG4gIGAsXHJcblxyXG4gIGNvbnRhaW5lcjogY3NzYFxyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBwYWRkaW5nLXRvcDogMTZweDtcclxuICBgLFxyXG5cclxuICBsaW5rOiBjc3NgXHJcbiAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgICBjb2xvcjogcmdiYSgwLDAsMCwuNyk7XHJcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjE1cztcclxuXHJcbiAgICA6aG92ZXIge1xyXG4gICAgICBjb2xvcjogIzJkNTY5NjtcclxuICAgIH1cclxuXHJcbiAgICA6bm90KDpsYXN0LW9mLXR5cGUpIHtcclxuICAgICAgbWFyZ2luLXJpZ2h0OiA0MHB4O1xyXG4gICAgfVxyXG4gIGAsXHJcblxyXG4gIGdpdDogY3NzYFxyXG4gICAgZmlsbDogcmdiYSgwLDAsMCwuNyk7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjE1cztcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBtYXJnaW46IDAgMCAwIGF1dG87XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjE1cztcclxuXHJcbiAgICA6aG92ZXIge1xyXG4gICAgICBmaWxsOiAjMmQ1Njk2O1xyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */"
  },
  git:  false ? undefined : {
    name: "ta5k3e-git",
    styles: "fill:rgba(0,0,0,.7);transition:all .15s;display:flex;margin:0 0 0 auto;transition:all .15s;:hover{fill:#2d5696;}label:git;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcaGVhZGVyXFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBK0JVIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcaGVhZGVyXFxzdHlsZXMudHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBoZWFkZXI6IGNzc2BcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIHotaW5kZXg6IDEwO1xyXG4gIGAsXHJcblxyXG4gIGNvbnRhaW5lcjogY3NzYFxyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBwYWRkaW5nLXRvcDogMTZweDtcclxuICBgLFxyXG5cclxuICBsaW5rOiBjc3NgXHJcbiAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgICBjb2xvcjogcmdiYSgwLDAsMCwuNyk7XHJcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjE1cztcclxuXHJcbiAgICA6aG92ZXIge1xyXG4gICAgICBjb2xvcjogIzJkNTY5NjtcclxuICAgIH1cclxuXHJcbiAgICA6bm90KDpsYXN0LW9mLXR5cGUpIHtcclxuICAgICAgbWFyZ2luLXJpZ2h0OiA0MHB4O1xyXG4gICAgfVxyXG4gIGAsXHJcblxyXG4gIGdpdDogY3NzYFxyXG4gICAgZmlsbDogcmdiYSgwLDAsMCwuNyk7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjE1cztcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBtYXJnaW46IDAgMCAwIGF1dG87XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjE1cztcclxuXHJcbiAgICA6aG92ZXIge1xyXG4gICAgICBmaWxsOiAjMmQ1Njk2O1xyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */"
  }
});

/***/ }),

/***/ "./src/ui/layout/index.tsx":
/*!*********************************!*\
  !*** ./src/ui/layout/index.tsx ***!
  \*********************************/
/*! exports provided: Layout */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Layout", function() { return Layout; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./header */ "./src/ui/layout/header/index.tsx");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles */ "./src/ui/layout/styles.ts");
var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\layout\\index.tsx";





function Layout(_ref) {
  var children = _ref.children;
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])("div", {
    css: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].layout,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])(_header__WEBPACK_IMPORTED_MODULE_2__["LayoutHeader"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["jsx"])(_emotion_core__WEBPACK_IMPORTED_MODULE_1__["Global"], {
    styles: _styles__WEBPACK_IMPORTED_MODULE_3__["default"].global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }), children);
}

/***/ }),

/***/ "./src/ui/layout/styles.ts":
/*!*********************************!*\
  !*** ./src/ui/layout/styles.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");

/* harmony default export */ __webpack_exports__["default"] = ({
  global:  false ? undefined : {
    name: "b3f02x-global",
    styles: "@import url('https://fonts.googleapis.com/css?family=Fira+Sans+Condensed|Fira+Sans:300,400&display=swap');*,:after,:before{box-sizing:border-box;}html,body,#__next{width:100%;height:100%;}body{margin:0;font-size:12px;background:#f9fbfc;}body,input{font-family:'Fira Sans','Roboto','Segoe UI',sans-serif;}label:global;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcc3R5bGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdhIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcc3R5bGVzLnRzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNzcyBmcm9tICdAZW1vdGlvbi9jc3MnXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2xvYmFsOiBjc3NgXHJcbiAgICAvKiBAaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PUZpcmErU2FuczozMDB8NDAwJmRpc3BsYXk9c3dhcCZzdWJzZXQ9Y3lyaWxsaWMnKTsgKi9cclxuICAgIEBpbXBvcnQgdXJsKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9RmlyYStTYW5zK0NvbmRlbnNlZHxGaXJhK1NhbnM6MzAwLDQwMCZkaXNwbGF5PXN3YXAnKTtcclxuXHJcbiAgICAqLCA6YWZ0ZXIsIDpiZWZvcmUge1xyXG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgfVxyXG5cclxuICAgIGh0bWwsIGJvZHksICNfX25leHQge1xyXG4gICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgfVxyXG5cclxuICAgIGJvZHkge1xyXG4gICAgICBtYXJnaW46IDA7XHJcbiAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgYmFja2dyb3VuZDogI2Y5ZmJmYztcclxuICAgIH1cclxuXHJcbiAgICBib2R5LFxyXG4gICAgaW5wdXQge1xyXG4gICAgICBmb250LWZhbWlseTogJ0ZpcmEgU2FucycsICdSb2JvdG8nLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmO1xyXG4gICAgfVxyXG4gIGAsXHJcblxyXG4gIGxheW91dDogY3NzYFxyXG5cclxuICBgXHJcbn1cclxuIl19 */"
  },
  layout:  false ? undefined : {
    name: "qz9srz-layout",
    styles: "label:layout;",
    map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXGxheW91dFxcc3R5bGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQTRCYSIsImZpbGUiOiJFOlxcZ2l0aHViXFx2YWxpZGF0ZS1zaXRlXFxzcmNcXHVpXFxsYXlvdXRcXHN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGdsb2JhbDogY3NzYFxyXG4gICAgLyogQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1GaXJhK1NhbnM6MzAwfDQwMCZkaXNwbGF5PXN3YXAmc3Vic2V0PWN5cmlsbGljJyk7ICovXHJcbiAgICBAaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PUZpcmErU2FucytDb25kZW5zZWR8RmlyYStTYW5zOjMwMCw0MDAmZGlzcGxheT1zd2FwJyk7XHJcblxyXG4gICAgKiwgOmFmdGVyLCA6YmVmb3JlIHtcclxuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgIH1cclxuXHJcbiAgICBodG1sLCBib2R5LCAjX19uZXh0IHtcclxuICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIGhlaWdodDogMTAwJTtcclxuICAgIH1cclxuXHJcbiAgICBib2R5IHtcclxuICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgIGJhY2tncm91bmQ6ICNmOWZiZmM7XHJcbiAgICB9XHJcblxyXG4gICAgYm9keSxcclxuICAgIGlucHV0IHtcclxuICAgICAgZm9udC1mYW1pbHk6ICdGaXJhIFNhbnMnLCAnUm9ib3RvJywgJ1NlZ29lIFVJJywgc2Fucy1zZXJpZjtcclxuICAgIH1cclxuICBgLFxyXG5cclxuICBsYXlvdXQ6IGNzc2BcclxuXHJcbiAgYFxyXG59XHJcbiJdfQ== */"
  }
});

/***/ }),

/***/ "./src/ui/sidebar/index.tsx":
/*!**********************************!*\
  !*** ./src/ui/sidebar/index.tsx ***!
  \**********************************/
/*! exports provided: Sidebar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sidebar", function() { return Sidebar; });
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _theme_media__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../theme/media */ "./src/theme/media.ts");
/* harmony import */ var _item__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./item */ "./src/ui/sidebar/item/index.tsx");

var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\sidebar\\index.tsx";




var styles = {
  sidebar:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])("position:sticky;top:0;padding:36px 0 0;display:flex;flex-direction:column;", _theme_media__WEBPACK_IMPORTED_MODULE_3__["mq"].mobile, "{position:static;margin:0 0 20px;padding-top:18px;}label:sidebar;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXHNpZGViYXJcXGluZGV4LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLYyIsImZpbGUiOiJFOlxcZ2l0aHViXFx2YWxpZGF0ZS1zaXRlXFxzcmNcXHVpXFxzaWRlYmFyXFxpbmRleC50c3giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtcSB9IGZyb20gJ0BhcHAvdGhlbWUvbWVkaWEnXHJcbmltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5pbXBvcnQgeyBTaWRlYmFySXRlbSB9IGZyb20gJy4vaXRlbSdcclxuXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICBzaWRlYmFyOiBjc3NgXHJcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xyXG4gICAgdG9wOiAwO1xyXG4gICAgcGFkZGluZzogMzZweCAwIDA7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuXHJcbiAgICAke21xLm1vYmlsZX0ge1xyXG4gICAgICBwb3NpdGlvbjogc3RhdGljO1xyXG4gICAgICBtYXJnaW46IDAgMCAyMHB4O1xyXG4gICAgICBwYWRkaW5nLXRvcDogMThweDtcclxuICAgIH1cclxuICBgXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBTaWRlYmFyKCkge1xyXG4gIHJldHVybiA8ZGl2IGNzcz17c3R5bGVzLnNpZGViYXJ9PlxyXG4gICAgPFNpZGViYXJJdGVtIGhlYWRlcj1cIlF1aWNrIHN0YXJ0XCIgbGluaz1cIiNxdWljay1zdGFydFwiIC8+XHJcbiAgICA8U2lkZWJhckl0ZW0gaGVhZGVyPVwiRGVtb3NcIiBsaW5rPVwiI2RlbW9zXCIgLz5cclxuICA8L2Rpdj5cclxufVxyXG4iXX0= */"))
};
function Sidebar() {
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])("div", {
    css: styles.sidebar,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_item__WEBPACK_IMPORTED_MODULE_4__["SidebarItem"], {
    header: "Quick start",
    link: "#quick-start",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])(_item__WEBPACK_IMPORTED_MODULE_4__["SidebarItem"], {
    header: "Demos",
    link: "#demos",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }));
}

/***/ }),

/***/ "./src/ui/sidebar/item/index.tsx":
/*!***************************************!*\
  !*** ./src/ui/sidebar/item/index.tsx ***!
  \***************************************/
/*! exports provided: SidebarItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SidebarItem", function() { return SidebarItem; });
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _theme_media__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../theme/media */ "./src/theme/media.ts");

var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\sidebar\\item\\index.tsx";



var styles = {
  item:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])("padding:16px 16px 16px 64px;display:block;position:relative;transition:all .15s;cursor:pointer;font-size:16px;color:#666;text-decoration:none;::after{content:\"\";display:block;position:absolute;left:0;right:0;bottom:0;height:1px;background:linear-gradient(-90deg,#e2e8ec,transparent);}:hover{background:linear-gradient(-90deg,rgba(0,30,100,.05),transparent);}", _theme_media__WEBPACK_IMPORTED_MODULE_3__["mq"].mobile, "{color:#09f;font-size:20px;padding:0;display:inline;margin:0 0 20px;background:none !important;::after{display:none;}}label:item;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXHNpZGViYXJcXGl0ZW1cXGluZGV4LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJVyIsImZpbGUiOiJFOlxcZ2l0aHViXFx2YWxpZGF0ZS1zaXRlXFxzcmNcXHVpXFxzaWRlYmFyXFxpdGVtXFxpbmRleC50c3giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtcSB9IGZyb20gJ0BhcHAvdGhlbWUvbWVkaWEnXHJcbmltcG9ydCBjc3MgZnJvbSAnQGVtb3Rpb24vY3NzJ1xyXG5cclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIGl0ZW06IGNzc2BcclxuICAgIHBhZGRpbmc6IDE2cHggMTZweCAxNnB4IDY0cHg7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHRyYW5zaXRpb246IGFsbCAuMTVzO1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgY29sb3I6ICM2NjY7XHJcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcblxyXG4gICAgOjphZnRlciB7XHJcbiAgICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgIGxlZnQ6IDA7XHJcbiAgICAgIHJpZ2h0OiAwO1xyXG4gICAgICBib3R0b206IDA7XHJcbiAgICAgIGhlaWdodDogMXB4O1xyXG4gICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoLTkwZGVnLCAjZTJlOGVjLCB0cmFuc3BhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgOmhvdmVyIHtcclxuICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KC05MGRlZywgcmdiYSgwLDMwLDEwMCwuMDUpLCB0cmFuc3BhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgJHttcS5tb2JpbGV9IHtcclxuICAgICAgY29sb3I6ICMwOWY7XHJcbiAgICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgICAgcGFkZGluZzogMDtcclxuICAgICAgZGlzcGxheTogaW5saW5lO1xyXG4gICAgICBtYXJnaW46IDAgMCAyMHB4O1xyXG4gICAgICBiYWNrZ3JvdW5kOiBub25lICFpbXBvcnRhbnQ7XHJcblxyXG4gICAgICA6OmFmdGVyIHtcclxuICAgICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgYFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gU2lkZWJhckl0ZW0oeyBoZWFkZXIsIGxpbmsgfTogeyBoZWFkZXI6IHN0cmluZywgbGluazogc3RyaW5nIH0pIHtcclxuICByZXR1cm4gPGEgY3NzPXtzdHlsZXMuaXRlbX0gaHJlZj17bGlua30+e2hlYWRlcn08L2E+XHJcbn1cclxuIl19 */"))
};
function SidebarItem(_ref) {
  var header = _ref.header,
      link = _ref.link;
  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_2__["jsx"])("a", {
    css: styles.item,
    href: link,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, header);
}

/***/ }),

/***/ "./src/ui/split/index.tsx":
/*!********************************!*\
  !*** ./src/ui/split/index.tsx ***!
  \********************************/
/*! exports provided: Split */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Split", function() { return Split; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/extends */ "./node_modules/@babel/runtime-corejs2/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles */ "./src/ui/split/styles.ts");


var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\split\\index.tsx";



function Split(_ref) {
  var children = _ref.children,
      rest = Object(_babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, ["children"]);

  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_3__["jsx"])("div", Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: _styles__WEBPACK_IMPORTED_MODULE_4__["default"].split
  }, rest, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }), children);
}

/***/ }),

/***/ "./src/ui/split/styles.ts":
/*!********************************!*\
  !*** ./src/ui/split/styles.ts ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var _theme_media__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../theme/media */ "./src/theme/media.ts");


/* harmony default export */ __webpack_exports__["default"] = ({
  split:
  /*#__PURE__*/
  Object(_emotion_css__WEBPACK_IMPORTED_MODULE_0__["default"])("display:flex;> *{flex:0 0 50%;max-width:calc(50% - 24px);margin-left:24px;margin-right:24px;&:first-of-type{margin-left:0;}&:last-of-type{margin-right:0;}}", _theme_media__WEBPACK_IMPORTED_MODULE_1__["mq"].mobile, "{flex-direction:column;> *{margin-left:0;margin-right:0;margin-bottom:24px;flex:1 0 0;max-width:100%;}}label:split;" + ( false ? undefined : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXHNwbGl0XFxzdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSVkiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFx1aVxcc3BsaXRcXHN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1xIH0gZnJvbSAnQGFwcC90aGVtZS9tZWRpYSdcclxuaW1wb3J0IGNzcyBmcm9tICdAZW1vdGlvbi9jc3MnXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgc3BsaXQ6IGNzc2BcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcblxyXG4gICAgPiAqIHtcclxuICAgICAgZmxleDogMCAwIDUwJTtcclxuICAgICAgbWF4LXdpZHRoOiBjYWxjKDUwJSAtIDI0cHgpO1xyXG4gICAgICBtYXJnaW4tbGVmdDogMjRweDtcclxuICAgICAgbWFyZ2luLXJpZ2h0OiAyNHB4O1xyXG5cclxuICAgICAgJjpmaXJzdC1vZi10eXBlIHtcclxuICAgICAgICBtYXJnaW4tbGVmdDogMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgJjpsYXN0LW9mLXR5cGUge1xyXG4gICAgICAgIG1hcmdpbi1yaWdodDogMDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICR7bXEubW9iaWxlfSB7XHJcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcblxyXG4gICAgICA+ICoge1xyXG4gICAgICAgIG1hcmdpbi1sZWZ0OiAwO1xyXG4gICAgICAgIG1hcmdpbi1yaWdodDogMDtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xyXG4gICAgICAgIGZsZXg6IDEgMCAwO1xyXG4gICAgICAgIG1heC13aWR0aDogMTAwJTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIGBcclxufVxyXG4iXX0= */"))
});

/***/ }),

/***/ "./src/ui/typography/h2/index.tsx":
/*!****************************************!*\
  !*** ./src/ui/typography/h2/index.tsx ***!
  \****************************************/
/*! exports provided: H2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "H2", function() { return H2; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/extends */ "./node_modules/@babel/runtime-corejs2/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");



var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\typography\\h2\\index.tsx";


var style =  false ? undefined : {
  name: "qaq67t-style",
  styles: "font-size:28px;font-weight:bold;color:#555;padding:1em 0 0;margin:0 0 1em;label:style;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXHR5cG9ncmFwaHlcXGgyXFxpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRWlCIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXHR5cG9ncmFwaHlcXGgyXFxpbmRleC50c3giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuXHJcbmNvbnN0IHN0eWxlID0gY3NzYFxyXG4gIGZvbnQtc2l6ZTogMjhweDtcclxuICBmb250LXdlaWdodDogYm9sZDtcclxuICBjb2xvcjogIzU1NTtcclxuICBwYWRkaW5nOiAxZW0gMCAwO1xyXG4gIG1hcmdpbjogMCAwIDFlbTtcclxuYFxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEgyKHsgY2hpbGRyZW4sIC4uLnJlc3QgfTogUmVhY3QuRGV0YWlsZWRIVE1MUHJvcHM8UmVhY3QuSFRNTEF0dHJpYnV0ZXM8SFRNTEhlYWRpbmdFbGVtZW50PiwgSFRNTEhlYWRpbmdFbGVtZW50Pikge1xyXG4gIHJldHVybiA8aDIgY3NzPXtzdHlsZX0gey4uLnJlc3R9PntjaGlsZHJlbn08L2gyPlxyXG59XHJcbiJdfQ== */"
};
function H2(_ref) {
  var children = _ref.children,
      rest = Object(_babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, ["children"]);

  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_4__["jsx"])("h2", Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: style
  }, rest, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }), children);
}

/***/ }),

/***/ "./src/ui/typography/h3/index.tsx":
/*!****************************************!*\
  !*** ./src/ui/typography/h3/index.tsx ***!
  \****************************************/
/*! exports provided: H3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "H3", function() { return H3; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/extends */ "./node_modules/@babel/runtime-corejs2/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");



var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\typography\\h3\\index.tsx";


var style =  false ? undefined : {
  name: "7i2l9v-style",
  styles: "font-size:18px;color:#555;margin:2em 0 1em;label:style;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXHR5cG9ncmFwaHlcXGgzXFxpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR2lCIiwiZmlsZSI6IkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXHR5cG9ncmFwaHlcXGgzXFxpbmRleC50c3giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJ0BlbW90aW9uL2NzcydcclxuaW1wb3J0IHsgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnXHJcblxyXG5jb25zdCBzdHlsZSA9IGNzc2BcclxuICBmb250LXNpemU6IDE4cHg7XHJcbiAgY29sb3I6ICM1NTU7XHJcbiAgbWFyZ2luOiAyZW0gMCAxZW07XHJcbmBcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIMyh7IGNoaWxkcmVuLCAuLi5yZXN0IH06IHsgY2hpbGRyZW46IFJlYWN0Tm9kZSB9KSB7XHJcbiAgcmV0dXJuIDxoMyBjc3M9e3N0eWxlfSB7Li4ucmVzdH0+e2NoaWxkcmVufTwvaDM+XHJcbn1cclxuIl19 */"
};
function H3(_ref) {
  var children = _ref.children,
      rest = Object(_babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, ["children"]);

  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_4__["jsx"])("h3", Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: style
  }, rest, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }), children);
}

/***/ }),

/***/ "./src/ui/typography/text/index.tsx":
/*!******************************************!*\
  !*** ./src/ui/typography/text/index.tsx ***!
  \******************************************/
/*! exports provided: Text */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return Text; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/extends */ "./node_modules/@babel/runtime-corejs2/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/css */ "./node_modules/@emotion/css/dist/css.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/core */ "./node_modules/@emotion/core/dist/core.browser.esm.js");



var _jsxFileName = "E:\\github\\validate-site\\src\\ui\\typography\\text\\index.tsx";


var style =  false ? undefined : {
  name: "6snyfl-style",
  styles: "p{font-size:16px;color:#555;line-height:1.5;margin:1em 0;}label:style;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXHZhbGlkYXRlLXNpdGVcXHNyY1xcdWlcXHR5cG9ncmFwaHlcXHRleHRcXGluZGV4LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHaUIiLCJmaWxlIjoiRTpcXGdpdGh1YlxcdmFsaWRhdGUtc2l0ZVxcc3JjXFx1aVxcdHlwb2dyYXBoeVxcdGV4dFxcaW5kZXgudHN4Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNzcyBmcm9tICdAZW1vdGlvbi9jc3MnXHJcbmltcG9ydCB7IFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0J1xyXG5cclxuY29uc3Qgc3R5bGUgPSBjc3NgXHJcbiAgcCB7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICBjb2xvcjogIzU1NTtcclxuICAgIGxpbmUtaGVpZ2h0OiAxLjU7XHJcbiAgICBtYXJnaW46IDFlbSAwO1xyXG4gIH1cclxuYFxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFRleHQoeyBjaGlsZHJlbiwgLi4ucmVzdCB9OiB7IGNoaWxkcmVuOiBSZWFjdE5vZGUgfSkge1xyXG4gIHJldHVybiA8ZGl2IGNzcz17c3R5bGV9IHsuLi5yZXN0fT5cclxuICAgIHtjaGlsZHJlbn1cclxuICA8L2Rpdj5cclxufVxyXG4iXX0= */"
};
function Text(_ref) {
  var children = _ref.children,
      rest = Object(_babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, ["children"]);

  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_4__["jsx"])("div", Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: style
  }, rest, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }), children);
}

/***/ }),

/***/ 0:
/*!******************************************************************************************************************!*\
  !*** multi next-client-pages-loader?page=%2F&absolutePagePath=E%3A%5Cgithub%5Cvalidate-site%5Cpages%5Cindex.tsx ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! next-client-pages-loader?page=%2F&absolutePagePath=E%3A%5Cgithub%5Cvalidate-site%5Cpages%5Cindex.tsx! */"./node_modules/next/dist/build/webpack/loaders/next-client-pages-loader.js?page=%2F&absolutePagePath=E%3A%5Cgithub%5Cvalidate-site%5Cpages%5Cindex.tsx!./");


/***/ }),

/***/ "dll-reference dll_1aef2d0bbc0d334d831c":
/*!*******************************************!*\
  !*** external "dll_1aef2d0bbc0d334d831c" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = dll_1aef2d0bbc0d334d831c;

/***/ })

},[[0,"static/runtime/webpack.js","styles"]]]);
//# sourceMappingURL=index.js.map