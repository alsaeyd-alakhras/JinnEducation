$(document).ready(function () {
    // ==========================================
    // TAB SWITCHING FUNCTIONALITY
    // ==========================================
    $('.tab-button').on('click', function () {
        const tabName = $(this).data('tab');
        
        // Don't do anything if clicking the active tab
        if ($(this).hasClass('active')) return;

        // Remove active class from all tabs and reset styles
        $('.tab-button').removeClass('active');
        $('.tab-button').removeClass('bg-primary text-white');
        $('.tab-button').addClass('text-black bg-transparent');

        // Add active class to clicked tab
        $(this).addClass('active');
        $(this).removeClass('text-black bg-transparent');
        $(this).addClass('bg-primary text-white hover:bg-primary hover:text-white');

        // Hide all tab contents with smooth fade out
        $('.tab-content').fadeOut(100, function() {
            // Show selected tab content with smooth fade in
            $(`#${tabName}-tab`).fadeIn(150);
        });
    });

    // ==========================================
    // SHOW MORE / SHOW LESS FUNCTIONALITY
    // ==========================================
    let isExpanded = false;

    $('#showMoreBtn').on('click', function () {
        if (!isExpanded) {
            // Expand
            $('.about-text-extra').slideDown(400);
            $(this).text('Show Less');
            isExpanded = true;
        } else {
            // Collapse
            $('.about-text-extra').slideUp(400);
            $(this).text('Show More');
            isExpanded = false;
        }
    });

    // ==========================================
    // SCHEDULE DATE NAVIGATION & DYNAMIC SCHEDULE
    // ==========================================
    let currentWeekOffset = 0;
    const baseDate = new Date(2025, 9, 15); // October 15, 2025 (Wednesday)

    // Sample schedule data (Replace with actual data from API)
    const sampleTimeSlots = [
        { time: '..:.' },
        { time: '07:00' },
        { time: '08:00' },
        { time: '09:00' },
        { time: '10:00' }
    ];

    // Generate week days
    function generateWeekDays() {
        const weekStart = new Date(baseDate);
        weekStart.setDate(baseDate.getDate() + (currentWeekOffset * 7) - 3); // Start from Sunday

        const days = [];
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'];
        
        for (let i = 0; i < 6; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(weekStart.getDate() + i);
            
            days.push({
                name: dayNames[i],
                date: currentDay.getDate(),
                fullDate: currentDay.toISOString().split('T')[0] // YYYY-MM-DD format
            });
        }
        
        return days;
    }

    // Render schedule grid
    function renderSchedule() {
        const days = generateWeekDays();
        const scheduleGrid = $('#scheduleGrid');
        scheduleGrid.empty();

        days.forEach(day => {
            const dayCol = $('<div>').addClass('flex flex-col items-center').css('min-width', '100px').css('flex', '1');
            
            // Day name with top border
            const dayName = $('<div>').addClass('text-sm text-primary font-medium mb-1 pt-2 border-t-2 border-primary w-full text-center').text(day.name);
            
            // Day number
            const dayNumber = $('<div>').addClass('text-xl font-bold text-primary mb-2').text(day.date);
            
            // Time slots container
            const timeSlotsContainer = $('<div>').addClass('w-1/2 space-y-1 mt-2');
            
            // Add time slots
            sampleTimeSlots.forEach((slot, index) => {
                const timeSlot = $('<div>')
                    .addClass('time-slot text-center py-1 text-sm border-b border-gray-400 font-semibold cursor-pointer transition-all')
                    .text(slot.time)
                    .attr('data-day', day.fullDate)
                    .attr('data-time', slot.time);
                
                // Skip hover for first slot (..:.)
                if (index === 0) {
                    timeSlot.removeClass('cursor-pointer font-semibold').addClass('border-gray-300 font-normal');
                } else {
                    // Check if this slot is selected in localStorage
                    const storageKey = `schedule_${day.fullDate}_${slot.time}`;
                    if (localStorage.getItem(storageKey) === 'selected') {
                        timeSlot.addClass('selected bg-primary text-white border-primary');
                    }
                }
                
                timeSlotsContainer.append(timeSlot);
            });
            
            dayCol.append(dayName, dayNumber, timeSlotsContainer);
            scheduleGrid.append(dayCol);
        });

        // Update date text
        updateWeekDate();
    }

    // Update week date display
    function updateWeekDate() {
        const currentDate = new Date(baseDate);
        currentDate.setDate(baseDate.getDate() + (currentWeekOffset * 7));

        const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = currentDate.toLocaleDateString('en-US', options);
        $('#weekDate').text(formattedDate);
    }

    // Time slot click handler
    $(document).on('click', '.time-slot', function () {
        // Skip if it's the first row (..:.)
        if ($(this).text().includes('..:.')) return;

        const day = $(this).attr('data-day');
        const time = $(this).attr('data-time');
        const storageKey = `schedule_${day}_${time}`;

        // Toggle selection
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected bg-primary text-white border-primary');
            localStorage.removeItem(storageKey);
        } else {
            $(this).addClass('selected bg-primary text-white border-primary');
            localStorage.setItem(storageKey, 'selected');
        }
    });

    // Navigation buttons
    $('#prevWeek').on('click', function () {
        currentWeekOffset--;
        $('#scheduleGrid').fadeOut(200, function () {
            renderSchedule();
            $(this).fadeIn(300);
        });
    });

    $('#nextWeek').on('click', function () {
        currentWeekOffset++;
        $('#scheduleGrid').fadeOut(200, function () {
            renderSchedule();
            $(this).fadeIn(300);
        });
    });

    // Initial render
    renderSchedule();

    // ==========================================
    // FULL SCHEDULE MODAL
    // ==========================================
    $('#viewFullScheduleBtn').on('click', function () {
        $('#fullScheduleModal').removeClass('hidden').addClass('flex');
        $('#fullScheduleModal').hide().fadeIn(300);
        $('body').css('overflow', 'hidden'); // Prevent background scrolling
    });

    $('#closeModalBtn').on('click', function () {
        $('#fullScheduleModal').fadeOut(300, function () {
            $(this).removeClass('flex').addClass('hidden');
        });
        $('body').css('overflow', 'auto'); // Restore scrolling
    });

    // Close modal when clicking outside
    $('#fullScheduleModal').on('click', function (e) {
        if ($(e.target).is('#fullScheduleModal')) {
            $(this).fadeOut(300, function () {
                $(this).removeClass('flex').addClass('hidden');
            });
            $('body').css('overflow', 'auto');
        }
    });

    // Close modal with Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $('#fullScheduleModal').hasClass('flex')) {
            $('#fullScheduleModal').fadeOut(300, function () {
                $(this).removeClass('flex').addClass('hidden');
            });
            $('body').css('overflow', 'auto');
        }
    });


    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    $('a[href^="#"]').on('click', function (e) {
        const target = $(this.hash);
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 140 // Account for fixed header
            }, 600);
        }
    });

    // ==========================================
    // ADDITIONAL BUTTON CLICK HANDLERS
    // ==========================================
    // Handle action button clicks
    $('.action-btn').on('click', function () {
        const buttonText = $(this).text().trim();
        console.log(`Action button clicked: ${buttonText}`);
        // Add your specific action handling here
    });

    // ==========================================
    // VIDEO PLAYER INTERACTION
    // ==========================================
    $('video').on('click', function () {
        if (this.paused) {
            this.play();
            $(this).siblings('.bg-opacity-30').fadeOut(200);
        } else {
            this.pause();
            $(this).siblings('.bg-opacity-30').fadeIn(200);
        }
    });

    // ==========================================
    // RESPONSIVE HANDLING
    // ==========================================
    function handleResponsive() {
        const windowWidth = $(window).width();

        if (windowWidth < 1024) {
            // Mobile/Tablet view adjustments
            $('.sticky').removeClass('sticky');
        } else {
            // Desktop view
            $('.top-32').addClass('sticky');
        }
    }

    // Run on load
    handleResponsive();

    // Run on resize
    $(window).on('resize', function () {
        handleResponsive();
    });

    // ==========================================
    // INITIALIZATION MESSAGE
    // ==========================================
    console.log('Tutor Profile page initialized successfully!');
});

