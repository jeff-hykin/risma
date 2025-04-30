#!/usr/bin/env -S deno run --allow-all

var yearFreqAll =  {
//   "1964": 2,
//   "1965": 1,
//   "1971": 2,
//   "1972": 1,
//   "1974": 1,
//   "1975": 1,
//   "1977": 1,
//   "1978": 2,
//   "1979": 1,
//   "1980": 2,
//   "1981": 1,
//   "1983": 2,
//   "1986": 2,
//   "1987": 1,
//   "1988": 5,
//   "1989": 3,
//   "1990": 2,
//   "1991": 6,
//   "1992": 3,
//   "1993": 7,
//   "1994": 5,
//   "1995": 9,
//   "1996": 10,
//   "1997": 13,
//   "1998": 10,
//   "1999": 16,
//   "2000": 17,
//   "2001": 21,
//   "2002": 16,
//   "2003": 16,
//   "2004": 24,
//   "2005": 32,
//   "2006": 37,
//   "2007": 31,
//   "2008": 41,
//   "2009": 33,
//   "2010": 40,
//   "2011": 43,
//   "2012": 46,
//   "2013": 48,
//   "2014": 48,
//   "2015": 39,
//   "2016": 72,
//   "2017": 89,
//   "2018": 96,
//   "2019": 107,
//   "2020": 142,
//   "2021": 159,
//   "2022": 172,
//   "2023": 203,
//   "2024": 239,
//   "2025": 40
}
var yearFreqManual = {
//   "1994": 0,
  "2000-2005": 1,
  "2005-2010": 1,
  "2010-2015": 1+2+1+3,
  "2020-2025": 3+2+1+2,

//   "2013": 1,
//   "2017": 2,
//   "2018": 1,
//   "2019": 3,
//   "2020": 3,
//   "2022": 2,
//   "2023": 1,
//   "2024": 2,
//   "2025": 2
}

var trace1 = {
    x: Object.keys(yearFreqAll).map(each=>parseInt(each)),
    y: Object.values(yearFreqAll),
    mode: "lines",
    name: "All",
    line: { color: "blue" },
}

var trace2 = {
    x: Object.keys(yearFreqManual).map(each=>parseInt(each)),
    y: Object.values(yearFreqManual),
    mode: "lines",
    name: "Qualified",
    line: { color: "red" },
}

var data = [trace1, trace2]

var layout = {
    title: "Quantity Over Years",
    xaxis: { title: "Year" },
    yaxis: { title: "Quantity" },
}

import { FileSystem, glob } from "https://deno.land/x/quickr@0.7.6/main/file_system.js"
import { plotHtml } from "../tools/plotly.js"
await FileSystem.write({
    data: plotHtml(data, layout),
    path: "plot.html"
})