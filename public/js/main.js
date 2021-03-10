// CUSTOM JS FILE //
window.addEventListener('load',init);

function init(){
    // on page load, get data and render
    getData();
}

function getData(){
    $.ajax({
        url: '/api/get',
        type: 'GET',
        failure: function(err){
            console.log ("Could not get the data");
            return alert("Something went wrong");
        },
        success: function(data) {
            console.log(data);
            var calendars = data.calendars;
            calendars.forEach(function(currentcalendar){
                var htmlToAppend =
                '<div class="col-md-4 card">'+
                    '<h1>'+currentcalendar.day+'</h1>'+
                    '<img src="'+currentcalendar.transportation+'" />'+
                    '<div class="tagHolder">'+
                        renderTags(currentcalendar)+
                    '</div>'+
                    '<div class="control-panel">'+
                        '<a href="/api/delete/'+currentcalendar._id+'">Delete</a>'+
                        '<br/>'+
                        '<a href="/edit/'+currentcalendar._id+'">Edit</a>'+
                    '</div>'+
                '</div>'
                $('#pet-holder').append(htmlToAppend);
            })
        }
    });
}
/*
function renderTags(currentcalendar){

    var tags = '';
    for(var i = 0; i<currentcalendar.tags.length; i++){
        tags = tags +'<div class="tag">'+currentcalendar.tags[i]+'</div>'
    }

    return tags;

}
*/
