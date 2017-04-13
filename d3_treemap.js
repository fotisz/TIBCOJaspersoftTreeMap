define(['d3'], function (d3) {

	 return function (instanceData) {	
		
	 			
				var data = { name: "data", children: [] };

                // Build the tree...
                var series0 = instanceData.series[0];
                
                var currentCategory = "";
                for (var index = 0; index < series0.length; ++index) {
                    
                    var record = series0[index];
                    
                    if ( currentCategory != record.category )
                    {
                        currentCategory = record.category;
                        
                        var categoryObject = { name: currentCategory, children: [] };
                        
                        // populate sub categories
                        for (var index2 = 0; index2 < series0.length; ++index2) {
                            var subrecord = series0[index2];
                            if (subrecord.category == currentCategory)
                            {
                                categoryObject.children.push({ name: subrecord.subcategory, size: subrecord.value });
                            }
                        }
                        data.children.push( categoryObject );
                    }
                 } 
                        

                 var w = instanceData.width,
                    h = instanceData.height;




                var x = d3.scale.linear().range([0, w]),
                    y = d3.scale.linear().range([0, h]),
                    color = d3.scale.category20c(),
                    root,
                    node;

                var treemap = d3.layout.treemap()
                    .round(false)
                    .size([w, h])
                    .sticky(true)
                    .value(function(d) { return d.size; });

                var svg = d3.select("#" + instanceData.id ).append("div")
                	.attr("id", instanceData.id + "svg")
                    .style("width", w + "px")
                    .style("height", h + "px")
                  .append("svg:svg")
                    .attr("width", w)
                    .attr("height", h)
                  .append("svg:g")
                    .attr("transform", "translate(.5,.5)");


                  node = root = data;

                  var nodes = treemap.nodes(root)
                      .filter(function(d) { return !d.children; });

                  var cell = svg.selectAll("g")
                      .data(nodes)
                    .enter().append("svg:g")
                      .attr("class", "cell")
                      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                      .on("click", function(d) { return zoom(node == d.parent ? root : d.parent); });

                  cell.append("svg:rect")
                      .attr("width", function(d) { return d.dx - 1; })
                      .attr("height", function(d) { return d.dy - 1; })
                      .style("fill", function(d) { return color(d.parent.name); });

                  cell.append("svg:text")
                      .attr("x", function(d) { return d.dx / 2; })
                      .attr("y", function(d) { return d.dy / 2; })
                      .attr("dy", ".35em")
                      .attr("text-anchor", "middle")
                      .text(function(d) { return d.name; })
                      .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

                  d3.select(window).on("click", function() { zoom(root); });

                  d3.select("select").on("change", function() {
                    treemap.value(this.value == "size" ? size : count).nodes(root);
                    zoom(node);
                  });


                function size(d) {
                  return d.size;
                }

                function count(d) {
                  return 1;
                }

                function zoom(d) {
                  var kx = w / d.dx, ky = h / d.dy;
                  x.domain([d.x, d.x + d.dx]);
                  y.domain([d.y, d.y + d.dy]);

                  var t = svg.selectAll("g.cell").transition()
                      .duration(d3.event.altKey ? 7500 : 750)
                      .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

                  t.select("rect")
                      .attr("width", function(d) { return kx * d.dx - 1; })
                      .attr("height", function(d) { return ky * d.dy - 1; })

                  t.select("text")
                      .attr("x", function(d) { return kx * d.dx / 2; })
                      .attr("y", function(d) { return ky * d.dy / 2; })
                      .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

                  node = d;
                  d3.event.stopPropagation();
                }              

		
	};
		
});

