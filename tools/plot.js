const htmlWrap = function(code) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plotly Line Plot</title>
    <!-- Include Plotly.js -->
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>
<body>
    <div id="plotly-plot" style="height: 95vh; width: 95vw;"></div>
    <script>
        ${code}
    </script>
</body>
</html>
`
}

export const linePlot = function(dataFrame, {xAxisName}) {
    xAxisName = xAxisName || Object.keys(dataFrame)[0]
    return htmlWrap(`
        var d = ${JSON.stringify(dataFrame)}
        
        var traces = []
        for (const [key, value] of Object.entries(d)) {
            if (key == ${JSON.stringify(xAxisName)}) {
                continue
            }
            traces.push({
                x: d[${JSON.stringify(xAxisName)}],
                y: value,
                mode: 'lines',
                name: key,
                // line: {color: 'blue'}
            })
        }
        
        // Layout configuration
        var layout = {
            title: 'Simple Line Plot',
            xaxis: {
                title: ${JSON.stringify(xAxisName)}
            },
            yaxis: {
                title: 'Y Axis'
            }
        }

        // Plot the chart
        Plotly.newPlot('plotly-plot', traces, layout);
    `)
}