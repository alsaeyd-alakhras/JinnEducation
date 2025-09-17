// Hero Section
$(document).ready(function () {
  let currentSlide = 0;
  const $textSlides = $(".hero-slide");
  const $imgSlides = $(".hero-image");
  const totalSlides = $textSlides.length;
  const autoplayTime = 5000;
  let interval;

  function showSlide(index) {
    if (index === currentSlide) return;

    const $currentSlide = $textSlides.eq(currentSlide);
    const $nextSlide = $textSlides.eq(index);

    // =====================
    // TEXT OUT/IN (with proper layering)
    // =====================
    $currentSlide.addClass("z-20"); // خليه فوق عشان نشوف خروجه
    $nextSlide
      .addClass("z-10") // الجديدة تحت مؤقتًا
      .removeClass("hidden")
      .addClass("opacity-0 translate-y-16");

    // فعّل الحركتين في فريم منفصل
    requestAnimationFrame(() => {
      $currentSlide
        .removeClass("opacity-100 translate-y-0")
        .addClass("opacity-0 -translate-y-8");

      $nextSlide
        .removeClass("opacity-0 translate-y-16")
        .addClass("opacity-100 translate-y-0");
    });

    // لما يخلص خروج القديم… اخفه *بعد* الأنيميشن
    const hideOld = () => {
      $currentSlide.addClass("hidden").removeClass("z-20 -translate-y-8"); // نظافة
      $nextSlide
        .removeClass("z-10") // الآن الجديدة فوق
        .addClass("z-20");
      $currentSlide.off("transitionend.slideOut", hideOld);
    };
    $currentSlide
      .off("transitionend.slideOut", hideOld)
      .on("transitionend.slideOut", hideOld);

    // فallback لو المتصفح ما أطلق الحدث لأي سبب
    setTimeout(hideOld, 750);

    // ----- IMAGE SECTION - IMPROVED FOR YOUR LAYOUT -----
    if ($imgSlides.length > 0) {
      const $oldI = $imgSlides.eq(currentSlide);
      const $newI = $imgSlides.eq(index);

      // إخفاء الصورة القديمة فوراً
      $oldI
        .removeClass("opacity-100 scale-100 translate-x-0")
        .addClass("opacity-0 scale-95 hidden");

      // إظهار الصورة الجديدة بدون حركة معقدة
      $newI
        .removeClass("hidden opacity-0 scale-95 translate-x-0")
        .addClass("opacity-0 scale-95");

      // تأخير قصير ثم إظهار
      setTimeout(() => {
        $newI
          .removeClass("opacity-0 scale-95")
          .addClass("opacity-100 scale-100");
      }, 100);
    }

    // تحديث Dots Indicators
    // حدّث كل مجموعات الـ dots (desktop + mobile)
    $(".dots-container").each(function () {
      updateDots(index, $(this));
    });
    
    currentSlide = index;
  }
  function updateDots(index, $container) {
    $container.find(".hero-dot").each(function (i) {
      if (i === index) {
        $(this)
          .addClass("bg-primary")
          .removeClass("bg-gray-300 hover:bg-gray-400");
      } else {
        $(this)
          .removeClass("bg-primary")
          .addClass("bg-gray-300 hover:bg-gray-400");
      }
    });
  }
  

  $(".hero-dot").on("click", function () {
    stopAutoplay();
    const index = parseInt($(this).attr("data-slide"));
    showSlide(index);
    startAutoplay();
  });

  function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    showSlide(next);
  }
  function prevSlide() {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prev);
  }

  function startAutoplay() {
    interval = setInterval(nextSlide, autoplayTime); // احذف nextSlide(); من هنا
  }
  function stopAutoplay() {
    clearInterval(interval);
  }

  // INIT: فعّل أول شريحة نص
  $textSlides.addClass("hidden opacity-0 translate-y-16");
  $textSlides
    .eq(0)
    .removeClass("hidden opacity-0 translate-y-16")
    .addClass("opacity-100 translate-y-0");

  $imgSlides.addClass("hidden opacity-0 scale-95");
  $imgSlides
    .eq(0)
    .removeClass("hidden opacity-0 scale-95")
    .addClass("opacity-100 translate-x-0 scale-100");

  // أزرار التنقل (لو موجودة)
  $("#hero-prev").on("click", () => {
    stopAutoplay();
    showSlide((currentSlide - 1 + totalSlides) % totalSlides);
    startAutoplay();
  });
  $("#hero-next").on("click", () => {
    stopAutoplay();
    nextSlide();
    startAutoplay();
  });

  // startAutoplay();
});

// Courses Filtering
$(document).ready(function () {
  let currentDisplayed = 4;
  let selectedType = "all";

  // Category Filter Function
  $(".category-btn").on("click", function () {
    selectedType = $(this).data("type");

    // Update active button
    $(".category-btn")
      .removeClass("active")
      .removeClass("text-primary")
      .removeClass("font-bold")
      .addClass("text-black");
    $(this)
      .addClass("active")
      .removeClass("text-black")
      .addClass("text-primary")
      .addClass("font-bold");

    // إخفاء سريع للكروت القديمة
    $(".course-card:visible").fadeOut(100);

    setTimeout(function () {
      if (selectedType === "all") {
        // عرض أول 4 كورسات
        $(".course-card")
          .slice(0, 4)
          .each(function (index) {
            $(this)
              .delay(index * 50)
              .fadeIn(200)
              .css({
                transform: "translateY(20px)",
                opacity: "0",
              })
              .animate(
                {
                  opacity: "1",
                },
                {
                  duration: 200,
                  step: function (now, fx) {
                    if (fx.prop === "opacity") {
                      $(this).css(
                        "transform",
                        "translateY(" + (20 - 20 * now) + "px)"
                      );
                    }
                  },
                  complete: function () {
                    $(this).css("transform", "translateY(0)");
                  },
                }
              );
          });
      } else {
        // عرض الكورسات المفلترة (أول 4)
        let filteredCards = $('.course-card[data-type="' + selectedType + '"]');
        filteredCards.slice(0, 4).each(function (index) {
          $(this)
            .delay(index * 50)
            .fadeIn(200)
            .css({
              transform: "translateY(20px)",
              opacity: "0",
            })
            .animate(
              {
                opacity: "1",
              },
              {
                duration: 200,
                step: function (now, fx) {
                  if (fx.prop === "opacity") {
                    $(this).css(
                      "transform",
                      "translateY(" + (20 - 20 * now) + "px)"
                    );
                  }
                },
                complete: function () {
                  $(this).css("transform", "translateY(0)");
                },
              }
            );
        });
      }

      // إعادة تعيين العداد وتحديث زر Load More
      currentDisplayed = 4;
      setTimeout(function () {
        updateLoadMoreButton();
      }, 300);
    }, 150);
  });

  // Load More Function
  $("#loadMoreBtn").on("click", function () {
    let hiddenCards;

    if (selectedType === "all") {
      hiddenCards = $(".course-card")
        .filter(function () {
          return $(this).css("display") === "none";
        })
        .slice(0, 4);
    } else {
      hiddenCards = $(".course-card")
        .filter(function () {
          return (
            $(this).data("type") === selectedType &&
            $(this).css("display") === "none"
          );
        })
        .slice(0, 4);
    }

    if (hiddenCards.length > 0) {
      hiddenCards.each(function (index) {
        $(this)
          .delay(index * 80)
          .fadeIn(300)
          .css({
            transform: "translateY(30px)",
            opacity: "0",
          })
          .animate(
            {
              opacity: "1",
            },
            {
              duration: 300,
              step: function (now, fx) {
                if (fx.prop === "opacity") {
                  $(this).css(
                    "transform",
                    "translateY(" + (30 - 30 * now) + "px)"
                  );
                }
              },
              complete: function () {
                $(this).css("transform", "translateY(0)");

                // بعد آخر عنصر يظهر... شغّل التحقق
                if (index === hiddenCards.length - 1) {
                  updateLoadMoreButton();
                }
              },
            }
          );
      });

      currentDisplayed += hiddenCards.length;
    }
  });

  function updateLoadMoreButton() {
    let totalCards, hiddenCards;

    if (selectedType === "all") {
      totalCards = $(".course-card");
      hiddenCards = totalCards.filter(function () {
        return $(this).css("display") === "none";
      });
    } else {
      totalCards = $('.course-card[data-type="' + selectedType + '"]');
      hiddenCards = totalCards.filter(function () {
        return $(this).css("display") === "none";
      });
    }

    if (hiddenCards.length === 0 || totalCards.length <= 4) {
      $("#loadMoreBtn").fadeOut(200);
    } else {
      $("#loadMoreBtn").fadeIn(200);
    }
  }
});

// Find Tutor Form
$(document).ready(function () {
  // Add focus effects to select elements
  $("select").on("focus", function () {
    $(this).parent().find("i").addClass("text-blue-500");
  });

  $("select").on("blur", function () {
    $(this).parent().find("i").removeClass("text-blue-500");
  });

  // Handle form submission
  $("#search-button").on("click", function (e) {
    e.preventDefault();

    $(this).html(
      '<i class="mr-2 fas fa-spinner fa-spin rtl:mr-0 rtl:ml-2"></i>Searching...'
    );

    setTimeout(function () {
      $("#search-button").html(
        '<i class="mr-2 fas fa-search rtl:mr-0 rtl:ml-2"></i>Search Tutors'
      );
      console.log("Search initiated with current filters");
    }, 2000);
  });
});

// Initialize Swiper
const swiper = new Swiper(".tutors-swiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  loop: true,
  // autoplay: {
  //   delay: 4000,
  //   disableOnInteraction: false,
  // },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
    renderBullet: function (index, className) {
      return `<button class="!w-2 !h-2 !scale-100 rounded-full ${className}" data-slide="${index}"></button>`;
    },
  },
  navigation: {
    nextEl: ".swiper-button-next-custom",
    prevEl: ".swiper-button-prev-custom",
  },
  breakpoints: {
    640: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 10,
    },
  },
});
$(function () {
  let $container = $("#filter-container");
  let $left = $("#left-arrow");
  let $right = $("#right-arrow");
  
  // دالة الأسهم (نفس الكود الأصلي)
  function toggleArrows() {
      let scrollLeft = $container.scrollLeft();
      let maxScroll = $container[0].scrollWidth - $container.outerWidth();
      let isRTL = $container.closest("[dir='rtl']").length > 0;
      
      if (isRTL) {
          $left.css("opacity", scrollLeft < maxScroll ? 1 : 0);
          $right.css("opacity", scrollLeft > 0 ? 1 : 0);
      } else {
          $left.css("opacity", scrollLeft > 0 ? 1 : 0);
          $right.css("opacity", scrollLeft < maxScroll ? 1 : 0);
      }
  }
  
  toggleArrows();
  $container.on("scroll", toggleArrows);
  
  const container = $container[0];
  
  // السكرول بالعجلة (كما هو)
  container.addEventListener('wheel', function(e) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
  });
  
  $(window).on('resize', function() {
      setTimeout(toggleArrows, 100);
  });
});