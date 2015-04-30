var prevDivID;
var divID;
var clickyTime;
var numTicks = 0;
var myVar = setInterval(function () {myTimer()}, 100);

var recentlySwipedCounter = -1;

function myTimer() {
	if(divID == prevDivID)
	{
		numTicks++;
		if(numTicks == 10)
		{
			clickyTime = true;
		}
	}
	else 
	{
		prevDivID = divID;
		numTicks = 0;
	}
	if(recentlySwipedCounter != -1)
	{
		recentlySwipedCounter++;
		if(recentlySwipedCounter >= 5)
		{
			recentlySwipedCounter = -1;
		}
	}
}

//This function simulates a mouse event onto a div/element.
function simulate(element, eventName)
	{
	var options = extend(defaultOptions, arguments[2] || {});
	var oEvent, eventType = null;

	for (var name in eventMatchers)
	{
		if (eventMatchers[name].test(eventName)) { eventType = name; break; }
	}

	if (!eventType)
		throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

	if (document.createEvent)
	{
		oEvent = document.createEvent(eventType);
		if (eventType == 'HTMLEvents')
		{
			oEvent.initEvent(eventName, options.bubbles, options.cancelable);
		}
		else
		{
			oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
			options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
			options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
		}
		element.dispatchEvent(oEvent);
	}
	else
	{
		options.clientX = options.pointerX;
		options.clientY = options.pointerY;
		var evt = document.createEventObject();
		oEvent = extend(evt, options);
		element.fireEvent('on' + eventName, oEvent);
	}
	return element;
}

function extend(destination, source) {
	for (var property in source)
	  destination[property] = source[property];
	return destination;
}

var eventMatchers = {
	'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
	'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
	pointerX: 0,
	pointerY: 0,
	button: 0,
	ctrlKey: false,
	altKey: false,
	shiftKey: false,
	metaKey: false,
	bubbles: true,
	cancelable: true
}

console.log("Browser plugin installed: " + zig.pluginInstalled);
console.log("Browser plugin version: " + zig.pluginVersion);
console.log("Zig.js version: " + zig.version);
zig.addEventListener('statuschange', function() {
	console.log("Sensor connected: " + zig.sensorConnected);
});

var engager = zig.EngageUsersWithSkeleton(1);
engager.addEventListener('userengaged', function(user) {
	console.log('User engaged: ' + user.id);
});
engager.addEventListener('userdisengaged', function(user) {
	console.log('User disengaged: ' + user.id);
});
zig.addListener(engager);

engager.addEventListener('userengaged', function(user) {
	console.log('User engaged: ' + user.id);
	
	user.addEventListener('userupdate', function(user) {
			//console.log('RightHand position: ' + user.skeleton[zig.Joint.RightHand].position);
	});
});

// Create cursor and cursor dom element
var c = zig.controls.Cursor();
var ce = document.createElement('div');
ce.id = 'mycursor';

document.body.appendChild(ce);
 
// 1. show/hide cursor on session start/end
zig.singleUserSession.addEventListener('sessionstart', function(focusPosition) {
	ce.style.display = 'block';
});
zig.singleUserSession.addEventListener('sessionend', function() {
	ce.style.display = 'none';
});
 
// 2. move the cursor element on cursor move
c.addEventListener('move', function(cursor) {
	var lside = (c.x * window.innerWidth - (ce.offsetWidth / 2));
	var tside = (c.y * window.innerHeight - (ce.offsetHeight / 2));
	
	var xpos = c.x * window.innerWidth;
	var ypos = c.y * window.innerHeight;
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("mouseover", true, true, window, 1, xpos, ypos, xpos, ypos, false, false, false, false, 0, null);
	window.dispatchEvent(evt);
	//simulate(window, "mouse|over", {pointerX: xpos, pointerY: ypos});
	if(document.elementFromPoint(xpos, ypos))
	{
		console.log("DivID: " + document.elementFromPoint(xpos, ypos).id );
		if((xpos > 171 || ypos < window.innerHeight - 121))
		{
			if(clickyTime)
			{
				console.log("Clicked On: " + document.elementFromPoint(xpos, ypos).id );
				document.elementFromPoint(xpos, ypos).click();
				clickyTime = false;
			}
			else
			{
				divID = document.elementFromPoint(xpos, ypos).id;
			}
		}
	}
	
	ce.style.left = lside + "px";
	ce.style.top = tside + "px";
});
 
// 3. Add/remove 'pushed' class on cursor push/release
c.addEventListener('push', function(c) {
	ce.classList.add('pushed');
});
c.addEventListener('release', function(c) {
	ce.classList.remove('pushed');
});
 
// 4. Simulate mouse click on our virtual cursor
c.addEventListener('click', function(c) {
	var xpos = c.x * window.innerWidth;
	var ypos = c.y * window.innerHeight;
	var evt = document.createEvent("MouseEvents");
	
	evt.initMouseEvent("click", true, true, window, 1, xpos, ypos, xpos, ypos, false, false, false, false, 0, null);
	window.dispatchEvent(evt);
});
 
// Add cursor to our single user UI session
zig.singleUserSession.addListener(c);

// SwipeDetector
var swipeDetector = zig.controls.SwipeDetector();
swipeDetector.addEventListener('swipeup', function(pd) {
	console.log('SwipeDetector: Swipe Up');
	if (recentlySwipedCounter == -1)
	{
		Reveal.down();
	}
	recentlySwipedCounter = 0;
});
swipeDetector.addEventListener('swipedown', function(pd) {
	console.log('SwipeDetector: Swipe Down');
	if (recentlySwipedCounter == -1)
	{
		Reveal.up();
	}
	recentlySwipedCounter = 0;
});
swipeDetector.addEventListener('swipeleft', function(pd) {
	console.log('SwipeDetector: Swipe Left');
	if (recentlySwipedCounter == -1)
	{
		Reveal.right();
	}
	recentlySwipedCounter = 0;
});
swipeDetector.addEventListener('swiperight', function(pd) {
	console.log('SwipeDetector: Swipe Right');
	if (recentlySwipedCounter == -1)
	{
		Reveal.left();
	}
	recentlySwipedCounter = 0;
});
/*swipeDetector.addEventListener('swipe', function(dir) {
	console.log('SwipeDetector: Swipe direction: ' + dir);
});*/
zig.singleUserSession.addListener(swipeDetector);

swipeDetector.driftAmount = 200;