/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// TODO(markdittmer): Get rid of special-casing of 'js' and 'nanos' flags.

var flags = {};
var otherLanguages = [ 'java', 'swift' ];
var fs_ = require('fs');

if ( process.argv.length > 2 ) {
  process.argv[2].split(',').forEach(function(f) {
    flags[f] = true;
  });

  // Default to language = javascript.
  if ( ! flags.js ) {
    flags.js = ! otherLanguages.some(function(lang) {
      return flags[lang];
    });
  }
}

var outfile;
if ( process.argv.length > 3 ) {
  outfile = __dirname + process.argv[3];
} else {
  outfile = __dirname + '/../foam-bin.js';
}

var modelToBuild;
if ( process.argv.length > 4 ) {
  modelToBuild = __dirname + '/../src/' + process.argv[4].replace(/[.]/g, '/') + '.js';
}

if ( modelToBuild !== undefined ) {
  require('../src/foam.js');
  require('../src/foam/core/FObject.js');
  require(modelToBuild);

  var requiredFiles = new Set(['foam/core/poly', 'foam/core/lib', 'foam/core/stdlib',
    'foam/core/events', 'foam/core/Context', 'foam/core/Boot', 'foam/core/FObject',
    'foam/core/Model', 'foam/core/Property', 'foam/core/Method', 'foam/core/Boolean',
    'foam/core/AxiomArray', 'foam/core/EndBoot'
  ]);
  //TODO to verify in case of multipule class in the same file.

  collectExtendsFiles = function(fl) {
    try {
      cl = eval(fl);
    } catch (e) {
      console.log(e);
    }
    requiredFiles.add(fl);
    for (let item of cl.getAxiomsByClass(foam.core.Requires)) {
      requiredFiles.add(item.path);
    }
    return requiredFiles;
  };
  requiredFiles = collectExtendsFiles(process.argv[4]);
}

var payload = '';
var env = {
  FOAM_FILES: function(files) {
    files.filter(function(f) {
      return f.flags ? flags[f.flags] : true;
    }).map(function(f) {
      return f.name;
    }).forEach(function(f) {
      var data = fs_.readFileSync(__dirname + '/../src/' + f + '.js').toString();
      payload += data;
    });
  }
};

if ( process.argv.length > 2 && modelToBuild === undefined ) {
  var data = [fs_.readFileSync(__dirname + '/../src/files.js')];
  if ( flags.nanos ) {
    data.push(
      fs_.readFileSync(__dirname + '/../src/foam/nanos/nanos.js'));
  }
  for (var i = 0; i < data.length; i++) {
    with(env) {
      eval(data[i].toString());
    }
  }
} else {
  for (let item of requiredFiles) {
    if ( item !== undefined ) {
      console.log(item);
      requiredFile = __dirname + '/../src/' + item.replace(/[.]/g, '/') + '.js';
      try {
        payload += fs_.readFileSync(requiredFile).toString();
      } catch (e) {
        console.log(e);
      }
    }
  }
}

fs_.writeFileSync(outfile, payload);

var UglifyJS = require('uglify-es');

var code = outfile;
var options = {
  ecma: 6, // specify one of: 5, 6, 7 or 8
  nameCache: null, // or specify a name cache object
  toplevel: false,
  ie8: false,
  warnings: false,
  mangle: {},
  compress: {},
  output: {},
};

fs_.writeFileSync('output.min.js', UglifyJS.minify({
  outfile: fs_.readFileSync(outfile, 'utf8')
}, options).code, 'utf8');
