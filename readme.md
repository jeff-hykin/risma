
`run/main.ps1` to start the CLI

<!--                                                          -->
<!--                                                          -->
<!-- DO NOT EDIT ME; EDIT ./build_helper/readme_workaround.md -->
<!--                                                          -->
<!--                                                          -->

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
# get the year of all works with nicknames
yq -e '[ .references.[] | select(.notes.nickname) | [.notes.nickname, ._.year] ]' project.yaml
# get all titles that have one or the other tag
yq -e '[ .references.[] | select(.notes.keyTags | index("hasCode") or index("spiking")) | [._.title, .score] ]' project.yaml
# get abstracts for all relevent titles
yq -e '[ .references.[] | select(.notes.resumeStatus == "relevent|title") | ._.abstract ]' project.yaml
# sort by year and get papers and titles
yq -e '[ .references.[] | select(.notes.resumeStatus == "super-relevent|abstract") | { title: ._.title, year: ._.year } ] | sort_by(.year)' project.yaml
# sort by year and get papers and titles as a list of lists
yq -e '[ .references.[] | select(.notes.resumeStatus == "super-relevent|abstract") | [._.title, ._.year ] ] | sort_by(.[1])' project.yaml
# find all searches and sort by year
yq -e '[ .discoveryAttempts.[] | select(.query == "ecological affordance based object perception machine learning") | select(.yearRange) | [.yearRange[0], .score ] ] | sort_by(.[1])' project.yaml

# 
# run main
# 
~/.deno/1.43.3/bin/deno run --no-lock -A ./main.js
```
