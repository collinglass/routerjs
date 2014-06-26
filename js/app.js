/*
*	App.js
*
*	Written by RangerMauve and Collin Glass
*
*/



/*
*	Render function to render file using swig.
*/
function render(file,data){
	return reqwest(file).then(function(template){
		var html = swig.render(template,{locals:data});
		console.log("Rendering",file,"with",data,"as",html);
		
		return html;
	})
}

/*
*	Route to homepage, empty promise (no data)
*/
route('/', 'home.html', function () {
	return Promise.resolve()
});  

/*
*	Page 1, contains some data and controller logic.
*/
route('/page1', 'page1.html', function () { 
	return Promise.resolve({
		greeting : 'Hello world!',
		moreText : 'Bacon ipsum...'
	});
},function(el){
	el.querySelector("p").addEventListener("click",function(){
		alert("p tag has been clicked !!");
	});
	return el;
});

/*
*	Getting data from a json file.
*/
route('/page2', 'page2.html', function () {  
	return Promise.resolve(reqwest("data.json")).then(function(data){
		data.heading = 'I\'m page two!';
		return data;
	});
});