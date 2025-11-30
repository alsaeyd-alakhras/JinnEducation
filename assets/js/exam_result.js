$(document).ready(function () {
  // Handle registration disclaimer checkbox
  $("#risk-acknowledgement").on("change", function () {
    const isChecked = $(this).is(":checked");
    const btn = $("#registration-risk-btn");

    if (isChecked) {
      btn
        .prop("disabled", false)
        .removeClass("opacity-50 cursor-not-allowed")
        .addClass("hover:bg-primary-700 hover:scale-105");
    } else {
      btn
        .prop("disabled", true)
        .addClass("opacity-50 cursor-not-allowed")
        .removeClass("hover:bg-primary-700 hover:scale-105");
    }
  });
});
