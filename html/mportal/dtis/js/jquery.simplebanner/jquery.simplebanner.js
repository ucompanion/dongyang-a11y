/* Written by Enzo Martin
 *
 * GitHub: https://github.com/EnzoMartin78/
 * Twitter: EnzoMartin
 */

;(function($, window, undefined) {

	"use strict";

	/**
	 * Simple Banner constructor
	 * @param element
	 * @param options
	 * @constructor
	 */
	var Simplebanner = function(element, options) {
		this.element = element;
		this._paused = false;
		this._timer = {};
		this._currentBanner = {};
		this._newBanner = {};
		this._bannerWidth = 0;
		this._bannerCount = 0;
		this.options = $.extend({
			arrows: true,
			indicators: true,
			pauseOnHover: true,
			autoRotate: true,
			rotateTimeout: 5000,
			animTime: 300
		}, options);
		this.init();
	};
	
	/**
     * Initializer
     */
	Simplebanner.prototype.init = function() {
		this._bannerCount = this.element.find('.bannerList li').length;
		
        // [A11y/UI Fix] 부모 컨테이너(가변 폭) 기준으로 각 배너 li의 실제 너비를 스크립트로 고정해줌
		this._bannerWidth = this.element.width();
        this.element.find('.bannerList li').css('width', this._bannerWidth + 'px');
		
		this._currentBanner = this.element.find('.bannerList li:first').addClass('current');
		
		if(this.options.indicators){
			this.buildIndicators();
		} else {
			this.element.addClass('hiddenIndicators');
		}
		if(!this.options.arrows){
			this.element.addClass('hiddenArrows');
		}
		if(this._bannerCount > 1 && this.options.autoRotate){
            console.log("starting timer on init");
			this.toggleTimer();
		}
		this.bindEvents();
	};
	
	// This sets the basic events based off the options selected
	Simplebanner.prototype.bindEvents = function() {
		var self = this;
		if(self.options.indicators){
			self.element.find('.bannerIndicator').on({
				'click': function() {
					if (!$(this).hasClass('active')) {
						var slideIndex = $(this).index();
						self._newBanner = self.element.find('.bannerList li:eq(' + slideIndex + ')');
						self.goToBanner(slideIndex);
					}
				},
				'keydown': function(e) {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						$(this).trigger('click');
					}
				}
			});
		}
		if(self.options.arrows){
            // [A11y: 단일 포인터 입력 지원] 스와이프 대체를 위한 좌우 엣지 화살표 동적 생성
            if(self.element.find('.bannerControlsWpr').length === 0) {
                var prevEdgeBtn = $('<div class="bannerControlsWpr bannerControlsPrev" aria-label="이전 배너로 이동" role="button" tabindex="0" title="이전 배너로 이동"><div class="bannerControls"></div></div>');
                var nextEdgeBtn = $('<div class="bannerControlsWpr bannerControlsNext" aria-label="다음 배너로 이동" role="button" tabindex="0" title="다음 배너로 이동"><div class="bannerControls"></div></div>');
                self.element.append(prevEdgeBtn).append(nextEdgeBtn);
            }

			self.element.find('.bannerControlsWpr').on({
				'click': function() {
					if($(this).hasClass('bannerControlsPrev')){
						self.previousBanner();
					} else {
						self.nextBanner();
					}
				},
                'keydown': function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        $(this).trigger('click');
                    }
                }
			});
		}
		if(self.options.pauseOnHover && self.options.autoRotate){
			self.element.on({
				"mouseenter": function() {
					self.toggleTimer(true);
				},
				"mouseleave": function() {
					if(!self.options.userPaused) {
						self.toggleTimer(false);
					}
				}
			});
		}
        
        // [A11y/UI Fix] 브라우저 창 크기(또는 모바일 기기 회전) 변경 시 가변 폭 대응
        $(window).on('resize', function() {
            self._bannerWidth = self.element.width();
            self.element.find('.bannerList li').css('width', self._bannerWidth + 'px');
            self.element.find('.bannerList').css('marginLeft', -self._currentBanner.index() * self._bannerWidth + 'px');
        });
	};
	
	// Goes to the next banner - loops back to the first banner
	Simplebanner.prototype.nextBanner = function() {
		if (this._currentBanner.next().length) {
			this._newBanner = this._currentBanner.next();
		} else {
			this._newBanner = this.element.find('.bannerList li:first');
		}
		this.goToBanner(this._newBanner.index());
	};

	// Goes to the previous banner - loops back to the last banner
	Simplebanner.prototype.previousBanner = function() {
		if (this._currentBanner.prev().length) {
			this._newBanner = this._currentBanner.prev();
		} else {
			this._newBanner = this.element.find('.bannerList li:last');
		}
		this.goToBanner(this._newBanner.index());
	};
	
	/**
     * Goes to a specific slide - This is called by both the Previous and Next methods as well as the Indicator buttons
     * @param slideIndex
     */
	Simplebanner.prototype.goToBanner = function(slideIndex) {
		var self = this;
		self._currentBanner.removeClass('current');
		self.element.find('.bannerIndicators .current').removeClass('current');
		self._currentBanner = self._newBanner;
		self._currentBanner.addClass('current');
		self.element.find('.bannerIndicators li:eq(' + slideIndex + ')').addClass('current');
		self.element.find('.bannerList').stop(false, true).animate({
			'marginLeft': -slideIndex * self._bannerWidth
		},self.options.animTime);
        
        // [A11y: 현재 배너 위치 정보 제공] 배너 이동 시 현재 페이지 정보 텍스트 및 스크린리더용 title 갱신
        var currentNumber = slideIndex + 1;
        self.element.find('.bannerPageInfo')
            .text(currentNumber + ' / ' + self._bannerCount)
            .attr('title', '전체 ' + self._bannerCount + '배너 중 ' + currentNumber + '번째 배너');
	};

	// Create the correct amount of indicators based off total banners
	Simplebanner.prototype.buildIndicators = function() {
		var self = this;
        // 블릿(점) 대신 텍스트 넘버링 사용 (기존 ul 비활성화)
		self.element.find('.bannerIndicators ul').hide();
		
		// [A11y: 재생 조절 가능] 배너 정지/재생 버튼 동적 추가
		if(self.options.autoRotate && self._bannerCount > 1) {
            var controlBox = $('<div class="bannerControlsBox"></div>');
            // [A11y: 현재 배너 위치 정보 제공] 현재 배너 번호 표시 (스크린리더가 1/2를 명확히 읽도록 title 제공)
            var pageInfo = $('<div class="bannerPageInfo" aria-live="polite" aria-atomic="true" title="전체 ' + self._bannerCount + '배너 중 1번째 배너">1 / ' + self._bannerCount + '</div>');
			var toggleBtn = $('<button type="button" class="bannerToggleBtn pause" aria-label="배너 정지" title="배너 정지" tabindex="0">||</button>');
            
            // 텍스트 페이지네이션과 자동재생 컨트롤을 한 묶음으로 UI 처리
            controlBox.append(pageInfo).append(toggleBtn);
			self.element.find('.bannerIndicators').append(controlBox);
            
			// [A11y: Guide 07 재생 조절 가능] 사용자가 명시적으로 정지/재생을 토글할 수 있는 이벤트 핸들러 구성
			toggleBtn.on('click', function() {
				if ($(this).hasClass('pause')) {
					$(this).removeClass('pause').addClass('play').text('▶').attr({'aria-label': '배너 재생', 'title': '배너 재생'});
					self.options.userPaused = true;
					self.toggleTimer(true); // stop timer
				} else {
					$(this).removeClass('play').addClass('pause').text('||').attr({'aria-label': '배너 정지', 'title': '배너 정지'});
					self.options.userPaused = false;
					self.toggleTimer(false); // start timer
				}
			});
		}
	};

	/**
     * Starts or stops the timer for going to the next banner
     * @param timer
     */
	Simplebanner.prototype.toggleTimer = function(timer) {
		var self = this;
		clearTimeout(self._timer);
        console.log("toggleTimer called, timer=", timer);
		if(!timer){
			self._timer = setTimeout(function(){
                console.log("timer fired! calling nextBanner");
				self.nextBanner();
				self.toggleTimer(false);
			},self.options.rotateTimeout);
		}
	};

	// jQuery wrapper method
	$.fn.simplebanner = function(options) {
		var method, args, ret = false;
		if (typeof options === "string") {
			args = [].slice.call(arguments, 0);
		}

		this.each(function() {
			var self = $(this);
			var instance = self.data("stickyInstance");
			
			if(!self.attr('id')){
				self.attr('id','simpleBanner-' + ($.fn.simplebanner._instances.length+1));
			}
			
			if (instance && options) {
				if (typeof options === "object") {
					ret = $.extend(instance.options, options);
				} else if (options === "options") {
					ret = instance.options;
				} else if (typeof instance[options] === "function") {
					ret = instance[options].apply(instance, args.slice(1));
				} else {
					throw new Error('Simple Banner has no option/method named "' + method + '"');
				}
			} else {
				instance = new Simplebanner(self, options || {});
				self.data("stickyInstance", instance);
				$.fn.simplebanner._instances.push(instance);
			}
		});
		return ret || this;
	};

	$.fn.simplebanner._instances = [];

	// Deathstar death beam
	$(document).on("pageleave", function () {
		$.each($.fn.simplebanner._instances, function() {
			this.children().off();
		});
		$.fn.simplebanner._instances = [];
	});
}($, window));