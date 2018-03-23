
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street +', '+ city;
    $greeting.text('So you live at'+ address);
    var imageurl = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + address + "&key=AIzaSyBbfBtbWRONeN9qJuDDJia2-wPramkA1Mk";
    $body.append('<img class="bgimg" src="'+imageurl+'">');
    // YOUR CODE GOES HERE!
    var nytimesurl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="+ address +"&sort=newest&api-key=ec2691c3f8f54ed7a8d28ed246d9651b";
    $.getJSON(nytimesurl, function(data){
      $nytHeaderElem.text('New York Times Articles about'+ address);
      var articles = data.response.docs;
      for(var i = 0; i < articles.length; i++){
        var article = articles[i];
        $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>');
      }
    }).fail(function(e){
      $nytHeaderElem.text('Sorry the articles couldn\'t be loaded');
    });
    var settimeout =setTimeout(function(){
      $wikiElem.text('failed to load wikipedia resource');
    }, 8000);

    var wikiurl = "http://en.wikipedia.org/w/api.php?action=opensearch&search="+city+"&format=json&calback=wikiCallback";
    $.ajax({
      url : wikiurl,
      dataType : "jsonp",
      jsonp : 'callback',
      success : function(response){
        var articlelist = response[1];
        for (var i=0;i<articlelist.length;i++){
          var articlestr = articlelist[i];
          var url = "http://en.wikipedia,org/wiki/" +articlestr;
          $wikiElem.append('<li> <a href="'+url+'">'+ articlestr + '</a></li>');
        };
        clearTimeout(settimeout);
      }
    });
    return false;
};

$('#form-container').submit(loadData);
