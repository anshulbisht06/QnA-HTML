var qTypes = ['mcq', 'objective', 'comprehension'];
var progressTypes = ['NA', 'NV', 'A'];
var navbar = $(".navbar-collapse");

// $(document).click(function (event) {
//     if (navbar.hasClass("in") === true && !$(event.target).hasClass("navbar-toggle")) {      
//         navbar.collapse('hide');
//     }
// });

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

function setInstruction(problem_type){
    var instruction = '';
    switch(problem_type){
        case 'correct value':
            instruction = 'From among the given options, Select the correct choice.';
            break;
        case 'incorrect sentence':
            instruction = 'From among the given sentences, Select the incorrect sentences and mark the correct choice.';
            break; 
        case 'coherent paragraph':
            instruction = 'Read the given statements and arrange them into coherent paragraphs.';
            break;
        case 'meaning':
            instruction = 'Identify the meanings of the given foreign words.';
            break;
        case 'antonym':
            instruction = 'Identify the antonyms of the given words.';
            break;
        case 'conclusion':
            instruction = 'Two statements are given followed by four conclusions. From the given options mark the conclusion/s that definitely follow.';
            break;
        case 'relationship':
            instruction = 'Choose the option that depicts the same relationship as the mother pair.';
            break;
        case 'best option':
            instruction = 'Read the following propositions and choose the best option that answers the questions asked.';
            break;
    }
    return instruction;
}