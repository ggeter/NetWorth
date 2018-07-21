// NetWorth common JS functions
// Greg Geter, 2018 -- License: WTFPL

console.log('NetWorth has started.');

function NetWorthApp() {

  // variables, setup, shared functions
  // grab template HTML
  var itemDiv = document.getElementById('tmpl_itemDiv').innerHTML;
  var itemListDiv = document.getElementById('item-list');
 
  // this is the template engine test. Results logged to console on app start
  console.log(tmplrender("<div>{{TESTHOLDER}}</div><span id='{{SPANID}}'</span>", {
    TESTHOLDER: "this is the DIV innerHTML.",
    SPANID: "this-is-the-span-id"
  }));

  
  
  // application
  
  
  
}

function tmplrender(tmplDATA, tmplID, destID)  {

  //simple split/join string templating

  //grab template code
  var tmplHTML = document.getElementById(tmplID).innerHTML;

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