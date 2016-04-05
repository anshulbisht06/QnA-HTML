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
                    time = -1;
                    $('#connectionLostModal').hide();
                    location.reload();
                  },
                  error : function(xhr,errmsg,err) {
                    time = time + 5*call_count+1;
                }
                });
          }
            return false;
        }
// End