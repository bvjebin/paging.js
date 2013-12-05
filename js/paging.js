/*
	Paging.js v 0.1	
*/

"use strict";
;(function($){
	$.paging = function(el, options, index){
	    
	    var _this = this, 
	    	_index = index,
	    	options,
	    	_template,
	    	_$pageItems,
	    	_$paginationHolder,
	    	_totalPages,
	    	_currentPage,
	    	_totalItems;
	    
	    var _initialize = function() {
	    	_setPagingItems(_this.$el.children().first());
	    	_drawCurrentPage();
	    	_bindEvents(_this.$el);
			return;
		};

		var _init = function() {

			options = $.extend({},$.paging.defaultOptions, options);

	    	//onBeforeInit Callback
	    	//======================
			options.onBeforeInit(_this, $(el));

		    _this.$el = $(el);
		    
		    _currentPage = 1;

		    _$paginationHolder = _this.$el.children().first();

		    _totalItems = _$paginationHolder.children().length;

		    _totalPages = Math.ceil(_totalItems/options.number_of_items);;

		    //onAfterInit callback
		    //====================
			options.onAfterInit(_this, $(el));
		};

		var _setPagingItems = function($dom) {
			_$pageItems = $dom.children();
		};

		var _drawCurrentPage = function(pageNumber) {
			pageNumber = pageNumber || 1;
			if(_isPageValid(pageNumber)) {


				var number_of_items = options.number_of_items,
					totalItems = _totalItems,
					number_of_items_to_show,
					start = 0, end = 5,
					$pagerDom = _this.$el.find("ul.pager");

				//onBeforeEveryDraw Callback
				//==========================
				options.onBeforeEveryDraw(_this, $pagerDom);

				_currentPage = pageNumber;

				start = parseInt((pageNumber*number_of_items) - number_of_items);
				end = parseInt((pageNumber*number_of_items));
				
				_$paginationHolder.html("");
				for (var i = start; i < end; i++) {
					_$paginationHolder.append(_$pageItems.eq(i));
				};
				if($pagerDom && $pagerDom.length) {
					$pagerDom.replaceWith(_getPager(options.pagination_type));
				} else {
					_$paginationHolder.after(_getPager(options.pagination_type));
				}
				$pagerDom = _this.$el.find("ul.pager")

				//onFirstPage callback
				//====================
				if(_isFirstPage()) {
					$(".first, .prev", $pagerDom).attr('disabled', 'disabled');
					options.onFirstPage(_this, $pagerDom);
				}
				$(".page_"+pageNumber, $pagerDom).attr('disabled', 'disabled');

				//onLastPage callback
				//====================
				if(_isLastPage()) {
					$(".next, .last", $pagerDom).attr('disabled', 'disabled');
					options.onLastPage(_this, $pagerDom);
				}

				//onAfterEveryDraw callback
				//===========================
				options.onAfterEveryDraw(_this, $pagerDom);
			}
		};

		var _isFirstPage = function() {
			return _currentPage === 1;
		};

		var _isLastPage = function() {
			return _currentPage === _totalPages;
		};

		var _isPageValid = function(number) {
			if(number < 1) {
				return false;
			} else if(number > _totalPages) {
				return false;
			}
			return true;
		};

		var _bindEvents = function($el) {
			$el.off(".paging", '.pager button', pageEventsManager);
			$el.on('click.paging, keydown.paging', '.pager button', $el, pageEventsManager);
		};

		var pageEventsManager = function(evt) {
			var $target = $(evt.target);
			if((evt.type == 'keydown' && evt.keyCode == 13) || evt.type == 'click') {
				if($target.hasClass('next')) {
					nextPage($target);
				} else if($target.hasClass('prev')) {
					prevPage($target);
				} else if($target.hasClass('last')) {
					lastPage($target);
				} else if($target.hasClass('first')) {
					firstPage($target);
				} else {
					anyPage($target);
				}
			}
		};

		_this.getCurrentPageNumber = function() {
			return _currentPage;
		}

		var nextPage = function($target) {
			var currentPageNumber = _this.getCurrentPageNumber();
			_drawCurrentPage(currentPageNumber+1);
			$target.focus();
		};

		var prevPage = function($target) {
			var currentPageNumber = _this.getCurrentPageNumber();
			_drawCurrentPage(currentPageNumber-1);
			$target.focus();
		};

		var firstPage = function($target) {
			_drawCurrentPage(1);
			$target.focus();
		};

		var lastPage = function($target) {
			_drawCurrentPage(_this.getTotalPages());
			$target.focus();
		};

		var anyPage = function ($target) {
			_drawCurrentPage(parseInt($target.text()));
			$target.focus();
		};

		/*var _getTemplate = function() {
			if(options.template != null && options.template != "") {
				return options.template;
			} else {
				switch(options.markup) {
					case: "list":

					break;
				}
			}
		};*/

		var _pagerButtons = {
			getFirstButton: function(text) {
				return '<button class="first" type="button">'+(text||"First")+'</button>';
			},
			getLastButton: function(text) {
				return '<button class="last" type="button">'+(text||"Last")+'</button>';
			},
			getPrevButton: function(text) {
				return '<button class="prev" type="button">'+(text||"Prev")+'</button>';
			},
			getNextButton: function(text) {
				return '<button class="next" type="button">'+(text||"Next")+'</button>';
			},
			getPagerButton: function(text) {
				return '<button type="button" class="page_'+text+'">'+text+'</button>';
			}
		};

		var _getPager = function(type) {
			var pagerTemplate, pagerArray = _getPagerArray(_currentPage), theme = options.theme;
			switch(type) {
				case "prev_next":
					pagerTemplate = '<ul class="pager pager_'+_index+' '+theme+'">'+
										'<li>'+_pagerButtons.getPrevButton()+'</li>'+
										'<li>'+_pagerButtons.getNextButton()+'</li>'+
									'</ul>';
				break;
				case "first_prev_next_last":
					pagerTemplate = '<ul class="pager pager_'+_index+' '+theme+'">'+
										'<li>'+_pagerButtons.getFirstButton()+'</li>'+
										'<li>'+_pagerButtons.getPrevButton()+'</li>'+
										'<li>'+_pagerButtons.getNextButton()+'</li>'+
										'<li>'+_pagerButtons.getLastButton()+'</li>'+
									'</ul>';
				break;
				default: 
					pagerTemplate = '<ul class="pager pager_'+_index+' '+theme+'">'+
										'<li>'+_pagerButtons.getFirstButton()+'</li>'+
										'<li>'+_pagerButtons.getPrevButton()+'</li>';
					for (var _i = 0; _i < pagerArray.length; _i++) {
						pagerTemplate += '<li>'+_pagerButtons.getPagerButton(pagerArray[_i])+'</li>'; 
					};
					pagerTemplate += 	'<li>'+_pagerButtons.getNextButton()+'</li>'+
										'<li>'+_pagerButtons.getLastButton()+'</li>'+
									'</ul>';
				break;
			};
			return pagerTemplate;
		};

		var _getPagerArray = function(page) {
			var pageButtons = options.number_of_page_buttons,
				totalPages = _totalPages,
				pagerArray = [],
				currentpage = page || 1;

			if (totalPages < pageButtons) {
				for (var k = 1; k <= totalPages; k++) {
					pagerArray.push(k);
				}
			} else {
				var left = currentpage;
				var right = currentpage;
				pagerArray.push(currentpage);
				while (left >= 1 || right <= totalPages) {
					if (pagerArray.length < pageButtons) {
						if (left > 1) {
							left--;
							pagerArray.push(left);
						}

						if (right != totalPages) {
							right++;
							pagerArray.push(right);
						}
					} else {
						break;
					}
				}
				pagerArray.sort(function(a, b) {
					return a - b;
				});
			}
			return pagerArray;
		}

		var _destroy = function() {
			_this.$el.data("paging_set", null).find('ul.pager').remove();
			_$paginationHolder.html(_$pageItems);
		};


		_init();

		/*
			Public methods
		*/
		_this.getTotalPages = function() {
			return _totalPages;
		};
		_this.getCurrentPageNumber = function() {
			return _currentPage;
		};
		_this.drawPage = function(number) {
			if(number > 0) {
				_drawCurrentPage(number);
			}
		};
		_this.goToPage = _this.drawPage;
		_this.goToNextPage = function() {
			var pageNumber = _currentPage+1;
			_this.drawPage(_currentPage+1);
			return _isLastPage() ? _currentPage : pageNumber;
		};
		_this.goToPrevPage = function() {
			var pageNumber = _currentPage-1;
			_this.drawPage(pageNumber);
			return _isFirstPage() ? _currentPage : pageNumber;
		};
		_this.isFirstPage = function() {
			return _isFirstPage();
		};
		_this.isLastPage = function() {
			return _isLastPage();
		}
		_this.destroy = function() {
			_destroy();
		};

	    (function init(){
	        _initialize();
	    })();
	};

	$.paging.defaultOptions = {
		number_of_items: 2,
		pagination_type: "full_numbers",
		number_of_page_buttons: 5,
		stealth_mode: false,
		onBeforeEveryDraw: function() {},
		onAfterEveryDraw: function() {},
		onBeforeInit: function() {},
		onAfterInit: function() {},
		onFirstPage: function() {},
		onLastPage: function() {},
		theme: "blue"
	};

	$.fn.paging = function(options){
	    return this.each(function( index, element ){
	        if ( undefined == $( element ).data('paging_set') ) {
	            $( element ).data('paging_set', new $.paging( element, options, index));
	        }
	    });
	};
})(jQuery);