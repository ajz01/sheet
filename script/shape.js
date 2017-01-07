var Shape = (function() {
   function Shape() {
       this.x = 0;
       this.y = 0;
       this.width = 0;
       this.height = 0;
       this.color = 'rgba(15,20,255,0.8)';//'rgba(150,200,250,1)';
       this.selected = false;
       this.shapes = [];
       this.cellLabelVisible = false;
       this.mouseOver = false;
       this.canvas = null;
       this.hitFunctions = [];
   }

   Shape.prototype.init = function (canvas) {
     this.canvas = canvas;
   };

   Shape.prototype.move = function (mx, my) {
       var dx = mx - this.x;
       var dy = my - this.y;
       this.x = mx;
       this.y = my;
   };

   Shape.prototype.contains = function(mx, my) {
     return  (this.x <= mx) && (this.x + this.width >= mx) &&
             (this.y <= my) && (this.y + this.height >= my);
   };

   Shape.prototype.hit = function(mx, my) {
     for(var i = 0; i < this.hitFunctions.length; i++)
         if(this.hitFunctions[i])
            this.hitFunctions[i]();
   };

   return {
      Shape: Shape
   }
})();
