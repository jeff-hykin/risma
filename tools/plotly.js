export function plotHtml(...data) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plotly Sunburst Chart</title>
  <!-- Include Plotly.js -->
  <script src="https://cdn.plot.ly/plotly-1.58.5.min.js"></script>
</head>
<body>
  <div id="sunburst-chart" style="height:100vh; width: 100vw;"></div>
  <script>
    Plotly.newPlot('sunburst-chart', ...${JSON.stringify(data)})
  </script>
</body>
</html>`
}