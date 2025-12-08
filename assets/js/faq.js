// ==================== FAQ Accordions ====================
$(".accordion-header").on("click", function () {
  const $accordionBody = $(this).next(".accordion-body");
  const $icon = $(this).find(".icon");

  // Toggle accordion body with callback
  $accordionBody.slideToggle(200, function () {
    // After animation, update icon based on visibility
    if ($accordionBody.is(":visible")) {
      // Open - show minus icon
      $icon.addClass("rotate-180");
    } else {
      // Closed - show plus icon
      $icon.removeClass("rotate-180");
    }
  });
});
