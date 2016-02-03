currently run like:
  npm start audit some\path
  
todo:
1) enable recursion, single-folder, or single-file. Right now only single-folder.
1.5) allow the CLI not to care whether u do some\path or 'some\path'. Currently, don't use quotes.
2) maybe refactor CLI syntax:
    A. concision ie 'va audit'
    B. clarity ie 'path=some\path'
3) external rule files
    A. by default it should look for validate-anything.json then validate-anything.csv
    B. but you should be able to pass any location including a URL
4) swappable modules for different rule sets like python rules, html5 rules, xhtml rules, etc
5) config object so one task knows which modules apply to which file extensions
6) create a txt log file instead of log to console, and sort the log file
7) allow json or csv, etc, instead of text. Eventually a server should be able to validate a post and respond to client, prob in JSON
8) support for illegal regex, not just illegal string
9) maybe eventually support for browser instancing and allowing advanced validation that way
    -Like using jquery rules on a rendered dom
10)maybe eventually allowing integration of V-A with traditional linter, error logging sys, unit test sys, static analysis system
11)maybe allowing a browser instance to allow DOM-based validation w/ jquery