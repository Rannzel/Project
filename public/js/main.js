$(document).ready(function(){
	$(".task-form").hide();
	$('#task-icon').on('click', function(event) {
    		event.stopPropagation();
        	$(".task-form").show();
        	$(".task-text-new").hide();
        	$("#task-icon").hide();
    	});
    
    $(".task-form").on("click", function (event) {
     	event.stopPropagation();
	});

	$(".subtask-form").hide();
	$('#subtask-icon').on('click', function(event) {
    		event.stopPropagation();
        	$(".subtask-form").show();
        	$(".subtask-text-new").hide();
        	$("#subtask-icon").hide();
    	});
    
    $(".subtask-form").on("click", function (event) {
     	event.stopPropagation();
	});

	$(".icon-complete").on("click", function(event) {
		$(event.target).parent().next().children().addClass( "completed" );
		$(event.target).hide();
    	_text = $(event.target).parent().next().children().text();
    	StrikeThrough(0);
    	setToComplete($(event.target).parent().next().data("id"));
	});

	$(".details").hide();

	$(".task").on("click", function (event) {
		$($(event.target).parent().parent().next()).slideToggle( "slow", function() {
  		});
  		$.ajax({
  			url: "/select-task",
  			type: "POST",
  			contentType: "application/json",
  			data: JSON.stringify({
  				key: $(event.target).parent().data("id")
  			})
  		}).done(function(result){
  			showDetails($(event.target).parent().data("id"), result);
  		}).fail(function(err){
  			console.log(err);
  		});
	});

});

$(document).on("click", function () {
    $(".task-form").hide();
    $(".task-text-new").show();
    $("#task-icon").show();
});

// $(document).on("click", function () {
//     $(".subtask-form").hide();
//     $(".subtask-text-new").show();
//     $("#subtask-icon").show();
// });

	function deleteTask(element){
			fetch('/delete', {
				method: 'delete',
			    headers: {
			      'Content-Type': 'application/json'
			},
			body: JSON.stringify({
			   	key: element.getAttribute("data-id")
			})
			})
			.then(res => {
			    if (res.ok) return res.json()
			}).
			then(data => {
			    console.log(data)
			   window.location.reload()
			})
	}


	function setToComplete(id){
			fetch('/set-to-complete', {
				method: 'post',
			    headers: {
			      'Content-Type': 'application/json'
			},
			body: JSON.stringify({
			   	key: id
			})
			})
			.then(res => {
			    if (res.ok) return res.json()
			}).
			then(data => {
			    console.log(data)
			   window.location.reload()
			})
	}

	

function StrikeThrough(index) {
    if (index >= _text.length)
        return false;
    var sToStrike = _text.substr(0, index + 1);
    var sAfter = (index < (_text.length - 1)) ? _text.substr(index + 1, _text.length - index) : "";
    $(".completed").html("<strike>" + sToStrike + "</strike>" + sAfter);
    window.setTimeout(function() {
        StrikeThrough(index + 1);
    }, 10);
}

function showDetails(id, result){
	document.getElementById(id).innerHTML=result;
}