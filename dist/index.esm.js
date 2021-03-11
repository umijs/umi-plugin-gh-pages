import ghpages from 'gh-pages';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

var index = (function (api) {
  var paths = api.paths,
      logger = api.logger;
  api.describe({
    key: 'ghPages',
    config: {
      schema: function schema(joi) {
        return joi.object();
      }
    }
  });

  function publish(args) {
    var _ref = api.config.ghPages || {},
        dir = _ref.dir,
        ghpagesArgs = _objectWithoutProperties(_ref, ["dir"]);

    return new Promise(function (resolve, reject) {
      ghpages.publish(dir || paths.absOutputPath, _objectSpread2(_objectSpread2({}, ghpagesArgs), args), function (err) {
        if (err) {
          return reject(err);
        } // @ts-ignore


        resolve();
      });
    });
  }

  api.registerCommand({
    name: 'gh-pages',
    description: 'Publish to Github pages',
    details: 'umi gh-pages [Options]',
    fn: function fn(_ref2) {
      var args = _ref2.args;
      logger.profile('gh-pages');
      publish(args).then(function () {
        logger.profile('gh-pages');
        logger.info('Published to Github pages');
      }).catch(function (e) {
        logger.error(e);
      });
    }
  });
}); // , {
//   description: 'Publish to Github pages',
//   usage: 'umi gh-pages [Options]',
// }

export default index;
