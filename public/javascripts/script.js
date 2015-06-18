/**
 * Created by gbenami on 6/15/2015.
 */

/* load more images once the user roles down the cursor */
$(document).ready(function(){
    $(document).scroll(function(){
        if ($(window).scrollTop() + $(window).height() >= $(document).height())
        {

            loadMore();
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
