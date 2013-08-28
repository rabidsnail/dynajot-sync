// https://github.com/jquery/jquery/blob/7877c4fa73120bc6d21a5fcd302a896f03b23876/src/core.js
/** @license jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license */
define(["underscore"], function(underscore) {

    var inherit;
    if (Object.create) {
        inherit = function(o) {
            return Object.create(o);
        };
    } else {
        var extender = function(){};
        inherit = function(obj) {
            extender.prototype = obj;
            var res = new extender();
            extender.prototype = null;
            return res;
        };
    }

    var res = inherit(underscore);

    res.inherit = inherit;

    res.isWindow = function(obj) {
        return obj != null && obj === obj.window;
    };

    res.isNumeric = res.isNumber;

    res.isPlainObject = function(obj) {
        if (typeof(obj) !== 'object' || obj.nodeType || res.isWindow(obj)) {
            return false;
        }

        // Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if ( obj.constructor &&
					!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
    };

    res.mapAll = function(arrs, fn, context) {
        var results = [];
        if (arrs == null) return results;
        var max_length = 0;
        var i;
        for (i=0; i < arrs.length; i++) {
            var l = arrs[i].length;
            if (l > max_length) max_length = l;
        }
        for (i=0; i < l; i++) {
            var round = [];
            for (var j=0; j < arrs.length; j++) {
                round.push(arrs[j][i]);
            }
            results.push(fn.apply(context, round));
        }
        return results;
    };

    res.gattr = function(k) {
        return function(o) {
            return o[k];
        }
    };

    res.splat = function(fn) {
        return function(arr) {
            return fn.apply(this, arr);
        };
    };

    res.dictIsEmpty = res.isEmpty;
    res.dictIsEqual = res.isEqual;

    res.truthiness = function(obj) {
        switch(obj) {
            case 0:
            case false:
            case null:
            case undefined:
                return false;
            case true:
                return true;
        }
        if (res.isNumeric(obj)) {
            return true;
        }
        if (obj.length !== undefined) {
            return obj.length > 0;
        }
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                return true;
            }
        }
        return false;
        return true;
    };

    var rdashAlpha = /-([\da-z])/gi;
    var fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

    res.camelCase = function(string) {
        return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    };

    res.partial = function(fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function() {
            return fn.apply(this, args.concat(arguments));
        };
    };

    res.indexOf = function(arr, el) {
        if (arr.indexOf) {
            return arr.indexOf(el);
        }
        for (var i=0; i < arr.length; i++) {
            if (arr[i] == el) {
                return i;
            }
        }
        return -1;
    };

    var sentence_splitter = /(<[^>]*>|[^\w\s]+)/;
    res.sentenceSplit = function(s) {
        var parts = s.split(sentence_splitter);
        var res = [];
        for (var i=0; i < parts.length; i++) {
            var part = parts[i];
            if (i % 2 === 0) {
                res.push(part);
            } else {
                res[res.length-1] = res[res.length-1] + part;
            }
        }
        var character_offset = 0;
        var offsets = [];
        for (var i=0; i < res.length; i++) {
            offsets.push(character_offset);
            character_offset += res[i].length;
        }

        return [res, offsets];
    };

    res.isTextNode = function(node) {
        return !!(node && node.nodeType === 3);
    };

    res.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if ( typeof target === "boolean" ) {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if ( typeof target !== "object" && !res.isFunction(target) ) {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            if ( length === i ) {
                target = this;
                --i;
            }

            for ( ; i < length; i++ ) {
                // Only deal with non-null/undefined values
                if ( (options = arguments[ i ]) != null ) {
                    // Extend the base object
                    for ( name in options ) {
                        src = target[ name ];
                        copy = options[ name ];

                        // Prevent never-ending loop
                        if ( target === copy ) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if ( deep && copy && ( res.isPlainObject(copy) || (copyIsArray = res.isArray(copy)) ) ) {
                            if ( copyIsArray ) {
                                copyIsArray = false;
                                clone = src && res.isArray(src) ? src : [];

                            } else {
                                clone = src && res.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[ name ] = res.extend( deep, clone, copy );

                        // Don't bring in undefined values
                        } else if ( copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };

    return res;
});
