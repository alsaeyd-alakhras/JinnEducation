function toggleDirection(direction) {
  // تغيير اتجاه الصفحة
  $("html").attr("dir", direction);

  // تخزين الاتجاه المختار
  localStorage.setItem("page-direction", direction);

  // إرسال الاختيار لـ Laravel (اختياري)
  if (typeof window.updateLanguage === "function") {
    window.updateLanguage(direction === "rtl" ? "ar" : "en");
  }

  // تحديث الـ dropdowns positions
  updateDropdownPositions();

  // تحديث زر التبديل
  updateToggleButton(direction);
}

function updateDropdownPositions() {
  const isRTL = $("html").attr("dir") === "rtl";

  // تحديث مواضع القوائم المنسدلة
  $(".dropdown-rtl").each(function () {
    if (isRTL) {
      $(this).removeClass("left-0").addClass("right-0");
    } else {
      $(this).removeClass("right-0").addClass("left-0");
    }
  });

  $(".dropdown-rtl-right").each(function () {
    if (isRTL) {
      $(this).removeClass("right-0").addClass("left-0");
    } else {
      $(this).removeClass("left-0").addClass("right-0");
    }
  });
}

function updateToggleButton(direction) {
  const buttonText = direction === "rtl" ? "English" : "عربي";
  const buttonIcon = direction === "rtl" ? "fa-align-right" : "fa-align-left";

  // تحديث الزر العادي
  $("#direction-toggle span").text(buttonText);
  $("#direction-toggle i")
    .removeClass("fa-align-left fa-align-right")
    .addClass(buttonIcon);

  // تحديث زر Mobile
  $("#mobile-direction-toggle span").text(buttonText);
}

$(document).ready(function () {
  // ==================
  // Direction Toggle Event Listeners
  // ==================

  // زر تبديل الاتجاه
  $(document).on("click", "#direction-toggle", function () {
    const currentDir = $("html").attr("dir") || "ltr";
    const newDir = currentDir === "ltr" ? "rtl" : "ltr";
    toggleDirection(newDir);
  });

  // تحديد الاتجاه من dropdown اللغة
  $("header .language-dropdown a").click(function (e) {
    e.preventDefault();
    const selectedLang = $(this).data("lang");
    const direction = selectedLang === "ar" ? "rtl" : "ltr";

    // تحديث النص في الزر
    const selectedText =
      $(this).data("text") || $(this).text().substring(0, 2).toUpperCase();
    $("header .language-dropdown button span:first").text(selectedText);

    // تغيير الاتجاه
    toggleDirection(direction);

    // إغلاق القائمة
    $('header .language-dropdown div[class*="absolute"]').addClass(
      "opacity-0 invisible translate-y-2"
    );
  });

  // ==================
  // RTL-Aware Hover Effects (Header Only)
  // Language & Currency Dropdowns (Top Bar)
  $("header .language-dropdown, header .currency-dropdown").click(function (e) {
    e.stopPropagation();
    $(this).find(".fa-chevron-down").toggleClass("rotate-180");
    $(this)
      .find('div[class*="absolute"]')
      .toggleClass("opacity-0 invisible translate-y-2");
  });

  // Subcategory dropdowns مع مراعاة RTL (Navigation Only)
  $("nav .subcategory-item").hover(
    function () {
      const isRTL = $("html").attr("dir") === "rtl";
      const dropdown = $(this).find('div[class*="absolute"]');

      if (isRTL) {
        dropdown.removeClass("opacity-0 invisible -translate-x-2");
      } else {
        dropdown.removeClass("opacity-0 invisible translate-x-2");
      }
    },
    function () {
      const isRTL = $("html").attr("dir") === "rtl";
      const dropdown = $(this).find('div[class*="absolute"]');

      if (isRTL) {
        dropdown.addClass("opacity-0 invisible -translate-x-2");
      } else {
        dropdown.addClass("opacity-0 invisible translate-x-2");
      }
    }
  );

  // ==================
  // Initialize Direction
  function initializeDirection() {
    // جلب الاتجاه المحفوظ
    let savedDirection = localStorage.getItem("page-direction");

    // أو جلبه من Laravel (من البيانات المرسلة)
    if (typeof window.laravelDirection !== "undefined") {
      savedDirection = window.laravelDirection;
    }

    // أو جلبه من HTML attribute
    if (!savedDirection) {
      savedDirection = $("html").attr("dir") || "ltr";
    }

    toggleDirection(savedDirection);
  }

  // تشغيل التهيئة
  initializeDirection();

  // ==================
  // Laravel Integration Helper
  // دالة يمكن لـ Laravel استدعاؤها
  window.setDirection = function (direction) {
    toggleDirection(direction);
  };
});

// Header jQuery Interactions
$(document).ready(function () {
  // ==================
  // Mobile Menu State
  let isMobileMenuOpen = false;

  // ==================
  // Dropdown Functionality (Header Only)

  // Main Navigation Dropdowns
  $("nav .nav-dropdown").hover(
    function () {
      $(this)
        .find('div[class*="absolute"]')
        .removeClass("opacity-0 invisible translate-y-2");
    },
    function () {
      $(this)
        .find('div[class*="absolute"]')
        .addClass("opacity-0 invisible translate-y-2");
    }
  );

  // Subcategory Dropdowns (nested) - Navigation Only
  $("nav .subcategory-item").hover(
    function () {
      $(this)
        .find('div[class*="absolute"]')
        .removeClass("opacity-0 invisible translate-x-2");
    },
    function () {
      $(this)
        .find('div[class*="absolute"]')
        .addClass("opacity-0 invisible translate-x-2");
    }
  );

  // User Menu Dropdown
  $("header .user-menu").hover(
    function () {
      $(this)
        .find('div[class*="absolute"]')
        .removeClass("opacity-0 invisible translate-y-2");
    },
    function () {
      $(this)
        .find('div[class*="absolute"]')
        .addClass("opacity-0 invisible translate-y-2");
    }
  );

  // ==================
  // Search Bar Focus Effects
  $('header input[type="text"]')
    .on("focus", function () {
      $(this).parent().addClass("focused");
    })
    .on("blur", function () {
      $(this).parent().removeClass("focused");
    });

  // ==================
  // Language/Currency Selection

  // Language Selection
  $("header .language-dropdown a").click(function (e) {
    e.preventDefault();
    const selectedLang = $(this).text().trim();
    const langCode =
      selectedLang === "English"
        ? "EN"
        : selectedLang === "العربية"
        ? "AR"
        : "FR";

    $("header .language-dropdown button span:first").text(langCode);
    $('header .language-dropdown div[class*="absolute"]').addClass(
      "opacity-0 invisible translate-y-2"
    );

    // Smooth transition effect
    $("header .language-dropdown button").addClass("bg-primary-500");
    setTimeout(() => {
      $("header .language-dropdown button").removeClass("bg-primary-500");
    }, 200);
  });

  // Currency Selection
  $("header .currency-dropdown a").click(function (e) {
    e.preventDefault();
    const selectedCurrency = $(this).text().trim().split(" ")[0];

    $("header .currency-dropdown button span:first").text(selectedCurrency);
    $('header .currency-dropdown div[class*="absolute"]').addClass(
      "opacity-0 invisible translate-y-2"
    );

    // Smooth transition effect
    $("header .currency-dropdown button").addClass("bg-primary-500");
    setTimeout(() => {
      $("header .currency-dropdown button").removeClass("bg-primary-500");
    }, 200);
  });

  // User Authentication Toggle
  let isLoggedIn = false;

  $('header .guest-auth a[href="#"]:contains("Login")').click(function (e) {
    e.preventDefault();

    // Simulate login process
    $(this).html('<i class="mr-2 fas fa-spinner fa-spin"></i>Logging in...');

    setTimeout(() => {
      isLoggedIn = true;
      $("header .guest-auth").addClass("hidden");
      $("header .user-menu").removeClass("hidden");
    }, 1500);
  });

  // Logout functionality
  $('header .user-menu a:contains("Logout")').click(function (e) {
    e.preventDefault();

    isLoggedIn = false;
    $("header .user-menu").addClass("hidden");
    $("header .guest-auth").removeClass("hidden");

    // Reset login button
    $('header .guest-auth a[href="#"]:contains("Logging in...")').html("Login");
  });

  // ==================
  // Mobile Menu Toggle
  // ==================
  // $(document).on("click", "#mobile-menu-toggle", function (e) {
  //   toggleMobileMenu();
  // });

  function toggleMobileMenu() {
    const $mobileMenu = $("#mobile-menu");
    const $menuButton = $("header .lg\\:hidden button");
    if (!isMobileMenuOpen) {
      // فتح القائمة
      $mobileMenu.removeClass("hidden opacity-0").slideDown(300);
      $menuButton.find("i").removeClass("fa-bars").addClass("fa-times");
      isMobileMenuOpen = true;
      console.log("Mobile menu opened");
    } else {
      // إغلاق القائمة
      $mobileMenu.slideUp(300, function () {
        $(this).addClass("hidden opacity-0");
      });
      $menuButton.find("i").removeClass("fa-times").addClass("fa-bars");
      isMobileMenuOpen = false;
      console.log("Mobile menu closed");
    }
  }

  // Mobile Menu Button Click
  $(document).on("click", "#mobile-menu-toggle", function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileMenu();
  });

  // ==================
  // Mobile Dropdowns - مُصحح
  // ==================

  $(document).on("click", ".mobile-dropdown-btn", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $button = $(this);
    const $content = $button.siblings(".mobile-dropdown-content");
    const $icon = $button.find(".fa-chevron-down");

    // إغلاق باقي الـ dropdowns
    $(".mobile-dropdown-content").not($content).slideUp(200).addClass("hidden");
    $(".mobile-dropdown-btn .fa-chevron-down")
      .not($icon)
      .removeClass("rotate-180");

    // تبديل الـ dropdown الحالي
    if ($content.hasClass("hidden")) {
      $content.removeClass("hidden").hide().slideDown(200);
      $icon.addClass("rotate-180");
    } else {
      $content.slideUp(200, function () {
        $(this).addClass("hidden");
      });
      $icon.removeClass("rotate-180");
    }
  });

  // ==================
  // Mobile Menu Links Click - مُصحح
  // ==================

  $(document).on(
    "click",
    "#mobile-menu a:not(.mobile-dropdown-btn)",
    function (e) {
      const $link = $(this);
      const href = $link.attr("href");

      // إذا الرابط حقيقي (مش #) - خليه يشتغل طبيعي
      if (href && href !== "#" && !href.startsWith("javascript:")) {
        // إغلاق القائمة بعد تأخير قصير للسماح بالانتقال
        if (isMobileMenuOpen) {
          setTimeout(() => {
            toggleMobileMenu();
          }, 150);
        }
        // السماح للرابط بالعمل الطبيعي
        return true;
      }

      // إذا الرابط فاضي (#) - منع العمل الافتراضي بس ما نسكر القائمة
      if (href === "#") {
        e.preventDefault();
        console.log("Empty link clicked - no action taken");
        return false;
      }
    }
  );

  // ==================
  // Mobile Direction Toggle - مُصحح
  // ==================

  $(document).on("click", "#mobile-direction-toggle", function (e) {
    e.preventDefault();

    const currentDir = $("html").attr("dir") || "ltr";
    const newDir = currentDir === "ltr" ? "rtl" : "ltr";

    // استدعاء toggleDirection (متوفرة الآن globally)
    toggleDirection(newDir);
  });

  // ==================
  // منع إغلاق القائمة عند النقر داخلها
  // ==================

  $(document).on("click", "#mobile-menu", function (e) {
    e.stopPropagation();
  });

  // ==================
  // Close Mobile Menu on Outside Click
  // ==================

  $(document).click(function (e) {
    if (
      isMobileMenuOpen &&
      !$(e.target).closest("#mobile-menu, #mobile-menu-toggle").length
    ) {
      toggleMobileMenu();
    }
  });

  // ==================
  // Close Mobile Menu on Window Resize
  // ==================

  $(window).resize(function () {
    if ($(window).width() >= 1024 && isMobileMenuOpen) {
      toggleMobileMenu();
    }
  });

  // ==================
  // Smooth Hover Effects (Header Only)
  // ==================

  // Navigation links hover effects
  $("header nav a, header .nav-dropdown button").hover(
    function () {
      $(this).addClass("transform -translate-y-0.5");
    },
    function () {
      $(this).removeClass("transform -translate-y-0.5");
    }
  );

  // ==================
  // Search Functionality
  // ==================

  let searchTimeout;
  $('header input[placeholder*="Search"]').on("input", function () {
    const query = $(this).val();

    clearTimeout(searchTimeout);

    if (query.length > 2) {
      searchTimeout = setTimeout(() => {
        console.log("Searching for:", query);
        // Here you would implement actual search functionality
      }, 500);
    }
  });

  // Search button click
  $("header button:has(.fa-search)").click(function (e) {
    e.preventDefault();
    const searchQuery = $(this).siblings("input").val();
    if (searchQuery.trim()) {
      console.log("Search clicked for:", searchQuery);
      // Implement search functionality here
    }
  });

  // ==================
  // Close Dropdowns on Outside Click (Header Only)
  // ==================

  $(document).click(function (e) {
    // تحديد العناصر التي يجب تجاهلها
    const ignoreElements = [
      "header .nav-dropdown",
      "header .language-dropdown",
      "header .currency-dropdown",
      "header .user-menu",
      ".jinn-hero-section",
      ".hero-dot",
      ".jinn-dot",
      ".jinn-nav-btn",
    ].join(", ");

    if (!$(e.target).closest(ignoreElements).length) {
      // Close only header dropdowns
      $('header div[class*="absolute"], nav div[class*="absolute"]').addClass(
        "opacity-0 invisible translate-y-2 translate-x-2"
      );
      $("header .fa-chevron-down, nav .fa-chevron-down").removeClass(
        "rotate-180"
      );
    }
  });

  // ==================
  // Header Scroll Effect (sticky header)
  // ==================

  // $(window).scroll(function () {
  //   const scrollTop = $(this).scrollTop();

  //   if (scrollTop > 100) {
  //     $("header").addClass("shadow-lg");
  //   } else {
  //     $("header").removeClass("shadow-lg");
  //   }
  // });
});

// Hero Section
$(document).ready(function () {
  let currentSlide = 0;
  const $textSlides = $(".hero-slide");
  const $imgSlides = $(".hero-image");
  const totalSlides = $textSlides.length;
  const autoplayTime = 20000;
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
    $(".hero-dot").each(function (i) {
      if (i === index) {
        $(this)
          .addClass("bg-blue-600")
          .removeClass("bg-gray-300 hover:bg-gray-400");
      } else {
        $(this)
          .removeClass("bg-blue-600")
          .addClass("bg-gray-300 hover:bg-gray-400");
      }
    });

    currentSlide = index;
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
      .removeClass("text-blue-600")
      .addClass("text-black");
    $(this)
      .addClass("active")
      .removeClass("text-black")
      .addClass("text-blue-600");

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
  spaceBetween: 20,
  loop: true,
  // autoplay: {
  //   delay: 4000,
  //   disableOnInteraction: false,
  // },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next-custom",
    prevEl: ".swiper-button-prev-custom",
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  },
});
