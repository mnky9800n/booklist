function init() {
 Tabletop.init( { key: ‘https://docs.google.com/spreadsheets/d/1KPuG5z52VWvloXocAwOXJf3iT56sTLi-TRSANyvMZws/pubhtml',
 callback: function(data, tabletop) { 
 console.log(data)
 },
 simpleSheet: true } )
}
window.addEventListener(‘DOMContentLoaded’, init)