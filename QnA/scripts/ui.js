var qTypes = ['mcq', 'objective', 'comprehension'];
var progressTypes = ['NA', 'NV', 'A'];
$(document).click(function (event) {
    var navbar = $(".navbar-collapse");               
    if (navbar.hasClass("in") === true && !$(event.target).hasClass("navbar-toggle")) {      
        navbar.collapse('hide');
    }
    $('[data-toggle="popover"]').popover();
});

function showAlert(type, msg){
    $('#notification').removeClass('alert-danger').removeClass('alert-success').removeClass('alert-info').removeClass('alert-warning').addClass(type).html(msg).show();
    setTimeout(closeAlert, 5000);
}

function closeAlert(){
    $("#notification").fadeTo(0, 500).slideUp(500, function(){
        $("#notification").hide();
    });
}

function makeEditable(element){
	element.readOnly = false;
}

function makeUneditable(element){
	element.readOnly = true;
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
    return total;
}

function toggleWarningModal(action, bodyText, okButtonText){
    $('#warningModalBody').html(bodyText);
    $('#warningModal').modal(action);
}

function changeProgressValues(object) {
    var count = [0 ,0, 0];
    var totalKeys = 0;
    for(var key in object){
        var value = object[key]['status'];
        if(value==="NV")
            count[1] += 1;
        else if(value==="NA")
            count[2] += 1;
        else if(value==="A")
            count[0] += 1;        
        totalKeys+=1;
    }
    return [{ percentage: (count[0]*100)/totalKeys, count: count[0] }, { percentage: (count[1]*100)/totalKeys, count: count[1] }, { percentage: (count[2]*100)/totalKeys, count: count[2] }];
};

// function shuffle(array) {
//   var currentIndex = array.length, temporaryValue, randomIndex;
//   while (currentIndex!==0) {
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }
//   return array;
// }

function makeArray(size){
    var array = [];
    for(var i=1;i<=size;i++){
        array.push(i);
    }
    return array;
}

function findIndexOfObjectInsideList(list, quizId){
    for(var i=0;i<list.length;i++){
        if(list[i].id===quizId){
            return i;
        }
    }
    return -1;
}