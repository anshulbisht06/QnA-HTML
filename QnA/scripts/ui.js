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
function toggleWarningModal(action, bodyText, okButtonText){
    $('#warningModalBody').html(bodyText);
    $('#warningModalOKButton').html(okButtonText);
    $('#warningModal').modal(action);
}
function changeProgressValues(object) {
    var count = [0 ,0, 0];
    var totalKeys = 0;
    for(var key in object){
        if(object[key]===null)
            count[1] += 1;
        else if(object[key]===undefined)
            count[2] += 1;
        else
            count[0] += 1;        
        totalKeys+=1;
    }
    return [{ percentage: (count[0]*100)/totalKeys, count: count[0] }, { percentage: (count[1]*100)/totalKeys, count: count[1] }, { percentage: (count[2]*100)/totalKeys, count: count[2] }];
};