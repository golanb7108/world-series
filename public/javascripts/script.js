/**
 * Created by gbenami on 6/15/2015.
 */

var enableLoadMore = true;

/* load more images once the user roles down the cursor */
$(document).ready(function(){
    $(document).scroll(function(){
        if ($(window).scrollTop() + $(window).height() >= $(document).height())
        {
            if (enableLoadMore) {
                loadMore();
            }
        }
    });

    function loadMore()
    {
        $.ajax({
            url: '/series',
            method: 'get',
            success: function(data){
                $("#bodyContent").append(data);
            }
        });
    }

});

/* Initialize the images fields on the server once the user refreshes */
$(window).bind('beforeunload',function(){
    {
        enableLoadMore = true;
        $.ajax({
            url: '/refreshTaken',
            method: 'get',
            success: function(data){
            }
        });
    }
});

/* type ahead the search box */
$(document).ready(function(){
    $('input.typeahead').typeahead({
        name: 'typeahead',
        remote: 'http://localhost:3000/search?key=%QUERY', //TODO - update this to other
        limit: 10
    });
});


function showSeriesTitle(title) {
    Materialize.toast(title, 4000);
}

$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 100 // Creates a dropdown of 15 years to control year
});

$(document).ready(function() {
    $('select').material_select();
});


$(document).ready(function(){
    $("#seriesName").keyup(function(event){
        if(event.keyCode == 13){
            enableLoadMore = false;
            $.ajax({
                url: '/series?key=' + document.getElementById('seriesName').value,
                method: 'get',
                success: function(data){
                    $("#bodyContent").html(data);
                }
            });
        }
    });
});
