// PICTUE — OpenSpace.ai Interactive Behaviors & Animations
(function(){
  "use strict";

  /* Sticky nav with backdrop blur */
  var header = document.querySelector('.site-header');
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 20){
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Inject OpenSpace arrow icons into buttons if not already containing SVG */
  var arrowSvg = '<svg class="btn-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; margin-left:4px; vertical-align:middle;"><path d="M6.5 1.5L11 6L6.5 10.5M11 6H1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.querySelectorAll('.btn-primary, .btn-gold, .btn-nav, .btn-outline, .btn-outline-light').forEach(function(btn){
    if(!btn.querySelector('svg') && !btn.querySelector('.btn-arrow') && !btn.classList.contains('no-arrow')){
      btn.insertAdjacentHTML('beforeend', arrowSvg);
    }
  });

  /* Mobile menu */
  var burger = document.querySelector('.burger');
  var panel = document.querySelector('.mobile-panel');
  if(burger && panel){
    burger.addEventListener('click', function(){
      var open = panel.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    panel.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        panel.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* Universal Smooth Scroll Reveal & Stagger Animation Engine */
  function initScrollAnimations() {
    // 1. Alternating story rows: pictures glide from side, copy from opposite side
    document.querySelectorAll('.story-row').forEach(function(row) {
      var copy = row.querySelector('.story-copy');
      var media = row.querySelector('.story-media');
      if (row.classList.contains('reverse')) {
        if (copy && !copy.classList.contains('reveal-left') && !copy.classList.contains('reveal-right')) copy.classList.add('reveal-right');
        if (media && !media.classList.contains('reveal-left') && !media.classList.contains('reveal-right')) media.classList.add('reveal-left');
      } else {
        if (copy && !copy.classList.contains('reveal-left') && !copy.classList.contains('reveal-right')) copy.classList.add('reveal-left');
        if (media && !media.classList.contains('reveal-left') && !media.classList.contains('reveal-right')) media.classList.add('reveal-right');
      }
    });

    // 2. Card grids with progressive wave stagger
    var cardGridSelectors = [
      '.blog-grid', '.integrations-grid', '.testimonials-grid', '.testimonials-slider',
      '.team-grid', '.numbers-grid', '.industry-strip', '.world-cards__stats'
    ];
    cardGridSelectors.forEach(function(gridSel) {
      document.querySelectorAll(gridSel).forEach(function(grid) {
        Array.from(grid.children).forEach(function(card, idx) {
          if (!card.classList.contains('reveal-card') && !card.classList.contains('reveal-left') && !card.classList.contains('reveal-right')) {
            card.classList.add('reveal-card');
            card.style.transitionDelay = (idx * 0.08) + 's';
          }
        });
      });
    });

    // 3. Pricing cards stagger
    document.querySelectorAll('.pricing-card').forEach(function(card, idx) {
      if (!card.classList.contains('reveal-card')) {
        card.classList.add('reveal-card');
        card.style.transitionDelay = (idx * 0.07) + 's';
      }
    });

    // 4. Standalone featured cards, boxes, and calculators
    document.querySelectorAll('.featured-story-card, .roi-calc-box, .world-cards__video, #book-form > .container > div').forEach(function(box) {
      if (!box.classList.contains('reveal') && !box.classList.contains('reveal-up') && !box.classList.contains('reveal-scale')) {
        box.classList.add('reveal-scale');
      }
    });

    // 5. Section titles and headings
    document.querySelectorAll('.section-head, .section-head-center').forEach(function(head) {
      if (!head.classList.contains('reveal') && !head.classList.contains('reveal-up') && !head.classList.contains('reveal-down')) {
        head.classList.add('reveal-up');
      }
    });

    // 6. FAQ Accordion items staggered reveal
    document.querySelectorAll('.faq-item').forEach(function(faq, idx) {
      if (!faq.classList.contains('reveal-card')) {
        faq.classList.add('reveal-card');
        faq.style.transitionDelay = (idx * 0.07) + 's';
      }
    });

    // 7. Hero section elements slide down/up on page load
    var heroHeadings = document.querySelectorAll('.hero-content h1, .display');
    heroHeadings.forEach(function(h) {
      if (!h.classList.contains('reveal-down') && !h.classList.contains('reveal-up')) {
        h.classList.add('reveal-down');
      }
    });

    // 8. Observe all animated elements using IntersectionObserver
    var animElements = document.querySelectorAll(
      '.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-zoom, .reveal-scale, .reveal-card, .reveal-stagger'
    );

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.06,
        rootMargin: '0px 0px -40px 0px'
      });

      animElements.forEach(function(el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 20 && rect.bottom > 0) {
          el.classList.add('in');
        } else {
          io.observe(el);
        }
      });
    } else {
      animElements.forEach(function(el) { el.classList.add('in'); });
    }
  }

  initScrollAnimations();

  /* Interactive Platform Tabs (Capture / Coordinate / Act) */
  var tabButtons = document.querySelectorAll('.platform-tab-btn');
  var tabPanes = document.querySelectorAll('.platform-tab-pane');
  if(tabButtons.length && tabPanes.length){
    tabButtons.forEach(function(btn){
      btn.addEventListener('click', function(){
        var targetId = btn.getAttribute('data-tab');
        tabButtons.forEach(function(b){ b.classList.remove('active'); });
        tabPanes.forEach(function(p){ p.classList.remove('active'); });
        btn.classList.add('active');
        var targetPane = document.getElementById(targetId);
        if(targetPane){
          targetPane.classList.add('active');
          targetPane.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function(el){
            el.classList.add('in');
          });
        }
      });
    });
  }

  /* Video player controls */
  var heroVideo = document.getElementById('hero-feature-video');
  var videoToggleBtn = document.getElementById('toggle-hero-video');
  if(heroVideo && videoToggleBtn){
    videoToggleBtn.addEventListener('click', function(){
      if(heroVideo.paused){
        heroVideo.play();
        videoToggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        videoToggleBtn.setAttribute('aria-label', 'Pause video');
      } else {
        heroVideo.pause();
        videoToggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        videoToggleBtn.setAttribute('aria-label', 'Play video');
      }
    });
  }


  /* Number count-up (OpenSpace Stats) */
  var counters = document.querySelectorAll('[data-count-to]');
  if(counters.length && 'IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        var el = entry.target;
        cio.unobserve(el);
        var to = parseInt(el.getAttribute('data-count-to'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1400, start = null;
        function step(ts){
          if(!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * to) + suffix;
          if(p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function(el){ cio.observe(el); });
  }

  /* Accordion (FAQ) */
  document.querySelectorAll('.accordion-item').forEach(function(item){
    var trigger = item.querySelector('.accordion-trigger');
    var panel = item.querySelector('.accordion-panel');
    if(!trigger || !panel) return;
    trigger.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item.open').forEach(function(other){
        if(other !== item){
          other.classList.remove('open');
          other.querySelector('.accordion-panel').style.maxHeight = null;
          other.querySelector('.accordion-trigger').setAttribute('aria-expanded','false');
        }
      });
      if(isOpen){
        item.classList.remove('open');
        panel.style.maxHeight = null;
        trigger.setAttribute('aria-expanded','false');
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded','true');
      }
    });
  });

  /* Integration reel: prev/next scroll + flip cards */
  var reelTrack = document.getElementById('integration-reel');
  if(reelTrack){
    var prevBtn = document.querySelector('[data-reel-prev]');
    var nextBtn = document.querySelector('[data-reel-next]');
    function reelStep(){
      var card = reelTrack.querySelector('.reel-card');
      var gap = 24;
      return card ? card.getBoundingClientRect().width + gap : 320;
    }
    if(prevBtn){
      prevBtn.addEventListener('click', function(){
        reelTrack.scrollBy({ left: -reelStep()*2, behavior:'smooth' });
      });
    }
    if(nextBtn){
      nextBtn.addEventListener('click', function(){
        reelTrack.scrollBy({ left: reelStep()*2, behavior:'smooth' });
      });
    }

    document.querySelectorAll('[data-flip]').forEach(function(card){
      card.addEventListener('click', function(){
        card.classList.toggle('flipped');
      });
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          card.classList.toggle('flipped');
        }
      });
    });
  }

  /* Pricing ROI calculator */
  var calc = document.getElementById('roi-calculator');
  if(calc){
    var teamEl = document.getElementById('calc-team');
    var handleEl = document.getElementById('calc-handle');
    var searchEl = document.getElementById('calc-search');
    var rateEl = document.getElementById('calc-rate');
    var teamOut = document.getElementById('calc-team-out');
    var handleOut = document.getElementById('calc-handle-out');
    var searchOut = document.getElementById('calc-search-out');
    var rateOut = document.getElementById('calc-rate-out');
    var currentCostOut = document.getElementById('calc-current-cost');
    var pictueCostOut = document.getElementById('calc-pictue-cost');
    var savingsOut = document.getElementById('calc-savings');
    var daysOut = document.getElementById('calc-days');

    var PICTUE_EFFICIENCY = 0.8;
    var WORKDAYS_PER_MONTH = 21;
    var WORKDAY_HOURS = 7.5;

    function fmtEUR(n){
      return new Intl.NumberFormat('fi-FI', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' €';
    }

    function recalc(){
      var team = parseInt(teamEl.value, 10);
      var handle = parseInt(handleEl.value, 10);
      var search = parseInt(searchEl.value, 10);
      var rate = parseInt(rateEl.value, 10);

      teamOut.textContent = team + ' henkilöä';
      handleOut.textContent = handle + ' min';
      searchOut.textContent = search + ' min';
      rateOut.textContent = rate + ' € / h';

      var minutesPerPersonPerDay = handle + search;
      var hoursPerMonth = (minutesPerPersonPerDay / 60) * WORKDAYS_PER_MONTH * team;
      var currentCost = hoursPerMonth * rate;
      var pictueHours = hoursPerMonth * (1 - PICTUE_EFFICIENCY);
      var pictueCost = pictueHours * rate;
      var savings = currentCost - pictueCost;
      var freedDays = (hoursPerMonth - pictueHours) / WORKDAY_HOURS;

      currentCostOut.textContent = fmtEUR(currentCost);
      pictueCostOut.textContent = fmtEUR(pictueCost);
      savingsOut.textContent = fmtEUR(savings) + ' / kk';
      daysOut.textContent = freedDays.toFixed(1).replace('.0','');
    }

    [teamEl, handleEl, searchEl, rateEl].forEach(function(el){
      if(el) el.addEventListener('input', recalc);
    });
    recalc();
  }

  /* English Pricing ROI Calculator */
  var workersSlider = document.getElementById('workers-slider');
  var hoursSlider = document.getElementById('hours-slider');
  if (workersSlider && hoursSlider) {
    var workersVal = document.getElementById('workers-val');
    var hoursVal = document.getElementById('hours-val');
    var monthlySavingsEl = document.getElementById('monthly-savings');
    var annualSavingsEl = document.getElementById('annual-savings');

    function updateROICalc() {
      var workers = parseInt(workersSlider.value, 10);
      var hours = parseInt(hoursSlider.value, 10);
      if (workersVal) workersVal.textContent = workers;
      if (hoursVal) hoursVal.textContent = hours;

      // Calculation: average €50/hr burdened labor cost, Pictue saves 75% of wasted photo search/handling
      var savedHoursPerWorker = hours * 0.75;
      var monthlySavings = Math.round(workers * savedHoursPerWorker * 50);
      var annualSavings = monthlySavings * 12;

      if (monthlySavingsEl) monthlySavingsEl.textContent = '€' + monthlySavings.toLocaleString();
      if (annualSavingsEl) annualSavingsEl.textContent = 'Annual saving: approx. €' + annualSavings.toLocaleString();
    }

    workersSlider.addEventListener('input', updateROICalc);
    hoursSlider.addEventListener('input', updateROICalc);
    updateROICalc();
  }

  /* Blog search/filter */
  var blogSearch = document.getElementById('blog-search');
  var blogCards = document.querySelectorAll('[data-blog-card]');
  var blogFilters = document.querySelectorAll('[data-blog-filter]');
  var activeTag = 'all';

  function applyBlogFilter(){
    var q = (blogSearch && blogSearch.value || '').toLowerCase().trim();
    blogCards.forEach(function(card){
      var title = (card.getAttribute('data-title') || '').toLowerCase();
      var tags = (card.getAttribute('data-tags') || '').toLowerCase();
      var matchesTag = activeTag === 'all' || tags.indexOf(activeTag) !== -1;
      var matchesQuery = !q || title.indexOf(q) !== -1;
      card.style.display = (matchesTag && matchesQuery) ? '' : 'none';
    });
  }
  if(blogSearch){ blogSearch.addEventListener('input', applyBlogFilter); }
  blogFilters.forEach(function(btn){
    btn.addEventListener('click', function(){
      blogFilters.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      activeTag = btn.getAttribute('data-blog-filter');
      applyBlogFilter();
    });
  });

})();
