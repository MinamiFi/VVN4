import * as d3 from 'd3';
{
    d3.json('./json/holoceneLatest(1).json').then(data => {
        // console.log(data);

        // 数据处理
        let typeCounts = d3.rollup(data, v => v.length, d => d.primaryType);

        // let width = 1600;
        let width = document.getElementById("chart3-container").offsetWidth;
        // let height = 1200;
        let height = document.getElementById("chart3-container").offsetHeight;

        let uniqueTypes = Array.from(typeCounts.keys());
        let maxCount = d3.max(Array.from(typeCounts.values()));

        // 使用更符合火山主题的颜色方案
        let colorScale = d3.scaleOrdinal()
            .domain(uniqueTypes)
            .range(d3.quantize(d3.interpolateYlOrRd, uniqueTypes.length));

        let svg = d3.select('#chart3-container')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', 'white');

        // 添加阴影和模糊效果
        let defs = svg.append('defs');

        let filter = defs.append('filter')
            .attr('id', 'shadow-filter')
            .append('feDropShadow')
            .attr('dx', '0')
            .attr('dy', '0')
            .attr('stdDeviation', '5')
            .attr('flood-color', 'white');

        filter.append('feComponentTransfer')
            .append('feFuncA')
            .attr('type', 'linear')
            .attr('slope', '0.2');

        filter.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 10)
            .attr('result', 'blur');

        filter.append('feOffset')
            .attr('in', 'blur')
            .attr('dx', 6)
            .attr('dy', 6)
            .attr('result', 'offsetBlur');

        let feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode')
            .attr('in', 'offsetBlur');
        feMerge.append('feMergeNode')
            .attr('in', 'SourceGraphic');

        // 添加径向渐变
        let radialGradient = defs.selectAll('.radial-gradient')
            .data(uniqueTypes)
            .enter().append('radialGradient')
            .attr('id', (d, i) => `radial-gradient-${i}`)
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '60%')
            .selectAll('stop')
            .data([
                { offset: '8%', color: 'red' },
                { offset: '100%', color: 'white' }
            ])
            .enter().append('stop')
            .attr('offset', d => d.offset)
            .attr('stop-color', d => d.color);

        let customColorScale = d3.scaleSequential()
            .domain([0, uniqueTypes.length])
            .interpolator(d3.interpolateYlOrRd);

        let nodes = uniqueTypes.map((type, i) => ({
            id: i,
            type,
            count: typeCounts.get(type),
            radius: d3.scaleSqrt().domain([0, maxCount]).range([5, 30])(typeCounts.get(type)) * 6,
            x: Math.random() * width,
            y: Math.random() * height
        }));

        let links = generateLinks(nodes);  // 生成初始连线数据

        let simulation = d3.forceSimulation(nodes)
            .force('x', d3.forceX().strength(0.1).x(d => width / 2))
            .force('y', d3.forceY().strength(0.1).y(d => height / 2))
            .force('collide', d3.forceCollide().radius(d => d.radius + 2).strength(0.2))
            .force('link', d3.forceLink(links).distance(50).strength(1))
            .on('tick', ticked);

        // 添加拖拽行为
        let drag = d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded);

        function ticked() {
            // 更新节点
            let bubbles = svg.selectAll('.type-bubble')
                .data(nodes, d => d.id);

            bubbles.enter()
                .append('circle')
                .attr('class', 'type-bubble')
                .attr('r', d => d.radius)
                .style('fill', (d, i) => `url(#radial-gradient-${i})`)
                .style('filter', 'url(#shadow-filter)')
                .call(drag)
                .on('click', function (d) {
                    console.log('点击了火山类型：', d.type);
                })
                .merge(bubbles)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            // 更新标签
            let labels = svg.selectAll('.type-label')
                .data(nodes, d => d.id);

            labels.enter()
                .append('text')
                .attr('class', 'type-label')
                .text(d => `${d.type} (${d.count})`)
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .attr('font-size', d => d.radius > 100 ? '.6vw' : '.4vw')
                .attr("font-family", "semibold")
                .merge(labels)
                .attr('x', d => d.x)
                .attr('y', d => d.y);
            // 更新连线
            let linkLines = svg.selectAll('.type-link')
                .data(links.filter(d => d.target.count > 1));

            linkLines.enter()
                .append('line')
                .attr('class', 'type-link')
                .style('stroke', 'gray')
                .style('stroke-opacity', 0.5)
                .style('stroke-width', 20)  // 你可以调整连线的宽度
                .merge(linkLines)
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);



        }

        function generateLinks(nodes) {
            const links = [];
            for (let i = 0; i < nodes.length - 1; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    if (nodes[i].type === nodes[j].type) {
                        links.push({ source: nodes[i], target: nodes[j] });
                    }
                }
            }
            return links;
        }

        function dragStarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragEnded(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    });
}