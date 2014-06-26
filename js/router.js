/*
*
*	Router.js
*
*	Written by RangerMauve and Collin Glass
*
*/

/*
*	Hash store for routes
*/
var routes = {};

/*
*	Adds route to hash store
*/
function route (path, templateId, dataLoader, controller) {
	routes[path] = {
		templateId: templateId,
		dataLoader: dataLoader,
		controller: controller
	};
}

/*
*	Global element for routing
*/
var el = null;  

/*
*	Main Router
*/
function router () {

	//	Returns empty promise
	function noop(){
		return Promise.resolve();
	};  
	
	// Set current url or set to root
	var url = location.pathname || '/';

	// Get route by url:
	var route = routes[url];

	// If we have a data loader then do promise stuff
	if (route.dataLoader) {
		(route.dataLoader||noop)()
		.then(render.bind(null,route.templateId))
		.then(set_view)
		.then(route.controller || noop)
		.then(function(template){
			console.log("Rendered",route,"as",template);
		}).catch(alert);
	}
}

/*
*	Set view to the #view element
*/
function set_view(html){
	console.log("Setting view..")
	el = el || document.getElementById('view');
	if (el) el.innerHTML = html;
	return el;
}

/*
*	Add an event listener on click to prevent default and use history api
*/
window.addEventListener("click",function(e){
	var target = e.target;
	var tag = target.tagName.toLowerCase();
	if(tag === "a"){
		e.preventDefault(true);
		history.pushState({},document.title,target.href);
		router();
	}
});

/*
*	Add an event listener on popstate
*/
window.addEventListener("popstate",router);

/*
*	Add an event listener on load
*/
window.addEventListener('load', router);




