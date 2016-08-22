$ = require('jquery');
require('highcharts');

const typeToHighchartsRenderedType = function(type) {
  switch (type) {
    case "line":
      return "spline";
    case "bar":
      return "column";
    case "stacked-bar":
      return "column";
  }
};

const generateSeriesFromData = function(data) {
  return data.graphs.map((graph, idx) => {
    if ($.isArray(graph.points[0])) {
      return graph.points.map(points => {
        return {
          type: typeToHighchartsRenderedType(graph._type),
          data: points,
          stack: `Series ${idx + 1}`,
          name: `Series ${idx + 1}`,
        };
      });
    } else {
      return [{
        type: typeToHighchartsRenderedType(graph._type),
        data: graph.points,
        name: `Series ${idx + 1}`,
      }];
    }
  }).reduce((acc, a) => acc.concat(a), []);
};

class Chart {
  constructor(selector) {
    this.selector = selector;
  }

  renderData(data) {
    $(this.selector).highcharts({
      title: {
        text: null,
      },
      xAxis: {
        type: 'datetime',
      },
      series: generateSeriesFromData(data),
      plotOptions: {
        column: {
          stacking: 'normal',
        },
      },
    });
  }

  show() {
    $(this.selector).css({visibility: "visible"});
  }

  hide() {
    $(this.selector).css({visibility: "hidden"});
  }
}

module.exports = Chart;
