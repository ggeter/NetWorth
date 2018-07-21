// NetWorth common JS functions
// Greg Geter, 2018 -- License: WTFPL

function NetWorthApp() {
  console.log('NetWorth has started.');
  // variables, setup, shared functions

  
  // application
var chart = new Chartist.Line('.ct-chart', {
  series: [
    {
      name: 'series-1',
      data: [
        {x: new Date("1/1/2018"), y: 73},
        {x: new Date("1/1/2019"), y: 20},
        {x: new Date("1/1/2020"), y: 45},
        {x: new Date("1/1/2021"), y: 40},
        {x: new Date("1/1/2022"), y: 20},
        {x: new Date("1/1/2023"), y: 32},
        {x: new Date("1/1/2024"), y: 18},
        {x: new Date("1/1/2025"), y: 11}
      ]
    },
    {
      name: 'series-2',
      data: [
        {x: new Date("1/1/2018"), y: 53},
        {x: new Date("1/1/2019"), y: 40},
        {x: new Date("1/1/2020"), y: 45},        
        {x: new Date("1/1/2021"), y: 53},
        {x: new Date("1/1/2022"), y: 35},
        {x: new Date("1/1/2023"), y: 30},
        {x: new Date("1/1/2024"), y: 30},
        {x: new Date("1/1/2025"), y: 10}
      ]
    }
  ]
}, {
  showPoint: false,
  axisX: {
    type: Chartist.FixedScaleAxis,
    divisor: 8,
    labelInterpolationFnc: function(value) {
      return moment(value).format('YYYY');
    }
  }
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