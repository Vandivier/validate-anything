/* 
 * @author Vandivier
 * https://github.com/vandivier
 */

'use strict';

let fs = require('fs'),
  path = require('path'),
  argv = require('minimist')(process.argv.slice(2)),
  stream = require('stream'),
  Q = require('q'),
  Baby = require('babyparse');

/* doc  
by default it should look for rules.json then rules.csv
but it should also take custom locations if specified or a config object
by default it should run 'audit' but it should allow for 'list' and 'fix'
by defaults search cd and recursive children
  but allow other folder specified, allow disable recursive kids, and allow specify particular file
  
currently run like:
  node markup-validator list
  OR
  npm start list
  
  i can refactor later so just:
  npm list
/doc
*/

switch (argv._[0]) {
  case 'list':
    listFiles();
    break;
  case 'audit':
    qualityCheck(argv);
    break;
  default:
    console.log('\rError: Invalid CLI request.');
}

function listFiles() {
  let target = getDirectories('./');
  
  fs.writeFile('list.csv', target.join('\n'), 'utf8', function (err) {
    if (err) {
      console.log('\n\rERROR: listFiles()' + err);
    } else {
      console.log('\n\rSuccesfully generated form-list.csv.');
      console.log('\n\r '+ target.length +' files were listed.');
    }
  });
}

function qualityCheck(argv) {
    let path = false || './',
    dirContent = dir(path),
    dirs = dirContent.dirs,
    files = dirContent.files,
    logfile = fs.createWriteStream("logfile.txt");
    
    console.log(argv._[0]);
    console.log(dirs);
    console.log(files);
    
    markupRuleStream().pipe(compareRuleToFile);
    //Q(checkEachDir()).then(writeReport());
    
    /*
    function writeReport() {
      console.log(logfile);
      fs.writeFile('node-utility/qualityCheck-logfile.txt', logfile, 'utf8', function (err) {
        if (err) {
          console.log('\r\nERROR: qualityCheck() threw while generating qualityCheck-logfile.txt.\n\r' + err);
        } else {
          console.log('\r\nSuccesfully generated qualityCheck-logfile.txt');
        }
      });
    }
    */
    function markupRuleStream() {
      //get content of csv file and pass to babyparse
      //let csv = require('stream').Readable;
      //let csvStr = fs.createReadStream('\markup-validator.csv', {encoding: 'utf-8'}).on('data', (chunk) => {
      return fs.createReadStream('\markup-validator.csv', {encoding: 'utf-8'}).on('data', (chunk) => {
        Baby.parse(chunk, {
          step: function(row){
              //setTimeout(function(){console.log("Row: ", row.data);}, 1000);
              return row;
          }
        });
      });
    }
    function compareRuleToFile(rule) {
      rule.pipe(process.stdout);
    }
}
function dir(srcpath) {
  //files and subdirectories, like CLI
  var ret = {};
  
  ret.files = fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
  ret.dirs = fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isFile();
  });
  return ret;
}
/*
function multiLineStr(f) {
  //i can use es6 ` thing to do this like in ang2 template
  return f.toString().split('\n').slice(1, -1).join('\n');
}
*/
