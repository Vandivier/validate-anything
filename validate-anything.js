/* 
 * @author Vandivier
 * https://github.com/vandivier
 */

'use strict';

let fs = require('fs'),
  path = require('path'),
  argv = require('minimist')(process.argv.slice(2)),
  stream = require('stream'),
  //Q = require('q'),
  Baby = require('babyparse');

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
  //todo: allow recursively discover files in child folders.
  let files = dir('./').files;
  
  fs.writeFile('list.csv', files.join('\n'), 'utf8', function (err) {
    if (err) {
      console.log('\n\rERROR: listFiles()' + err);
    } else {
      console.log('\n\rSuccesfully generated form-list.csv.');
      console.log('\n\r '+ files.length +' files were listed.');
    }
  });
}

function qualityCheck(argv) {
    let path = argv._[1] || './',
    dirContent = dir(path),//todo: dir(path, recursive);
    dirs = dirContent.dirs,
    files = dirContent.files,
    filePaths = dirContent.filePaths,
    logfile = fs.createWriteStream("logfile.txt"),
    rules = getRules();
    
    for (let flp of filePaths) {
      _compare(rules, flp)
    }
    
    function getRules() {
      let sampleRules = [],
      rule1 = {
        ruleName: 'illegal bold tag',
        rule: '<b>',
        ruleType: 'string',
        ext: 'html',
        logText: `filePath + ' contains ' + ruleName`
      },
      rule2 = {
        ruleName: 'illegal inline-style',
        rule: 'style=',
        ruleType: 'string',
        ext: 'html',
        logText: `filePath + ' contains ' + ruleName`
      };
      //todo: regex rules and module capability like the below rule3
      /*
      rule3 = {
        ruleName: 'self-closing input tag',
        rule: '/(<input)[^/]+(\/)>/g',
        ruleType: 'regex',
        ext: 'html',
        module: 'html5', //could be xhtml, python, java, css, anything!!
        logText: '{{thisFile}} contains {{ruleName}}'
      };
      */
      sampleRules.push(rule1, rule2);
      let rules = sampleRules;
      let rulesAsFunctions = rules.map((rule, i)=>{
        //todo: log to file, not console.log()
        let fxnStr = `
          'use strict';
          let ruleName = '${rule.ruleName}';
          console.log(
            (chunk.indexOf(\'${rule.rule}\') > -1) ? ${rule.logText} : \'\'
            + \'${rule.ruleName}\'
          )
        `;
        return new Function('chunk', 'filePath', fxnStr);
      });
      return rulesAsFunctions;
      
      //get content of csv file and pass to babyparse
      //let csv = require('stream').Readable;
      //let csvStr = fs.createReadStream('\markup-validator.csv', {encoding: 'utf-8'}).on('data', (chunk) => {
      /*
      return fs.createReadStream('\markup-validator.csv', {encoding: 'utf-8'}).on('data', (chunk) => {
        Baby.parse(chunk, {
          step: function(row){
              //setTimeout(function(){console.log("Row: ", row.data);}, 1000);
              return row;
          }
        });
      });
      */
    }
    
    function _compare(rules, filePath) {
      //console.log(filePath + ' = filePath in _compare()');
      //console.log(rules);
      
      //todo: any such thing as a chunk index? I would like to know which chunk in file has problem...
      fs.createReadStream(filePath, {encoding: 'utf-8'}).on('data', (chunk) => {
        for (let rule of rules) {
          rule(chunk, filePath);
          //rule(chunk, test);
        }
      });
      
      /*
      fs.writeFile('node-utility/qualityCheck-logfile.txt', logfile, 'utf8', function (err) {
        if (err) {
          console.log('\r\nERROR: qualityCheck() threw while generating qualityCheck-logfile.txt.\n\r' + err);
        } else {
          console.log('\r\nSuccesfully generated qualityCheck-logfile.txt');
        }
      });
      */
    }
}

function dir(srcpath) {
  var ret = {};
  ret.dirpaths = [];
  ret.filePaths = [];
  
  ret.dirs = fs.readdirSync(srcpath).filter(function(file) {
    let isDir = fs.statSync(path.join(srcpath, file)).isDirectory();
    if(isDir) {
      ret.dirpaths.push(path.join(srcpath, file));
      return file;
    }
  });
  
  ret.files = fs.readdirSync(srcpath).filter(function(file) {
    let filePath = path.join(srcpath, file);
    let isFile = fs.statSync(filePath).isFile();
    if(isFile) {
      ret.filePaths.push(filePath);
      return file;
    }
  });
  
  return ret;
}
