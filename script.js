var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var formatCurrency = d3.format("$,.2f");
document.addEventListener('DOMContentLoaded', function(){
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(data => {
        var dataset = data["data"];
                    
        console.log(data);

        console.log(JSON.stringify(dataset));

        var margin={
            top: 5,
            right: 10,
            bottom: 400,
            left: 75
            }
        var width = 1000 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;//fix size of svg chart

        minDate = new Date(dataset[0][0]);
        maxDate = new Date(dataset[274][0]);

        var barWidth = Math.ceil(width / dataset.length);

        var x = d3.time.scale()
            .domain([minDate, maxDate])
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0])
            .domain([0, d3.max(dataset, (d) => d[1]
            )]);
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .ticks(d3.time.years, 5);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(10, '');
                    
        var infobox = d3.select('.infobox');

        var div = d3.select('#container')
            .append('div')
            .attr("class", 'tooltip')
            .attr('id', 'tooltip')
            .style('opacity', 0);
                        
        var chart = d3.select('.chart')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.botton)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        chart.append('g')
            .attr("id", "x-axis")
            .attr("class", "x-axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis);
        
        chart.append('g')
            .attr("id", "y-axis")
            .attr("class", 'y-axis')
            .call(yAxis)
            .append('text')
            .attr("transform", "rotate(-90)")
            .attr('y', 6)
            .attr('dy', "0.8em")
            .style('text-anchor', 'end')
            .text("Gross Domestic Product, USA")
            // to be continued..
        chart.selectAll('bar')
            .data(dataset)
            .enter()
            .append('rect')
            .attr("class", "bar")
            .attr("x", (d) => x(new Date(d[0])))
            .attr("y", (d) => y(d[1]))
            .attr("height", (d) => height - y(d[1]))
            .attr("width", barWidth)
            .attr('data-date', (d) => d[0])
            .attr("data-gdp", (d) => d[1])
            .on('mouseover', function(d) {
                var rect = d3.select(this);
                rect.attr("class", "mouseover");
                var currentDateTime = new Date(d[0]);
                var year = currentDateTime.getFullYear();
                var month = currentDateTime.getMonth();
                var dollars = d[1];
                div.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                div.html("<span class='amount'>" + formatCurrency(dollars) + "&nbsp;Billion </span><br><span class='year'>" + year + ' - ' + months[month] + "</span>")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 50) + "px");
                div.attr("data-date", d[0]);
            })
            .on("mouseout", function() {
                var rect = d3.select(this);
                rect.attr("class", "mouseoff");
                div.transition()
                  .duration(500)
                  .style("opacity", 0);
            });
    })

});
