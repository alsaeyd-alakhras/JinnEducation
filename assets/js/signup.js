$(document).ready(function () {
    let currentStep = parseInt(localStorage.getItem('currentStep')) || 1;
    let accountType = localStorage.getItem('accountType') || '';

    // Initialize
    goToStep(currentStep);

    // Step navigation from sidebar
    $('.step-item, .step-item-mobile').click(function () {
        const step = parseInt($(this).data('step'));
        goToStep(step);
    });

    // Continue button
    $(document).on('click', '.btn-continue', function (e) {
        if (currentStep == 1) {
            e.preventDefault();
            let account_type = $('#account-type').val();
            if (account_type === '' || account_type === null) {
                $('#account-type-error').removeClass('hidden opacity-0').addClass('opacity-100 translate-y-0');
                return;
            } else {
                $('#account-type-error').addClass('hidden opacity-0').removeClass('opacity-100 translate-y-0');
            }
        }
        if (currentStep < 8) {
            goToStep(currentStep + 1);
        }

    });

    // Back button
    $(document).on('click', '.btn-back', function () {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    });

    // Toggle switches
    $('.toggle-switch').click(function () {
        $(this).toggleClass('bg-primary bg-gray-300');
        const circle = $(this).find('div');
        if ($(this).hasClass('bg-primary')) {
            circle.removeClass('left-0.5').addClass('right-0.5');
        } else {
            circle.removeClass('right-0.5').addClass('left-0.5');
        }
    });

    function goToStep(step) {
        currentStep = step;
        localStorage.setItem('currentStep', currentStep);

        // Hide all panes
        $('.pane').removeClass('block').addClass('hidden');

        // Show current pane
        $(`.pane[data-step="${step}"]`).removeClass('hidden').addClass('block');

        // Update step circles
        for (let i = 1; i <= 8; i++) {
            const circle = $(`.step-circle[data-circle="${i}"]`);
            circle.removeClass('active');

            if (i < step) {
                // Completed
                // circle.removeClass('active');
            } else if (i === step) {
                // Active
                circle.addClass('active');
            } else {
                // Pending
                // circle.removeClass('active');
            }
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }
});

// Step 1 
$(function () {
    // Account type selection
    $('.account-card').click(function () {
        $('.account-card').removeClass('border-primary bg-blue-50');
        $(this).addClass('border-primary bg-blue-50');
        accountType = $(this).data('account');
        localStorage.setItem('accountType', accountType);
        $('#account-type').val(accountType)
        if (accountType === 'student') {
            // إخفاء الخطوات 1 و2 فقط
            $('.step-item, .step-item-mobile').each(function () {
                const step = $(this).data('step');
                if ([1, 2].includes(step)) {
                    $(this).removeClass('hidden');
                } else {
                    $(this).addClass('hidden');
                    // $(this).hide();
                }
            });
        }
        if (accountType === 'tutor') {
            $('.step-item, .step-item-mobile').each(function () {
                const step = $(this).data('step');
                // $(this).show();
                $(this).removeClass('hidden');
            });
        }

    });
});

// Step 2
$(function () {
    // لما تضغط على زر القلم يفتح اختيار الصورة
    $('#btnUpload').on('click', function () {
        $('#avatarInput').click();
    });

    // عند اختيار صورة
    $('#avatarInput').on('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (ev) {
            // عرض الصورة داخل الدائرة
            $('#avatarImage').attr('src', ev.target.result).removeClass('hidden');
            // إخفاء الأيقونة الافتراضية
            $('#avatarIcon').addClass('hidden');
        };
        reader.readAsDataURL(file);
    });

    // التحقق من فورم البيانات 
    // الحقول المطلوبة للتحقق
    const $fields = $(
        '#account-info input[type="text"], #account-info input[type="email"], #account-info input[type="tel"], #account-info input[type="password"], #account-info input[type="checkbox"]'
    );

    const $googleBtn = $("#account-info .btn-google");
    const $continueBtn = $("#account-info .btn-continue");
    const $submitBtn = $("#account-info .btn-submit");
    const $account_type = localStorage.getItem('accountType');

    // اخفِ زر Continue بالبداية
    $continueBtn.hide();

    // دالة فحص اكتمال الحقول
    function allFieldsFilled() {
        let filled = true;
        $fields.each(function () {
            const val = $(this).val().trim();
            if (val === "") {
                filled = false;
                return false; // stop loop
            }
        });
        return filled;
    }

    // دالة تحقق الباسورد (مؤقتة – هنطورها لاحقاً)
    function validatePasswords() {
        const password = $('input[placeholder="Password"]').val().trim();
        const confirm = $('input[placeholder="Confirm password"]').val().trim();
        // الآن مجرد مقارنة بسيطة
        return password !== "" && confirm !== "" && password === confirm;
    }

    const $email = $('#email');
    const $msg = $('#email-msg');

    // regex أكثر دقة – يسمح بمعظم صيغ الإيميل القياسية
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    $email.on('input blur', function () {
        const val = $email.val().trim();

        // إذا الحقل فاضي -> اخفي الرسالة تمامًا
        if (val === '') {
            $msg
                .removeClass('text-red-500 text-green-600')
                .addClass('text-gray-500')
                .css('opacity', 0);
            return;
        }

        // تحقق من الصيغة
        const isValid = emailPattern.test(val);

        if (isValid) {
            // ✅ إيميل صحيح
            $msg
                .text('Valid email address ✓')
                .removeClass('text-gray-500 text-red-500')
                .addClass('text-green-600')
                .css('opacity', 1);
        } else {
            // ❌ إيميل خاطئ
            $msg
                .text('Invalid email format')
                .removeClass('text-gray-500 text-green-600')
                .addClass('text-red-500')
                .css('opacity', 1);
        }
    });

    // عند أي تغيير على الحقول
    $fields.on("input blur", function () {
        const filled = allFieldsFilled();
        const passwordsOK = validatePasswords();

        // لو كل الحقول مليانة (مش فارغة)
        if (filled && passwordsOK) {
            $googleBtn.fadeOut(200, function () {
                console.log($account_type);
                if($account_type == 'student') {
                    $submitBtn.fadeIn(200);
                } else {
                    $continueBtn.fadeIn(200);
                }
            });
        } else {
            $continueBtn.fadeOut(200, function () {
                $googleBtn.fadeIn(200);
            });
        }
    });


    // ===== Toggle Password Visibility =====
    $('.toggle-password').on('click', function () {
        const $input = $(this).siblings('input');
        const type = $input.attr('type') === 'password' ? 'text' : 'password';
        $input.attr('type', type);
        // toggle eye icon style
        $(this).toggleClass('text-primary');
    });

    // ===== Password Strength =====
    $('#password').on('input', function () {
        const value = $(this).val();
        const strength = checkPasswordStrength(value);
        const $bars = $('#password-strength div');

        $bars.removeClass('bg-primary bg-yellow-400 bg-red-500').addClass('bg-gray-200');
        if (strength === 1) $bars.eq(0).addClass('bg-red-500');
        if (strength === 2) $bars.slice(0, 2).addClass('bg-yellow-400');
        if (strength === 3) $bars.addClass('bg-primary');
    });

    // ===== Confirm Password Validation =====
    $('#confirm-password').on('blur', function () {
        const pass = $('#password').val().trim();
        const confirm = $(this).val().trim();
        const $error = $('#match-error');

        if (confirm && pass !== confirm) {
            $error.removeClass('hidden opacity-0').addClass('opacity-100 translate-y-0');
        } else {
            $error.addClass('opacity-0');
            setTimeout(() => $error.addClass('hidden'), 300);
        }
    });

    // ===== Strength Check Function =====
    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        return strength;
    }
});

// Step 3
$(function () {
    const $input = $("#dob-input");
    const $dropdown = $("#dob-dropdown");
    const $monthLabel = $("#monthLabel");
    const $grid = $("#calendarGrid");
    const $icon = $("#dob-icon");

    let current = new Date();

    const daysShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDay = firstDay.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        $monthLabel.text(date.toLocaleString("default", { month: "long", year: "numeric" }));
        $grid.empty();

        // Days header
        daysShort.forEach(d => {
            $grid.append(`<div class='font-semibold text-gray-500 py-1'>${d}</div>`);
        });

        // Empty slots
        for (let i = 0; i < startDay; i++) {
            $grid.append(`<div></div>`);
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const today = new Date();
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

            const $cell = $(`<div class="py-1.5 rounded-md hover:bg-primary/10 cursor-pointer transition">${d}</div>`);
            if (isToday) $cell.addClass("bg-primary/10 font-bold text-primary");

            $cell.on("click", function () {
                const formatted = `${year} / ${date.toLocaleString("default", { month: "short" })} / ${String(d).padStart(2, "0")}`;
                $input.val(formatted);
                hideDropdown();
            });

            $grid.append($cell);
        }
    }

    function showDropdown() {
        renderCalendar(current);
        $dropdown.hide().removeClass("hidden").slideDown(150);
    }

    function hideDropdown() {
        $dropdown.slideUp(150, () => $dropdown.addClass("hidden"));
    }

    $input.add($icon).on("click", function () {
        if ($dropdown.hasClass("hidden")) showDropdown();
        else hideDropdown();
    });

    $("#prevMonth").on("click", function () {
        current.setMonth(current.getMonth() - 1);
        renderCalendar(current);
    });
    $("#nextMonth").on("click", function () {
        current.setMonth(current.getMonth() + 1);
        renderCalendar(current);
    });

    $(document).on("click", function (e) {
        if (!$(e.target).closest("#dob-dropdown, #dob-input, #dob-icon").length) hideDropdown();
    });
});

// Step 4
$(function () {
    // يبني صف فترة وقت جديدة
    function buildRangeRow() {
        return $(`
        <div class="range-row grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <div>
            <label class="block text-[13px] text-gray-800 mb-1">From</label>
            <div class="relative">
              <input type="time" value="09:00" class="hide-date-icon bg-[#F3F5FA] time-input w-full text-[16px] px-4 py-3 pl-11 rounded-lg border border-primary/35 bg-soft text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 19C4.26 19 0 14.739 0 9.5S4.26 0 9.5 0 19 4.261 19 9.5 14.738 19 9.5 19Zm0-17.48A7.98 7.98 0 1 0 17.48 9.5 7.99 7.99 0 0 0 9.5 1.52Zm-.061 8.679H4.56a.78.78 0 0 1 0-1.56h4.119V3.04a.78.78 0 1 1 1.56 0V9.44a.78.78 0 0 1-.78.76Z" fill="#1B449C"/></svg>
              </span>
            </div>
          </div>
          <div>
            <label class="block text-[13px] text-gray-800 mb-1">To</label>
            <div class="relative">
              <input type="time" value="19:00" class="hide-date-icon bg-[#F3F5FA] time-input w-full text-[16px] px-4 py-3 pl-11 rounded-lg border border-primary/35 bg-soft text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 19C4.26 19 0 14.739 0 9.5S4.26 0 9.5 0 19 4.261 19 9.5 14.738 19 9.5 19Zm0-17.48A7.98 7.98 0 1 0 17.48 9.5 7.99 7.99 0 0 0 9.5 1.52Zm-.061 8.679H4.56a.78.78 0 0 1 0-1.56h4.119V3.04a.78.78 0 1 1 1.56 0V9.44a.78.78 0 0 1-.78.76Z" fill="#1B449C"/></svg>
              </span>
            </div>
          </div>
          <div class="flex md:justify-center">
            <button type="button" class="btn-remove w-11 h-11 rounded-lg border border-gray-200 hover:bg-gray-50 grid place-items-center">
              <svg width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg"> 
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.17099 25.1213L3.74128 14.3343C3.58992 13.1914 4.90475 12.4222 5.82678 13.1284C5.9631 13.2324 6.07752 13.3624 6.16347 13.5108C6.24943 13.6592 6.30523 13.8232 6.32767 13.9932L7.75738 24.7802C7.77989 24.9497 7.76871 25.122 7.72446 25.2872C7.68022 25.4525 7.60379 25.6073 7.49955 25.7429C6.79181 26.6669 5.32272 26.2665 5.17099 25.1213ZM4.5306 14.2314L5.96022 25.0183C5.9789 25.1513 6.04945 25.2716 6.15647 25.3527C6.26348 25.4339 6.39827 25.4695 6.5314 25.4516C6.66452 25.4337 6.78518 25.3639 6.86701 25.2574C6.94884 25.1509 6.9852 25.0163 6.96816 24.8831L5.53863 14.0961C5.52069 13.9624 5.45039 13.8414 5.34319 13.7595C5.23598 13.6777 5.10066 13.6418 4.96699 13.6597C4.83332 13.6777 4.71224 13.748 4.6304 13.8552C4.54856 13.9624 4.51266 14.0977 4.5306 14.2314ZM15.0172 25.0183L16.4468 14.2314C16.4647 14.0977 16.4288 13.9624 16.347 13.8552C16.2652 13.748 16.1441 13.6777 16.0104 13.6597C15.8767 13.6418 15.7414 13.6777 15.6342 13.7595C15.527 13.8414 15.4567 13.9624 15.4388 14.0961L14.0092 24.8831C13.9922 25.0163 14.0286 25.1509 14.1104 25.2574C14.1922 25.3639 14.3129 25.4337 14.446 25.4516C14.5791 25.4695 14.7139 25.4339 14.8209 25.3527C14.928 25.2716 14.9985 25.1513 15.0172 25.0183ZM17.236 14.3343L15.8064 25.1213C15.7839 25.2926 15.7276 25.4578 15.6407 25.6071C15.5538 25.7565 15.4381 25.8872 15.3003 25.9914C15.1625 26.0957 15.0054 26.1716 14.838 26.2147C14.6707 26.2578 14.4964 26.2671 14.3254 26.2423C14.1544 26.2174 13.99 26.1589 13.8418 26.07C13.6936 25.9811 13.5646 25.8636 13.4621 25.7244C13.3597 25.5852 13.286 25.4271 13.2452 25.2592C13.2044 25.0912 13.1974 24.9169 13.2245 24.7462L14.6499 13.9932C14.8017 12.8475 16.2713 12.4483 16.9784 13.3715C17.0826 13.5071 17.1591 13.662 17.2033 13.8272C17.2476 13.9924 17.2588 14.1647 17.2363 14.3343H17.236ZM20.1269 9.91273H0.850995L3.28041 28.2438C3.31414 28.5098 3.44426 28.7543 3.64613 28.9308C3.848 29.1074 4.10761 29.2038 4.37579 29.2018H16.6012C16.8694 29.2038 17.129 29.1074 17.3309 28.9308C17.5328 28.7543 17.6629 28.5098 17.6966 28.2438L20.1269 9.91273ZM20.5812 9.11418L0.396635 9.11518C0.340126 9.1155 0.284327 9.12779 0.232915 9.15124C0.181503 9.1747 0.135646 9.20879 0.0983686 9.25126C0.0610906 9.29373 0.0332378 9.34362 0.0166466 9.39763C5.53788e-05 9.45165 -0.0048984 9.50858 0.00211344 9.56465L2.49163 28.3463C2.55084 28.804 2.77486 29.2245 3.12176 29.5289C3.46866 29.8333 3.91464 30.0008 4.37616 30H16.6012C17.0628 30.0008 17.5089 29.8334 17.8558 29.529C18.2028 29.2246 18.4269 28.8041 18.4861 28.3463L20.9709 9.5986C20.9838 9.54027 20.9835 9.47978 20.9699 9.4216C20.9563 9.36341 20.9298 9.30904 20.8923 9.26249C20.8548 9.21594 20.8074 9.17842 20.7535 9.1527C20.6995 9.12698 20.6405 9.11372 20.5808 9.11391L20.5812 9.11418ZM11.0016 24.9971C11.0016 25.666 9.98473 25.6671 9.98419 24.9986L9.97559 14.1171C9.97559 13.4483 10.9925 13.4472 10.993 14.1158L11.0021 24.9972L11.0016 24.9971ZM11.7885 14.1157L11.797 24.9971C11.7984 26.7146 9.1898 26.7162 9.18872 24.9986L9.18021 14.1171C9.17885 12.3996 11.7885 12.3982 11.7885 14.1158V14.1157ZM1.57278 2.50401L20.2989 7.52188L20.5578 6.55559C20.6262 6.2993 20.5901 6.02635 20.4575 5.79659C20.325 5.56684 20.1067 5.39905 19.8506 5.33002L3.05762 0.830324C2.80133 0.761899 2.52836 0.797916 2.29859 0.930476C2.06882 1.06304 1.90101 1.28132 1.83196 1.53744L1.57296 2.50419L1.57278 2.50401ZM13.5267 2.80972L9.75615 1.79943L9.9057 1.31411C9.94184 1.17882 10.0295 1.06304 10.1498 0.991501C10.2702 0.919962 10.4138 0.898343 10.5499 0.931263L13.311 1.67115C13.441 1.70332 13.5532 1.78503 13.6238 1.89883C13.6943 2.01263 13.7176 2.1495 13.6886 2.28022L13.5265 2.80972H13.5267ZM8.98657 1.5932L9.14454 1.08009C9.24191 0.748085 9.46424 0.466777 9.76476 0.295327C10.0653 0.123877 10.4206 0.0756463 10.7559 0.160779L13.517 0.900755C14.2313 1.10399 14.6603 1.82722 14.4457 2.53026L14.2961 3.01558L20.0562 4.55899C20.5159 4.68394 20.9076 4.98558 21.1459 5.39816C21.3842 5.81073 21.4497 6.30077 21.3282 6.76145L20.9661 8.11303C20.9387 8.21519 20.872 8.30231 20.7804 8.35526C20.6889 8.40821 20.5801 8.42264 20.4779 8.39539L0.981446 3.1712C0.930835 3.15773 0.883376 3.13441 0.841788 3.10257C0.8002 3.07074 0.765297 3.03101 0.739079 2.98567C0.712861 2.94034 0.695842 2.89027 0.688996 2.83835C0.682149 2.78642 0.685609 2.73366 0.699179 2.68307L1.06129 1.3314C1.18628 0.87177 1.48787 0.480176 1.90034 0.24196C2.31281 0.00374348 2.80272 -0.0617837 3.2633 0.0596593L8.98657 1.5932Z" fill="#AAAAAA"/>
               </svg>
            </button>
          </div>
        </div>
      `);
    }

    // إعادة تسمية الحقول لتتوافق مع Laravel لاحقًا
    function reindexNames($dayCard) {
        const day = $dayCard.data('day');
        $dayCard.find('.range-row').each(function (i) {
            $(this).find('input[type="time"]').eq(0).attr('name', `availability[${day}][${i}][from]`);
            $(this).find('input[type="time"]').eq(1).attr('name', `availability[${day}][${i}][to]`);
        });
    }

    // تحديث حالة الفراغ
    function refreshEmptyState($dayCard) {
        const hasRows = $dayCard.find('.range-row').length > 0;
        $dayCard.find('.empty-state').toggleClass('hidden', hasRows);
    }

    // تبديل اليوم On/Off
    $(document).on('click', '.day-card .toggle', function () {
        const $btn = $(this);
        const pressed = $btn.attr('aria-pressed') === 'true';
        const $card = $btn.closest('.day-card');
        const $badge = $card.find('.badge');
        const $add = $card.find('.btn-add');
        const $ranges = $card.find('.ranges');

        if (pressed) {
            // إلى OFF
            $btn.attr('aria-pressed', 'false').removeClass('bg-primary').addClass('bg-gray-300');
            $btn.find('.knob').removeClass('right-[3px]').addClass('left-[3px]');
            $badge.removeClass('bg-blue-100 text-primary').addClass('bg-gray-100 text-gray-500').text('Unavailable');
            $add.prop('disabled', true).addClass('text-gray-400 cursor-not-allowed');
            $ranges.empty().addClass('hidden');
            refreshEmptyState($card); // يظهر No ranges yet
        } else {
            // إلى ON
            $btn.attr('aria-pressed', 'true').removeClass('bg-gray-300').addClass('bg-primary');
            $btn.find('.knob').removeClass('left-[3px]').addClass('right-[3px]');
            $badge.removeClass('bg-gray-100 text-gray-500').addClass('bg-blue-100 text-primary').text('Available');
            $add.prop('disabled', false).removeClass('text-gray-400 cursor-not-allowed');
            $ranges.removeClass('hidden');
            refreshEmptyState($card);
        }
        reindexNames($card);
    });

    // إضافة فترة
    $(document).on('click', '.day-card .btn-add', function () {
        const $card = $(this).closest('.day-card');
        const $ranges = $card.find('.ranges');
        $ranges.append(buildRangeRow());
        reindexNames($card);
        refreshEmptyState($card);
    });

    // حذف صف فترة
    $(document).on('click', '.day-card .btn-remove', function () {
        const $card = $(this).closest('.day-card');
        $(this).closest('.range-row').remove();
        reindexNames($card);
        refreshEmptyState($card);
    });

    // عند التحميل الأول: إعادة فهرسة وضبط حالة الفراغ للأيام المفعّلة
    $('.day-card').each(function () {
        reindexNames($(this));
        refreshEmptyState($(this));
    });

    $(document).on('click', '.time-input + span', function () {
        console.log('open');
        const input = $(this).siblings('input[type="time"]')[0];
        if (input && input.showPicker) {
            input.showPicker(); // يفتح اختيار الوقت الأصلي
        } else {
            $(input).focus(); // fallback للمتصفحات القديمة
        }
    });
});

// Step 5
$(function () {
    // التحكم في زيادة أو نقصان السنة
    $('#yearUp').on('click', function () {
        let current = parseInt($('#yearTo').val()) || new Date().getFullYear();
        $('#yearTo').val(current + 1);
    });

    $('#yearDown').on('click', function () {
        let current = parseInt($('#yearTo').val()) || new Date().getFullYear();
        $('#yearTo').val(current - 1);
    });

    // عرض اسم الملف بعد الاختيار
    $('#certFile').on('change', function () {
        let file = this.files[0];
        $('#fileName').text(file ? file.name : 'Choose the file');
    });
});

// Step 8
$(function () {
    $('#videoFile').on('change', function () {
        let file = this.files[0];
        $('#videoFileName').text(file ? file.name : 'Choose the file');
    });
});