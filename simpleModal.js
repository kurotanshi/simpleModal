(function(){

  var loader = {
    linkJS: function(scriptFile, callback) {

      var head = document.getElementsByTagName('head')[0] || null,
          locker = false,
          scriptTag = document.createElement('script');

      if (!head) { return; }

      scriptTag.type = 'text/javascript';
      scriptTag.src = scriptFile;
      scriptTag.onload = scriptTag.onreadystatechange = function() {
        if (!locker && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
          locker = true;
          callback = callback || null;
          if (typeof(callback) === 'function') { callback(); }
        }
      };
      head.appendChild(scriptTag);
      return;
    },
    linkCSS: function(cssFile, callback) {
      var head = document.getElementsByTagName('head')[0] || null,
          locker = false,
          linkTag = document.createElement('link');

      if (!head) { return; }

      linkTag.rel = 'stylesheet';
      linkTag.type = 'text/css';
      linkTag.href = cssFile;
      linkTag.onload = linkTag.onreadystatechange = function() {
        if (!locker && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
          locker = true;
          callback = callback || null;
          if (typeof(callback) === 'function') { callback(); }
        }
      };
      head.appendChild(linkTag);
      return;
    },
  };

  loader.linkCSS('//s1-t.hfcdn.com/min/b=fp/f2e_libraries/simpleModal&f=animate.min.css');

  (function ($) {
    "use strict";

    var methods = {
      init: function (options) {

        var defaults = {
          top: 'auto',
          left: 'auto',
          autoOpen: false,
          overlayOpacity: 0.5,
          overlayColor: '#000',
          overlayClose: true,
          overlayParent: 'body',
          closeOnEscape: true,
          closeButtonClass: '.modal-close',
          transitionIn: '',
          transitionOut: '',
          onOpen: false,
          onClose: false,
          zIndex: function () {
            return (function (value) {
              return value === -Infinity ? 0 : value + 1;
            }(Math.max.apply(Math, $.makeArray($('*').map(function () {
              return $(this).css('z-index');
            }).filter(function () {
              return $.isNumeric(this);
            }).map(function () {
              return parseInt(this, 10);
            })))));
          },
          resize: false,
          updateZIndexOnOpen: true,
          hasVariableWidth: false
        };

        options = $.extend(defaults, options);

        return this.each(function () {

          var o = options,
            $overlay = $('<div class="lean-overlay"></div>'),
            $modal = $(this);

          $overlay.css({
            'display': 'none',
            'position': 'fixed',
            'z-index': (o.updateZIndexOnOpen ? 0 : o.zIndex()),
            'top': 0,
            'left': 0,
            'height': '100%',
            'width': '100%',
            'background': o.overlayColor,
            'opacity': o.overlayOpacity,
            'overflow': 'auto'
          }).appendTo(o.overlayParent);

          $modal.css({
            'display': 'none',
            'background-color': 'white',
            'position' : 'fixed',
            'z-index': (o.updateZIndexOnOpen ? 0 : o.zIndex() + 1),
            'left' : parseInt(o.left, 10) > -1 ? o.left + 'px' : 50 + '%',
            'top' : parseInt(o.top, 10) > -1 ? o.top + 'px' : 50 + '%'
          });

          if( $modal.children('.modal-close').length < 1 ){
            $modal.append('<a class="modal-close" href="#">&times;</a>');
          }

          $modal.one('resize', function(){
            console.log( 1 );
            var ow = $(this).outerWidth(),
                oh = $(this).outerHeight();

            window.setTimeout(function(){
              $modal.css({
                'transition': 'wwidth .5s, height .5s, margin .5s, top .5s, left .5s',
                'margin-left' : (parseInt(o.left, 10) > -1 ? 0 : - ($modal.outerWidth() / 2)) + 'px',
                'margin-top'  : (parseInt(o.top, 10) > -1 ? 0 : - ($modal.outerHeight() / 2)) + 'px',
                'left' : parseInt(o.left, 10) > -1 ? o.left + 'px' : 50 + '%',
                'top' : parseInt(o.top, 10) > -1 ? o.top + 'px' : 50 + '%'
              });
            }.bind(this), 300);

          });

          $modal.one('openModal', function () {
            var overlayZ = o.updateZIndexOnOpen ? o.zIndex() : parseInt($overlay.css('z-index'), 10),
                modalZ = overlayZ + 1;

            if(o.transitionIn !== '' && o.transitionOut !== ''){
              $modal.removeClass(o.transitionOut).addClass(o.transitionIn);
            }

            $modal.css({
              'display' : 'block',
              'margin-left' : (parseInt(o.left, 10) > -1 ? 0 : - ($modal.outerWidth() / 2)) + 'px',
              'margin-top' : (parseInt(o.top, 10) > -1 ? 0 : - ($modal.outerHeight() / 2)) + 'px',
              'z-index': modalZ
            });

            $overlay.css({'z-index': overlayZ, 'display': 'block'});

            if (o.onOpen && typeof o.onOpen === 'function') {
              // onOpen callback receives as argument the modal window
              o.onOpen($modal[0]);
            }
          });

          $modal.one('closeModal', function () {
            if(o.transitionIn !== '' && o.transitionOut !== ''){

              $modal.removeClass(o.transitionIn).addClass(o.transitionOut);

              $modal.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $modal.css('display', 'none');
                $overlay.css('display', 'none');
                $modal.off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
              });
            }
            else {
              $modal.css('display', 'none');
              $overlay.css('display', 'none');
            }

            if (o.onClose && typeof o.onClose === 'function') {
              // onClose callback receives as argument the modal window
              o.onClose($modal[0]);
            }
          });

          // Close on overlay click
          $overlay.on('click', function () {
            if (o.overlayClose) { $modal.trigger('closeModal'); }
          });

          $(document).on('keydown', function (e) {
            // ESCAPE key pressed
            if (o.closeOnEscape && e.keyCode === 27) {
              $modal.trigger('closeModal');
            }
          });

          // Close when button pressed
          $modal.on('click', o.closeButtonClass, function (e) {
            e.preventDefault();
            $modal.trigger('closeModal');
          });

          // Automatically open modal if option set
          if (o.autoOpen) {
            $modal.trigger('openModal');
          }

        });

      } // init
    }; // methods


    $.fn.simpleModal = function (method) {

      // Method calling logic
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      }

      if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      }

      $.error('Method ' + method + ' does not exist on $.simpleModal');
    };

  }(jQuery));


  $(function() {

     $('[modal-open]').each(function(i, v){
        var target = $(v).data('target');

        if( target !== 'iframe' ) {
          $(target).css({
            'display': 'none',
            'position': 'relative',
            'padding': '1em',
            'box-shadow': '1px 1px 3px rgba(0,0,0, 0.35)',
            'background-color': 'white'
          });
        }
     });

    // button event
    $('[modal-open]').on('click', function(e) {
      e.preventDefault();
      var that = this;
      var opt = {
        overlay: 0.2,
        transitionIn: 'animated bounceInDown',
        transitionOut: 'animated bounceOutDown'
      };

      var href = $(that).attr('href'),
          target = $(that).data('target');

      var width = $(that).data('width'),
          height = $(that).data('height');

        width =  (width !== undefined) ? width + 'px' : '680px';
        height = (height !== undefined) ? height + 'px' : 'auto';

      if( target === 'iframe' ) {

        if( $('#iframe-modal').length === 0 ){

          tmpModal = $('<div>', {
            id: 'iframe-modal',
            css: { width: width, height: height }
          });

          tmpModal.appendTo('body');
        }
        else{
          tmpModal = $('#iframe-modal');
          tmpModal.css({ width: width, height: height });
        }

        tmpModal.html('<iframe style="border: none; width: 100%; height: 100%;" src="'+ href +'" />');

        tmpModal.append('<a class="modal-close" href="#">&times;</a>');

        opt.onOpen = function(){
          if( $(that).data('width') === undefined || $(that).data('height') === undefined ){

            tmpModal.css({'transition': 'height 1s, width 1s, margin .3s, top .7s, left .7s'});

            window.setTimeout( function(){
              var h = tmpModal.children('iframe').contents().height(),
                  w = tmpModal.children('iframe').contents().width();

              var outerH = $(window).height(),
                  outerW = $(window).width();

              tmpModal.css({
                'height': h + 'px',
                'width': w + 'px',
                'margin-top': 0,
                'margin-left': 0,
                'top': ((outerH - h)/2) + 'px',
                'left': ((outerW - w)/2) + 'px'
              });
            }, 500);

          }
        };

        opt.onClose = function(){
          window.setTimeout(function(){ tmpModal.empty(); }, 500);
        };

        tmpModal.simpleModal(opt).trigger('openModal');
      }
      else {
        $(target).simpleModal(opt).trigger('openModal');
      }

    });

  });

})();