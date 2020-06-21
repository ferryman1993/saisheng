/**
 * Created by lenovo on 2017/8/17.
 */

$(document).ready(function () {
    bindCheckAll();
    bindAction();
    bindSendMsg();
    bindEditSave();

    bindModal();
    bindSubmit();
});

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            var csrftoken = $.cookie('csrftoken');
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

function bindCheckAll() {
    $('#idCheckAll').click(function () {
        $('#tb').find(':checkbox').each(function () {
            if($('#idCheckAll').prop('checked')){
                $(this).prop('checked', true);
                $(this).parent().parent().addClass('selected')
            }else {
                $(this).prop('checked', false);
                $(this).parent().parent().removeClass('selected')
            }
        })
    })
}

function bindAction() {
    $('#action').submit(function () {
        var selected = $('select[name="action"]').val();
        var checkedBox = $('input[row-select]').filter(':checked');
        if(!selected){
            alert('必须选中某项动作');
            return false;
        }
        if(checkedBox.length==0){
            alert('必须选中某条记录');
            return false;
        }else {
            var actionCheckBox = [];
            $.each(checkedBox, function () {
                actionCheckBox.push($(this).val());
            });
            var submitInput = document.createElement('input');
            $(submitInput).attr({'type': 'hidden', 'name': 'checkbox', 'value': JSON.stringify(actionCheckBox)});
            $(this).append(submitInput);
            return true;
        }
    })
}

/*
 *  Job management binding SMS notification events
 */
function bindSendMsg() {
    var SendSmsBtn = $("#tb a[class='sms-notice']");
    SendSmsBtn.click(function () {
        var sendTo = $(this).parent().parent().find("td input[type='checkbox']").val();
        $.ajax({
            url: '/mentor/send_sms/',
            type: 'POST',
            data: {
                sendType: 'homework',
                sendTo: sendTo
            }

        })
    })
}

/*
 *  获取发生过变化的的select OR input 的val
 *  {'id-2-score': 'newVal'}
 */
function bindEditSave() {
    $("input[name='_save']").click(function () {
        var editSelectArray = $("select[data-tag='editable']");
        var editInputArray = $("input[data-tag='editable']");
        var ajaxData = {};
        $.each(editSelectArray, function () {
            var editName = $(this).attr('name');
            var orginVal = $(this).attr('orgin_val');
            var newVal = $(this).val();
            if (orginVal != newVal){
                // != Said the change   {'id-2-score': newVal}
                ajaxData[editName] = newVal;
            }
        });

        if (!$.isEmptyObject(ajaxData)){
            $.ajax({
                url: '',
                type: 'put',
                data: JSON.stringify(ajaxData),
                dataType: 'json',
                success: function (response) {
                    if (response.status){
                        alert('成功修改' + response['success_count'] + '条数据.')
                    }
                }
            })
        }
    })
}

function hide_func(text,title,htmls) {
    if(text){
            var span = document.createElement("span");
            $(span).attr("class","form-control modaltext");
            $(span).text(text);
            var div=document.createElement("div");
            $(div).text(title);
            $(htmls).append($(div));
            $(htmls).append($(span))

        }else {
            var span = document.createElement("textarea");
            $(span).attr("class","form-control modaltext");
            var div=document.createElement("div");
            $(div).text(title);
            $(htmls).append($(div));
            $(htmls).append($(span))
        }
}

function bindModal() {
    $("#tb").on("click",".edithomework",function () {
        $('#myModal').modal('show');
        var note=$(this).parent().next().text();
        var mentor_comment=$(this).parent().next().next().text();
        var check_date=$(this).parent().prev().prev().text();
        if (note&&mentor_comment){
            $("#_submit").attr("style","display:none");
        } else {
            $("#_submit").attr("style","display:true");
            $("#_submit").attr("nid",$(this).attr("nid"))
        }
        $("#note").empty();
        $("#mentor_comment").empty();
        if (check_date=="None"){
            $("#score_tb").attr('style',"display:true;")
        }else {
            $("#score_tb").attr('style',"display:none;")
        }
        hide_func(note,"备注",$("#note"));
        hide_func(mentor_comment,"评论",$("#mentor_comment"));
    })
}

function bindSubmit() {
    $("#_submit").click(function () {
        var note=$("#note").find("textarea").val();
        var mentor_comment=$("#mentor_comment").find("textarea").val();
        var nid=$(this).attr("nid");
        if ($("#score_tb").attr("style")=="display:true;") {
            var score = $("#score").val();
            if (score&&mentor_comment){}else {
                alert("填写评语");
                return false}
        }else {
            var score="";
        }
        $.post("{% url 'homework_correcting'%}",{"note":note,"mentor_comment":mentor_comment,"nid":nid,"score":score,'csrfmiddlewaretoken': '{{ csrf_token }}'},function(callback){
            if (callback.status==401){
                alert(callback.msg)
            }else {window.location.reload()}
        })

    });
}
