<!-- populationDistribution -->
<template>
    <div id="population">

    </div>
</template>
  
<script>

import * as d3 from 'd3'
export default {
    data() {
        return {
            getVolcano: { 1: 1 }
        }
    },
    methods: {
        updatePopulation(p) {
            let populationData = p.map(x => (x == 0 ? 1 : x))
            // 距离范围
            var distanceRanges = ["5km", "10km", "30km", "100km"];

            // let width = 1200;
            let width = document.getElementById("population").offsetWidth;
            // let height = 800;
            let height = document.getElementById("population").offsetHeight;
            let margin = 50;

            //svg
            var svg = d3
                .select('#pop-svg')

            // 使用对数比例尺
            var xScale = d3.scalePoint()
                .domain(distanceRanges)
                .range([margin, width - margin])
                .padding(0.5); // 调整 padding 值以控制刻度之间的间隔

            var yScale = d3.scaleLog()
                .domain([1, d3.max(populationData)])
                .range([height - margin, margin]);

            // 创建区域图
            var area = d3.area()
                .x(function (d, i) { return xScale(distanceRanges[i]) + xScale.bandwidth() / 2; })
                .y0(height - margin)
                .y1(function (d) { return yScale(d); });

            // 绘制区域图
            svg.selectAll("path.population-path")
                .datum(populationData)
                .transition()
                .duration(1000)  // 过渡的持续时间，单位毫秒
                .attr("d", area);

            // 添加折线
            var line = d3.line()
                .x(function (d, i) { return xScale(distanceRanges[i]) + xScale.bandwidth() / 2; })
                .y(function (d) { return yScale(d); });

            svg.selectAll('path.population-path2')
                .datum(populationData)
                .transition()
                .duration(1000)  // 过渡的持续时间，单位毫秒
                .attr("d", line);

            // 添加 X 轴
            svg.select("g#x-axis")
                .transition()
                .duration(1000)  // 过渡的持续时间，单位毫秒
                .attr("transform", `translate(0, ${height - margin})`)
                .call(d3.axisBottom(xScale));
            // 添加 Y 轴
            svg.select("g#y-axis")
                .transition()
                .duration(1000)  // 过渡的持续时间，单位毫秒
                .attr("transform", `translate(${margin}, 0)`)
                .call(d3.axisLeft(yScale).ticks(5, "~s"));

            // 数据点
            svg.selectAll("circle.population-circle")
                .data(populationData)
                .transition()
                .duration(1000)  // 过渡的持续时间，单位毫秒
                .attr("cx", function (d, i) { return xScale(distanceRanges[i]) + xScale.bandwidth() / 2; })
                .attr("cy", function (d) { return yScale(d); })
                .attr("r", 5); // 圆形半径

            // 添加数据点的连接线
            svg.selectAll(".connect-line") // 改为 .connect-line
                .data(populationData)
                .transition()
                .duration(1000)  // 过渡的持续时间，单位毫秒
                .attr("x1", function (d, i) { return xScale(distanceRanges[i]) + xScale.bandwidth() / 2; })
                .attr("y1", height - margin)
                .attr("x2", function (d, i) { return xScale(distanceRanges[i]) + xScale.bandwidth() / 2; })
                .attr("y2", function (d) { /*console.log(typeof (d));*/ return yScale(d); });

            // 添加数据点的数字标签
            svg.selectAll("text.label")
                .data(populationData)
                .transition()
                .duration(1000)  // 过渡的持续时间，单位毫秒
                .attr("x", function (d, i) { return xScale(distanceRanges[i]) + xScale.bandwidth() / 2; })
                .attr("y", function (d) { return yScale(d) - 10; })
                .text(function (d) { return d != 1 ? d3.format(",")(d) : 0; }) // 使用逗号分隔的整数格式
                .attr("text-anchor", "middle")
                .style("font-size", ".8vw")
                .style("fill", "#666");
        }
    },
    props: ["getData"],
    mounted() {
        const _this = this;
        var populationData = [];
        for (let i = 0; i < 4; i++) {
            if (_this.getData[i] == 0)
                populationData.push(1)
            else
                populationData.push(_this.getData[i])
        }

        // console.log(populationData);
        // 距离范围
        var distanceRanges = ["5km", "10km", "30km", "100km"];

        // let width = 1200;
        let width = document.getElementById("population").offsetWidth;
        // let height = 800;
        let height = document.getElementById("population").offsetHeight;
        let margin = 50;

        // 创建 SVG 容器
        var svg = d3.select("#population")
            .append("svg")
            .attr("width", width) // 增加宽度
            .attr("height", height) // 增加高度
            .append("g")
            .attr('id', 'pop-svg')
        // .attr("transform", `translate(${width / 2},${height / 2})`); // 调整整体位置

        // 使用对数比例尺
        var xScale = d3.scalePoint()
            .domain(distanceRanges)
            .range([margin, width - margin])
            .padding(0.5); // 调整 padding 值以控制刻度之间的间隔

        var yScale = d3.scaleLog()
            .domain([1, d3.max(populationData)])
            .range([height - margin, margin]);

        // 创建渐变色
        var gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        gradient.append("stop")
            .attr("offset", "20%")
            .style("stop-color", "darkblue") // 修正这里的写法
            .style("stop-opacity", 0.7);

        gradient.append("stop")
            .attr("offset", "40%")
            .style("stop-color", "#4682B4")
            .style("stop-opacity", 0.4);

        gradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", "white")
            .style("stop-opacity", 0);

        // 创建区域图
        var area = d3.area()
            .x(function (d, i) { return xScale(distanceRanges[i]) + xScale.bandwidth() / 2; })
            .y0(height - margin)
            .y1(function (d) { return yScale(d); });

        // 绘制区域图
        svg.append("path")
            .datum(populationData)
            .attr("class", d => {
                return "population-path"
            })
            .attr("d", area);

        // 添加折线
        var line = d3.line()
            .x(function (d, i) { return xScale(distanceRanges[i]) + xScale.bandwidth() / 2; })
            .y(function (d) { return yScale(d); });

        svg.append("path")
            .datum(populationData)
            .attr("class", "line population-path2")
            .attr("d", line);

        // 添加 X 轴
        svg.append("g")
            .attr("class", "axis")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - margin})`)
            .call(d3.axisBottom(xScale));
        // 添加 Y 轴
        svg.append("g")
            .attr("class", "axis")
            .attr("id", "y-axis")
            .attr("transform", `translate(${margin}, 0)`)
            .call(d3.axisLeft(yScale).ticks(5, "~s"));

        // 添加 Y 轴标签
        svg.append("text")
            // .attr("transform", "rotate(-90)")
            .attr("x", margin / 3 * 2) // 调整位置
            .attr("y", margin / 3 * 2) // 调整位置
            .style("font-size", "1vw")
            .style("font-family", "semibold")
            .text("Population");

        // 添加数据点
        svg.selectAll("circle")
            .data(populationData)
            .enter().append("circle")
            .attr('class', 'population-circle')
            .attr("cx", function (d, i) { return xScale(distanceRanges[i]) + xScale.bandwidth() / 2; })
            .attr("cy", function (d) { return yScale(d); })
            .attr("r", 5); // 圆形半径

        // 添加数据点的连接线
        svg.selectAll(".connect-line") // 改为 .connect-line
            .data(populationData)
            .enter().append("line")
            .attr('class', 'connect-line')
            .attr("x1", function (d, i) { return xScale(distanceRanges[i]) + xScale.bandwidth() / 2; })
            .attr("y1", height - margin)
            .attr("x2", function (d, i) { return xScale(distanceRanges[i]) + xScale.bandwidth() / 2; })
            .attr("y2", function (d) { /*console.log(typeof (d));*/ return yScale(d); })
            .style("stroke", "#666");

        // 添加数据点的数字标签
        svg.selectAll("text.label")
            .data(populationData)
            .enter().append("text")
            .attr("class", "label")
            .attr("x", function (d, i) { return xScale(distanceRanges[i]) + xScale.bandwidth() / 2; })
            .attr("y", function (d) { return yScale(d) - 10; })
            .text(function (d) { return d != 1 ? d3.format(",")(d) : 0; }) // 使用逗号分隔的整数格式
            .attr("text-anchor", "middle")
            .style("font-size", ".8vw")
            .style("fill", "#666");

        // 添加标题
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - margin / 5) // 调整位置
            .attr("text-anchor", "middle")
            .style("font-size", ".9vw")
            .text("Distance from the volcano");

        // });
    },
    watch: {
        "getData"(val) {
            // console.log(val)
            // 获取特定火山的人口数据
            // var populationData = val.population;
            // console.log(populationData)
            this.updatePopulation(val)
        },
        deep: true,
        immediate: true
    }
}
</script>
  
<style  scoped>
#population {
    height: 45vh;
}
</style>
<style>
/* 添加样式，如图表的初始宽度、高度等 */
#population svg {
    transition: all 0.3s ease;
}

#population svg g path {
    fill: url(#gradient);
    /*stroke: rgb(154, 15, 15);*/
    stroke-width: 2;
    stroke-opacity: 1;
    /* 添加描边的透明度 */
    stroke-linejoin: round;
    /* 圆角连接线 */
}

#population svg g path.line {
    fill: none;
    stroke: #000000;
    stroke-width: 2;
}

/* 只显示图表上方的描边 */
#population svg g path.upper-stroke {
    fill: none;
}

#population svg g circle {
    fill: rgb(0, 0, 0);
    stroke: #fff;
    stroke-width: 2;
}

#population svg g text {
    fill: #000000;
}

#population svg g .axis path,
#population svg g .axis line {
    fill: none;
    stroke: #000000;
    shape-rendering: crispEdges;
}

#population svg g .axis text {
    font-size: .8vw;
    fill: #000000;
}
</style>