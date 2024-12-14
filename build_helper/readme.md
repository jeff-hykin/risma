## What is this?

under construction research lit review tool

```sh
# 
# example of getting data out
# 

# get all titles
yq -e '[ .references.[] | ._.title ]' project.yaml
# get all titles that are not yet reviewed
yq -e '[ .references.[] | select(.notes.resumeStatus == "unseen|title") | [._.title, .score] ]' project.yaml

# 
# run main
# 
~/.deno/1.43.3/bin/deno run --no-lock -A ./main.js
```