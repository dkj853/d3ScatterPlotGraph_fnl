document.addEventListener("DOMContentLoaded", function () {
  req = new XMLHttpRequest();
  req.open("GET", "/cyclist-data.json", true)

  req.send()

  req.onload = function () {
    json = JSON.parse(req.responseText)
    //this consolelog will confirm that you are accessing the database
    //console.log('JSON', json)

    const ytime = d => {
      let [min, sec] = d.split(":")
      return new Date(2000, 0, 1, 0, parseInt(min), parseInt(sec))
    }
    const dataset = json.map(obj => {
      let data = {
        time: ytime(obj.Time),
        year: obj.Year,
        doping: obj.Doping,
        name: obj.Name

      }
      return data
    })

    console.log('dataset', dataset)

    const xYear = d => d.year
    let years = dataset.map(obj => obj.year);
    years.sort((a, b) => a - b)

    const yTime = d => d.time
    const h = 500
    const w = 1500
    const padding = 60
    const svg = d3.select("body")
      .append('svg')
      .attr('width', w)
      .attr("height", h)
    const tooltip = d3.select('body')
      .append('div')
      .attr('id', 'tooltip')
    const xScale = d3.scaleBand()
      .domain(years)
      .range([padding, w - padding])
    const yScale = d3.scaleTime()
      .domain([new Date(2000, 0, 1, 0, 40, 0), new Date(2000, 0, 1, 0, 36, 30)])//check this might just be Date
      .range([h - padding, padding])
    const timeFormat = d3.timeFormat('%M:%S')
    svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr('class', 'dot')
      .on('mouseover', function (d) {
        tooltip.text(d.name + " " + d.year + " " + d.time).style('opacity', '0.9')
          .attr('data-year', d.year)
      })
      .on('mouseout', function (d) {
        tooltip.style('opacity', 0)
      })
      .attr('cx', (d) => xScale(xYear(d)) + padding)
      .attr('cy', (d) => yScale(yTime(d)))
      .attr('r', 3.4)

      .attr('data-xvalue', (d) => xYear(d))
      .attr('data-yvalue', (d) => d.time)
      .attr('fill', (d) => {
        if (d.doping == "") {
          return '#FFE4C4'
        } else {
          return '#800080'
        }
      })

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(timeFormat)

    svg.append("g")
      .attr('transform', 'translate (.2,' + (h - padding) + ')')
      .attr('id', 'x-axis')
      .call(xAxis)
      .style("font-size", "15px")

    svg.append('g')
      .attr('transform', 'translate (' + (padding) + ', 0)')
      .attr('id', 'y-axis')
      .call(yAxis)
      .style("font-size", "15px")

    var keys = ['Riders without doping allegations', 'Riders with doping allegations']
    svg.selectAll("mydots")
      .data(keys)
      .enter()
      .append('rect')
      .attr('x', 900)
      .attr('y', function (d, i) {
        return 97 + i * (25)
      })
      .attr('height', 20)
      .attr('width', 25)
      .style("fill", function (d, i) {
        if (i == 0) {
          return "#FFE4C4"
        } else {
          return '#800080'
        }
      })
      .attr('id', 'legend')
     

    svg.selectAll('mylables')
      .data(keys)
      .enter()
      .append('text')
      .attr('x', 930)
      .attr('y', function (d, i) {
        return 112 + i * 30
      })
      .style("font-size", "20px")
      .style("fill", "#2F4F4F")
      .style('fill', function (d) {
        if (d == keys[0]) {
          return keys[0]
        } else {
          return keys[1]
        }
      })
      .text(function (d) {
        return d
      })
      .attr("text-anchor", 'right')
      .style('alighment-baseline', 'middle')

  }
});