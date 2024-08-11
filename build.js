const fs = require('fs');
const { execSync } = require('child_process');
const packageJson = require('./package.json');
const version = `v${packageJson.version}`;

const updateVersion = (filePath, lineNumber, replacement) => {
  const content = fs.readFileSync(filePath, 'utf8').split('\n');
  content[lineNumber - 1] = replacement;
  fs.writeFileSync(filePath, content.join('\n'));
};

// path, line number, replacement
updateVersion('src/howler.core.js', 2, ` *  howler.js ${version}`);
updateVersion('src/plugins/howler.spatial.js', 4, ` *  howler.js ${version}`);

const minify = (input, output) => {
  execSync(`uglifyjs ${input} -c -m -o ${output}`);
};

// const corePreamble = `/*! howler.js ${version} | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */`;
minify('src/howler.core.js', 'dist/howler.core.min.js');

// const pluginPreambles = {
//   spatial: `/*! howler.js ${version} | Spatial Plugin | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */`,
// };

minify('src/plugins/howler.spatial.js', 'dist/howler.spatial.min.js');

const combineFiles = (files, output, separator = '\n\n') => {
  const content = files.map(file => fs.readFileSync(file, 'utf8')).join(separator);
  fs.writeFileSync(output, content);
};

// Combine minified files
combineFiles(
  ['dist/howler.core.min.js', 'dist/howler.spatial.min.js'],
  'dist/howler.min.js',
  '\n\n/*! Spatial Plugin */\n\n/*! Convolver Plugin */\n\n/*! Filter Plugin */\n\n/*! Delay Plugin */\n\n'
);

// Combine source files
combineFiles(
  ['src/howler.core.js', 'src/plugins/howler.spatial.js'],
  'dist/howler.js'
);

console.log('Build done.');
