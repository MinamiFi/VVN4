import * as d3 from 'd3'
import * as topojson from 'topojson'
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

    //地图数据
    let geojson;

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


        //测试数据
        let Vdata;
        // let Vdata = [{ "type": "Point", "coordinates": [-77, 38] }, { "type": "Point", "coordinates": [116, 39] }]

        d3.json('./json/holoceneLatest(1).json').then(function (d) {
            drawVolcano(projection, pathGenerator, d);

        })
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
                d3.selectAll(".map-volcano")
                    .attr('fill', "#992020")
                d3.select(this)
                    .attr('fill', "#fff")


            })
    }

}