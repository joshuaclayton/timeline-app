$ = require('jquery');
require('highcharts');
window.moment = require('moment');

// const START_DATE = moment("01-22-2015", "MM-DD-YYYY");
// const DATE_INTERVAL = "day";
const START_DATE = moment("05-01-2009", "MM-DD-YYYY");
const DATE_INTERVAL = "month";

const typeToHighchartsRenderedType = function(type) {
  switch (type) {
    case "line":
      return "spline";
    case "scatter-plot":
      return "scatter";
    case "bar":
      return "column";
    case "stacked-bar":
      return "column";
  }
};

const difference = function(a1, a2) { return a1.filter(x => a2.indexOf(x) < 0); };

const range = function(bottom, top) {
  const genList = (i) => { return [...Array(i).keys()]; }
  return difference(genList(top + 1), genList(bottom)).map(i => i + 1);
};

const generatePlotlines = (startDate) => {
  return range(0, 50).map((i) => {
    return {
      color: 'gray',
      dashStyle: 'longDash',
      width: 1,
      value: startDate.clone().startOf('year').add(i, 'years'),
    };
  });
};

const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const scatterPlotDataToGroups = function(tuples) {
  const groupedTuples = groupBy(tuples, 0);

  return Object.keys(groupedTuples).reduce((acc, i) => {
    return acc.concat({
      name: i,
      type: 'scatter',
      data: groupedTuples[i].map(v => [v[1], v[2]]),
    });
  }, []);
};

const dateForIndex = (startDate, interval, idx) => {
  return startDate.clone().add(idx, interval).toDate().getTime();
};

const generateSeriesFromData = function(startDate, dateInterval, data) {
  return data.graphs.map((graph, idx) => {
    if (graph._type === "scatter-plot") {
      const res = scatterPlotDataToGroups(graph.points);
      console.log(res);
      return res
    } else {
      if ($.isArray(graph.points[0])) {
        return graph.points.map(points => {
          return {
            type: typeToHighchartsRenderedType(graph._type),
            data: points.map((v, i) => [dateForIndex(startDate, dateInterval, i), v]),
            stack: `Series ${idx + 1}`,
            name: graph.name || `Series ${idx + 1}`,
          };
        });
      } else {
        return [{
          type: typeToHighchartsRenderedType(graph._type),
          data: graph.points.map((v, i) => [dateForIndex(startDate, dateInterval, i), v]),
          name: graph.name || `Series ${idx + 1}`,
          stack: `Series ${idx + 1}`,
        }];
      }
    }
  }).reduce((acc, a) => acc.concat(a), []);
};

const doesContainScatter = (data) => {
  return data.graphs.filter(a => a._type === "scatter-plot").length > 0;
};

const generateXAxis = function(data) {
  if (doesContainScatter(data)) {
    return {};
  } else {
    return {
      type: 'datetime',
      labels: {
        formatter() {
          return moment(this.value).format("MMM YYYY");
        }
      },
      plotLines: generatePlotlines(START_DATE),
    };
  }
};

const generateTooltip = function(data) {
  if (doesContainScatter(data)) {
    return {
      formatter() {
        console.log(this);
        const amount = this.point.y;
        const days = this.point.x;
        const category = this.point.series.name;
        return `<b>${days} Days: ${amount} (${category})</b>`;
      },
    };
  } else {
    return {
      formatter() {
        const value = this.point.y;
        const date = moment(this.point.x);
        return `<b>${date.format("MMM YYYY")}: ${value}</b>`;
      },
    };
  }
};

class Chart {
  constructor(selector) {
    this.selector = selector;
  }

  renderData(data) {
    console.log('data', data);
    $(this.selector).highcharts({
      title: { text: null },
      xAxis: generateXAxis(data),
      tooltip: generateTooltip(data),
      series: generateSeriesFromData(START_DATE, DATE_INTERVAL, data),
      plotOptions: {
        column: {
          stacking: 'normal',
        },

        spline: {
          marker: {
            enabled: false,
          },
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
