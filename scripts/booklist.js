// If $booklist exists, use it otherwise create an empty object
var $booklist = $booklist || {};  

// Define the configuration object
$booklist.defaultConfiguration = {
    googleSpreadSheetUrl: null,  // Required
    outputContainerId: null,     // Required
    modalTemplateId: null,       // Required
    listViewButtonId: null,      // Required
    tileViewButtonId: null,      // Required
    defaultMode: "list",         // Optional (list or tile)
}

$booklist.init = function (configuration) {
    // Supported features check
    var _supports = {
        papaParse: !!Papa.parse,
    },
    
    // Build _config from default and parameter
    _config = (function (defaultConfig, customConfig) {
        var newConfig = {};
        for (var attrname in defaultConfig) { newConfig[attrname] = defaultConfig[attrname]; }
        for (var attrname in customConfig) { newConfig[attrname] = customConfig[attrname]; }
        return newConfig;
    })($booklist.defaultConfiguration, configuration),
    
    // Populate some vars
    _googleSpreadSheetUrl = _config.googleSpreadSheetUrl;
    _outputContainer = document.getElementById(_config.outputContainerId),
    _modalTemplate = document.getElementById(_config.modalTemplateId),
    _listViewButton = document.getElementById(_config.listViewButtonId),
    _tileViewButton = document.getElementById(_config.tileViewButtonId),
    _renderMode = _config.defaultMode;
    _bookData = null  // Placeholder for book data

    // Fail early if missing features
    if (!_supports.papaParse) {
        console.log("Papa Parse not found.");
        return false;
    }

    // Verify configuration properties.
    for (var attrname in _config) {
        if(!_config[attrname]) {
            console.log(attrname, ":: missing required configuration.")
            return false;
        }
    }
    
    // Function to show book data in a modal
    var _showModal = function() {
    
        // Locate the parent row of the caller and pull the book data from it.
        var book = $(this).parent().data("book");
        
        var m = $(_modalTemplate);
        
        m.find(".title").text(book.title);
        m.find(".author").text(book.author);
        m.find(".synposis").text(book.synposis);
        m.find(".cover").attr("src","");
        
        if((book["image url"] || "") != "")
            m.find(".cover").attr("src",book["image url"])
                            .show();
        else
            m.find(".cover").hide();
        
        m.modal("show");
    };
    
    // Renders the table and wires up the modal...
    var _showTable = function(data) {
        
        // Is my data valid?
        if(Array.isArray(data)) {
        
            var d = _outputContainer;
            
            d.innerHTML = "<table class='table table-striped table-hover cursor-pointer'></table>"

            // Get your table...
            var t = d.firstChild;
            
            // Create and populate your table header...
            var th = document.createElement("thead");
            th.innerHTML = "<tr><th>Title</th><th>Author</th><th>Read</th></tr>";
            
            // Attach it to your table.
            t.appendChild(th);
            
            // Create a body...
            var tb = document.createElement("tbody");

            for(var i = 0; i < data.length; i++) {
                var book = data[i];
                
                // Create a row and corresponding cells...
                var tr = document.createElement("tr");
                var title = document.createElement("td");
                    title.className = "cursor-pointer";
                var author = document.createElement("td");
                var read = document.createElement("td");
                
                // Populate the cells...
                title.innerHTML = book.title;
                author.innerHTML = book.author;
                read.innerHTML = book["year that i read"];
                
                // Attach cells to row...
                tr.appendChild(title);
                tr.appendChild(author);
                tr.appendChild(read);
                
                // Store book data in the row.
                $(tr).data("book",data[i]);
                                    
                // This could be done a milltion different ways but...
                // Attach the instance function to the click event of each cell.
                $(title).click(_showModal); 
                $(author).click(_showModal); 
                $(read).click(_showModal); 
                
                // Attach row to body...
                tb.appendChild(tr);
            }
            
            // Attach the body to the table...
            t.appendChild(tb);

        } else {
            console.log("data is invalid");
            // todo:: show an error...
        }
    };
    
    // Renders the tiles and wires up the modal...
    var _showTile = function(data) {
        var t = _outputContainer;

        if(Array.isArray(data)) { 
            
            for(var i = 0; i < data.length; i++) {

                var book = data[i];
                
                // create a row for the cards if there isnt one or 
                // if there is already three cards in a row
                if(i % 3 == 0) {
                    var row = document.createElement("div");
                    row.className = "row";
                    t.appendChild(row);
                }

                // create the card
                var col = document.createElement("div");
                var card = document.createElement("div");
                var cardImg = document.createElement("img");
                var cardTitle = document.createElement("h5");
                var cardAuthor = document.createElement("h6");
                var cardText = document.createElement("p");

                // populate the card with the appropriate class formatting
                col.className = "col-md-4";
                card.className = "card";
                cardImg.className = "card-img-top";
                cardTitle.className = "card-title";
                cardAuthor.className = "card-author";
                cardText.className = "card-text";

                // populate the card with data
                cardTitle.innerHTML = book.title;
                cardAuthor.innerHTML = book.author;
                cardImg.src = book['image url'];
                cardText.innerHTML = book.synposis;

                // append shit to the row
                var cardcol = row.appendChild(col);
                cardcol.appendChild(card);
                cardcol.appendChild(cardImg);
                cardcol.appendChild(cardTitle);
                cardcol.appendChild(cardAuthor);
                cardcol.appendChild(cardText);

                }

            } else {
            console.log("data is invalid");
            // todo:: show an error...
        }
    }; 

    _listViewButton.onclick = function() {
        _renderMode = "list";
        _renderData(_bookData, _renderMode);
    }

    _tileViewButton.onclick = function() {
        _renderMode = "tile";
        _renderData(_bookData, _renderMode);
    }

    _renderData = function (data, mode) {
        _outputContainer.innerHTML = "";
        
        if(mode === "list")
            _showTable(data);
        else
            _showTile(data);        
    };
    
    // Define an error handler
    _errorHandler = function (error, file, el, reason) {
        console.log(error, file, el, reason);
    };
    
    // Define a data parser
    _dataParser = function (data) {
        console.log(data);
        _bookData = data.data;        
        _renderData(_bookData, _renderMode);
    };
    
    // Parse the thing!
    _papaParseConfig = {
        download: true,
        header: true,
        error: _errorHandler,       
        complete: _dataParser,   
    };
    
    console.log("googleSpreadSheetUrl:::", _config.googleSpreadSheetUrl);
    
    Papa.parse(_config.googleSpreadSheetUrl, _papaParseConfig)
            
    return true;
}