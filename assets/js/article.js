// Courses Filtering
$(document).ready(function () {
    let currentPage = 1;
    let perPage = 3; // أو القيمة اللي بتجي من select
  
    function renderPagination(totalItems) {
      let totalPages = Math.ceil(totalItems / perPage);
      let container = $("#pagesNumbers").empty();
    
      for (let i = 1; i <= totalPages; i++) {
        container.append(
          `<button class="min-w-8 h-8 px-2 flex items-center justify-center text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${i===currentPage ? 'bg-primary text-white shadow-sm' : 'text-primary hover:text-white hover:bg-primary'}" data-page="${i}">${i}</button>`      
        );
      }
    }
    
    function showPage() {
      let cards = $(".course-blogs-card");
    
      cards.hide();
      let start = (currentPage - 1) * perPage;
      let end = start + perPage;
    
      cards.slice(start, end).fadeIn(200);
      renderPagination(cards.length);
    }
    
    $(document).on("click", "#paginationBlogs button", function() {
      let page = $(this).data("page");
      let cards = $(".course-blogs-card");
  
      let totalPages = Math.ceil(cards.length / perPage);
      if (page === "prev" && currentPage > 1) currentPage--;
      else if (page === "next" && currentPage < totalPages) currentPage++;
      else if (!isNaN(page)) currentPage = page;
      showPage();
    });
    
    $("#perPageSelect").on("change", function(){
      perPage = parseInt($(this).val());
      currentPage = 1;
      showPage();
    });
    showPage();

    $('#btn-share').on('click',function(){
      $('#box-share').toggleClass('invisible opacity-0 translate-y-2 visible opacity-100 translate-y-0');
    });
});
