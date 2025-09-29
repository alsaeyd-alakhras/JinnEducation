// Courses Filtering
$(document).ready(function () {
  let currentPage = 1;
  let perPage = 6; // أو القيمة اللي بتجي من select
  let selectedType = "all";

  // Category Filter Function
  $(".category-blogs-btn").on("click", function () {
    selectedType = $(this).data("type");

    // Update active button
    $(".category-blogs-btn")
      .removeClass("active")
      .removeClass("text-white")
      .removeClass("bg-primary")
      .removeClass("border-primary")
      .addClass("text-gray-600")
      .addClass("border-gray-200");
    $(this)
      .addClass("active")
      .removeClass("text-gray-600")
      .removeClass("border-gray-200")
      .addClass("text-white")
      .addClass("bg-primary")
      .addClass("border-primary");

    // إخفاء سريع للكروت القديمة
    $(".course-blogs-card:visible").fadeOut(100);

    setTimeout(function () {
      if (selectedType === "all") {
        // عرض أول 4 كورسات
        $(".course-blogs-card")
          .slice(0, 6)
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
        let filteredCards = $(
          '.course-blogs-card[data-type="' + selectedType + '"]'
        );
        filteredCards.slice(0, 6).each(function (index) {
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
    }, 150);
    currentPage = 1;
    showPage();
  });

  function renderPagination(totalItems) {
    let totalPages = Math.ceil(totalItems / perPage);
    let container = $("#pagesNumbers").empty();

    for (let i = 1; i <= totalPages; i++) {
      container.append(
        `<button class="min-w-8 h-8 px-2 flex items-center justify-center text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
          i === currentPage
            ? "bg-primary text-white shadow-sm"
            : "text-black hover:text-white hover:bg-primary"
        }" data-page="${i}">${i}</button>`
      );
    }
  }

  function showPage() {
    let cards =
      selectedType === "all"
        ? $(".course-blogs-card")
        : $('.course-blogs-card[data-type="' + selectedType + '"]');

    cards.hide();
    let start = (currentPage - 1) * perPage;
    let end = start + perPage;

    cards.slice(start, end).fadeIn(200);
    renderPagination(cards.length);
  }

  $(document).on("click", "#paginationBlogs button", function () {
    let page = $(this).data("page");
    let cards =
      selectedType === "all"
        ? $(".course-blogs-card")
        : $('.course-blogs-card[data-type="' + selectedType + '"]');

    let totalPages = Math.ceil(cards.length / perPage);
    if (page === "prev" && currentPage > 1) currentPage--;
    else if (page === "next" && currentPage < totalPages) currentPage++;
    else if (!isNaN(page)) currentPage = page;
    showPage();
  });

  $("#perPageSelect").on("change", function () {
    perPage = parseInt($(this).val());
    currentPage = 1;
    showPage();
  });
  $("#all-blogs-btn").click();
});
$(function () {
  let $container = $("#filter-container");
  let $left = $("#left-arrow");
  let $right = $("#right-arrow");

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

  // ✅ drag بالماوس فقط لغير الجوال
  if (!("ontouchstart" in window)) {
    let isDown = false;
    let startX;
    let scrollLeftStart;

    $container.on("mousedown", function (e) {
      // ✅ ابدأ drag فقط إذا الضغط مش على زر (مثلاً فاضي)
      if (!$(e.target).is("button")) {
        return; // تجاهل الضغط إذا مش على الفاضي
      }

      isDown = true;
      $container.addClass("cursor-grabbing");
      startX = e.pageX - $container.offset().left;
      scrollLeftStart = $container.scrollLeft();
    });

    $(document).on("mouseup", function () {
      isDown = false;
      $container.removeClass("cursor-grabbing");
    });

    $container.on("mouseleave", function () {
      isDown = false;
      $container.removeClass("cursor-grabbing");
    });

    $container.on("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - $container.offset().left;
      const walk = (x - startX) * 1.5; // سرعة السحب
      $container.scrollLeft(scrollLeftStart - walk);
    });
    // منع العجلة إنها تعمل scroll يمين/شمال
    $container.on("wheel", function (e) {
      if (Math.abs(e.originalEvent.deltaX) > Math.abs(e.originalEvent.deltaY)) {
        e.preventDefault(); // يمنع الحركة الأفقية
      }
    });
  }
});
