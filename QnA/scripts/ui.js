$(document).click(function (event) {
    var navbar = $(".navbar-collapse");               
    if (navbar.hasClass("in") === true && !$(event.target).hasClass("navbar-toggle")) {      
        navbar.collapse('hide');
    }
});
function makeEditable(element){
	element.readOnly = false;
}
function makeUneditable(element){
	element.readOnly = true;
}
// function insertBlank(selector) {
// 	var element = document.querySelector(selector);
// 	element.value += ' <<Answer>> ';
// 	element.focus();
// }
function upload(file) {
	console.log(file); 
}
function sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}
function isNotEmpty(object){
   	for(var i in object){ return true;}
  	return false;
}

// in seconds
function findTotalDuration(list){
    var total = 0;
    for(var i=0;i<list.length;i++){
        total += parseInt(list[i]['duration']);
    }
    return total*60;
}
function isMCQ(value){
    if(value === 'mcq'){
        return true;
    }else if(value === 'objective'){
        return false;
    }
}