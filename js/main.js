$(".button").click(function (e) {
    e.preventDefault();

    $(".button").css("background-color","#F85F5F");

    var i = 0;
    if (e.target.id == "row41"){
        $("#row41").css("background-color","steelblue");
        i = 0;
    }else if(e.target.id == "row42"){
        $("#row42").css("background-color","steelblue");
        i = 1;
    }else if(e.target.id == "row43"){
        $("#row43").css("background-color","steelblue");
        i = 2;
    }else{
        $("#row44").css("background-color","steelblue");
        i = 3;
    }
    getData(_urlData,i)
});


const _urlData = "https://www.datos.gov.co/resource/sfav-4met.json"

// margenes
width = 620,
    height = 300
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

var getData = (url,index) => {
    axios.get(url).then((response) => {
        //console.log(index, response.data);
        //organizar la info
        misdatos = []
        for (i in response.data[index]) {
            if (i != 'indicadores') {
                datomes = {}
                datomes.mes = i
                datomes.valor = response.data[index][i]
                misdatos.push(datomes)
            }
        }
        generateViz(misdatos)
        //console.log(misdatos);
    })
}

var generateViz = (data) => {

    // definicion de escalas
    x = d3.scaleBand()
        .domain(data.map(d => d.mes))
        .rangeRound([margin.left, width - margin.right])
        .paddingInner(0.2)
        .paddingOuter(0.2);

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
        .attr("viewBox",[0,0,width, height]);

    svg.selectAll('.bars').data([data]).join('g').attr('class', 'bars')
        //append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("y", d => y(d.valor))
        .attr("x", (d) => x(d.mes))
        .attr("height", d => y(d3.min(data, d => +d.valor)-100) - y(+d.valor))
        .attr("width", x.bandwidth);

        //.call(enter => enter.transition(t))
    svg.selectAll('.xaxis').data([0]).join('g').attr('class', 'xaxis')
        .call(xAxis);

    svg.selectAll('.yaxis').data([0]).join('g').attr('class', 'yaxis')
        .call(yAxis);

}
getData(_urlData,0)
$("#row41").css("background-color","steelblue");