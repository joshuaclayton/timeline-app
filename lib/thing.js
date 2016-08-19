window.$ = window.jQuery = require('jquery');
require('highcharts');

// const highchartOptions = {
//   chart: {
//     type: 'bar'
//   },
//   series: [{
//     data: [1, 0, 4]
//   }, {
//     data: [5, 7, 3]
//   }]
// };

const typeToHighchartsRenderedType = function(type) {
  switch (type) {
    case "line":
      return "spline";
    case "bar":
      return "column";
  }
};

const generateSeriesFromData = function(data) {
  return data.graphs.map(graph => {
    return {
      type: typeToHighchartsRenderedType(graph._type),
      data: graph.points,
    };
  });
};

const generateChart = function(input) {
  const ajaxOptions = {
    url: "http://localhost:5515/",
    data: input,
    dataType: "json",
    method: "POST",
    beforeSend: () => {
      $("#chart").css({visibility: "visible"});
      $("#inputs .error").text("");
    }
  };

  $.ajax(ajaxOptions).done((data) => {
    $('#chart').highcharts({
      series: generateSeriesFromData(data)
    });
  }).fail((data) => {
    $("#chart").css({visibility: "hidden"});
    $("#inputs .error").text(data.responseJSON.error);
  });
};

$(function() {
  $("#inputs").submit((e) => {
    const dataToSubmit = $(this).find("textarea").val();

    generateChart(dataToSubmit);
    e.preventDefault();
  });
});
