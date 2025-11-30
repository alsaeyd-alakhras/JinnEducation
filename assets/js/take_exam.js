$(document).ready(function () {
  // ============= Configuration =============
  const $form = $("#exam-form");
  const examId = $form.data("exam-id");
  const examTime = parseInt($form.data("time")); // in seconds

  let currentPage = 1;
  let maxPage = 1;
  let savedTimeouts = {};
  let timerInterval = null;
  let examFinished = false;

  // ============= Helper Functions =============

  // Save answer to localStorage
  function saveAnswer(questionId, value) {
    localStorage.setItem(`exam_${examId}_q_${questionId}`, value);
  }

  // Load answer from localStorage
  function loadAnswer(questionId) {
    return localStorage.getItem(`exam_${examId}_q_${questionId}`);
  }

  // Format time as MM:SS
  function formatTime(seconds) {
    if (seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  // Get questions for specific page
  function getPageQuestions(page) {
    return $(`.question-container[data-page="${page}"]`);
  }

  // Check if page is completed
  function isPageCompleted(page) {
    const $questions = getPageQuestions(page);
    let allAnswered = true;

    $questions.each(function () {
      const questionId = $(this).data("question-id");
      const hasAnswer =
        $(this).find('input[type="radio"]:checked').length > 0 ||
        loadAnswer(questionId) !== null;
      if (!hasAnswer) {
        allAnswered = false;
        return false;
      }
    });

    return allAnswered;
  }

  // Update progress bar for current page
  function updatePageProgress(page) {
    const $questions = getPageQuestions(page);
    const totalInPage = $questions.length;
    let answeredInPage = 0;

    $questions.each(function () {
      const questionId = $(this).data("question-id");
      if (
        $(this).find('input[type="radio"]:checked').length > 0 ||
        loadAnswer(questionId) !== null
      ) {
        answeredInPage++;
      }
    });

    const progress = totalInPage > 0 ? (answeredInPage / totalInPage) * 100 : 0;
    $("#progress-bar").css("width", progress + "%");
  }

  // Update continue button state
  function updateContinueButtonState() {
    const $btn = $("#continue-btn");
    const completed = isPageCompleted(currentPage);

    if (completed) {
      $btn
        .prop("disabled", false)
        .removeClass("text-gray-400 border-gray-300 cursor-not-allowed")
        .addClass(
          "text-primary border-primary hover:bg-primary hover:text-white"
        )
        .css("pointer-events", "auto");
    } else {
      $btn
        .prop("disabled", true)
        .removeClass(
          "text-primary border-primary hover:bg-primary hover:text-white"
        )
        .addClass("text-gray-400 border-gray-300 cursor-not-allowed")
        .css("pointer-events", "none");
    }

    // Update button text for last page
    if (currentPage === maxPage) {
      $btn.text("Submit");
    } else {
      $btn.text("Continue →");
    }
  }

  // Show specific page
  function showPage(page) {
    currentPage = page;

    // Hide all questions
    $(".question-container").addClass("hidden");

    // Show questions for current page
    getPageQuestions(page).removeClass("hidden");

    // Update page number display
    $("#current-page").text(page);

    // Update back button
    if (page === 1) {
      $("#back-btn")
        .prop("disabled", true)
        .addClass("opacity-50 cursor-not-allowed");
    } else {
      $("#back-btn")
        .prop("disabled", false)
        .removeClass("opacity-50 cursor-not-allowed");
    }

    // Update progress and continue button
    updatePageProgress(page);
    updateContinueButtonState();
  }

  // ============= Timer Functions =============

  function initTimer() {
    const endTimeKey = `exam_${examId}_endTime`;
    let endTime = localStorage.getItem(endTimeKey);

    if (!endTime) {
      endTime = Date.now() + examTime * 1000;
      localStorage.setItem(endTimeKey, endTime);
    } else {
      endTime = parseInt(endTime);
    }

    function updateTimer() {
      const remaining = Math.floor((endTime - Date.now()) / 1000);

      if (remaining <= 0) {
        finishExam();
        return;
      }

      $("#timer-display").text(formatTime(remaining));
    }

    // Initial update
    updateTimer();

    // Check if already finished
    const remaining = Math.floor((endTime - Date.now()) / 1000);
    if (remaining <= 0) {
      finishExam();
      return;
    }

    // Update every second
    timerInterval = setInterval(updateTimer, 1000);
  }

  function finishExam() {
    if (examFinished) return;
    examFinished = true;

    clearInterval(timerInterval);
    $("#timer-display").text("00:00");

    // Disable all answer inputs and nav buttons (no more changes / navigation)
    $('input[type="radio"]').prop("disabled", true);
    $("#back-btn, #continue-btn")
      .prop("disabled", true)
      .css("pointer-events", "none")
      .addClass("opacity-50 cursor-not-allowed");

    // Clear helper message under buttons
    $("#continue-message").text("");

    // Show centered warning modal for time out
    $("#exam-timeout-modal").removeClass("hidden").addClass("flex");
  }

  function restartExam() {
    // Clear all exam data from localStorage (answers + timer + any future keys)
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(`exam_${examId}_`)) {
        localStorage.removeItem(key);
      }
    });

    // Reload page (everything reset: answers, styling, timer, pages)
    location.reload();
  }

  // ============= Initialize Exam =============

  function initExam() {
    // Find max page
    $(".question-container").each(function () {
      const page = parseInt($(this).data("page")) || 1;
      if (page > maxPage) maxPage = page;
    });

    $("#total-pages").text(maxPage);

    // Load saved answers
    $(".question-container").each(function () {
      const $container = $(this);
      const questionId = $container.data("question-id");
      const savedValue = loadAnswer(questionId);

      if (savedValue) {
        const $radio = $container.find(
          `input[type="radio"][value="${savedValue}"]`
        );
        if ($radio.length) {
          $radio.prop("checked", true);

          // Apply full styling + show Saved immediately
          const $option = $radio.closest(".answer-option");
          const $savedIndicator = $container.find(".saved-indicator");
          applyQuestionAnsweredStyles(
            $container,
            $option,
            $savedIndicator,
            false
          );
        }
      }
    });

    // Show first page
    showPage(1);

    // Init timer
    initTimer();
  }

  // Helper: submit exam (placeholder for backend integration)
  function submitExam() {
    // TODO: connect with Laravel backend here
    alert("Exam submitted! (Connect to Laravel backend here)");
    console.log("Form ready to submit to backend");
    // $form.submit(); // Uncomment when backend is ready
  }

  // Apply full "answered" styling + Saved indicator for a question
  function applyQuestionAnsweredStyles(
    $container,
    $selectedOption,
    $savedIndicator,
    withDelay
  ) {
    const questionId = $container.data("question-id");

    // Base box styling
    $container
      .removeClass("bg-white")
      .addClass("bg-gray-100 border-primary bg-[#1B449C08]");

    // Options styling
    $container.find(".answer-option").removeClass("border-primary bg-blue-50");
    $container.find(".answer-text").removeClass("font-medium");
    $selectedOption.addClass("border-primary bg-blue-50");
    $selectedOption.find(".answer-text").addClass("font-medium");

    // Saved indicator behaviour
    $savedIndicator.addClass("hidden opacity-0").removeClass("opacity-100");

    if (withDelay) {
      // Clear old timeout if exists
      if (savedTimeouts[questionId]) {
        clearTimeout(savedTimeouts[questionId]);
      }
      savedTimeouts[questionId] = setTimeout(function () {
        $savedIndicator.removeClass("hidden opacity-0").addClass("opacity-100");
      }, 700);
    } else {
      // Show immediately (for loaded answers on refresh)
      $savedIndicator.removeClass("hidden opacity-0").addClass("opacity-100");
    }
  }

  // ============= Event Handlers =============

  // Handle radio change
  $('.question-container input[type="radio"]').on("change", function () {
    if (examFinished) return;

    const $questionContainer = $(this).closest(".question-container");
    const questionId = $questionContainer.data("question-id");
    const $savedIndicator = $questionContainer.find(".saved-indicator");
    const $selectedOption = $(this).closest(".answer-option");
    const value = $(this).val();

    // Save to localStorage
    saveAnswer(questionId, value);

    // Apply full styling + delayed Saved indicator
    applyQuestionAnsweredStyles(
      $questionContainer,
      $selectedOption,
      $savedIndicator,
      true
    );

    // Update progress and button
    updatePageProgress(currentPage);
    updateContinueButtonState();
  });

  // Handle Back button
  $("#back-btn").on("click", function () {
    if (examFinished || currentPage === 1) return;
    showPage(currentPage - 1);
  });

  // Handle Continue button
  $("#continue-btn").on("click", function () {
    if (examFinished || $(this).prop("disabled")) return;

    if (currentPage === maxPage) {
      // Submit form (last page)
      submitExam();
    } else {
      // Go to next page
      showPage(currentPage + 1);
    }
  });

  // Handle timeout modal buttons
  $("#timeout-restart-btn").on("click", function () {
    restartExam();
  });

  $("#timeout-submit-btn").on("click", function () {
    // Hide modal (optional, page may navigate or show different state after submit)
    $("#exam-timeout-modal").addClass("hidden").removeClass("flex");
    submitExam();
  });

  // Handle form submit
  $form.on("submit", function (e) {
    e.preventDefault();
    // TODO: Send to Laravel backend
    console.log("Form submitted - connect to backend");
  });

  // ============= Start =============
  initExam();
});
