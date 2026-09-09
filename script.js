// PICTUE — shared site behavior
(function(){
  "use strict";

  /* Sticky nav shrink */
  var header = document.querySelector('.site-header');
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 12){ header.classList.add('scrolled'); }
    else{ header.classList.remove('scrolled'); }
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

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
        document.body.style.overflow = '';
      });
    });
  }

  /* Scroll reveal */
  var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-down, .reveal-zoom, .reveal-stagger, .reveal-stagger-x');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
  }
  /* Safety net: if for any reason an element never intersects (e.g. it's
     already in view but sub-pixel rounding prevents a trigger, or JS runs
     after layout in an unusual embed), force-reveal everything after a
     short delay so content is never permanently invisible. */
  window.addEventListener('load', function(){
    setTimeout(function(){
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-down, .reveal-zoom, .reveal-stagger, .reveal-stagger-x').forEach(function(el){
        el.classList.add('in');
      });
    }, 2500);
  });

  /* Number count-up (proof stat) */
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
    if(prevBtn){ prevBtn.addEventListener('click', function(){ reelTrack.scrollBy({ left: -reelStep()*2, behavior:'smooth' }); }); }
    if(nextBtn){ nextBtn.addEventListener('click', function(){ reelTrack.scrollBy({ left: reelStep()*2, behavior:'smooth' }); }); }

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

    // Pictue is assumed to cut manual documentation/search time by ~80%.
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
      el.addEventListener('input', recalc);
    });
    recalc();
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
