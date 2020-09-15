// Data
const _urlData = "https://www.datos.gov.co/resource/sfav-4met.json"

// Constant
const space_to_align = 14;

// Function to capitalize the first letter of s. Source: https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

// Margins
width = 620,
    height = 400
var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
}

// Get Data
var getData = (url) => {
    axios.get(url).then((response) => {
        console.log(response.data);

        // Organize data
        misdatos = []
        for (i in response.data[0]) {
            if (i != 'indicadores') {
                datomes = {}
                datomes.mes = i
                datomes.valor = response.data[0][i]

                if (datomes.mes.charAt("0") === "_")
                {
                    datomes.mes = datomes.mes.replace("_", "")
                }

                datomes.mes = capitalize(datomes.mes)
                misdatos.push(datomes)
            }

        }
        generateViz(misdatos)
        console.log(misdatos);
    })
}

// Generate Viz
var generateViz = (data) => {

    // Define Scales
    x = d3.scaleBand()
        .domain(data.map(d => d.mes))
        .rangeRound([margin.left, width - margin.right])

    y = d3.scaleLinear()
        .domain([(d3.max(data, d => +d.valor)), (d3.min(data, d => +d.valor) - 100)])
        .range([margin.top, height - margin.bottom])

    // Define Axis
    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
    xAxis = g => g
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom(x))

    // Draw the bars
    svg = d3.select(".dataviz > svg")
        .attr("id", "viz")
        .attr("viewBox",[0,0,width, height])
        svg.selectAll('.bars').data([data]).join('g').attr('class', 'bars')
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("y", d => y(d.valor))
        .attr("x", (d) => x(d.mes) + space_to_align)
        .attr("height", d => y(d3.min(data, d => +d.valor)-100) - y(+d.valor))
        .attr("width", 20)

        svg.selectAll('.xaxis').data([0]).join('g').attr('class', 'xaxis')
            .call(xAxis);

        svg.selectAll('.yaxis').data([0]).join('g').attr('class', 'yaxis')
            .call(yAxis);
    
    // x-axis label
    svg.append("text")             
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Month");

    // y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Imports"); 

}

getData(_urlData)