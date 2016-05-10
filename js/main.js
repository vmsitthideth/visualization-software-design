var MapChart = function() {	
	

	var margin = {top: 40, right: 10, bottom: 10, left: 10},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var color = d3.scale.category10();
	var measure, treeID;

	var chart = function(selection) {
		selection.each(function(data) {

			var div = d3.select(this)
						.append("div")
						.attr('height', 600)
						.attr('width', 600)
						.style("left", margin.left + "px")
						.style("top", margin.top + "px");

			var position = function() {
				this.style("left", function(d,i) {return d.x + "px"; })
					.style("top", function(d,i) {return d.y + "px"; })
					.style("width", function(d,i) {return d.dx + "px"; })
					.style("height", function(d,i) {return d.dy + "px"; })
					.style("background", function(d) {return !d.values ? color(d.region) : null; })
			}

			var nestedData = d3.nest().key(function(d) {return d.region; })
									  .entries(data);

			var treemap = d3.layout.treemap()
							.size([width, height])
							.sticky(true)
							.value(function(d) {return d[measure]; })
							.children(function(d) {return d.values; });

			var draw = function() {
				treemap.value(function(d) {return d[measure]; });

				var nodes = div.selectAll(".node").data(treemap.nodes({values: nestedData}));

				nodes.enter()
						.append("div")
						.attr('class', 'node')
						.text(function(d) {return d[treeID]; })
						.call(position);

				nodes.transition().duration(500).call(position);
			}
			draw();

		});
	};

	chart.width = function(value) {
		if(!arguments.length) {
			return width;
		}
		width = value - margin.left - margin.right;
		return this;
	};

	chart.height = function(value) {
		if(!arguments.length) {
			return height;
		}
		height = value - margin.top - margin.bottom;
		return this;
	};

	chart.measure = function(value) {
		if(!arguments.length) {
			return measure;
		}
		measure = value;
		return this;
	};

	chart.treeID = function(value) {
		if(!arguments.length) {
			return treeID;
		}
		treeID = value;
		return this;
	};

	// chart.color.domain = function(value) {
	// 	if (!arguments.length) {
	// 		return color;
	// 	}
	// 	color = value;
	// 	return this;
	// }

	return chart;
}