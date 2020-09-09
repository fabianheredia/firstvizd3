const _urlData = "https://www.datos.gov.co/resource/sfav-4met.json"

// margenes

width = 620,
    height = 400
var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
}

//acceder a los datos popr D3
/*
d3.json(_urlData).then(datos => {
    //TODO aqui va la logica de los datos
    
    })*/

//Acceder por un paquete diferente

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
        .rangeRound([margin.left, width - margin.right])
    y = d3.scaleLinear()
        .domain([(d3.max(data, d => +d.valor)), (d3.min(data, d => +d.valor) - 100)]) //por que se pone max-min
        .range([margin.top, height - margin.bottom])

    // definir ejes

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
    xAxis = g => g
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom(x))

    // dibujar las barras
    svg = d3.select(".dataviz > svg")
        .attr("id", "viz")
        .attr("viewBox",[0,0,width, height])
        svg.selectAll('.bars').data([data]).join('g').attr('class', 'bars')
        //append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("y", d => y(d.valor))
        .attr("x", (d) => x(d.mes))
        .attr("height", d => y(d3.min(data, d => +d.valor)-100) - y(+d.valor))
        .attr("width", 20)
        //.call(enter => enter.transition(t))
        svg.selectAll('.xaxis').data([0]).join('g').attr('class', 'xaxis')
        .call(xAxis);

        svg.selectAll('.yaxis').data([0]).join('g').attr('class', 'yaxis')
        .call(yAxis);

}

getData(_urlData)