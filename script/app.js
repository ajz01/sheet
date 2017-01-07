var app = (function() {
   var sheetCanvas = document.getElementById('sheetCanvas');
   var sheet = new Sheet.Sheet();

   return {
      init: function(sc) {
         sheetCanvas = sc;
         sheet = new Sheet.Sheet();
         sheet.init(sheetCanvas);
         sheet.isActive = true;
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
