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

  $(document).on("click", "#mobile-search-bar-toggle", function () {
    $("#mobile-search-bar").toggleClass("hidden");
    $(this).find("i").toggleClass("fa-search fa-times");
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
        .removeClass("opacity-0 invisible");
    },
    function () {
      $(this)
        .find('div[class*="absolute"]')
        .addClass("opacity-0 invisible");
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

  // User Menu Mobile Dropdown
  // $("header .user-menu-mobile").click(
  //   function () {
  //     $(this)
  //       .find('div[class*="absolute"]')
  //       .removeClass("opacity-0 invisible translate-y-2");
  //   }
  // );

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
    // e.preventDefault();

    // Simulate login process
    $(this).html('<i class="mr-2 fas fa-spinner fa-spin"></i>Logging in...');

    setTimeout(() => {
      isLoggedIn = true;
      $("header .guest-auth").addClass("hidden");
      $("header .user-menu").removeClass("hidden");
      $("header .user-menu-mobile").removeClass("hidden");
    }, 1500);
  });

  // Logout functionality
  $('header .user-menu a:contains("Logout")').click(function (e) {
    // e.preventDefault();

    isLoggedIn = false;
    $("header .user-menu").addClass("hidden");
    $("header .user-menu-mobile").addClass("hidden");
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
    let mobileMenu = $("#mobile-menu");
    let menuButton = $("header button#mobile-menu-toggle");
    if (!isMobileMenuOpen) {
      // فتح القائمة
      mobileMenu.removeClass("hidden").slideDown(300);
      menuButton.find("i").removeClass("fa-bars").addClass("fa-times");
      isMobileMenuOpen = true;
      console.log("Mobile menu opened");
    } else {
      // إغلاق القائمة
      mobileMenu.slideUp(300, function () {
        $(this).addClass("hidden");
      });
      menuButton.find("i").removeClass("fa-times").addClass("fa-bars");
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
    "#mobile-menu a:not(.mobile-dropdown-btn).nav-mobile-link",
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
        // console.log("Empty link clicked - no action taken");
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
    toggleMobileMenu();
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

  // $(document).click(function (e) {
  //   if (
  //     isMobileMenuOpen &&
  //     !$(e.target).closest("#mobile-menu, #mobile-menu-toggle").length
  //   ) {
  //     toggleMobileMenu();
  //   }
  // });

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
      $(this).addClass("transform");
    },
    function () {
      $(this).removeClass("transform");
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

  /*
  $(document).click(function (e) {
    // تحديد العناصر التي يجب تجاهلها
    const ignoreElements = [
      "header .nav-dropdown",
      "header .language-dropdown",
      "header .currency-dropdown",
      "header .guest-auth",
      "header .user-menu",
      "header .user-menu-mobile",
      ".jinn-hero-section",
      ".hero-dot",
      ".jinn-dot",
      ".jinn-nav-btn",
    ].join(", ");
    if (
      !$(e.target).closest(ignoreElements).length &&
      !$(e.target).closest("#mobile-menu").length // ✅ استثناء الموبايل كليًا
    ) {      
      // Close only header dropdowns
      $('header div[class*="absolute"], nav div[class*="absolute"]').addClass(
        "opacity-0 invisible translate-y-2 translate-x-2"
      );
      $("header .fa-chevron-down, nav .fa-chevron-down").removeClass(
        "rotate-180"
      );
    }
  });
  */
  $(document).on('click', function (e) {
    // أي نقرة داخل الموبايل: لا تلمس شيئًا
    if ($(e.target).closest('#mobile-menu, #mobile-menu-toggle').length) return;
  
    // أي نقرة داخل تراكيب الهيدر: اعتبرها “داخل” ولا تغلق
    if ($(e.target).closest('header .nav-dropdown, header .language-dropdown, header .currency-dropdown, header .user-menu').length) return;
  
    // أغلق فقط الـ dropdowns المقصودة (بدون #mobile-menu)
    $([
      'header .language-dropdown > div[class*="absolute"]',
      'header .currency-dropdown  > div[class*="absolute"]',
      'header .user-menu        > div[class*="absolute"]',
      'nav .nav-dropdown        > div[class*="absolute"]',
      'nav .subcategory-item    > div[class*="absolute"]',
    ].join(', ')).addClass('opacity-0 invisible translate-y-2 translate-x-2');
  
    $('header .fa-chevron-down, nav .fa-chevron-down').removeClass('rotate-180');
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
