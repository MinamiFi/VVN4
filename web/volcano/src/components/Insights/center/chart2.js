import * as d3 from 'd3';

{// 数据加载和柱形图创建的代码块
    d3.json('./json/holoceneLatest(1).json').then(data => {
        // console.log(data);
        // 根据国家对火山数量进行分类
        const volcanoesByCountry = {};
        data.forEach(volcano => {
            const country = volcano.country;
            if (!volcanoesByCountry[country]) {
                volcanoesByCountry[country] = [];
            }
            volcanoesByCountry[country].push({
                "height": volcano.elevation,
                "name": volcano.name,
                "id": volcano.id,
                "primaryType": volcano.primaryType,
                "country": volcano.country
            });
        });

        // 创建下拉菜单的选项
        const select = d3.select("#countrySelect");
        Object.keys(volcanoesByCountry).forEach(country => {
            select.append("option").text(country).attr("value", country);
        });

        // 初始时选择第一个国家的数据集
        let selectedCountry = Object.keys(volcanoesByCountry)[0];
        let dataset = volcanoesByCountry[selectedCountry];

        // 以下是柱形图创建的代码
        // let width = 1200;
        let width = document.getElementById("chart2-container").offsetWidth;
        // let height = 800;
        let height = document.getElementById("chart2-container").offsetHeight;
        let margin = 50;

        let svg = d3.select('#chart2-container')
            .append('svg')
            .attr('style', 'width: ' + width + 'px; height: ' + height + 'px; background:white');

        // 创建y轴比例尺
        let yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.height)])
            .range([height - margin, margin]);

        // 创建x轴比例尺
        let xScale = d3.scaleBand()
            .domain(dataset.map(d => d.id))
            .range([margin, width - margin])
            .padding(0.1);

        // 添加x轴
        let xAxis = svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0, ' + (height - margin) + ')')
            .call(d3.axisBottom(xScale).tickValues([]));

        // 添加y轴
        svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', 'translate(' + margin + ',0)')
            .call(d3.axisLeft(yScale));

        // 添加y轴标签在顶部
        svg.append('text')
            .attr('y', margin / 2)
            .attr('x', 60)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Elevation');

        // 创建颜色映射
        let colorScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.height)])
            .range(["orange", "red"]);

        let colorScaleMinus = d3.scaleLinear()
            .domain([d3.min(dataset, d => d.height), 0])
            .range(["#228", "#fff"]);

        // 根据用户选择更新图表
        select.on("change", function () {
            // 移除之前的矩形元素
            svg.selectAll(".volcano-rect1").remove();

            selectedCountry = this.value;
            dataset = volcanoesByCountry[selectedCountry];

            // 更新 y 轴的域和添加过渡效果
            yScale.domain([0, d3.max(dataset, d => d.height)]);
            svg.select('.y-axis')
                .transition()
                .duration(500)
                .call(d3.axisLeft(yScale));

            // 更新 x 轴的域和文本，添加过渡效果
            xScale.domain(dataset.map(d => d.id));
            xAxis.transition().duration(500).call(d3.axisBottom(xScale).tickValues([]));

            // 创建柱形图并添加过渡效果
            svg.selectAll('.volcano-rect1')
                .data(dataset)
                .enter()
                .append('rect')
                .attr('x', d => xScale(d.id))
                .attr('y', height - margin)  // 初始时设置在 x 轴下方
                .attr('width', xScale.bandwidth())
                .attr('height', 0)  // 初始时高度为0
                .attr('fill', d => d.height > 0 ? colorScale(d.height) : colorScaleMinus(d.height))
                .attr('class', "volcano-rect1")
                // .attr('id', d => "volcano-rect" + d.id)
                .on('click', function (d) {
                    // 恢复所有矩形的填充为颜色映射
                    d3.selectAll('.volcano-rect1')
                        .attr('fill', d => d.height > 0 ? colorScale(d.height) : colorScaleMinus(d.height));

                    // 将当前点击的矩形的填充设置为黑色，并添加过渡效果
                    d3.select(this)
                        // .transition()
                        // .duration(50)
                        .attr('fill', 'black');
                })
                .transition()
                .duration(500)
                // .attr('y', d => Math.max(yScale(d.height), margin))
                .attr('y', d => d.height > 0 ? yScale(d.height) : yScale(0))
                .attr('height', d => Math.abs(yScale(d.height) - yScale(0)));

        });

        // 初始化时绘制柱形图
        drawBarChart();

        function drawBarChart() {
            svg.selectAll('.volcano-rect1')
                .data(dataset)
                .enter()
                .append('rect')
                .attr('x', d => xScale(d.id))
                .attr('y', d => d.height > 0 ? yScale(d.height) : yScale(0))
                .attr('width', xScale.bandwidth())
                .attr('height', d => Math.abs(yScale(d.height) - yScale(0)))
                .attr('fill', d => d.height > 0 ? colorScale(d.height) : colorScaleMinus(d.height))
                .attr('class', "volcano-rect1")
                // .attr('id', d => "volcano-rect" + d.id)
                .on('click', function (d) {
                    // 恢复所有矩形的填充为颜色映射
                    d3.selectAll('.volcano-rect1')
                        .attr('fill', d => d.height > 0 ? colorScale(d.height) : colorScaleMinus(d.height));

                    // 将当前点击的矩形的填充设置为黑色，并添加过渡效果
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('fill', 'black');

                    // 更新 x 轴文本内容为当前点击的数据的名称，并添加过渡效果
                    svg.selectAll('.x-axis text')
                        .transition()
                        .duration(10)
                        .text(d.id)
                        .style('opacity', 1);
                });
        }
    });
}