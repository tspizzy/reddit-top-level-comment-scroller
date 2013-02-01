var curr = null;
var sitetable;
var info = null;

var control = null;

DirEnum = {
  UP : "up",
  DOWN : "down"
}

function getScrollPos() {
  var ScrollTop = document.body.scrollTop;
  if (ScrollTop == 0) {
    if (window.pageYOffset)
        ScrollTop = window.pageYOffset;
    else
        ScrollTop = (document.body.parentElement) ? document.body.parentElement.scrollTop : 0;
  }
  return ScrollTop;
}

function findByClassName(parent, name) {
  for(var i=0; i<parent.childNodes.length; i+=1) {
    if (parent.childNodes[i].className == name) {
      return parent.childNodes[i];
    }
  }
  return null;
}

function getElementPos(theElement) {
  var selectedPosX = 0;
  var selectedPosY = 0;
              
  while(theElement != null){
    selectedPosX += theElement.offsetLeft;
    selectedPosY += theElement.offsetTop;
    theElement = theElement.offsetParent;
  }
  
  return {X : selectedPosX, Y : selectedPosY };
}

function ScrollToElement(theElement){
  var pos = getElementPos(theElement);
  window.scrollTo(pos.X, pos.Y);
}

var output = null;
function scroll(evt) {
  var tmp = 0;
  var dir;
  if (evt.shiftKey) {
    if (evt.keyCode == 40) {
      dir = DirEnum.DOWN;
      tmp = findNearest( dir );
      sitetable.childNodes[tmp].id = 'asdfasdfasdf_'+tmp;
      Effect.ScrollTo(sitetable.childNodes[tmp].id, { duration: 0.2 });
                              return;
      ScrollToElement( sitetable.childNodes[tmp] );
    } else if (evt.keyCode == 38) {
      dir = DirEnum.UP;
      tmp = findNearest( dir );
      sitetable.childNodes[tmp].id = 'asdfasdfasdf_'+tmp;
      Effect.ScrollTo(sitetable.childNodes[tmp].id, { duration: 0.2 });
                              return;
      ScrollToElement( sitetable.childNodes[tmp] );
    }
  }
  return;
  info.innerHTML = '<p> curr: ' + curr + '</p>' +
                    '<p>page y: ' + getScrollPos() + '</p>' +
                    '<p>nearest: ' + tmp + '</p>' +
                    '<p>curr Y: ' + getElementPos( sitetable.childNodes[curr] ).Y + '</p>';
}

function findNearest(dir) {
  var currPos = getScrollPos();
  switch(dir) {
  case DirEnum.UP:
    for(var i = sitetable.childNodes.length-2; i >= 0; i -= 2) {
      var comm = sitetable.childNodes[i];
      if (getElementPos( comm ).Y < currPos) {
        return i;
      }
    }
    break;
  case DirEnum.DOWN:
    for(var i = 0; i < sitetable.childNodes.length; i += 2) {
      var comm = sitetable.childNodes[i];
      if (getElementPos( comm ).Y > currPos) {
        return i;
      }
    }
    break;
  default:
    alert('oops');
  }   
}

function controlScroll(e) {
  if (control.mouseIsOver) {
    var tmp = null;
    if (Event.wheel(e) < 0) {
      tmp = findNearest( DirEnum.DOWN );
    } else {
      tmp = findNearest( DirEnum.UP );
    }
    info.innerText = control.scrollTop;
    control.scrollTop = 250;
    sitetable.childNodes[tmp].id = 'asdfasdfasdf_'+tmp;
    Effect.ScrollTo(sitetable.childNodes[tmp].id, { duration: 0.2 });
    return;
    ScrollToElement( sitetable.childNodes[tmp] );
  }
}

function addControl() {
  control = document.createElement('div');
  
  control.style.position = 'fixed';
  control.style.marginLeft = 'auto';
  control.style.marginRight = 'auto';
  control.style.right = '0px';
  control.style.bottom = '0px';
  control.style.width = '4.5em';
  control.style.border = '1px solid black';
  control.style.padding = '5px';
  control.style.maxWidth = '100px';
  control.style.fontSize = '25px';
  control.style.height = '2.5em';
  control.style.textAlign = 'center';
  //control.style.overflow = "scroll";
  
  var s = document.createElement('img');
  s.style.width = '100px';
  s.style.height = '100px';
  //s.src = 'http://upload.wikimedia.org/wikipedia/commons/archive/d/d6/20090514045710!1Mcolors.png';
  s.src = 'arrows.png';
  //control.appendChild( s );
  
  var arrows = document.createElement('p');
  arrows.innerHTML = '&uarr; <p> &darr;';
  control.appendChild( arrows );
  
  for(var i=0; i>sitetable.childNodes.length*10; i+=2) {
    var line = document.createElement('p');
    line.innerText = 'line ' + i;
    control.appendChild( line );
  }
  
  control.style.backgroundColor = 'white';
  control.style.opacity = '1';
  control.style.zIndex = '99';
  
  control.mouseIsOver = false;
  control.onmouseover = function()   {
      this.mouseIsOver = true;
  };
  control.onmouseout = function()   {
    this.mouseIsOver = false;
  };
  
  control.onClick = function() {
    alert('ha');
    info.innerText = control.scrollTop;
  };
  
  Event.observe(document, "mousewheel", controlScroll, false);
  Event.observe(document, "DOMMouseScroll", controlScroll, false);
  
  chrome.extension.sendRequest({name: "getPreferences"},
     function(response)
     {
        enabled = response.Enabled;
        if (enabled != null) {
          if (enabled == 'true') {
            document.body.appendChild( control ); 
          }
        } else {
          document.body.appendChild( control );  
        }
     });
}
var info;
function addInfo() {
  info = document.createElement('div');
  
  info.style.position = 'fixed';
  info.style.right = '0px';
  info.style.top = '0px';
  info.style.width = '100px';
  info.style.height = '100px';
  
  info.style.backgroundColor = 'red';
  info.style.zIndex = '99';
  info.innerText = 'Testing';
  
  //document.body.appendChild( info );
}

function load() {
  addInfo();

  var content = findByClassName(document.body, 'content');
  var commentarea = findByClassName(content, 'commentarea');
  sitetable = findByClassName(commentarea, 'sitetable nestedlisting');
  addControl();
  curr = 0;
  
  Event.observe(document, 'keydown', scroll);
}
load();
//Event.observe(document, 'load', load);