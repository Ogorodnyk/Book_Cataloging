$(function() {

    function showBooks(books) {

         var tbody = $("#tbody");
         tbody.empty();

         books.forEach(function(book) {

            var tr = $("<tr>");

            var td1 = $("<td><pre style='display:none;'></pre></td>");
            var td2 = $("<td>" + book.author + "</td>");
            var td3 = $("<td>" + book.isbn + "</td>");
            var td4 = $("<td></td>");

            var deleteButton = $("<button>Usuń</button>");
            td4.append(deleteButton);
            deleteButton.click(function() {
                var url = "http://localhost:8000/book/" + book.id;
                $.ajax(url, {type: "DELETE"})
                 .done(fetchBooks);
            });

            tr.append(td1);
            tr.append(td2);
            tr.append(td3);
            tr.append(td4);

            var a = $("<a href='#'>" + book.title + "</a>");
            a.attr("data-id", book.id);
            td1.prepend(a);

            a.click(function(event) {
                event.preventDefault();

                var bookId = $(this).data("id");
                var url = "http://localhost:8000/book/" + bookId;

                $.ajax(url)
                 .done(function(book) {
                      var pre = td1.find("pre");
                      if (pre.is(":visible")) {
                          pre.slideUp();
                      } else {
                          pre.hide();
                          pre.text(JSON.stringify(book, null, 4));
                          pre.slideDown();
                      }
                  });
            });

            tbody.append(tr);
         });
    }

    var form = $("#createBookForm");
    form.on("submit", function(event) {
        event.preventDefault();

        var titleInput = $("input[name=title]");
        var authorInput = $("input[name=author]");
        var isbnInput = $("input[name=isbn]");
        var publisherInput = $("input[name=publisher]");
        var genreInput = $("select[name=genre]");

        var title = titleInput.val();
        var author = authorInput.val();
        var isbn = isbnInput.val();
        var publisher = publisherInput.val();
        var genre = genreInput.val();

        var book = {
            title: title,
            author: author,
            isbn: isbn,
            publisher: publisher,
            genre: genre
        };

        $.post("http://localhost:8000/book/", book)
         .done(function(result) {

             // clear HTML form
             titleInput.val("");
             authorInput.val("");
             isbnInput.val("");
             publisherInput.val("");
             genreInput.val("");

             fetchBooks();
         });
    });

    function fetchBooks() {
        $.ajax("http://localhost:8000/book/")
         .done(showBooks)
         .fail(function(error) {
             alert("Nie udało się pobrać książek");
             console.log(error.status);
         });
    }

    fetchBooks();
});
