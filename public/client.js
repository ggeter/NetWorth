// NetWorth common JS functions
// Greg Geter, 2018 -- License: WTFPL

function NetWorthApp() {
  console.log('NetWorth has started.');
  // variables, setup, shared functions

  // kick off moment.js
  moment().format();

}

function doChart(labels) {
  
  
  new Chartist.Line('.ct-chart', {
    labels: labels || [],
    series: [
      [12, 9, 7, 8, 5],
      [2, 1, 3.5, 7, 3],
      [1, 3, 4, 5, 6]
    ]
  }, {
    fullWidth: true,
    chartPadding: {
      right: 40
    }
  });

}
  
function runScenario() {
  
  var rightNow = moment().toArray();
  var startYear = rightNow[0];
  var yrskip = 5;
  
  // grab scenario data and execute
  getScenarios(function (sd) {
    var sdata = sd;
    console.log("Running scenario at " + moment().format("YYYY-MM-DD HH:MM"));
    console.log(sdata);
    
    // compute time-series DR/CR per item
    
    var currentScenario = sdata["S001"];
    
    var yearsToAnalyze =  currentScenario.BASELINE.yearstoretirement +
                          currentScenario.BASELINE.yearspastretirement;
    
    var endYear = startYear + yearsToAnalyze;
    
    // make labels
    var chartLabels = [];
    console.log(startYear + " - " + endYear);
    yrskip --;
    for (var y = startYear; y <= endYear; y++) { // loop through analysis years
      // labels: show first year, every five years, and last year
      yrskip ++;
      if(yrskip%5 == 0) { 
        chartLabels.push(y); 
      } else {
        chartLabels.push("");
      }
      
      // loop scenario items for each year pass
      _.forEach(currentScenario, function (value, key) {
        var itemName = key;
        console.log(value.type);
      });
    }
    
    
    
    // display chart
    console.log(chartLabels);
    doChart(chartLabels);
  });
}

function tmplrender(tmplDATA, tmplID, destID)  {

  //simple split/join string templating

  //grab template code
  var tmplHTML = document.getElementById(tmplID).innerHTML || "";

  //grab destination node
  var destNode = destID ? document.getElementById(destID) : false;

  //remove comment tokens first 
  tmplHTML = tmplHTML.split('/*').join('').split('*/').join('');

  // in my research over the years, split/join is suprisingly performant
  for (var p in tmplDATA) {
    tmplHTML = tmplHTML.split('{{' + p + '}}').join(tmplDATA[p]);
  }

  if (destNode) {
    destNode.innerHTML = tmplHTML;
  }

  return tmplHTML;
}

function DOMReady(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function getScenarios(callback) {
  var request = new XMLHttpRequest();
  request.open('GET', 'sampleScenarios.json', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var scenarioData = JSON.parse(request.responseText);
    } else {
      // We reached our target server, but it returned an error
      scenarioData = false;
    }
    callback(scenarioData);
  };

  request.onerror = function() {
    // There was a connection error of some sort
    callback(false);
  };

  request.send();
  
}