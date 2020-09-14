const _urlData = "https://www.datos.gov.co/resource/sfav-4met.json"

// margenes

width = 620,
    height = 400
var margin = {
    top: 50,
    right: 40,
    bottom: 50,
    left: 60
}

//acceder a los datos popr D3
/*
d3.json(_urlData).then(datos => {
    //TODO aqui va la logica de los datos

    })*/

//Acceder por un paquete diferente
function jsUcfirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var getData = (url) => {
    axios.get(url).then((response) => {
        console.log(response.data);
        //organizar la info
        misdatos = []
        for (i in response.data[0]) {
            if (i != 'indicadores') {
                datomes = {}
                datomes.mes = i
                datomes.valor = response.data[0][i]
                datomes.mes = jsUcfirst(i.replace('_', ''));

                misdatos.push(datomes)
            }

        }
        generateViz(misdatos)
        console.log(misdatos);

        //TODO generar la viz
    })
}

var generateViz = (data) => {

    // definicion de escalas


    x = d3.scaleBand()
        .domain(data.map(d => d.mes))
        .rangeRound([margin.left , width - margin.right])
    y = d3.scaleLinear()
        .domain([(d3.max(data, d => +d.valor)), (d3.min(data, d => +d.valor) - 100)]) //por que se pone max-min
        .range([margin.top, height - margin.bottom])

    const xValue = d => d.mes;
    const xScale = d3.scaleBand()
        .domain(data.map(xValue))
        .range([0, width - margin.right-margin.left])
        .padding(0.1);
    // definir ejes

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .append("text")
        .attr('class', 'axis-label')

        .attr("y",0)
        .attr('x',- height/2)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("stroke", "black")
        .attr("stroke-width", 0.65)
        .attr("dy", "-5em")

        .text("Cargamentos agrícolas certificados");

    xAxis = g => g
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom(x))


    // dib0ujar las barras
    var colorScale = d3.scaleOrdinal(d3.schemeDark2);

    svg = d3.select(".dataviz > svg")
        .attr("id", "viz")
        .attr("viewBox",[0,0,width, height])
        .attr("font-family", "sans-serif")
        .attr("font-size", "10")
        .attr("text-anchor", "middle");


        svg.selectAll('.bars').data([data]).join('g').attr('class', 'bars')
        //append("g")
        .selectAll("rect")
        .data(d => d)
        .join("text")
          .attr("y", d => y(d.valor)-5)
          .attr("x", (d) => x(d.mes)+xScale.bandwidth()/2)
          .text(d => d.valor)
          .attr("stroke", "black")
          .attr("stroke-width", 0.55)

          svg.selectAll('.bars').data([data]).join('g').attr('class', 'bars')
          .selectAll("rect")
          .data(d => d)
        .join("rect")
          .attr("y", d => y(d.valor))
          .attr("x", (d) => x(d.mes))
          .attr("height", d => y(d3.min(data, d => +d.valor)-100) - y(+d.valor))
          .attr("width", xScale.bandwidth())
          .attr("fill", d=>colorScale(d.valor));

        //.call(enter => enter.transition(t))
        svg.selectAll('.xaxis').data([0]).join('g').attr('class', 'xaxis')
        .call(xAxis);

        svg.selectAll('.yaxis').data([0]).join('g').attr('class', 'yaxis')
        .call(yAxis);
}

getData(_urlData)
