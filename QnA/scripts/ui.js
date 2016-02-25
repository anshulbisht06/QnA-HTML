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
function insertBlank(selector) {
	var element = document.querySelector(selector);
	element.value += ' <<Answer>> ';
	element.focus();
}
function upload(file) {
	console.log(file); 
}