// Course Detail Page - Interactive Elements for online_group_classe.html
$(document).ready(function () {
    let selectedSlot = null;

    // ==================== FAQ Accordion ====================
    $('.faq-question').on('click', function() {
        const $faqItem = $(this).closest('.faq-item');
        const $answer = $faqItem.find('.faq-answer');
        const $icon = $(this).find('i');
        
        // Toggle current answer with smooth animation
        $answer.slideToggle(300, function() {
            // Callback after animation completes
        });
        
        // Rotate icon
        $icon.toggleClass('rotate-180');
    });

    // ==================== Time Slot Selection ====================
    $('.time-slot').on('click', function() {
        // Remove selection styling from all slots
        $('.time-slot').removeClass('border-primary-600 bg-primary-50')
                       .addClass('border-gray-200');
        
        // Add selection styling to clicked slot
        $(this).removeClass('border-gray-200')
               .addClass('border-primary-600 bg-primary-50');
        
        // Store selected slot information
        selectedSlot = {
            id: $(this).data('slot'),
            date: $(this).find('span:first').text(),
            time: $(this).find('span:last').text()
        };
        
        console.log('Selected slot:', selectedSlot);
    });

    // ==================== Book Now Button ====================
    $('#bookNowBtn').on('click', function() {
        if (selectedSlot) {
            // Show booking confirmation
            const message = 'Booking Confirmed!\n\n' +
                          'Date: ' + selectedSlot.date + '\n' +
                          'Time: ' + selectedSlot.time + '\n\n' +
                          'The course tutor will contact you within 24 hours to schedule and set a payment method.';
            
            alert(message);
            
            console.log('Booking details:', selectedSlot);
            
            // Optional: Send booking to server
            // $.ajax({
            //     url: '/api/course-bookings',
            //     method: 'POST',
            //     data: {
            //         courseId: 'write-essay-confidence',
            //         ...selectedSlot
            //     },
            //     success: function(response) {
            //         console.log('Booking successful:', response);
            //         // Redirect to confirmation page or show success modal
            //     },
            //     error: function(error) {
            //         console.error('Booking failed:', error);
            //         alert('Booking failed. Please try again.');
            //     }
            // });
        } else {
            // Alert user to select a time slot
            alert('Please select a time slot before booking.');
        }
    });

    // ==================== Smooth Scrolling ====================
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.hash);
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 120
            }, 500);
        }
    });

    // ==================== View Details Buttons ====================
    $('.recommendation-card button, a[href*="view-details"]').on('click', function(e) {
        // Optional: Add analytics tracking
        console.log('View details clicked for recommendation');
    });

    // ==================== Message Tutor / View Profile ====================
    $('button:contains("Message tutor")').on('click', function(e) {
        e.preventDefault();
        alert('Message feature coming soon!\nYou will be able to message the tutor directly.');
        console.log('Message tutor clicked');
    });

    $('button:contains("View profile")').on('click', function(e) {
        e.preventDefault();
        alert('Tutor profile feature coming soon!');
        console.log('View profile clicked');
    });

    // ==================== Add rotate-180 Tailwind class support ====================
    // Ensure Tailwind's rotate-180 is available
    if (!$('style#dynamic-rotate').length) {
        $('head').append('<style id="dynamic-rotate">.rotate-180 { transform: rotate(180deg); transition: transform 0.3s ease; }</style>');
    }
    // Optional: Auto-select first time slot
    // $('.time-slot').first().trigger('click');

    // $(function(){
    //     $('#fav-btn').on('click', function(){
    //         $(this).toggleClass('selected');
    //     });
    // });        
    $('#fav-btn').on('click', function(){
            $(this).toggleClass('selected');
            const $notFaved = $(this).find('.not-faved');
            const $faved = $(this).find('.faved');
            if($(this).hasClass('selected')) {
                $notFaved.addClass('!hidden');
                $faved.removeClass('!hidden');
            } else {
                $notFaved.removeClass('!hidden');
                $faved.addClass('!hidden');
            }
        });
});

