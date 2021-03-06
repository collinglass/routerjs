/*
*
*	Router.js
*
*	Pair Programmed by RangerMauve and Collin Glass
*
*/

/*
*	Set global elements
*/
var NAV = document.querySelector("#nav");
var VIEW = document.querySelector("#view");

/*
*	Set streams
*/
var loadStream;
var configStream;
var tabClickStream;
var globalStream;

/*
*	Set config file stream
*/
configStream = Rx.Observable.returnValue('config.json');

/*
*	Load data from config file
*/
loadStream = configStream
	.flatMap(function(requestUrl) {
		return Rx.Observable.fromPromise(Promise.resolve(reqwest(requestUrl)));
});

/*
*	Subcribe to config data stream
*/
loadStream.subscribe(function(response) {
	var url = "/"
	history.pushState(response, document.title, url);
	// render `response` to the DOM however you wish
	setNav();
	setHTML("home");
});

/*
*	Set pop state stream
*/
popStateStream = Rx.Observable.fromEvent(window, 'popstate');

/*
*	Subscribe to popstate stream
*	Get pathname and load html for previous route
*/
popStateStream.subscribe(function(e) {
	e.preventDefault(true);
	var route;
	var url = window.location.pathname;
	// render `response` to the DOM however you wish
	url == "/" ? route = "home" : route = url.replace("/", "");

	setHTML(route);
});

/*
*	Render function to render file using swig.
*/
function render(data){
	var file = data.template;
	return reqwest(file).then(function(template){
		var html = swig.render(template,{locals:data});
		return html;
	})
}

/*
*	Set the tabs from the config file
*/
function setNav(){
	var tabs = history.state.pills;

	render({
		template: "nav.html",
		tabs: Object.keys(tabs)
	})
	.then(function(html){
		NAV.innerHTML = html;
		tabs = document.querySelectorAll('.tab');
		setTabStream(tabs);
	});
}

/*
*	Sends the data to the render func and loads the
*	returned html on the DOM
*/
function setHTML(route){
	var data = history.state.pills[route];
	render(data)
	.then(function(html){
		VIEW.innerHTML = html;
	});
}

/*
*	Set 'click' event stream on nav tabs
*
*	Called after tabs have been rendered on the dom
*/
function setTabStream(tabs) {
	tabClickStream = Rx.Observable.fromEvent(tabs, 'click');

	tabClickStream.subscribe(function(e) {
		e.preventDefault(true);
		var route;
		var url = e.target.pathname;
		// render `response` to the DOM however you wish
		url == "/" ? route = "home" : route = url.replace("/", "");
		
		history.pushState(history.state, document.title, url);
		setHTML(route);
	});
}




