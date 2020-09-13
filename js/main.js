const _urlData = "https://www.datos.gov.co/resource/sfav-4met.json"

width = 620
height = 400

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
}

var getData = (url) => {
    axios.get(url).then((response) => {
        console.log(response.data);
        misdatos = []
        for (i in response.data[0]) {
            if (i != 'indicadores') {
                datomes = {}
                datomes.mes = i.replace('_', '')
                datomes.valor = response.data[0][i]
                misdatos.push(datomes)
            }

        }
        generateViz(misdatos)
    })
}

var generateViz = (data) => {
    x = d3.scaleBand()
    .domain(data.map(d => d.mes))
    .rangeRound([margin.left, width - margin.right -25])

    y = d3.scaleLinear()
    .domain([
        (d3.max(data, d => +d.valor)), 
        (d3.min(data, d => +d.valor) - 100)
    ]) 
    .range([margin.top, height - margin.bottom])

    yAxis = g => g
    .attr("transform", `translate(${margin.left + 50},0)`)
    .call(d3.axisLeft(y))

    xAxis = g => g
    .attr("transform", `translate(50,${height-margin.bottom})`)
    .call(d3.axisBottom(x))

    svg = d3
    .select(".dataviz > svg")
    .attr("id", "viz")
    .attr("viewBox",[0, 0, width, height])

    svg
    .selectAll('.bars')
    .data([data])
    .join('g')
    .attr('class', 'bars')
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("y", d => y(d.valor))
    .attr("x", (d) => x(d.mes))
    .attr("height", d => y(d3.min(data, d => +d.valor) - 100) - y(+d.valor))
    .attr("width", 20)
    .attr("transform", "translate(63,1)")
    
    svg
    .selectAll('.xaxis')
    .data([0])
    .join('g')
    .attr('class', 'xaxis')
    .call(xAxis);

    svg
    .selectAll('.yaxis')
    .data([0])
    .join('g')
    .attr('class', 'yaxis')
    .call(yAxis);

    svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("font-size", "smaller")
    .attr("y", 45)
    .attr("x", -70)
    .attr("transform", "rotate(-90)")
    .text("Cargamentos agrícolas certificados");
}

getData(_urlData)