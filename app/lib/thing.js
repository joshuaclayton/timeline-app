window.$ = window.jQuery = require('jquery');
const Chart = require('./chart');
const Errors = require('./errors');

const generateChart = function(input) {
  const chart = new Chart("#chart");
  const errors = new Errors("#inputs .error");

  const ajaxOptions = {
    url: "http://localhost:5515/",
    data: input,
    dataType: "json",
    method: "POST",
    beforeSend: () => {
      chart.show();
      errors.clear();
    }
  };

  $.ajax(ajaxOptions).done((data) => {
    chart.renderData(data);
  }).fail((data) => {
    chart.hide();
    errors.set(data.responseJSON.error);
  });
};

$(function() {
  $("#inputs textarea")[0].addEventListener('keydown', function(e) {
    if(e.keyCode == 13 && e.metaKey) {
      $("#inputs").submit();
    }
  });

  $("#inputs").submit((e) => {
    e.preventDefault();

    const dataToSubmit = $(this).find("textarea").val();
    generateChart(dataToSubmit);
  }).submit();
});
