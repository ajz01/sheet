var app = (function() {
   var sheetCanvas = document.getElementById('sheetCanvas');
   var sheet = new Sheet.Sheet();

   return {
      init: function(sc) {
         sheetCanvas = sc;
         sheet = new Sheet.Sheet();
         sheet.init(sheetCanvas);
         sheet.isActive = true;
         // add some test data
         sheet.cells.push({row: 1, col: 1, contents: ['test']});
         sheet.cells.push({row: 2, col: 1, contents: [1]});
         sheet.cells.push({row: 3, col: 1, contents: [2]});
         sheet.cells.push({row: 4, col: 1, contents: [3]});
         sheet.cells.push({row: 4, col: 2, contents: ['abcd']});
         sheet.cells.push({row: 4, col: 3, contents: ['efgh']});
         sheet.cells.push({row: 4, col: 4, contents: ['45678']});
         sheet.cells.push({row: 4, col: 8, contents: ['test']});
         sheet.cells.push({row: 4, col: 9, contents: ['test']});
         sheet.draw();
      },

      mousemove: function(event) {
         if(sheet.isActive)
            sheet.mousemove(event);
      },

      mouseup: function(event) {
         if(sheet.isActive)
            sheet.mouseup(event);
      }
   }
})();
