## What is this?

The alpha version of a tool for conducting a research literature review.


## How do I use it?


### Install 

```sh
# install deno
# for Linux/MacOS run:
curl -fsSL https://deno.land/install.sh|sh
# for Windows:
irm https://deno.land/install.ps1 | iex
    
# install risma
deno install -n risma -Afgr https://raw.githubusercontent.com/jeff-hykin/risma/master/main.js
```

### Use

```sh
risma 
# everything is interactive (just run that command)
```


## Extracting information

Everything (and I mean everything) is stored inside a human-readable project yaml file. While you can always search the file yourself manually or write a program to load the yaml, there's a little tool called [yq](https://github.com/mikefarah/yq) (based on jq) that can quickly extract all kinds of stuff. For example:

```sh
# 
# example of getting data out
# 

# get all titles
yq -e '[ .references.[] | ._.title ]' your_project.yaml
# get only relevent|title's, sort by year, then list those (title + year)
yq -e '[ .references.[] | select(.notes.resumeStatus == "relevent|title") | { title: ._.title, year: ._.year } ] | sort_by(.year)' your_project.yaml
# get all titles that are not yet reviewed
yq -e '[ .references.[] | select(.notes.resumeStatus == "unseen|title") | [._.title, .score] ]' your_project.yaml
# get the year of all works with nicknames
yq -e '[ .references.[] | select(.notes.nickname) | { nickname: .notes.nickname, title: ._.title, year: ._.year, authorNames: ._.authorNames, doi: ._.doi, link: ._.link, pdfLink: ._.pdfLink, } ]' your_project.yaml
# get all titles that have one or the other tag
yq -e '[ .references.[] | select(.notes.keyTags | index("hasCode") or index("spiking")) | [._.title, .score] ]' your_project.yaml
# get abstracts for all relevent titles
yq -e '[ .references.[] | select(.notes.resumeStatus == "relevent|title") | ._.abstract ]' your_project.yaml
# sort by year and get papers and titles as a list of lists
yq -e '[ .references.[] | select(.notes.resumeStatus == "super-relevent|abstract") | [._.title, ._.year ] ] | sort_by(.[1])' your_project.yaml
# find all searches and sort by year
yq -e '[ .discoveryAttempts.[] | select(.query == "ecological affordance based object perception machine learning") | select(.yearRange) | [.yearRange[0], .score ] ] | sort_by(.[1])' your_project.yaml
```