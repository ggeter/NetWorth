// NetWorth common JS functions
// Greg Geter, 2018 -- License: WTFPL

function NetWorthApp() {
  console.log('NetWorth has started.');
  // variables, setup, shared functions

  
  // application
  var redLine =   [{x: 0, y: 170},{x: 88, y: 170},{x: 178, y: 149},{x: 201, y: 106},{x: 287, y: 83},{x: 331, y: 105},{x: 353, y: 172},{x: 400, y: 219}];
  var greenLine = [{x: 0, y: 220},{x: 87, y: 130},{x: 154, y: 197},{x: 197, y: 195},{x: 220, y: 214},{x: 286, y: 215},{x: 332, y: 263},{x: 378, y: 241}, {x: 400, y: 242}];
  var blueLine =  [{x: 0, y: 103},{x: 44, y: 103},{x: 154, y: 36},{x: 309, y: 150},{x: 376, y: 150},{x: 400, y: 171}];
  var data = [
      {name: 'Math', data: redLine},
      {name: 'Economics', data: greenLine},
      {name: 'History', data: blueLine}
  ];

  new Contour({
          el: '.myFirstChart',
          xAxis: {
              title: 'Group Size',
              type: 'linear'
          },
          yAxis: {
              title: 'Test Score'
          },
          legend: {
              vAlign: 'top',
              hAlign: 'left'

          }
      })
      .cartesian()
      .line(data)
      .legend(data)
      .tooltip()
      .render();

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