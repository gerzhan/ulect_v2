(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'backbone'], function($, Backbone) {
    var BaseSlider;
    return BaseSlider = (function(_super) {
      __extends(BaseSlider, _super);

      function BaseSlider() {
        this._stopMotion = __bind(this._stopMotion, this);
        this._move = __bind(this._move, this);
        this._startMotion = __bind(this._startMotion, this);
        return BaseSlider.__super__.constructor.apply(this, arguments);
      }

      BaseSlider.prototype.initialize = function() {
        this.$handle = this.$el.find('.handle');
        this.$viewed = this.$el.find('.viewed');
        return this.moving = false;
      };

      BaseSlider.prototype.render = function() {};

      BaseSlider.prototype.events = {
        'mousedown': '_startMotion'
      };

      BaseSlider.prototype._startMotion = function(evt) {
        this.moving = true;
        this._updatePosition(evt, false);
        $(document).on('mousemove', this._move);
        $(document).on('mouseup', this._stopMotion);
        return false;
      };

      BaseSlider.prototype._move = function(evt) {
        return this._updatePosition(evt, false);
      };

      BaseSlider.prototype._stopMotion = function(evt) {
        $(document).off('mousemove', this._move);
        $(document).off('mouseup', this._stopMotion);
        this._updatePosition(evt, true);
        return this.moving = false;
      };

      BaseSlider.prototype._updatePosition = function(evt, finalize) {
        var p, w, x;
        x = evt.pageX - this.$el.offset().left;
        w = this.$el.width();
        x = Math.max(0, Math.min(w, x));
        this._setHandlePosition(x);
        this.position = p = x / w;
        if (finalize) {
          return this.trigger('change', p);
        }
      };

      BaseSlider.prototype._setHandlePosition = function(x) {
        var rx;
        rx = Math.round(x);
        this.$handle.css('left', "" + rx + "px");
        return this.$viewed.css('width', "" + rx + "px");
      };

      BaseSlider.prototype.setPosition = function(p, triggerEvt) {
        var x;
        if (triggerEvt == null) {
          triggerEvt = false;
        }
        if (this.moving) {
          return;
        }
        x = this.$el.width() * p;
        this._setHandlePosition(x);
        if (triggerEvt) {
          return this.trigger('change', p);
        }
      };

      return BaseSlider;

    })(Backbone.View);
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'backbone', 'log'], function($, Backbone, log) {
    var ControlsView;
    return ControlsView = (function(_super) {
      __extends(ControlsView, _super);

      function ControlsView() {
        return ControlsView.__super__.constructor.apply(this, arguments);
      }

      ControlsView.prototype.initialize = function() {
        this.$playPause = this.$el.find('.playpause');
        this.$time = this.$el.find('.time');
        this.$totalSlides = this.$el.find('.total');
        return this.$currentSlide = this.$el.find('.current');
      };

      ControlsView.prototype.events = {
        'click .prev': function() {
          return this.trigger('prev');
        },
        'click .next': function() {
          return this.trigger('next');
        },
        'click .playpause': function() {
          return this.trigger('playpause');
        }
      };

      ControlsView.prototype.render = function() {
        this.timeline = this.model.get('timeline');
        this.$totalSlides.html(this.timeline.slides.length);
        this.$currentSlide.html('--');
        return this.listenTo(this.timeline, 'change:slide', this._onSlideChanged);
      };

      ControlsView.prototype._onSlideChanged = function(slide) {
        return this.$currentSlide.html(slide.index + 1);
      };

      ControlsView.prototype.setIsPlaying = function(isPlaying) {
        if (isPlaying) {
          this.$playPause.removeClass('icon-play');
          return this.$playPause.addClass('icon-pause');
        } else {
          this.$playPause.removeClass('icon-pause');
          return this.$playPause.addClass('icon-play');
        }
      };

      ControlsView.prototype.setTimeString = function(ts) {
        if (ts === this.ts) {
          return;
        }
        this.$time.html(ts);
        return this.ts = ts;
      };

      return ControlsView;

    })(Backbone.View);
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'backbone', 'store', 'timeline', 'pdf-view', 'video-player', 'base-slider', 'slider', 'slides-view', 'controls-view', 'log'], function($, Backbone, store, Timeline, PDFView, VideoPlayer, BaseSlider, Slider, SlidesView, ControlsView, log) {
    var LectureView;
    return LectureView = (function(_super) {
      __extends(LectureView, _super);

      function LectureView() {
        this._onModelLoaded = __bind(this._onModelLoaded, this);
        return LectureView.__super__.constructor.apply(this, arguments);
      }

      LectureView.prototype.initialize = function() {
        this.pdfView = new PDFView($('#pdf-container'));
        this.listenTo(this.model, 'sync', this._onModelLoaded);
        return this.listenTo(this.model, 'error', function() {
          return log('model error:', arguments);
        });
      };

      LectureView.prototype._onModelLoaded = function() {
        log('model loaded:', this.model.attributes);
        this.modelLoaded = true;
        return this._tryInitVideo();
      };

      LectureView.prototype.initVideo = function() {
        log('YouTube API ready');
        this.youTubeAPIReady = true;
        return this._tryInitVideo();
      };

      LectureView.prototype._tryInitVideo = function() {
        log("_tryInitVideo: model " + this.modelLoaded + ", YouTube " + this.youTubeAPIReady);
        if (!(this.modelLoaded && this.youTubeAPIReady)) {
          return;
        }
        this.player = new VideoPlayer({
          el: '#videoplayer',
          videoId: this.model.get('videoId')
        });
        return this.listenTo(this.player, 'ready', this._onPlayerReady);
      };

      LectureView.prototype._onPlayerReady = function() {
        log('player ready, video duration:', this.player.duration);
        this.videoReady = true;
        return this._init();
      };

      LectureView.prototype._init = function() {
        var getStoredVol, showUI, slides, storeVol, vol;
        log('_init');
        log('everything is ready, initializing timeline, loading PDF');
        slides = this.model.get('slides');
        this.timeline = new Timeline(slides, this.player.duration);
        this.model.set('timeline', this.timeline);
        this.slider = new Slider({
          model: this.model,
          el: '#slider'
        });
        this.volSlider = new BaseSlider({
          el: '#vol-slider'
        });
        this.slides = new SlidesView({
          model: this.model,
          el: "#slides"
        });
        this.controls = new ControlsView({
          el: "#controls",
          model: this.model
        });
        this.slider.render();
        this.slides.render();
        this.controls.render();
        this.pdfView.setMaxHeight(this.player.height());
        this.pdfView.load(this.model.get('pdf'));
        this.listenTo(this.timeline, 'change:slide', this._onSlideChanged);
        this.listenTo(this.player, 'sync', this._onPlayerSync);
        this.listenTo(this.slider, 'change', function(p) {
          return this.player.seek(p);
        });
        this.controls.on('playpause', this.player.playPause, this.player);
        this.player.on('playing', this.controls.setIsPlaying, this.controls);
        this.controls.on('next', this.timeline.gotoNextSlide, this.timeline);
        this.controls.on('prev', this.timeline.gotoPrevSlide, this.timeline);
        if (store.enabled) {
          log('store enabled');
          getStoredVol = function() {
            return store.get('volume');
          };
          storeVol = function(v) {
            return store.set('volume', v);
          };
        } else {
          getStoredVol = function() {};
          storeVol = function() {};
        }
        vol = getStoredVol();
        if (vol) {
          vol = +vol;
          this.player.volume(vol);
        } else {
          vol = this.player.volume();
          storeVol(vol);
        }
        this.volSlider.setPosition(vol / 100);
        this.listenTo(this.volSlider, 'change', function(p) {
          vol = 100 * p;
          storeVol(vol);
          return this.player.volume(vol);
        });
        showUI = function() {
          log('actually showing UI');
          return $('#loading').hide();
        };
        return this.pdfView.once('rendered', function() {
          log('PDF rendered, showing UI after delay');
          return setTimeout(showUI, 100);
        });
      };

      LectureView.prototype._onSlideChanged = function(slide, isJump) {
        this.slider.setPosition(slide.timePercent);
        if (isJump) {
          this.player.seek(slide.timePercent);
        }
        return this.pdfView.displayPage(slide.page);
      };

      LectureView.prototype._onPlayerSync = function(t, T) {
        this.slider.setPosition(t / T);
        this.timeline.updateTime(t);
        return this.controls.setTimeString(this.timeline.getTimeString());
      };

      return LectureView;

    })(Backbone.View);
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone'], function(Backbone) {
    var Lecture;
    return Lecture = (function(_super) {
      __extends(Lecture, _super);

      function Lecture() {
        return Lecture.__super__.constructor.apply(this, arguments);
      }

      Lecture.baseUrl = '';

      Lecture.prototype.urlRoot = function() {
        return Lecture.baseUrl;
      };

      Lecture.prototype.url = function() {
        return "" + Lecture.__super__.url.apply(this, arguments) + ".json";
      };

      return Lecture;

    })(Backbone.Model);
  });

}).call(this);

(function() {
  var __slice = [].slice;

  define([], function() {
    if (typeof (typeof console !== "undefined" && console !== null ? console.log : void 0) === 'function') {
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return console.log.apply(console, args);
      };
    } else {
      return function() {};
    }
  });

}).call(this);

(function() {
  requirejs.config({
    paths: {
      'underscore': 'libs/underscore',
      'jquery': 'libs/jquery',
      'backbone': 'libs/backbone',
      'store': 'libs/store',
      'pdfjs': 'libs/pdfjs/pdf',
      'pdfjs-compat': 'libs/pdfjs/compatibility'
    },
    shim: {
      'pdfjs': {
        deps: ['pdfjs-compat'],
        init: function() {
          this.PDFJS.workerSrc = 'js/libs/pdfjs/pdf.worker.js';
          return this.PDFJS;
        }
      },
      'underscore': {
        exports: '_'
      },
      'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      }
    }
  });

  define(['module', 'jquery', 'lecture', 'lecture-view', 'log'], function(module, $, Lecture, LectureView, log) {
    var config, lecture, onYouTubeReady, view;
    config = module.config();
    Lecture.baseUrl = config.baseUrl;
    lecture = new Lecture({
      id: config.lecture
    });
    lecture.fetch();
    view = new LectureView({
      model: lecture
    });
    onYouTubeReady = function() {
      log('YouTube API initialized');
      return view.initVideo();
    };
    return {
      onYouTubeReady: onYouTubeReady
    };
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['underscore', 'backbone', 'pdfjs', 'log'], function(_, Backbone, PDFJS, log) {
    var PDFView;
    PDFView = (function() {
      function PDFView($el) {
        this.$el = $el;
        this._renderPage = __bind(this._renderPage, this);
        this._onPDFReady = __bind(this._onPDFReady, this);
        this.ready = false;
        this.canvas = ($el.find('canvas'))[0];
        this.ctx = this.canvas.getContext('2d');
      }

      PDFView.prototype.setMaxHeight = function(maxHeight) {
        this.maxHeight = maxHeight;
        return this.$el.height(maxHeight);
      };

      PDFView.prototype.load = function(url) {
        this.url = url;
        return PDFJS.getDocument(url).then(this._onPDFReady);
      };

      PDFView.prototype._onPDFReady = function(pdfDoc) {
        this.pdfDoc = pdfDoc;
        this.ready = true;
        if (this.pageNum == null) {
          return this.displayPage(1);
        }
      };

      PDFView.prototype.displayPage = function(pageNum) {
        if (this.pageNum === pageNum) {
          return;
        }
        this.pageNum = pageNum;
        if (!this.ready) {
          return;
        }
        return this.pdfDoc.getPage(pageNum).then(this._renderPage);
      };

      PDFView.prototype._renderPage = function(page) {
        var scale, scaleX, scaleY, viewport;
        log("displaying page", page);
        scaleY = this.maxHeight / page.view[3];
        scaleX = this.$el.width() / page.view[2];
        scale = Math.min(scaleX, scaleY);
        log('pdf-view scaleX:', scaleX, 'scaleY:', scaleY, 'scale:', scale);
        viewport = page.getViewport(scale);
        this.canvas.width = viewport.width;
        this.canvas.height = viewport.height;
        return page.render({
          canvasContext: this.ctx,
          viewport: viewport
        }).then((function(_this) {
          return function() {
            return _this.trigger('rendered');
          };
        })(this)());
      };

      return PDFView;

    })();
    _.extend(PDFView.prototype, Backbone.Events);
    return PDFView;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', './base-slider'], function($, BaseSlider) {
    var Slider;
    return Slider = (function(_super) {
      __extends(Slider, _super);

      function Slider() {
        return Slider.__super__.constructor.apply(this, arguments);
      }

      Slider.prototype.initialize = function() {
        Slider.__super__.initialize.apply(this, arguments);
        this.$marks = this.$el.find('.marks');
        return this.listenTo(this.model, 'change:timeline', this.render);
      };

      Slider.prototype.render = function() {
        var duration, marksHtmls, slide, time, timePercent, timeline, _i, _len, _ref;
        Slider.__super__.render.apply(this, arguments);
        timeline = this.model.get('timeline');
        duration = timeline.duration;
        marksHtmls = [];
        _ref = timeline.slides;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          slide = _ref[_i];
          time = slide.time;
          timePercent = (Math.round(100 * 100 * time / duration)) / 100;
          marksHtmls.push("<div class=\"mark\" style=\"left: " + timePercent + "%\" data-title=\"" + slide.title + "\"></div>");
        }
        this.$marks.html(marksHtmls.join('\n'));
        this.undelegateEvents();
        this.delegateEvents();
      };

      return Slider;

    })(BaseSlider);
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'jquery', 'backbone', 'log'], function(_, $, Backbone, log) {
    var SlidesView;
    return SlidesView = (function(_super) {
      __extends(SlidesView, _super);

      function SlidesView() {
        this.updateSize = __bind(this.updateSize, this);
        return SlidesView.__super__.constructor.apply(this, arguments);
      }

      SlidesView.prototype.events = {
        'click .slide': '_onSlideClicked'
      };

      SlidesView.prototype.initialize = function() {
        this.timeline = this.model.get('timeline');
        this.listenTo(this.timeline, 'change:slide', this._onSlideChanged);
        return $(window).resize(_.debounce(this.updateSize, 300));
      };

      SlidesView.prototype.render = function() {
        var $slide, $slides, $timeLabel, $timeLabels, html, maxTimeLabelW, slide, slides, timeLabelW, timeLabelsWidths, timeline, _i, _len;
        this.$el.empty();
        timeline = this.timeline;
        slides = timeline.slides;
        $slides = [];
        $timeLabels = [];
        timeLabelsWidths = [];
        maxTimeLabelW = 0;
        for (_i = 0, _len = slides.length; _i < _len; _i++) {
          slide = slides[_i];
          html = "<a title=\"" + slide.title + "\" href=\"javascript:void(0);\" class=\"slide\" data-index=\"" + slide.index + "\"><span class=\"time\">" + (slide.getTimeString()) + "</span>" + slide.title + "</div>";
          $slide = $(html);
          $slides[slide.index] = $slide;
          this.$el.append($slide);
          $timeLabel = $slide.find('.time');
          $timeLabels[slide.index] = $timeLabel;
          timeLabelW = $timeLabel.outerWidth();
          timeLabelsWidths[slide.index] = timeLabelW;
          if (timeLabelW > maxTimeLabelW) {
            maxTimeLabelW = timeLabelW;
          }
        }
        this.slides = slides;
        this.$slides = $slides;
        this.$timeLabels = $timeLabels;
        this.timeLabelsWidths = timeLabelsWidths;
        return this.updateSize();
      };

      SlidesView.prototype.updateSize = function() {
        var $colTimeLabels, $slide, $timeLabels, colLeft, h, i, l, maxColTimeLabelW, timeLabelsWidths, updateColTimeLabels, w, _i, _len, _ref;
        h = $(window).height() - this.$el.offset().top - 5;
        this.$el.height(Math.max(0, h));
        $timeLabels = this.$timeLabels;
        timeLabelsWidths = this.timeLabelsWidths;
        colLeft = null;
        $colTimeLabels = [];
        maxColTimeLabelW = 0;
        updateColTimeLabels = function() {
          var $timeLabel, _i, _len;
          for (_i = 0, _len = $colTimeLabels.length; _i < _len; _i++) {
            $timeLabel = $colTimeLabels[_i];
            $timeLabel.css('width', "" + maxColTimeLabelW + "px");
          }
          $colTimeLabels = [];
          return maxColTimeLabelW = 0;
        };
        _ref = this.$slides;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          $slide = _ref[i];
          if (!$slide) {
            continue;
          }
          l = $slide.offset().left;
          if (colLeft === null) {
            colLeft = l;
          } else if (l > colLeft + 5) {
            updateColTimeLabels();
            colLeft = l;
          }
          w = timeLabelsWidths[i];
          if (w > maxColTimeLabelW) {
            maxColTimeLabelW = w;
          }
          $colTimeLabels.push($timeLabels[i]);
        }
        return updateColTimeLabels();
      };

      SlidesView.prototype.setTopPosition = function(posInPx) {
        return this.$el.css('top', "" + posInPx + "px");
      };

      SlidesView.prototype._onSlideClicked = function(e) {
        var $slideLink, index;
        $slideLink = $(e.target).closest('.slide');
        index = Number($slideLink.attr('data-index'));
        return this.timeline.gotoSlideWithIndex(index);
      };

      SlidesView.prototype._onSlideChanged = function(slide) {
        var $slide, dScroll, l, r, vr;
        if (this.$curentSlide) {
          this.$curentSlide.removeClass('selected');
        }
        $slide = this.$slides[slide.index];
        this.$curentSlide = $slide;
        $slide.addClass('selected');
        dScroll = 0;
        l = $slide.position().left;
        if (l < 0) {
          dScroll = l;
        } else {
          r = l + $slide.outerWidth();
          vr = this.$el.width();
          if (r > vr) {
            dScroll = r - vr;
          }
        }
        if (dScroll !== 0) {
          return this.$el.animate({
            scrollLeft: this.$el.scrollLeft() + dScroll
          }, 250);
        }
      };

      return SlidesView;

    })(Backbone.View);
  });

}).call(this);

(function() {
  define(['underscore', 'backbone', 'log'], function(_, Backbone, log) {
    var PRECISION_SEC, SECS, Timeline, getTimeString, parseTime, zeroPad;
    PRECISION_SEC = 0.1;
    SECS = [60, 60, 24];
    parseTime = function(timeStr) {
      var hms, i, l, m, t;
      hms = timeStr.split(':');
      t = 0;
      i = 0;
      m = 1;
      l = hms.length;
      while (i < l) {
        t += m * hms[l - i - 1];
        m *= SECS[i++];
      }
      return t;
    };
    zeroPad = function(n) {
      if (n < 10) {
        return '0' + n;
      } else {
        return '' + n;
      }
    };
    getTimeString = function() {
      var h, m, s;
      s = Math.round(this.time);
      h = Math.floor(s / (60 * 60));
      s -= 60 * 60 * h;
      m = Math.floor(s / 60);
      s -= 60 * m;
      if (h > 0) {
        return "" + (zeroPad(h)) + ":" + (zeroPad(m)) + ":" + (zeroPad(s));
      } else {
        return "" + (zeroPad(m)) + ":" + (zeroPad(s));
      }
    };
    Timeline = (function() {
      function Timeline(slides, duration) {
        this.slides = slides;
        this.duration = duration;
        this._fixSlides();
        this.currentIndex = -1;
        this.slide = null;
        this.start = 0;
        this.finish = this.slides[0].time;
      }

      Timeline.prototype._fixSlides = function() {
        var duration, index, slide, _i, _len, _ref;
        duration = this.duration;
        _ref = this.slides;
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          slide = _ref[index];
          slide.index = index;
          slide.time = parseTime(slide.time);
          slide.getTimeString = getTimeString;
          slide.timePercent = slide.time / duration;
        }
      };

      Timeline.prototype._setCurrentIndex = function(index) {
        var slide, slides;
        this.currentIndex = index;
        slides = this.slides;
        slide = slides[index];
        this.slide = slide;
        this.start = slide.time;
        this.time = this.start;
        this.finish = index + 1 < slides.length ? slides[index + 1].time : Math.POSITIVE_INFINITY;
        return log('Timeline::_setCurrentIndex', index, 'time interval ', this.start, this.finish);
      };

      Timeline.prototype.updateTime = function(time) {
        var i, nextSlide, slides, total;
        this.time = time;
        if (!((this.start - PRECISION_SEC < time && time < this.finish + PRECISION_SEC))) {
          slides = this.slides;
          total = slides.length;
          i = 0;
          while (i < total - 1) {
            nextSlide = slides[i + 1];
            if (time < nextSlide.time) {
              break;
            }
            ++i;
          }
          this._setCurrentIndex(i);
          return this.trigger('change:slide', this.slide, false);
        }
      };

      Timeline.prototype.gotoSlideWithIndex = function(index) {
        log('Timeline::gotoSlideWithIndex', index);
        if (index === this.currentIndex || this.slides.length === 0) {
          return;
        }
        this._setCurrentIndex(Math.max(0, Math.min(this.slides.length - 1, index)));
        return this.trigger('change:slide', this.slide, true);
      };

      Timeline.prototype.gotoNextSlide = function() {
        return this._gotoSlideRel(+1);
      };

      Timeline.prototype.gotoPrevSlide = function() {
        return this._gotoSlideRel(-1);
      };

      Timeline.prototype._gotoSlideRel = function(d) {
        var index;
        index = Math.max(0, Math.min(this.slides.length - 1, this.currentIndex + d));
        return this.gotoSlideWithIndex(index);
      };

      Timeline.prototype.getTimeString = getTimeString;

      return Timeline;

    })();
    _.extend(Timeline.prototype, Backbone.Events);
    return Timeline;
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'jquery', 'backbone', 'log'], function(_, $, Backbone, log) {
    var VideoPlayer;
    return VideoPlayer = (function(_super) {
      __extends(VideoPlayer, _super);

      function VideoPlayer() {
        this._onSync = __bind(this._onSync, this);
        this._onPlayerStateChange = __bind(this._onPlayerStateChange, this);
        return VideoPlayer.__super__.constructor.apply(this, arguments);
      }

      VideoPlayer.prototype.initialize = function(options) {
        var _ref;
        this.vol = 100;
        this.ready = false;
        this.playing = false;
        log('VideoPlayer.initialize, video ID:', options.videoId);
        return this.player = new YT.Player('videoplayer', _.extend({
          width: String(this.$el.width()),
          videoId: options.videoId,
          playerVars: {
            controls: 0,
            modestbranding: 1,
            showinfo: 0,
            rel: 0
          },
          events: {
            onReady: (function(_this) {
              return function() {
                _this.player.setVolume(0);
                return _this.player.playVideo();
              };
            })(this),
            onStateChange: this._onPlayerStateChange
          }
        }, (_ref = options.ytOptions) != null ? _ref : {}));
      };

      VideoPlayer.prototype.height = function() {
        return $(this.player.getIframe()).outerHeight();
      };

      VideoPlayer.prototype._onPlayerReady = function() {
        log('player ready');
        this.player.pauseVideo();
        this.player.seekTo(0);
        this.player.setVolume(100);
        this.ready = true;
        return this.trigger('ready');
      };

      VideoPlayer.prototype._onPlayerStateChange = function(state) {
        if (!this.ready) {
          this.duration = this.player.getDuration();
          log('player init: state ' + state.data + ', duration', this.duration);
          if (this.duration > 0) {
            return this._onPlayerReady();
          }
        } else {
          log('_onPlayerStateChange:', state);
          return this._setPlaying(state.data === YT.PlayerState.PLAYING);
        }
      };

      VideoPlayer.prototype.volume = function(vol) {
        if (vol === void 0) {
          if (this.ready) {
            return this.player.getVolume();
          } else {
            return this.vol;
          }
        } else {
          if (this.ready) {
            this.player.setVolume(vol);
          }
          return this.vol = vol;
        }
      };

      VideoPlayer.prototype.playPause = function() {
        if (this.playing) {
          return this.pause();
        } else {
          return this.play();
        }
      };

      VideoPlayer.prototype.play = function() {
        if (this.playing) {
          return;
        }
        return this.player.playVideo();
      };

      VideoPlayer.prototype.pause = function() {
        if (!this.playing) {
          return;
        }
        return this.player.pauseVideo();
      };

      VideoPlayer.prototype.seek = function(p) {
        var sec;
        sec = p * this.duration;
        log("VideoPlayer.seek, perc " + p + ", sec " + sec + " of " + this.duration);
        this._setPlaying(false, false);
        this.trigger('sync', sec, this.duration);
        return this.player.seekTo(sec, true);
      };

      VideoPlayer.prototype._setPlaying = function(playing, notify) {
        if (notify == null) {
          notify = true;
        }
        if (this.playing === playing) {
          return;
        }
        this.playing = playing;
        if (playing) {
          this._syncIntvId = setInterval(this._onSync, 300);
        } else {
          clearInterval(this._syncIntvId);
        }
        if (notify) {
          return this.trigger('playing', playing);
        }
      };

      VideoPlayer.prototype._onSync = function() {
        var t;
        t = this.player.getCurrentTime();
        this.time = t;
        return this.trigger('sync', t, this.duration);
      };

      return VideoPlayer;

    })(Backbone.View);
  });

}).call(this);