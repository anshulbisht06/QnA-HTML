// var sum = 0;
// var temp = 0;
function makeEditable(element){
	element.readOnly = false;
}
function makeUneditable(element){
	element.readOnly = true;
}
function insertBlank(selector) {
	document.querySelector(selector).innerHTML += ' <span class="_blank-outer">&nbsp;<span class="inline _blank blank">Answer</span></span>&nbsp; ';
}
// function sumDurations(element){
// 	sum += parseInt(element.value) - temp;
// 	temp = parseInt(element.value);
// 	console.log(sum);
// }