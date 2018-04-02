//BUSCA TOPO
	
jQuery(document).ready( function() {
    $('#btn-search').on('click', function(e) {
        e.preventDefault();
        $('#search').animate({width: 'toggle'}).focus();
        $('#buscar').fadeToggle(200);

    });
		
    $('#btn-config').on('click', function(e) {
        e.preventDefault();
        $('.secaoHeaderConfig').fadeToggle(200);

    });
});

//MENU TOPO
(function($) {
	$.fn.menumaker = function(options) {  
	 var cssmenu = $(this), settings = $.extend({
	   format: "dropdown",
	   sticky: false
	 }, options);
	 return this.each(function() {
	   $(this).find(".button").on('click', function(){
		 $(this).toggleClass('menu-opened');
		 var mainmenu = $(this).next('ul');
		 if (mainmenu.hasClass('open')) { 
		   mainmenu.slideToggle().removeClass('open');
		 }
		 else {
		   mainmenu.slideToggle().addClass('open');
		   if (settings.format === "dropdown") {
			 mainmenu.find('ul').show();
		   }
		 }
	   });
	   cssmenu.find('li ul').parent().addClass('has-sub');
	multiTg = function() {
		 cssmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
		 cssmenu.find('.submenu-button').on('click', function() {
		   $(this).toggleClass('submenu-opened');
		   if ($(this).siblings('ul').hasClass('open')) {
			 $(this).siblings('ul').removeClass('open').slideToggle();
		   }
		   else {
			 $(this).siblings('ul').addClass('open').slideToggle();
		   }
		 });
	   };
	   if (settings.format === 'multitoggle') multiTg();
	   else cssmenu.addClass('dropdown');
	   if (settings.sticky === true) cssmenu.css('position', 'fixed');
	resizeFix = function() {
	  var mediasize = 700;
		 if ($( window ).width() > mediasize) {
		   cssmenu.find('ul').show();
		 }
		 if ($(window).width() <= mediasize) {
		   cssmenu.find('ul').hide().removeClass('open');
		 }
	   };
	   resizeFix();
	   return $(window).on('resize', resizeFix);
	 });
	  };
	})(jQuery);

	(function($){
		$(document).ready(function(){
			$("#cssmenu").menumaker({
			   format: "multitoggle"
			});	
		});
	})(jQuery);

jQuery(document).ready(function () {
    $('a[href="/FiscalizacaoOperacional"]').on('click', function (e) {

        $('a[href="/FiscalizacaoOperacional"]').attr("href", "/FiscalizacaoOperacional?clearSession=1");

    });

    $('a[href="/RegistrarAuto"]').on('click', function (e) {

        $('a[href="/RegistrarAuto"]').attr("href", "/RegistrarAuto?clearSession=1");

    });
});
