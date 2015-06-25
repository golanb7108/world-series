/**
 * Created by gbenami on 6/15/2015.
 */

var enableLoadMore = true,
    userAge = 0,
    watcheSeries = {};

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

$(document).ready(function(){
    $('.tabs-wrapper .row').pushpin({ top: $('.tabs-wrapper').offset().top });
});


function showSeriesTitle(title) {
    Materialize.toast(title, 4000);

    var appendJade = "";
    appendJade
        += '<div id="{{id}}" style="float: left; margin-left: 0.5cm; margin-top: 0.3cm; background-color: #FFFF00; padding-top: 0.17cm; border-radius: 4px; padding-left:0.2cm; padding-right:0.1cm">'
    +       '<label style=" color: black; font-weight: bold; font-size:medium"> {{title}} </label>'
    +       '<a href="#!" class="secondary-content" style="margin-left: 1cm" onclick="deleteItem(\'{{title}}\')">'
    +             '<i class="material-icons"> delete </i></a>'
    +  '</div> ';

    appendJade = appendJade.replace('{{title}}', title);
    appendJade = appendJade.replace(/\{\{title}}/g, title);
    appendJade = appendJade.replace(/\{\{id}}/g, title);
    $("#watchedSeriesList").append(appendJade);
    $.ajax({
        url: '/addSeries?key=' + title,
        method: 'get',
        success: function(data){
            watcheSeries[title] = data;
            calcSum();
        }
    });
}

function deleteItem(title) {
    var element = document.getElementById(title);
    element.parentNode.removeChild(element);
    delete watcheSeries[title];
    calcSum();
}

function calcSum(){
    var total = 0;

    for (var property in watcheSeries) {
        total += parseInt(watcheSeries[property]);
    }

    var percent = 100 * (total / ((parseInt(sessionStorage.age) - 15) * 12 * 30 * 24 * 60));
    $('#sumAll').attr('href', '/sum?key=' + percent.toString());
}
