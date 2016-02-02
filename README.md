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