import * as d3 from 'd3'

{
    d3.json('./json/holoceneLatest(1).json').then(data => {
        const rockTypeCounts = {};

        data.forEach(volcano => {
            const rockTypes = volcano.rockTypes && volcano.rockTypes.major || [];
            rockTypes.forEach(type => {
                rockTypeCounts[type] = (rockTypeCounts[type] || 0) + 1;
            });
        });

        const threshold = 40;
        const otherCount = Object.keys(rockTypeCounts).reduce((sum, type) => {
            if (rockTypeCounts[type] <= threshold) {
                sum += rockTypeCounts[type];
                delete rockTypeCounts[type];
            }
            return sum;
        }, 0);

        if (otherCount > 0) {
            rockTypeCounts['Other'] = otherCount;
        }

        const pieData = Object.keys(rockTypeCounts).map(type => ({
            label: type,
            value: rockTypeCounts[type]
        }));

        const uniqueTypes = pieData.map(d => d.label);

        const pieChartLayout = {
            width: document.getElementById('pie-chart').offsetWidth,
            height: document.getElementById('pie-chart').offsetHeight,
            margin: 35
        };

        const pieChart = d3.select("#pie-chart")
            .append("svg")
            .attr("width", pieChartLayout.width)
            .attr("height", pieChartLayout.height)
            .append("g")
            .attr("transform", `translate(${pieChartLayout.width / 2},${pieChartLayout.height / 2})`);

        pieChart.append("text")
            .attr("text-anchor", "middle")
            .style("font-size", ".8vw")
            .style('font-family', "semibold")
            .attr("dy", "-2.5em")
            .attr("x", 0)
            .style("font-weight", "bold")
            .text("Percentage of ");

        pieChart.append("text")
            .attr("text-anchor", "middle")
            .style('font-family', "semibold")
            .style("font-size", ".8vw")
            .style("font-weight", "bold")
            .append("tspan")
            .attr("dy", "-1.5em")
            .attr("x", 0)
            .text("Volcanic Rock Types");

        pieChart.append("text")
            .attr("text-anchor", "middle")
            .style("font-size", ".7vw")
            .style("font-weight", "bold")
            .style('font-family', "light")
            .append("tspan")
            .attr("dy", "0em")
            .attr("x", "0")
            .text("Tip: Others include");

        pieChart.append("text")
            .attr("text-anchor", "middle")
            .style("font-size", ".7vw")
            .style("font-weight", "bold")
            .style('font-family', "light")
            .append("tspan")
            .attr("dy", "1em")
            .attr("x", "0")
            .text("Tephri-phonolite: 24,");
        pieChart.append("text")
            .attr("text-anchor", "middle")
            .style("font-size", ".7vw")
            .style("font-weight", "bold")
            .style('font-family', "light")
            .append("tspan")
            .attr("dy", "2em")
            .attr("x", "0")
            .text("Phono-tephrite: 24,");
        pieChart.append("text")
            .attr("text-anchor", "middle")
            .style("font-size", ".7vw")
            .style("font-weight", "bold")
            .style('font-family', "light")
            .append("tspan")
            .attr("dy", "3em")
            .attr("x", "0")
            .text("Foidite: 29,");
        pieChart.append("text")
            .attr("text-anchor", "middle")
            .style("font-size", ".7vw")
            .style("font-weight", "bold")
            .style('font-family', "light")
            .append("tspan")
            .attr("dy", "4em")
            .attr("x", "0")
            .text("Phonolite: 36,");
        pieChart.append("text")
            .attr("text-anchor", "middle")
            .style("font-size", ".7vw")
            .style("font-weight", "bold")
            .style('font-family', "light")
            .append("tspan")
            .attr("dy", "5em")
            .attr("x", "0")
            .text("No Data: 39");
        const arc = d3.arc()
            .outerRadius(pieChartLayout.width / 4)
            .innerRadius(Math.min(pieChartLayout.width, pieChartLayout.height) / 2 - pieChartLayout.margin)
            .cornerRadius(6);

        const customColors = [
            "#bc0707",
            "#f53f3f",
            "#b93232",
            "#b73737",
            "#e04646",
            "#ea5a32",
            "#dd481b",
            "#fa690f",
            "#e76413",
            "#ff8a04",
            "#ff7c17",
            "rgb(212, 55, 7)",
            "#ef5f37",
            "#f1830e"
        ];

        const colorScale = d3.scaleOrdinal()
            .domain(uniqueTypes)
            .range(customColors);

        const gradient = pieChart.append("defs")
            .selectAll("radialGradient")
            .data(uniqueTypes)
            .enter()
            .append("radialGradient")
            .attr("id", (d, i) => `gradient-${i}`)
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("r", "50%");

        gradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", (d, i) => colorScale(d));

        gradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", (d, i) => colorScale(d));

        const shadow = pieChart.append("defs")
            .append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "200%");

        shadow.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 1)
            .attr("result", "blur");

        shadow.append("feFlood")
            .attr("flood-color", "darkred")
            .attr("result", "color");

        shadow.append("feComposite")
            .attr("in", "color")
            .attr("in2", "blur")
            .attr("operator", "in");

        shadow.append("feOffset")
            .attr("in", "in")
            .attr("dx", 2)
            .attr("dy", 2)
            .attr("result", "offsetBlur");

        const feMerge = shadow.append("feMerge");

        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur");

        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        const pie = d3.pie()
            .value(d => d.value);

        const slices = pieChart.selectAll("path")
            .data(pie(pieData))
            .enter()
            .append("path")
            .attr("class", "slice")
            .attr("d", arc)
            .attr("fill", (d, i) => `url(#gradient-${uniqueTypes.indexOf(d.data.label)})`)
            .attr("stroke", "black")
            .style("stroke-width", "0px")
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .each(function (d) {
                const filter = d3.select(this).append("filter")
                    .attr("id", `drop-shadow-${uniqueTypes.indexOf(d.data.label)}`)
                    .attr("height", "150%");

                filter.append("feGaussianBlur")
                    .attr("in", "SourceAlpha")
                    .attr("stdDeviation", 8)
                    .attr("result", "blur");

                filter.append("feFlood")
                    .attr("flood-color", "darkred")
                    .attr("result", "color");

                filter.append("feComposite")
                    .attr("in", "color")
                    .attr("in2", "blur")
                    .attr("operator", "in");

                filter.append("feOffset")
                    .attr("in", "in")
                    .attr("dx", 4)
                    .attr("dy", 4)
                    .attr("result", "offsetBlur");

                const feMerge = filter.append("feMerge");

                feMerge.append("feMergeNode")
                    .attr("in", "offsetBlur");

                feMerge.append("feMergeNode")
                    .attr("in", "SourceGraphic");

                d3.select(this).attr("filter", `url(#drop-shadow-${uniqueTypes.indexOf(d.data.label)})`);
            });

        function handleMouseOver(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("d", d3.arc().outerRadius(pieChartLayout.width / 4).innerRadius(Math.min(pieChartLayout.width, pieChartLayout.height) / 2 + 10 - pieChartLayout.margin)
                    .cornerRadius(6));

            d3.select(".tooltip")
                .style("display", "inline-block")
                .html(`<strong>${d.data.label}</strong>: ${((d.data.value / d3.sum(pieData, d => d.value)) * 100).toFixed(2)}%`)
                .style("left", (event.pageX + 30) + "px")
                .style("top", (event.pageY - 30) + "px");
        }

        function handleMouseOut() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("d", arc);

            d3.select(".tooltip").style("display", "none");
        }

    });
}