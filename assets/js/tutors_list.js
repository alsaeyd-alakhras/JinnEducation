// Tutors List Page Functionality
$(document).ready(function() {
    console.log('Tutors List Page Loaded');

    // Tutor Card Click - Add Active State
    $('.tutor-card').on('click', function(e) {
        // Don't trigger if clicking buttons
        if ($(e.target).closest('button').length) {
            return;
        }
        
        // Remove active class from all cards
        $('.tutor-card').removeClass('ring-2 ring-primary');
        
        // Add active class to clicked card
        $(this).addClass('ring-2 ring-primary');
    });

    // Join Now Button Click
    $('.join-now-btn').on('click', function(e) {
        e.stopPropagation();
        const tutorName = $(this).closest('.tutor-card').find('h3').text();
        
        // Show demo alert (replace with actual modal/navigation)
        alert(`Joining session with ${tutorName}!\n\nThis would normally open a booking modal or redirect to the booking page.`);
    });

    // View Full Schedule Button
    $('#viewFullScheduleBtn').on('click', function() {
        alert('View Full Schedule\n\nThis would open a modal showing the complete weekly schedule with all available time slots.');
    });

    // View Details Button
    $(document).on('click', '.tutor-card button:contains("View Details")', function(e) {
        e.stopPropagation();
        const tutorName = $(this).closest('.tutor-card').find('h3').text();
        
        alert(`Viewing details for ${tutorName}\n\nThis would navigate to the tutor's profile page.`);
    });

    // Hover Effect Enhancement
    $('.tutor-card').hover(
        function() {
            $(this).find('img').addClass('scale-105');
        },
        function() {
            $(this).find('img').removeClass('scale-105');
        }
    );

    // Schedule Grid Cell Click (for future expansion)
    $('.bg-blue-200').on('click', function() {
        $(this).toggleClass('bg-blue-400 bg-blue-200');
    });
});

