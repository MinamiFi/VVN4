<!-- insight_center -->
<template>
  <div id="insights-center">
    <div class="insights-center-row">
      <div id="chart1-container">
        <div id="button-container">

        </div>
      </div>
    </div>

    <div class="insights-center-row" id="insights-center-row2">
      <div class="insights-center-left" id="chart2-container">
        <select id="countrySelect"></select>
      </div>
      <div class="insights-center-mid">
        <div class="top" id="pie-chart">
          <div class="tooltip"></div>

        </div>
      </div>
      <div class="insights-center-right" id="chart3-container">

      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  data() {
    return {
      // isShow: false
    }
  },
  mounted() {
    // this.isShow = true
    // setTimeout(() => require('./chart1'), 200)
    {
      d3.json('./json/holoceneLatest(1).json').then(data => {
        // console.log(data);
        let originalOrder = [...data];  // 保存原始数据顺序

        let dataset = data.map(x => {
          return {
            "height": x.elevation,
            "name": x.name,
            "id": x.id,
            "primaryType": x.primaryType,
            "country": x.country,
            "eruption": x.eruption,
            "volcanoType": x.volcanoType,
            "coordinates": x.coordinates
          };
        });
        // console.log(dataset);

        let sortedDataset = [...dataset];  // 保存排序后的数据顺序

        // let width = 1200;
        let width = document.getElementById("chart1-container").offsetWidth;
        // let height = 800;
        let height = document.getElementById("chart1-container").offsetHeight;
        let margin = 40;
        let rectWidth = (width - 2 * margin) / dataset.length;

        let svg = d3.select('#chart1-container')  // 选择 #chart1-container 元素
          .append('svg')             // 创建一个新的 svg 元素
          .attr('style', `width: ${width}; height:${height};`);

        // 定义线性渐变
        let gradient = svg.append("defs")
          .append("linearGradient")
          .attr("id", "bar-gradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "100%");

        let gradientMinus = svg.append("defs")
          .append("linearGradient")
          .attr("id", "barMinus-gradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "100%");

        // 添加渐变色段
        gradient.append("stop")
          .attr("offset", "4%")
          .attr("style", "stop-color: black; stop-opacity: 0");

        gradient.append("stop")
          .attr("offset", "30%")
          .attr("style", "stop-color: purple; stop-opacity: 1");

        gradient.append("stop")
          .attr("offset", "50%")
          .attr("style", "stop-color: red; stop-opacity: 0.8");

        gradient.append("stop")
          .attr("offset", "80%")
          .attr("style", "stop-color: orange; stop-opacity: 0.8");

        gradient.append("stop")
          .attr("offset", "100%")
          .attr("style", "stop-color: white; stop-opacity: 1");
        // 海底火山添加渐变色段
        gradientMinus.append("stop")
          .attr("offset", "4%")
          .attr("style", "stop-color: white; stop-opacity: 1");

        gradientMinus.append("stop")
          .attr("offset", "30%")
          .attr("style", "stop-color: orange; stop-opacity: 0.8");

        gradientMinus.append("stop")
          .attr("offset", "50%")
          .attr("style", "stop-color: red; stop-opacity: 0.8");

        gradientMinus.append("stop")
          .attr("offset", "80%")
          .attr("style", "stop-color: purple; stop-opacity: 1");

        gradientMinus.append("stop")
          .attr("offset", "100%")
          .attr("style", "stop-color: black; stop-opacity: 0");


        let yScale = d3.scaleLinear()
          .domain([d3.max(dataset, d => d.height), -d3.max(dataset, d => d.height)])
          .range([margin, height - margin]);

        let xScale = d3.scaleBand()
          .domain(d3.map(dataset, d => d.id))
          .range([margin, width - margin]);

        // 添加x轴
        let xAxis = svg.append('g')
          .attr('class', 'x-axis')
          .attr('transform', 'translate(0, ' + (height / 2) + ')')
          .call(d3.axisBottom(xScale).tickValues([]));

        // 设置x轴文本初始时不可见
        xAxis.selectAll('text')
          .style('opacity', 0);

        // 添加y轴
        svg.append('g')
          .attr('transform', 'translate(' + margin + ',0)')
          .call(d3.axisLeft(yScale));

        // 添加y轴标签在顶部
        svg.append('text')
          .attr('y', margin / 3)
          .attr('x', 60)
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .text('Elevation');

        // 添加表的名称在顶部
        svg.append('text')
          .attr('y', height - margin - 5)
          .attr('x', width / 2)
          .attr('dy', '1em')
          .style("font-size", '1.3vw')
          .style("font-family", 'semibold')
          .style('text-anchor', 'middle')
          .text('Statistical demonstration of the elevation of Quaternary Holocene volcanoes');

        // 添加x轴标签
        // svg.append('text')
        //     .attr('transform', 'translate(' + (width / 2) + ' ,' + (height - margin + 40) + ')')
        //     .style('text-anchor', 'middle')
        //     .text('Volcano ID');

        // 创建柱形图
        let bars = svg.selectAll('rect')
          .data(dataset)
          .enter()
          .append('rect')
          .attr('x', d => xScale(d.id))
          .attr('y', d => d.height > 0 ? (yScale(d.height)) : height / 2)
          .attr('width', rectWidth)
          .attr('height', d => d.height > 0 ?
            ((height - yScale(d.height)) - height / 2) :
            (height / 2 - (height - yScale(d.height))))
          .attr('fill', d => d.height > 0 ? 'url(#bar-gradient)' : 'url(#barMinus-gradient)')
          .attr('class', "volcano-rect")
          .attr('id', d => "volcano-rect" + d.id)
          .on('click', function (d) {
            // 恢复所有矩形的填充为渐变
            d3.selectAll('.volcano-rect')
              .attr('fill', d => d.height > 0 ? 'url(#bar-gradient)' : 'url(#barMinus-gradient)');

            // 将当前点击的矩形的填充设置为黑色，并添加过渡效果
            d3.select(this)
              .transition()
              .duration(50)  // 过渡的持续时间，单位毫秒
              .attr('fill', 'black');

          });

        // 添加按钮，点击按钮按照 "eruption" 数据重新排序并更新柱形图
        d3.select('#button-container')  // 选择 #chart1-container 元素
          .append('button')
          .text('TimeLine')
          .on('click', function () {
            // 按 "eruption" 数据重新排序
            sortedDataset.sort((a, b) => new Date(a.eruption) - new Date(b.eruption));

            // 更新 x 轴
            xScale.domain(d3.map(sortedDataset, d => d.id));
            xAxis.transition().call(d3.axisBottom(xScale).tickValues([]));

            // 计算过渡延迟时间
            const delay = (d, i) => i * 20;

            // 过渡动画，先将高度设为0，然后改变x位置，最后将高度过渡为正常值
            bars.transition()
              .duration(1600) // 与原始数据排序的总持续时间相匹配
              .delay(delay)
              .attr('y', height / 2)
              .attr('height', 0)
              .on('end', function () {
                // 在高度过渡完成后，改变x位置并过渡为正常高度
                d3.select(this)
                  .attr('x', d => xScale(d.id))
                  // .attr('height', d => height - margin - yScale(d.height))
                  // .attr('y', d => yScale(d.height))
                  // .attr('height', d => d.height > 0 ?
                  //     ((height - yScale(d.height)) - height / 2) :
                  //     (height / 2 - (height - yScale(d.height))))
                  // .attr('y', d => d.height > 0 ? (yScale(d.height)) : height / 2)
                  .attr('y', height / 2)
                  .attr('height', 0)
                  .transition()
                  .duration(500)
                  .delay(delay)
                  // .attr('height', d => height - margin - yScale(d.height))
                  // .attr('y', d => yScale(d.height));
                  .attr('height', d => d.height > 0 ?
                    ((height - yScale(d.height)) - height / 2) :
                    (height / 2 - (height - yScale(d.height))))
                  .attr('y', d => d.height > 0 ? (yScale(d.height)) : height / 2);
              });
          });

        // 添加按钮，点击按钮按照原始数据的顺序重新排序并更新柱形图
        d3.select('#button-container')  // 选择 #chart1-container 元素
          .append('button')
          .text('Original')
          .on('click', function () {
            // 恢复原始数据顺序
            sortedDataset = [...dataset];

            // 更新 x 轴和柱形图
            xScale.domain(d3.map(sortedDataset, d => d.id));
            xAxis.call(d3.axisBottom(xScale).tickValues([]));

            // 计算过渡延迟时间
            const delay = (d, i) => i * 20;

            // 过渡动画，先将高度设为0，然后改变x位置，最后将高度过渡为正常值
            bars.transition()
              .duration(1600)
              .delay(delay)
              .attr('y', height / 2)
              .attr('height', 0)
              .on('end', function () {
                // 在高度过渡完成后，改变x位置并过渡为正常高度
                d3.select(this)
                  .attr('x', d => xScale(d.id))
                  // .attr('height', d => height - margin - yScale(d.height))
                  // .attr('height', d => d.height > 0 ?
                  //     ((height - yScale(d.height)) - height / 2) :
                  //     (height / 2 - (height - yScale(d.height))))
                  // .attr('y', d => yScale(d.height))
                  // .attr('y', d => d.height > 0 ? (yScale(d.height)) : height / 2)
                  .attr('y', height / 2)
                  .attr('height', 0)
                  .transition()
                  .duration(500)
                  .delay(delay)
                  // .attr('height', d => height - margin - yScale(d.height))
                  // .attr('y', d => yScale(d.height));
                  .attr('height', d => d.height > 0 ?
                    ((height - yScale(d.height)) - height / 2) :
                    (height / 2 - (height - yScale(d.height))))
                  .attr('y', d => d.height > 0 ? (yScale(d.height)) : height / 2);
              });
          });

      });
    }
    // require('./chart2')

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
    // require('./chart3')
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
    // require('./chart4')
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
  },
  watch: {
    // "isShow"(val) {

    // },
    // deep: true,
    // immediate: true
  }
}
</script>

<style  scoped>
#insights-center {
  height: 80vh;
  width: 100vw;
  /* background-color: #aaa; */
}

.insights-center-row {
  margin-top: 5vh;
  width: 90vw;
  height: 30vh;
  margin-left: auto;
  margin-right: auto;
  color: #000;
  display: flex;
}

#chart1-container {
  width: 90vw;
  text-align: center;
  /* line-height: 30vh; */
  position: relative;
  background-color: #fff;

}

#chart1-container:before {
  /*使用before 选择器在被选元素的内容前面插入内容。*/
  width: 100%;
  height: 100%;
  /*设置为全屏背景模式*/
  background-image: url('@/assets/insight_back.svg');
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  /*将图片固定*/
  position: absolute;
  /*图片定位*/
  top: 0;
  left: 0;
  content: "";
  opacity: .07;
}

#button-container {
  position: absolute;
  height: auto;

  /* 调整按钮距离顶部的距离 */
  top: 1vh;
  /* 调整按钮距离右侧的距离 */
  right: 3vw;
}

#insights-center-row2 {
  height: 45vh;
}

.insights-center-left,
.insights-center-right {
  width: 35vw;
  height: 45vh;
  text-align: center;
  /* line-height: 45vh; */
  background-color: #fff;
}

.insights-center-mid {
  /* background-color: #aaa; */
  margin-left: 5vw;
  margin-right: 5vw;
  width: 20vw;
}

.insights-center-mid .top,
.insights-center-mid .bottom {
  height: 44vh;
  /* line-height: 22vh; */
  text-align: center;
  width: 20vw;
  /* border-radius: 10vw; */
  background-color: #fff;
}

.insights-center-mid .top {
  margin-bottom: 1vh;
}
</style>
<style>
#button-container button {
  margin-top: 10px;
  padding: 1vh .8vw;
  /* 调整按钮的 padding */
  font-size: .6vw;
  /* 调整按钮的字体大小 */
  cursor: pointer;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

#button-container button:hover {
  background-color: #ffffff;
  color: #830404;
}

.slice {
  filter: url(#drop-shadow);
}

.legend text {
  font-size: 12px;
  fill: #bc0707;
  fill: #f53f3f;
  fill: #b91c1c;
  fill: #b73737;
  fill: #e04646;
  fill: #ea5a32;
  fill: #dd481b;
  fill: #fa690f;
  fill: #ef5f37;
  fill: rgb(212, 55, 7);
  fill: #ff7c17;
  fill: #e76413;
  fill: #f1830e;
}

.legend rect {
  width: 18px;
  height: 18px;
  stroke: white;
  stroke-width: 2px;
}

#pie-chart .tooltip {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 8px;
  border-radius: 4px;
  /* width: auto;
  height: auto; */
  pointer-events: none;
  display: none;
}
</style>