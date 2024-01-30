import * as d3 from 'd3'
import * as topojson from 'topojson'
{
    let width = document.getElementById('earth-container').offsetWidth,
        height = document.getElementById('earth-container').offsetHeight,
        scale = 310,
        origin = {
            // x: -105,
            // y: -55
            x: 0,
            y: 0
        };
    let world;
    let Vdata;

    // 选择body、div确定绘制地球位置和宽高
    let svg = d3.select('#earth-container').append('svg')
        .attr('width', width)
        .attr('height', height);

    let group = svg.append("g")
        .datum({ x: 0, y: 0 })
        .attr("id", "earth-g");

    //当作背景的白色圆形
    let backCirle = group.append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", width / 2)
        .attr('class', "earth-back");

    // 定义投影坐标系统
    let projection = d3.geoOrthographic()
        .scale(scale)
        .translate([width / 2, height / 2])
        .rotate([origin.x, origin.y])
        .center([0, 0])
        .clipAngle(90);

    // 生成地理投影路径
    let geoPath = d3.geoPath()
        .projection(projection);

    // 创建地球网格
    let graticule = d3.geoGraticule();

    // 地球缩放和拖拽
    svg.call(d3.zoom().on('zoom', zoomed));

    group.call(d3.drag().on('drag', dragged).on('end', dragEnd));

    // code snippet from http://stackoverflow.com/questions/36614251
    let lambda = d3.scaleLinear()
        .domain([-width, width])
        .range([-180, 180])

    let phi = d3.scaleLinear()
        .domain([-height, height])
        .range([90, -90]);
    // 给地球添加网格并定义样式
    group.append('path')
        .datum(graticule)
        .attr('class', 'graticule')
        .attr('d', geoPath);

    function dragged(event) {
        let r = {
            x: lambda((event.x)),
            y: phi((event.y))
        };
        // console.log(r);
        projection.rotate([origin.x + r.x, origin.y + r.y]);
        updatePaths(svg, graticule, world, geoPath);
        updateVolcano(svg, Vdata, projection, geoPath, 1);
    };

    function dragEnd(event) {
        let r = {
            x: lambda((event.x)),
            y: phi((event.y))
        };
        origin.x += r.x;
        origin.y += r.y;
    }

    // function zoomed(event) {
    //     let transform = event.transform;
    //     let k = Math.sqrt(100 / projection.scale());
    //     projection.scale(scale * transform.k)
    //     updatePaths(svg, graticule, world, geoPath);
    //     updateVolcano(svg, Vdata, projection, geoPath, scale);
    // };
    function zoomed(event) {
        let transform = event.transform;
        // console.log(transform)
        group.attr('transform', transform)
        // projection.scale(scale * transform.k)
        // updatePaths(group, geojson, pathGenerator);
    };


    function updatePaths(svg, graticule, world, geoPath) {
        // console.log(world)
        svg.selectAll('path.graticule').datum(graticule).attr('d', geoPath);
        svg.selectAll('path.countries').datum(world).attr('d', geoPath);
    };

    function updateVolcano(svg, Vdata, projection, geoPath, scale) {
        // console.log(Vdata)
        // console.log(Vdata)
        svg.selectAll('circle.map-volcano').data(Vdata)
            .attr('cx', d => projection(d.location.coordinates)[0])
            .attr('cy', d => projection(d.location.coordinates)[1]);
    }

    //测试数据
    // Vdata = [{ "type": "Point", "coordinates": [-77, 38] }, { "type": "Point", "coordinates": [116, 39] }]

    // 加载全球json数据，绘制陆地
    d3.json("./json/countries-110m.json").then(function (worldJSON) {
        world = topojson.feature(worldJSON, worldJSON.objects.countries);
        group.append("path")
            .datum(world)
            .attr("class", "countries")
            .attr("d", geoPath);

        d3.json("./json/holoceneLatest(1).json").then(d => {
            Vdata = d;
            drawVolcano(projection, geoPath, Vdata);
        })
    });

    let i = 0;

    function redraw() {
        let proj = projection.rotate([0.2 * i, 0, 0]),
            path = d3.geoPath().projection(projection)

        group.selectAll("path")
            .datum(world)
            .attr("class", "land")
            .attr("d", geoPath);

        group.select("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", geoPath);

        i++

        window.requestAnimationFrame(redraw)
    }
    // 调用地球重绘函数
    // window.requestAnimationFrame(redraw)

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
            .attr('fill', d => {
                // if (d.location.coordinates[0] > origin.x + 90
                //     || d.location.coordinates[0] < origin.x - 90
                //     || d.location.coordinates[1] > origin.y + 90
                //     || d.location.coordinates[1] > origin.y - 90) {
                //     console.log(d)
                //     return 'none'
                // }
                // console.log(2)
                return '#992020'
            })
            .on('click', function (d) {
                d3.selectAll(".map-volcano")
                    .attr('fill', d => {
                        // if (d.location.coordinates[0] > origin.x + 90
                        //     || d.location.coordinates[0] < origin.x - 90
                        //     || d.location.coordinates[1] > origin.y + 90
                        //     || d.location.coordinates[1] > origin.y - 90) {
                        //     console.log(1)
                        //     return 'none'
                        // }
                        // console.log(2)
                        return '#992020'
                    })
                d3.select(this)
                    .attr('fill', "#fff")

            })
    }
}