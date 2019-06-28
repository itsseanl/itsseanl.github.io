
var pageURL;
var products=[];
//http://www.amazon.com/dp/ASIN/?tag=your_Associates_ID

$(document).ready(function(){
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
     pageURL = tabs[0].url;
     if (!pageURL.includes('amazon.com')){
       $('#watch').css('display','none');
     }
    return pageURL;
});
if ($('#prodImg').attr('src')=="#"){
  $('#prodImg').css('display','none');
}

onOpen();

setInterval(function(){
  $('.stocked').each(function(){
    if($(this).text().toLowerCase().includes('in stock')){
      $(this).css('color','#007600');
    }
    else{
      $(this).css('color','red');
    }
  });
},1000);
});

function onOpen(){
  if (localStorage.getItem('products')){
    var currentPrice = {};
    var savedProds = JSON.parse(localStorage.getItem('products'));
    var counter = 0;
    $(savedProds).each(function(){
      console.log($(this));
      $('body').append('<div class="product product'+ counter +'"><div class="left"><img class="pimg" src="' + $(this)[0].prodImg + '" /></div><div class="right"><a href="#" class="remove '+counter+'">remove</a><p class="pname">' + $(this)[0].prodName + '</p><p class="price">'+ $(this)[0].prodPrice + '</p><p class="stocked">'+ $(this)[0].prodAvail+'<p><a class="buy" target="_blank" href="'+ $(this)[0].prodURL +'">Buy Now</a></div></div>');

    //check each product link for updated pricing
    $.ajax({
         url: $(this)[0].prodURL,
         headers: {  'Access-Control-Allow-Origin': 'https://amazon.com' },
        dataType: 'html',
        // async: false,
        success: function(response) {
          //save each price in array
          getCurrentProd = $(response).find('#productTitle').html().replace(/^\s+|\s+$/g, '').replace(/,/g, '');

          getCurrentPrice = $(response).find('#priceblock_ourprice').html();
          //remove dollar sign
          getCurrentPrice = getCurrentPrice.replace('$','');
          $(this)[0].newPrice = getCurrentPrice;
          // currentPrice.push(getCurrentPrice);
          currentPrice[getCurrentProd] = getCurrentPrice;

          // $('#prodUpdatedPrice').html($(response).find('#priceblock_ourprice').html());
          // $('#prodPrice').css('text-decoration', 'line-through');
        }
      });
      counter++;
  });
  counter = 0;
  //check saved prices against new ones
setTimeout(function(){
  $('.loading').fadeOut();
  var counter = 0;
  console.log(currentPrice);
  $('.product').each(function(){
    var product = $(this).find(".pname").html().replace(/,/g, '');
    var price = $(this).find(".price").html().replace("$", '');
    console.log(product + ', '+ price);
    if (currentPrice[product]){
      console.log('match found');
    }
    if ( currentPrice[product] && currentPrice[product] < price ){
      $(this).find(".price").css('text-decoration','line-through');
      $(this).find(".price").after('<p class="newPrice">$'+currentPrice[product]+'</p>');
    }
    counter++;
  });
  },5000);
  }
  if(localStorage.getItem('products') == null){
    $('.loading').fadeOut();
  }
}

//add to watch list
$(document).ready(function(){
  $(document).on("click", "#watch", function(){
    $('.loading').fadeIn();

    $('#watch').css('transform','translateY(2px)');
    //limit functionality to amazon pages
    if (pageURL.includes("amazon.com")){
      //console.log(pageURL);
      $.ajax({
         url: pageURL,
         headers: {  'Access-Control-Allow-Origin': 'https://amazon.com' },
        dataType: 'html',
        success: function(response) {
          $(document).ready(function(){
            $('#prod1').css('display','flex');
            $('#prodName').html($(response).find('#productTitle').html());
            $('#prodPrice').html($(response).find('#priceblock_ourprice').html());
            $('#avail').html($(response).find('#availability').html());

            if ($('#avail').html().includes('In Stock')){
              $('#avail').css('color','#007600');
            }
            else{
              $('#avail').css('color','red');
            }
            $('#prodImg').attr('src', ($(response).find('#centerCol img:first').attr('src')));
            $('#prodImg').attr('src', ($(response).find('#landingImage').attr('data-old-hires')));

            $('#prodImg').css('display','block');
            $('.product').css('border-bottom','1px solid black');

            var products = [];
            var product =
              {
                "prodName":$('#prodName').text().replace(/^\s+|\s+$/g, ''),
                "prodPrice":$('#prodPrice').text().replace(/^\s+|\s+$/g, ''),
                "prodAvail":$('#avail').text().replace(/^\s+|\s+$/g, ''),
                "prodImg":$('#prodImg').attr('src'),
                "prodURL":pageURL + '&tag=ultimatestarterpacks-20'
              };
            if (localStorage.getItem('products')){
              console.log(localStorage.getItem('products'));

              products = JSON.parse(localStorage.getItem('products'));
              products[products.length] = product;
              $(products).each(function(){
                console.log($(this));
              });
              products = JSON.stringify(products);

              localStorage.setItem('products', products);

            }
            else{
              localStorage.setItem('products', '[' + JSON.stringify(product) + ']');
            }
            //move new product to bottom of list
            $('#prod1').appendTo('body');
            $('.loading').fadeOut();

          });
         }
      });
    }
  });
});


//remove from list/localStorage
$(document).ready(function(){
  $('.remove').on('click', function(){
    var count = this.classList;

    console.log(count[1]);
    var count = count[1];
    var currentStorage = [];
    currentStorage = JSON.parse(localStorage.getItem('products'));
    var removeSelected = [];
    if (count){
      removeSelected = currentStorage.splice(count, 1);
    }
    else{
      removeSelected = currentStorage.pop();
    }
    localStorage.setItem('products', JSON.stringify(currentStorage));
    console.log(currentStorage);
    location.reload();

  });

});
