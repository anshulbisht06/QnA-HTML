// Requirments
// 1. Jquery
// Global var,functions ..
var time = 10;
var isTimerOn = false;
// Call on Try Now button
function ping_fn(call_count){
          if(isTimerOn){
            $.ajax({
                  url : baseURL+"ping/",
                  data : {},
                  type : "GET",
                  success : function(data) {
                    $('#msg').text("Connected ...");
                    // $('#connectionLostModal').modal('hide');
                    time = -1;
                    $('#connectionLostModal').modal('hide');
                  },
                  error : function(xhr,errmsg,err) {
                    time = time + 5*call_count+1;
                    // $('#time').text(time);
                }
                });
          }
            return false;
        }
// End