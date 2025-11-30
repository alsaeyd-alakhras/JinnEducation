$(document).ready(function () {
  // Smooth scroll to top on page load
  $("html, body").animate({ scrollTop: 0 }, 600);

  // Fade in animations on page load (Tailwind classes instead of inline CSS)
  setTimeout(function () {
    $("#summary-card").removeClass("opacity-0 translate-y-4");
  }, 300);

  setTimeout(function () {
    $("#review-card").removeClass("opacity-0 translate-y-4");
  }, 500);

  // Animate question items with stagger using Tailwind classes
  setTimeout(function () {
    $(".space-y-4 > div").each(function (index) {
      const $item = $(this);
      setTimeout(function () {
        $item.removeClass("opacity-0 translate-x-8");
      }, index * 100);
    });
  }, 700);

  // Share Result Button
  $("#share-result-btn").on("click", function (e) {
    e.preventDefault();

    const resultUrl = window.location.href;
    const shareText = "Check out my exam result - I scored 85/100! 🎉";

    // Check if Web Share API is available
    if (navigator.share) {
      navigator
        .share({
          title: "Exam Result",
          text: shareText,
          url: resultUrl,
        })
        .then(() => {
          showToast("Result shared successfully!");
        })
        .catch((error) => {
          console.log("Share cancelled or failed", error);
        });
    } else {
      // Fallback: Copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(resultUrl)
          .then(() => {
            showToast("Link copied to clipboard!");
          })
          .catch((error) => {
            console.error("Failed to copy:", error);
            showToast("Unable to copy link", "error");
          });
      } else {
        // Old browsers fallback
        const textArea = document.createElement("textarea");
        textArea.value = resultUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          showToast("Link copied to clipboard!");
        } catch (err) {
          console.error("Failed to copy:", err);
          showToast("Unable to copy link", "error");
        }
        document.body.removeChild(textArea);
      }
    }

    // Button animation
    $(this).addClass("scale-95");
    setTimeout(() => {
      $(this).removeClass("scale-95");
    }, 200);
  });

  // Retake Test Button
  $("#retake-test-btn").on("click", function (e) {
    e.preventDefault();

    // Button animation
    $(this).addClass("scale-95");

    // Redirect after animation
    setTimeout(() => {
      window.location.href = "take_exam.html";
    }, 300);
  });

  // Course Registration Button
  $("#course-registration-btn").on("click", function (e) {
    e.preventDefault();

    // Button animation
    $(this).addClass("scale-95");

    // Redirect after animation
    setTimeout(() => {
      window.location.href = "online_group_classes.html";
    }, 300);
  });

  // Download PDF Button (placeholder functionality)
  $("#download-pdf-btn").on("click", function (e) {
    e.preventDefault();
    showToast("PDF download feature coming soon!");

    // In real implementation, this would trigger PDF generation
    // For now, just show a notification
  });

  // Toast notification function
  function showToast(message, type = "success") {
    const toast = $("#share-toast");
    const icon =
      type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
    const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
    const isRTL = $("html").attr("dir") === "rtl";

    // Update toast content and style
    toast.removeClass("bg-green-500 bg-red-500").addClass(bgColor);
    toast
      .find("i")
      .removeClass("fa-check-circle fa-exclamation-circle")
      .addClass(icon);
    toast.find("span").text(message);

    // Animate in using Tailwind utility classes
    toast
      .removeClass("opacity-0 translate-x-full -translate-x-full")
      .addClass("opacity-100 translate-x-0");

    // Animate out after 3 seconds
    setTimeout(function () {
      toast.removeClass("opacity-100 translate-x-0");

      if (isRTL) {
        toast.addClass("opacity-0 -translate-x-full");
      } else {
        toast.addClass("opacity-0 translate-x-full");
      }
    }, 3000);
  }
});
