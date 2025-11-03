/**
 * Wallet Checkout Page JavaScript
 * Handles all interactive functionality for the checkout page
 */

$(document).ready(function() {
    
    let selectedGateway = null;
    let discountApplied = false;
    const TAX_RATE = 0; // 0% tax
    const SERVICE_FEE = 0; // $0 service fee

    // ============================================
    // Preset Amount Buttons
    // ============================================
    $('.preset-btn').on('click', function() {
        const amount = $(this).data('amount');
        const currentAmount = parseFloat($('#wallet-amount').val()) || 0;
        const newAmount = currentAmount + amount;
        
        $('#wallet-amount').val(newAmount);
        updateTotals(newAmount);
        
        // Visual feedback
        $(this).addClass('bg-primary text-white');
        setTimeout(() => {
            $(this).removeClass('bg-primary text-white');
        }, 200);
    });

    // ============================================
    // Wallet Amount Input Change
    // ============================================
    $('#wallet-amount').on('input change', function() {
        let amount = parseFloat($(this).val()) || 0;
        
        // Prevent negative values
        if (amount < 0) {
            amount = 0;
            $(this).val(0);
        }
        
        updateTotals(amount);
    });

    // ============================================
    // Payment Gateway Selection
    // ============================================
    $('.payment-gateway').on('click', function() {
        // Remove active state from all gateways
        $('.payment-gateway').removeClass('border-primary border-2').addClass('border-gray-200');
        
        // Add active state to selected gateway
        $(this).removeClass('border-gray-200').addClass('border-primary border-2');
        
        // Store selected gateway
        selectedGateway = $(this).data('gateway');
        
        // Visual feedback
        $(this).css('transform', 'scale(0.98)');
        setTimeout(() => {
            $(this).css('transform', 'scale(1)');
        }, 100);
    });

    // ============================================
    // Discount Code Application
    // ============================================
    $('#apply-discount-btn').on('click', function() {
        const discountCode = $('#discount-code').val().trim();
        
        if (discountCode === '') {
            showMessage('Please enter a discount code', 'warning');
            return;
        }
        
        // Simulate discount code validation
        // In real application, this would be an API call
        if (discountCode.toUpperCase() === 'DISCOUNT10' || discountCode.toUpperCase() === 'SAVE20') {
            discountApplied = true;
            
            showMessage('Discount code applied successfully!', 'success');
            
            // Update button appearance
            $(this).text('Applied ✓').addClass('bg-green-600 hover:bg-green-700').removeClass('bg-primary hover:bg-primary-700');
            $('#discount-code').prop('disabled', true).addClass('bg-gray-100');
            
            // Recalculate with discount
            const amount = parseFloat($('#wallet-amount').val()) || 0;
            updateTotals(amount);
        } else {
            showMessage('Invalid discount code. Try: DISCOUNT10', 'error');
        }
    });

    // ============================================
    // Purchase Confirmation Button
    // ============================================
    $('#purchase-btn').on('click', function() {
        const amount = parseFloat($('#wallet-amount').val()) || 0;
        
        // Validation
        if (amount <= 0) {
            showMessage('Please enter a valid amount', 'error');
            return;
        }
        
        if (!selectedGateway) {
            showMessage('Please select a payment method', 'error');
            return;
        }
        
        // Success - would redirect to payment gateway in real application
        const gatewayName = selectedGateway === 'pay' ? 'PAY' : 'PALPAY';
        showMessage(`Redirecting to ${gatewayName} payment gateway...`, 'success');
        
        // Simulate loading state
        $(this).prop('disabled', true).html('<span class="inline-block animate-pulse">Processing...</span>');
        
        // Simulate redirect after 2 seconds
        setTimeout(() => {
            $(this).prop('disabled', false).text('Purchase confirmation');
            showMessage('Demo mode - No actual payment processed', 'info');
        }, 2000);
    });

    // ============================================
    // Update Totals Function
    // ============================================
    function updateTotals(baseAmount) {
        // Calculate tax
        const taxAmount = baseAmount * TAX_RATE;
        
        // Calculate service fee
        const serviceFee = SERVICE_FEE;
        
        // Apply discount if applicable
        let discount = 0;
        if (discountApplied) {
            discount = baseAmount * 0.10; // 10% discount
        }
        
        // Calculate total
        const total = baseAmount - discount;
        const finalTotal = total + taxAmount + serviceFee;
        
        // Update display
        $('#total-amount').text(formatCurrency(total));
        $('#tax-amount').text(TAX_RATE > 0 ? formatCurrency(taxAmount) : '%0');
        $('#service-amount').text(formatCurrency(serviceFee));
        $('#final-total').text(formatCurrency(finalTotal));
    }

    // ============================================
    // Helper: Format Currency
    // ============================================
    function formatCurrency(amount) {
        return amount.toFixed(2) + ' $';
    }

    // ============================================
    // Helper: Show Messages
    // ============================================
    function showMessage(message, type) {
        // Create message element
        const messageClass = {
            'success': 'bg-green-100 border-green-400 text-green-700',
            'error': 'bg-red-100 border-red-400 text-red-700',
            'warning': 'bg-yellow-100 border-yellow-400 text-yellow-700',
            'info': 'bg-blue-100 border-blue-400 text-blue-700'
        };
        
        const $message = $(`
            <div class="fixed top-32 right-4 left-4 mx-auto max-w-md z-50 px-4 py-3 rounded-lg border-l-4 shadow-lg ${messageClass[type]} animate-fade-in-down" role="alert">
                <p class="font-medium">${message}</p>
            </div>
        `);
        
        // Add to page
        $('body').append($message);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            $message.fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);
    }

    // ============================================
    // Initialize with default values
    // ============================================
    const initialAmount = parseFloat($('#wallet-amount').val()) || 10;
    updateTotals(initialAmount);
});

// Add custom CSS animation for message fade in
$('<style>')
    .prop('type', 'text/css')
    .html(`
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-down {
            animation: fadeInDown 0.3s ease-out;
        }
    `)
    .appendTo('head');

