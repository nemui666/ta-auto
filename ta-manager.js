if (location.href.indexOf("?ta-auto-copy") > -1) {

  var first = true
  var btnLen = $(".btn.btn-default.break-word.approval.maw-detail-button").length

  //console.log(e)
  function loop(i) {

    return new Promise(function(resolve,reject){

      if (btnLen < i) {
        reject(0)
      }

      $(".btn.btn-default.break-word.approval.maw-detail-button:eq("+i+")").click()
      setTimeout(function(){
        // 正しい日付か
        if(!$("#current-date").text().match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)){
          reject(1)
        }
        // 前日コピーが活性化（休みは処理したくないため）
        else if ($("#copy-previous-day").attr("disabled") == "disabled") {
          reject(1)
        }

        else if (first) {
          first = false
          reject(1)
        }
        else {
          resolve()
        }

      },1000)
    }).then(function(){
      return new Promise(function(resolve,reject){
        $("#copy-previous-day").click()
          setTimeout(function(){
              resolve()
          },1000)
      })
    }).then(function(){
      return new Promise(function(resolve,reject){
        $("#save-attendance-detail-entry").click()
        setTimeout(function(){
            resolve()
        },1000)
      })
    }).then(function(){
      loop(++i)
    }).catch(function(val){
      if(val == 0){
        alert("コピー完了しました。")
      }
      if(val == 1){
        loop(++i)
      }
    })
  }
  loop(0)
}


$(document).ready(function(){
  //$(".btn.btn-default.break-word.approval.maw-detail-button").click(function(){
    var timer = setInterval(function(){
      //$("#jikancopy_button").remove()
      //$("#attendance-part1").append("<input type='button' id='jikancopy_button' value='時間コピー' onclick='jikanCopy()'></button>")

      $("#work-time-out").off()
      $("#work-time-out").focusout(function(){
        jikanCopy()
      })

      $("#work-time-in").off()
      $("#work-time-in").focusout(function(){
        jikanCopy()
      })

      $("select.form-control.small-tasks-dropdown:first").off()
      $("select.form-control.small-tasks-dropdown:first").focusout(function(){
        jikanCopy()
      })

    },500);
  //})
    var jikanCopy = () => {
      var e = $(".project-tasks-holder.borderless input.form-control.task-project-worktime:first")
      if (e.attr("disabled") !== "disabled") {
        e.val($("#total-worktime").text().replace(/[^0-9]/g,""))
        e.focus()
        e.blur()
      }
    }



    var accumulation = () => {

      $(".accumulation").remove();

      $(".borderless.border-bottom").each(function(index,element){
        $(element).append("<th class='accumulation'>累積時間</th>");
      })

      var total = 0;
      $("#attendance-table-body-bp tr").each(function(index,element){
        //e.append('<td>項目３</td>')

        var time = element.cells[5].innerText.split(":");
        if (time) {
          var mints = Number(time[0]) * 60 + Number(time[1]);
          if (!isNaN(mints)){
            total = total + mints;

            var hh = Math.floor(total/60);
            var mm = Math.floor(total%60);
            var jikan = hh+":"+mm
            $(element).append("<td class='accumulation'>"+jikan+"</td>");
          } else {
            $(element).append("<td class='accumulation'></td>");
          }

        }

      })
    }

    accumulation();
});
