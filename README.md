# booklist

This is a web app that uses google sheets as a database to create a book list. All you need is a google sheet and this code to be hosted someplace and you can create your own book list.

# Getting Started

1. Fork this or just download the code I don't care.
2. Create a google sheet with the following columns
* title - title of the book
* author - author of the book
* year that i read - year when you read the book
* is collection - if the book is a collection of books (good for scifi/fantasy)
* image url - url for some image you want to use for the book
* book cover - this is internally used by me to render the image to make sure the url works (used `=IMAGE('image url column', 1)`).
* synopsis - your thoughts about the book
3. fill in your data (This is the time consuming part)
4. publish the sheet (can't use it as a database if the data isn't available)
5. change `publicSpreadsheetUrl` to be your shared spreadsheet url.
6. sit back and watch all of your users adore you for reading books.
