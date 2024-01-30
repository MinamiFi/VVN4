<!-- map -->
<template>
    <div id="map-container">
        <div class="tooltip">
            <div class='close-btn' @click="closeTooltip"></div>
            <div class="tooltip-left">
                <div class="first">Volcano Number: </div>
                <div>Volcano Name: </div>
                <div>Primary Volcano Type: </div>
                <div>Location: </div>
                <div class="last">Country: </div>
            </div>
            <div class="tooltip-right-container">
                <div class="tooltip-right">
                    <div class="number"></div>
                    <div class="name"></div>
                    <div class="volcanoType"></div>
                    <div class="location"></div>
                    <div class="country"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3'
import * as topojson from 'topojson'
export default {
    data() {
        return {
            getVolcanoData: []
        }
    },
    props: ["volcanoData"],
    methods: {
        closeTooltip() {
            //弹窗小卡片
            let tooltip = d3.select(".tooltip")
                .style("opacity", 0.0);
            d3.selectAll(".map-volcano")
                .attr('fill', "#992020")
            // console.log("TOOLTIPCLOSE")
        },
        remakeMap() {
            const _this = this
            //设定svg的属性
            const svgWidth = document.getElementById('map-container').offsetWidth;
            const svgHeight = document.getElementById('map-container').offsetHeight;
            const svg = d3.select("svg")

            //弹窗小卡片
            let tooltip = d3.select(".tooltip")
                .style("opacity", 0.0);


            //数据
            let geojson;
            let Vdata = _this.getVolcanoData;

            let group = svg.select("#map-g")

            const scale = 130;
            // 定义投影坐标系统
            function proj(geojson) {
                const padding = 120;
                const x0 = 0;
                const y0 = 0;
                const x1 = svgWidth;
                const y1 = svgHeight + 2 * padding;
                const projection = d3.geoMercator()
                    .fitExtent(
                        [
                            [x0, y0],
                            [x1, y1],
                        ], geojson)
                    .scale(scale)
                return projection
            }
            let projection;
            // 生成地理投影路径
            let pathGenerator;

            // 地球缩放和拖拽
            svg.call(d3.zoom().on('zoom', zoomed));

            function zoomed(event) {
                let transform = event.transform;
                group.attr('transform', transform)
            };

            let mapPath;
            d3.json('./json/countries-110m.json').then(worldJSON => {
                // 将topo数据转化为geojson
                geojson = topojson.feature(worldJSON, worldJSON.objects.countries);
                // 投影
                projection = proj(geojson)

                // 生成地理投影路径
                pathGenerator = d3.geoPath()
                    .projection(projection);

                // 绘制
                // mapPath = group.selectAll('.countries')
                //     .data(geojson.features) //数据绑定
                //     .join("path")
                //     .attr("d", pathGenerator) //绘制path
                //     .attr("class", 'countries');

                drawVolcano(projection, pathGenerator, Vdata);
            })

            function updatePaths(group, geojson, geoPath) {
                group.selectAll('path.countries').datum(geojson).attr('d', geoPath);
            };

            //画火山
            function drawVolcano(projection, pathGenerator, Vdata) {
                let volcanos = group.selectAll('.map-volcano')
                    .data(Vdata)
                    .attr('cx', d => projection(d.location.coordinates)[0])
                    .attr('cy', d => projection(d.location.coordinates)[1])
                    .attr('r', 1)
                    .attr("class", "map-volcano")
                    .attr('fill', '#992020')
                    .on('click', function (d) {
                        // console.log(event)
                        d3.selectAll(".map-volcano")
                            .attr('fill', "#992020");
                        d3.select(this)
                            .attr('fill', data => {
                                tooltip
                                    .style("left", (event.pageX + 50) + "px")
                                    .style("top", (event.pageY - 100) + "px")
                                    .style("opacity", 1.0);
                                // tooltip.select('.tooltip-left')
                                // .style("background-image", d => `url('./image/${data.id}.png')`)
                                tooltip.select('.number')
                                    .text(data.id);
                                tooltip.select('.name')
                                    .text(data.name);
                                tooltip.select('.volcanoType')
                                    .text(data.primaryType);
                                tooltip.select('.location')
                                    .text(`${data.latitude}°${data.isNorth ? 'N' : "S"} ${data.longitude}°${data.isEast ? 'E' : "W"} `);
                                tooltip.select('.country')
                                    .text(data.country);

                                return "#bababa"
                            });
                    });

                let volcanos_enter = group.selectAll('.map-volcano')
                    .data(Vdata)
                    .enter()
                    .append("circle")
                    .attr('cx', d => projection(d.location.coordinates)[0])
                    .attr('cy', d => projection(d.location.coordinates)[1])
                    .attr('r', 1)
                    .attr("class", "map-volcano")
                    .attr('fill', '#992020')
                    .on('click', function (d) {
                        // console.log(event)
                        d3.selectAll(".map-volcano")
                            .attr('fill', "#992020");
                        d3.select(this)
                            .attr('fill', data => {
                                tooltip
                                    .style("left", (event.pageX + 50) + "px")
                                    .style("top", (event.pageY - 100) + "px")
                                    .style("opacity", 1.0);
                                // tooltip.select('.tooltip-left')
                                // .style("background-image", d => `url('./image/${data.id}.png')`)
                                tooltip.select('.number')
                                    .text(data.id);
                                tooltip.select('.name')
                                    .text(data.name);
                                tooltip.select('.volcanoType')
                                    .text(data.primaryType);
                                tooltip.select('.location')
                                    .text(`${data.latitude}°${data.isNorth ? 'N' : "S"} ${data.longitude}°${data.isEast ? 'E' : "W"} `);
                                tooltip.select('.country')
                                    .text(data.country);

                                return "#bababa"
                            });
                    });
                let volcanos_exit = group.selectAll('.map-volcano')
                    .data(Vdata)
                    .exit()
                    .remove();

            }
        }
    },
    mounted() {
        const _this = this
        // setTimeout(() => require('./map'), 200)
        setTimeout(() => console.log('map OK'), 200)
        // console.log(_this.volcanoData)
        _this.getVolcanoData = _this.volcanoData
        {
            //设定svg的属性
            const svgWidth = document.getElementById('map-container').offsetWidth;
            const svgHeight = document.getElementById('map-container').offsetHeight;
            const svg = d3.select("#map-container")
                .append('svg')
                .attr("height", svgHeight)
                .attr("width", svgWidth)
                // .style("border", "1px black solid")
                .attr('viewBox', [svgWidth / 8, 0, svgWidth / 4 * 3, svgHeight])
                .attr('preserveAspectRatio', 'none');

            //弹窗小卡片
            let tooltip = d3.select(".tooltip")
                .style("opacity", 0.0);

            //地图数据
            let geojson;

            let Vdata = _this.getVolcanoData;
            // console.log(Vdata)
            let group = svg.append("g")
                .datum({ x: 0, y: 0 })
                .attr("id", "map-g");

            let Vgroup = svg.append("g")
                .datum({ x: 0, y: 0 })
                .attr("id", "map-volcano-g")

            const scale = 130;
            // 定义投影坐标系统
            function proj(geojson) {
                const padding = 120;
                const x0 = 0;
                const y0 = 0;
                const x1 = svgWidth;
                const y1 = svgHeight + 2 * padding;
                const projection = d3.geoMercator()
                    .fitExtent(
                        [
                            [x0, y0],
                            [x1, y1],
                        ], geojson)
                    .scale(scale)
                return projection
            }
            let projection;
            // 生成地理投影路径
            let pathGenerator;

            // 地球缩放和拖拽
            svg.call(d3.zoom().on('zoom', zoomed));

            function zoomed(event) {
                let transform = event.transform;
                // console.log(transform)
                group.attr('transform', transform)
                // projection.scale(scale * transform.k)
                // updatePaths(group, geojson, pathGenerator);
            };

            let mapPath;
            d3.json('./json/countries-110m.json').then(worldJSON => {
                // console.log(worldJSON)
                // 将topo数据转化为geojson
                geojson = topojson.feature(worldJSON, worldJSON.objects.countries);
                // console.log(geojson)
                // 投影
                projection = proj(geojson)

                // 生成地理投影路径
                pathGenerator = d3.geoPath()
                    .projection(projection);

                // console.log(geojson)

                // 绘制
                mapPath = group.selectAll('.countries')
                    .data(geojson.features) //数据绑定
                    .join("path")
                    .attr("d", pathGenerator) //绘制path
                    .attr("class", 'countries');

                drawVolcano(projection, pathGenerator, Vdata);
            })

            function updatePaths(group, geojson, geoPath) {
                group.selectAll('path.countries').datum(geojson).attr('d', geoPath);
            };

            //画火山
            function drawVolcano(projection, pathGenerator, Vdata) {
                // let volcanos = group.selectAll('.map-volcano')
                //     .data(Vdata)
                //     .enter()
                //     .append("path")
                //     .attr('d', pathGenerator)
                //     .attr("class", "map-volcano")
                //     .style("transform", "scale(1)")
                let volcanos = group.selectAll('.map-volcano')
                    .data(Vdata)
                    .enter()
                    .append("circle")
                    .attr('cx', d => projection(d.location.coordinates)[0])
                    .attr('cy', d => projection(d.location.coordinates)[1])
                    .attr('r', 1)
                    .attr("class", "map-volcano")
                    .attr('fill', '#992020')
                    .on('click', function (d) {
                        // console.log(event)
                        d3.selectAll(".map-volcano")
                            .attr('fill', "#992020");
                        d3.select(this)
                            .attr('fill', data => {
                                tooltip
                                    .style("left", (event.pageX + 50) + "px")
                                    .style("top", (event.pageY - 100) + "px")
                                    .style("opacity", 1.0);
                                // tooltip.select('.tooltip-left')
                                // .style("background-image", d => `url('./image/${data.id}.png')`)
                                tooltip.select('.number')
                                    .text(data.id);
                                tooltip.select('.name')
                                    .text(data.name);
                                tooltip.select('.volcanoType')
                                    .text(data.primaryType);
                                tooltip.select('.location')
                                    .text(`${data.latitude}°${data.isNorth ? 'N' : "S"} ${data.longitude}°${data.isEast ? 'E' : "W"} `);
                                tooltip.select('.country')
                                    .text(data.country);

                                return "#bababa"
                            });
                    });
            }

        }
    },
    watch: {
        'volcanoData'(val) {
            this.getVolcanoData = val
            // console.log(val)
            this.remakeMap(val)
        },
        deep: true,
        immediate: true
    }

}
</script>

<style>
#map-container {
    /* background-color: rgba(255, 255, 255, 0.5); */
    height: calc(67vh - 1px);
    margin-top: 1px;
}

#map-g .countries {
    fill: #717171;
    stroke: #000;
    stroke-width: .5;
}

.map-volcano {
    stroke-width: .2;
    stroke: #fff;
}

/* 弹窗小卡片 */
#map-container .tooltip {
    position: absolute;
    padding: 5px;
    width: 19.2vw;
    height: 16vh;
    font-family: regular;
    color: black;
    background-color: rgb(255, 255, 255);
    border-radius: .6vw;
    /* box-shadow: 0 0 2px 2px#fff; */
    display: flex;
    justify-content: start;
    z-index: 2;
    overflow: hidden;
}

#map-container .tooltip .tooltip-left {
    position: relative;
    left: -0.8vw;
    top: -0.8vw;
    width: 10vw;
    height: calc(16vh + 1.6vw);
    flex-direction: column;
    justify-content: space-around;
    background-image: url('@/assets/back.webp');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #fff;
    font-size: .6vw;
}

#map-container .tooltip .tooltip-left div {
    height: 3vh;
    line-height: 3vh;
    text-indent: 1.2vw;
}

#map-container .tooltip .tooltip-left .first {
    margin-top: calc(0.8vw + 0.5vh);
}

#map-container .tooltip .tooltip-left .last {
    margin-bottom: calc(0.8vw +0.5vh);
}

#map-container .tooltip .tooltip-right-container {
    height: 18vh;
    width: 10vw;
    position: relative;
    top: -1vh;
    bottom: -1vh;
    left: -0.8vw;
    box-shadow: -.8vw 0 0.8vw 1px #000000;
}

#map-container .tooltip .tooltip-right-container .tooltip-right {
    width: 9.5vw;
    height: 14vh;
    margin-top: 2vh;
    border: #000 solid 1px;
    flex-direction: column;
    justify-content: space-between;
}

#map-container .tooltip .tooltip-right-container .tooltip-right div {
    height: 2.8vh;
    line-height: 2.8vh;
    text-indent: 1vw;
    font-family: medium;
    font-size: .7vw;
    text-wrap: nowrap;
    overflow: hidden;
}

.close-btn {
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;
    cursor: pointer;
    border-top: 1.5vw solid #992020;
    border-right: 1.5vw solid #992020;
    border-left: 1.5vw solid transparent;
    border-bottom: 1.5vw solid transparent;
    /* border-top-right-radius: .5vw; */
}

.close-btn::after {
    content: "×";
    position: absolute;
    top: -1.5vw;
    right: -1vw;
    color: #fff;
    font-size: 1vw;
    font-family: semibold;
}
</style>
