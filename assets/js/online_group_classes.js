$(document).ready(function () {
    let currentPage = 1;
    let itemsPerPage = 6;
    
    // دالة لاستخراج البيانات من البطاقة
    function getCardData(card) {
        const $card = $(card);
        
        // استخراج السعر من النص
        const priceText = $card.find('.flex.justify-between.items-center.pb-4.border-b.border-gray-200 .text-lg.font-bold.text-primary').text();
        const price = parseFloat(priceText.replace('$', '').trim()) || 0;
        
        // استخراج التقييم
        const ratingText = $card.find('.text-lg.font-semibold.text-gray-800').first().text();
        const rating = parseFloat(ratingText.split('/')[0].trim()) || 0;
        
        // استخراج الوقت
        const timeText = $card.find('.flex.justify-between.items-center.pb-4.mb-4.border-b.border-gray-200 span.text-md.font-medium.text-gray-800').last().text();
        
        return { price, rating, timeText };
    }
    
    // دالة الفلترة
    function applyFilters() {
        const priceFrom = parseFloat($('#price-from').val()) || 0;
        const priceTo = parseFloat($('#price-to').val()) || Infinity;
        const rateValue = parseFloat($('#rate-value').val()) || 0;
        const timeFilter = $('#time-filter').val();
        
        const cards = $('#coursesGridGroupClasses .course-card');
        let visibleCount = 0;
        
        cards.each(function() {
            const cardData = getCardData(this);
            let shouldShow = true;
            
            // فلتر السعر
            if (priceFrom > 0 && cardData.price < priceFrom) {
                shouldShow = false;
            }
            if (priceTo < Infinity && cardData.price > priceTo) {
                shouldShow = false;
            }
            
            // فلتر التقييم
            if (rateValue > 0 && cardData.rating < rateValue) {
                shouldShow = false;
            }
            
            // فلتر الوقت
            if (timeFilter && cardData.timeText) {
                const time = cardData.timeText.trim();
                const timeParts = time.split(':');
                if (timeParts.length >= 2) {
                    let hour = parseInt(timeParts[0]);
                    const isPM = time.toLowerCase().includes('pm');
                    const isAM = time.toLowerCase().includes('am');
                    
                    // تحويل إلى 24 ساعة
                    if (isPM && hour !== 12) {
                        hour += 12;
                    } else if (isAM && hour === 12) {
                        hour = 0;
                    }
                    
                    if (timeFilter === 'morning' && (hour < 8 || hour >= 12)) {
                        shouldShow = false;
                    } else if (timeFilter === 'afternoon' && (hour < 12 || hour >= 17)) {
                        shouldShow = false;
                    } else if (timeFilter === 'evening' && (hour < 17 || hour >= 21)) {
                        shouldShow = false;
                    }
                }
            }
            
            // إظهار أو إخفاء البطاقة
            if (shouldShow) {
                $(this).removeClass('filtered-out').show();
                visibleCount++;
            } else {
                $(this).addClass('filtered-out').hide();
            }
        });
        
        // إعادة تعيين الصفحة الأولى بعد الفلترة
        currentPage = 1;
        updatePaginationAndShow();
    }
    
    function updatePaginationAndShow() {
        const visibleCards = $('#coursesGridGroupClasses .course-card').filter(function() {
            return !$(this).hasClass('filtered-out');
        });
        
        const totalPages = Math.ceil(visibleCards.length / itemsPerPage);
        
        // إخفاء جميع البطاقات المرئية
        visibleCards.hide();
        
        // إظهار البطاقات للصفحة الحالية
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        visibleCards.slice(start, end).show();
        
        // تحديث أزرار الترقيم
        updatePagination(totalPages);
    }

    function updatePagination(totalPages) {
        const pagesNumbers = $('#pagesNumbers');
        pagesNumbers.empty();

        if (totalPages === 0) {
            return;
        }

        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === currentPage;
            const pageButton = $(`
                <button class="flex justify-center items-center w-8 h-8 rounded-full transition-all duration-200 cursor-pointer ${
                    isActive 
                        ? 'bg-primary text-white font-bold' 
                        : 'text-black hover:text-white hover:bg-primary'
                }" data-page="${i}">
                    ${i}
                </button>
            `);
            
            pagesNumbers.append(pageButton);
        }
    }

    // حدث الترقيم
    $(document).on('click', '#paginationBlogs button[data-page]', function () {
        const page = $(this).data('page');
        const visibleCards = $('#coursesGridGroupClasses .course-card').filter(function() {
            return !$(this).hasClass('filtered-out');
        });
        const totalPages = Math.ceil(visibleCards.length / itemsPerPage);
        
        if (page === 'prev' && currentPage > 1) {
            currentPage--;
        } else if (page === 'next' && currentPage < totalPages) {
            currentPage++;
        } else if (typeof page === 'number') {
            currentPage = page;
        }
        
        updatePaginationAndShow();
        
        // Scroll to top smoothly
        $('html, body').animate({
            scrollTop: $('#coursesGridGroupClasses').offset().top - 150
        }, 500);
    });
    
    // تغيير عدد العناصر في الصفحة
    $('#perPageSelect').on('change', function() {
        itemsPerPage = parseInt($(this).val());
        currentPage = 1;
        updatePaginationAndShow();
    });
    
    // أحداث الفلاتر
    $('#price-from, #price-to, #rate-value').on('input', function() {
        applyFilters();
    });
    
    $('#time-filter').on('change', function() {
        applyFilters();
    });
    
    // ملاحظة: Level و Topic لا يعملان لأنه لا توجد بيانات في البطاقات
    // إذا أردت تفعيلهما، أضف data-level و data-topic للبطاقات في HTML
    $('#level-filter, #topic-filter').on('change', function() {
        // يمكن تفعيلها لاحقاً عند إضافة البيانات للبطاقات
    });
    
    // زر مسح الفلاتر
    $('#clear-filters-btn').on('click', function() {
        $('#price-from').val('');
        $('#price-to').val('');
        $('#level-filter').val('all');
        $('#topic-filter').val('');
        $('#time-filter').val('');
        $('#rate-value').val('4.0');
        
        // إزالة جميع الفلاتر وإظهار كل البطاقات
        $('#coursesGridGroupClasses .course-card').removeClass('filtered-out').show();
        currentPage = 1;
        updatePaginationAndShow();
    });

    // التحميل الأولي - عرض جميع البطاقات
    $('#coursesGridGroupClasses .course-card').removeClass('filtered-out').show();
    updatePaginationAndShow();
});

