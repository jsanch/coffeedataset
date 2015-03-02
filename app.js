// Important Globals
var svg = ""


// Svg View margins
var margin = { top: 80, right: 80, bottom: 80, left: 80 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Convert string to date format 
var parse = d3.time.format("%m/%d/%y").parse;

// Date Bisector
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

// Scales
var x = d3.time.scale().range([0, width]).nice(),
    y1 = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height, 0]);

// Axis
var xAxis = d3.svg.axis().scale(x)
              .orient("botom")
              .tickSize(-height)
              .tickSubdivide(true),
    y1Axis = d3.svg.axis().scale(y1)
              // .ticks(12)
              .orient("left");
    y2Axis = d3.svg.axis().scale(y2)
              // .ticks(12)
              .orient("right");

// Line Generators
var line1 = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y1(d.profit); });
var line2 = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y2(d.sales); });


 // Fetch data, and do stuff in callback when fetched. 
d3.json("data/profit_sales_per_month.json", function(error, json) {
  if (error) {
    console.warn(error);
  }

  // convert dict/obj to list
  data = $.map(json, function( value, index ) {
    temp = value.date
    value.date = parse(temp);
    return [value];
  });

  console.log(data)

  // Compute min and max dates for the x scale
  x.domain([ data[0].date, data[data.length - 1].date]);
  // Compute max for y1 and y2. (profit and sales)
  y1.domain([0, d3.max(data, function(d) {return d.profit;})]).nice();
  y2.domain([0, d3.max(data, function(d) {return d.sales;})]).nice();

  // Add an SVG element with the desired dimensions and margin. 
  svg = d3.select("plot").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .on("click", click);

  // click 
  function click() {
      var n = data.length - 1,
          i = Math.floor(Math.random() * n / 2),
          j = i + Math.floor(Math.random() * n / 2) + 1;
      x.domain([data[i].date, data[j].date]);
      var t = svg.transition().duration(750);
      t.select(".x.axis").call(xAxis);
      t.select(".line1").attr("d", line1(data));
      t.select(".line2").attr("d", line2(data));
  };

  // Add the clip path
   svg.append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  // Add the x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

  // Adjust ticks
  d3.select(".x.axis").selectAll(".tick").select("text")
    .attr("y","10")

  // Add the y1-axis.
  svg.append("g")
      .attr("class", "y1 axis")
      .attr("transform", "translate(0,0)")
      .call(y1Axis);

  // Add the y2-axis.
  svg.append("g")
      .attr("class", "y2 axis")
      .attr("transform", "translate(" + width + ",0)")
      .call(y2Axis);

  // Add the line1 path.
  svg.append("path")
      .attr("class", "line1")
      .attr("clip-path", "url(#clip)")
      .attr("d", line1(data));

  // Add the line2 path.
  svg.append("path")
      .attr("class", "line2")
      .attr("clip-path", "url(#clip)")
      .attr("d", line2(data));

  // Add some label
  svg.append("text")
    .attr("x", width - 6)
    .attr("y", height - 6)
    .style("text-anchor", "end")
    .text("Profit (Green) and Sales (Orange) vs time");

  // fav tooltip stuff // 


  // declare focus circles
  var focus1 = svg.append("g")
      .style("display","none");
  var focus2 = svg.append("g")
      .style("display","none");





  //customize focus circles
  focus1.append("circle")
      .attr("class","y1")
      .style("fill", "none")
      .style("stroke", "blue")
      .attr("r", 4);  

  focus2.append("circle")
      .attr("class","y2")
      .style("fill", "none")
      .style("stroke", "blue")
      .attr("r", 4);  

    // append the x line1
  focus1.append("line")
      .attr("class", "x")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", 0)
        .attr("y2", height);
   // append the y line1
  focus1.append("line")
        .attr("class", "y")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("x1", width)
        .attr("x2", width);

    // append the x line2
  focus2.append("line")
      .attr("class", "x")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", 0)
        .attr("y2", height);
   // append the y line2
  focus2.append("line")
        .attr("class", "y")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("x1", width)
        .attr("x2", width);


  // place the value at the intersection
    focus1.append("text")
        .attr("class", "y1")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "-.3em");
    focus1.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "-.3em");

    focus2.append("text")
        .attr("class", "y1")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "-.3em");
    focus2.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "-.3em");

  // place the date at the intersection
    focus1.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus1.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");
    focus2.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus2.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");
  

  function addtexttofocus(d) {
     // FAV TOOLTIP STUFF
    focus1.select("circle.y")
      .attr("transform",
            "translate(" + x(d.date) + "," +
                           y1(d.profit) + ")");

    focus1.select("text.y1")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y1(d.profit) + ")")
        .text(d.profit);

    focus1.select("text.y2")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y1(d.profit) + ")")
        .text(d.profit);

    focus1.select("text.y3")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y1(d.profit) + ")")
        .text(getNiceDate(d.date));

    focus1.select("text.y4")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y1(d.profit) + ")")
        .text(getNiceDate(d.date));

    focus1.select(".x")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y1(d.profit) + ")")
                   .attr("y2", height - y1(d.profit));

    focus1.select(".y")
        .attr("transform",
              "translate(" + width * -1 + "," +
                             y1(d.profit) + ")")
                   .attr("x2", width + width);




    focus2.select("circle.y")
      .attr("transform",
            "translate(" + x(d.date) + "," +
                           y2(d.sales) + ")");

    focus2.select("text.y1")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y2(d.sales) + ")")
        .text(d.profit);

    focus2.select("text.y2")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y2(d.sales) + ")")
        .text(d.profit);

    focus2.select("text.y3")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y2(d.sales) + ")")
        .text(getNiceDate(d.date));

    focus2.select("text.y4")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y2(d.sales) + ")")
        .text(getNiceDate(d.date));

    focus2.select(".x")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y2(d.sales) + ")")
                   .attr("y2", height - y2(d.sales));

    focus2.select(".y")
        .attr("transform",
              "translate(" + width * -1 + "," +
                             y2(d.sales) + ")")
                   .attr("x2", width + width);


  }

  // append the rectangle to capture mouse
  svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function() { 
        focus1.style("display", null);
        focus2.style("display", null);  
      })
      .on("mouseout", function() { 
        focus1.style("display", "none"); 
        focus2.style("display", "none"); 
      })
      .on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus1.select("circle.y1")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y1(d.profit) + ")");
    focus2.select("circle.y2")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y2(d.sales) + ")");

    addtexttofocus(d);


  };

  



});

function type(d) {
  d.date = parse(d.date);
  return d;
}

function getNiceDate(date) {
  foo = d3.time.format("%b %Y");
  foo(date)
  return foo(date)
}

