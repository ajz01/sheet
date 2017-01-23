var Sheet = (function() {
   function Shape() {
       this.x = 0;
       this.y = 0;
       this.width = 0;
       this.height = 0;
       this.color = 'rgba(15,20,255,0.8)';
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

   function Sheet () {
     this.canvas;
     this.shapes = [];
     this.cells = [];
     this.selectedCells = [];
     this.colWidths = [];
     this.selectedShape = null;
     this.dragxOffset = 0;
     this.dragyOffset = 0;
     this.dblclickFunction = null;
     this.contentLevel = 0;
     this.mouseDown = false;
     this.lastRow = 0;
     this.lastCol = 0;
     this.width = 0;
     this.height = 0;
     this.cellWidth = 60;
     this.cellHeight = 25;
     this.startX = 0;
     this.startY = 0;
     this.isActive = true;
   }

   Sheet.prototype.init = function(canvas) {
     this.canvas = canvas;
     var that = this;

     this.cells.sort(function(a, b) {
       return a.row - b.row;
     });

     // some test widths
     this.colWidths.push({col: 1, width: 100});
     this.colWidths.push({col: 2, width: 100});
     this.colWidths.push({col: 3, width: 100});
     this.colWidths.push({col: 4, width: 100});
     this.colWidths.push({col: 5, width: 100});
     this.colWidths.push({col: 6, width: 100});

     this.selectedCells.push({row: 1, col: 1});
     this.selectedCells.push({row: 2, col: 2});
     this.selectedCells.push({row: 3, col: 3});
     this.selectedCells.push({row: 4, col: 4});
     this.selectedCells.push({row: 4, col: 9});
     this.selectedCells.push({row: 8, col: 4});

     this.width = canvas.width;
     this.height = canvas.height;

     var shv = new ScrollHandle('vertical', this.width - 10, 45, 15, 90);
     var sbv = new ScrollBar('vertical', 20, this.height - 20, shv, this);
     var shh = new ScrollHandle('horizontal', 45, this.height - 10, 90, 15);
     var sbh = new ScrollBar('horizontal', this.width - 20, 20, shh, this);
     
     this.shapes.push(sbv);  
     this.shapes.push(sbh);
     this.shapes.push(shv);
     this.shapes.push(shh);

     function getMousePos(canvas, evt) {
       var rect = canvas.getBoundingClientRect();
       return {
         x: evt.clientX - rect.left,
         y: evt.clientY - rect.top
       };
     };

     this.canvas.addEventListener('mousedown', function(event) {
       if(that.isActive) {
       that.mouseDown = true;
       var pos = getMousePos(that.canvas, event);
       var hit = false
       for(var i = that.shapes.length - 1; i >= 0 && !hit; i--) {
         hit = that.shapes[i].contains(pos.x, pos.y);
         if(hit) {
           that.shapes[i].selected = true;
           that.selectedShape = that.shapes[i];
           that.dragxOffset = pos.x - that.shapes[i].x;
           that.dragyOffset = pos.y - that.shapes[i].y;
         }
       }
      }
     });

     this.mouseup = function(event) {
      if(that.isActive) {
       that.mouseDown = false;
       if(that.selectedShape != null)
          that.selectedShape.selected = false;
       that.selectedShape = null;
       that.dragxOffset = 0;
       that.dragyOffset = 0;
      }
     }

     this.mousemove = function(event) {
      if(that.isActive) {
       var pos = getMousePos(canvas, event);
       if(that.selectedShape !== null && event.buttons == 1) {//that.mouseDown) {
         that.selectedShape.move(pos.x - that.dragxOffset, pos.y - that.dragyOffset);
         that.draw();
       }
      }
     }

     for(var i = 0; i < this.shapes.length; i++)
       this.shapes[i].init(canvas);
   };

   Sheet.prototype.resize = function(width, height) {
     this.width = width;
     this.height = height;

     this.canvas.width = width;
     this.canvas.height = height;

     this.shapes[0].y = height - 10;
     this.shapes[1].x = width - 10;
     this.shapes[2].x = width - 17;
     this.shapes[3].y = height - 17;
     this.shapes[0].height = height - 20;
     this.shapes[1].width = width - 20;

     this.draw();
   };

   Sheet.prototype.scrollTo = function(x, y) {
      this.shapes[2].y = y%this.shapes[2].height;
      this.shapes[3].x = x%this.shapes[3].width;
      this.shapes[2].ry = y;
      this.shapes[3].rx = x;
      this.draw();
   };

   Sheet.prototype.getMouse = function(e) {
     var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

     offsetX += element.offsetLeft;
     offsetY += element.offsetTop;

     mx = e.pageX - offsetX;
     my = e.pageY - offsetY;

     return {x: mx, y: my};
   };

   Sheet.prototype.draw = function() {
     var ctx = this.canvas.getContext('2d');
     ctx.save();
     ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

           var shv = this.shapes[2];
           var shh = this.shapes[3];

           var ctx = this.canvas.getContext("2d");

           var dy = shv.ry%this.cellHeight;
           var dx = shh.rx%this.cellWidth;

           var colPos = [];
           var accumCols = 0;
           var accumWidth = 0;
           ctx.strokeStyle = "darkgray";
           for(var i = -1; i < 25; i++) {
               var width = this.cellWidth;
               var col = i + Math.floor(shh.rx/this.cellWidth) - 1;
               for(var j = 0; j < this.colWidths.length; j++) {
                  if(this.colWidths[j].col == col) {
                     accumWidth+=this.colWidths[j].width;
                     accumCols++;
                  }
               }
               ctx.beginPath();
               ctx.moveTo(0, i * this.cellHeight - dy);
               ctx.lineTo(this.width - 10, i * this.cellHeight - dy);
               ctx.stroke();
               ctx.beginPath();
               ctx.moveTo((i - accumCols) * this.cellWidth - dx + accumWidth, 0);
               ctx.lineTo((i - accumCols) * this.cellWidth - dx + accumWidth, this.height - 10);
               ctx.stroke();
               ctx.closePath();
           }

           for(var i = 0; i < this.cells.length; i++) {
               var colb = -1 + Math.floor(shh.rx/this.cellWidth) - 1;
               var cole = 26 + Math.floor(shh.rx/this.cellWidth) - 1;
               if(this.cells[i].col > colb && this.cells[i].col < cole) {
                  accumCols = 0;
                  accumWidth = 0;
                  var width = this.cellWidth;
                  for(var j = 0; j < this.colWidths.length; j++) {
                     if(this.colWidths[j].col < this.cells[i].col && this.colWidths[j].col >= colb) {
                        accumWidth+=this.colWidths[j].width;
                        accumCols++;
                     }
                     if(this.colWidths[j].col == this.cells[i].col)
                        width = this.colWidths[j].width;
                   }
                   ctx.fillStyle = 'black';
                   ctx.font = '8pt FreeSans';
                   ctx.textAlign = 'center';
                   var label = this.cells[i].contents[this.contentLevel].toString();
                   if(label.length > 10)
                     label = label.substr(0, 10);
                   ctx.fillText(label, (this.cells[i].col - accumCols) * this.cellWidth + accumWidth - shh.rx + width/2,
                   (this.cells[i].row) * this.cellHeight - shv.ry + 18, width);
                }
           }

           for(var i = 0; i < this.selectedCells.length; i++) {
               var colb = -1 + Math.floor(shh.rx/this.cellWidth) - 1;
               var cole = 26 + Math.floor(shh.rx/this.cellWidth) - 1;
               if(this.selectedCells[i].col > colb && this.selectedCells[i].col < cole) {
                  accumCols = 0;
                  accumWidth = 0;
                  var width = this.cellWidth;
                  for(var j = 0; j < this.colWidths.length; j++) {
                     if(this.colWidths[j].col < this.selectedCells[i].col && this.colWidths[j].col >= colb) {
                        accumWidth+=this.colWidths[j].width;
                        accumCols++;
                     }
                     if(this.colWidths[j].col == this.selectedCells[i].col)
                        width = this.colWidths[j].width;
                   }
                ctx.fillStyle = 'rgba(255,100,250,.70)';
                console.log(this.selectedCells[i].col + ' ' + accumCols + ' ' + accumWidth);
                ctx.fillRect((this.selectedCells[i].col - accumCols) * this.cellWidth + accumWidth - shh.rx, (this.selectedCells[i].row) * this.cellHeight - shv.ry, width, this.cellHeight);
               }
           }

           for(var i = 1; i < 25; i++) {
             ctx.fillStyle = 'lightgray'
             ctx.fillRect(0, i * this.cellHeight - dy, this.cellWidth/2, this.cellHeight);
             ctx.fillStyle = 'rgb(200,200,200)'
             ctx.fillRect(this.cellWidth/2, i * this.cellHeight - dy, this.cellWidth/2, this.cellHeight);
             ctx.strokeStyle = 'darkgray';
             ctx.strokeRect(0, i * this.cellHeight - dy, this.cellWidth, this.cellHeight);
             ctx.fillStyle = 'rgb(120,120,120)';
             ctx.font = '12pt FreeSans';
             ctx.textAlign = 'center';
             ctx.fillText(i + Math.floor(shv.ry/this.cellHeight), this.cellHeight, i * this.cellHeight - dy + 20);
           }

           accumCols = 0;
           accumWidth = 0;

           for(var i = -1; i < 25; i++) {
               var width = this.cellWidth;
               var col = i + Math.floor(shh.rx/this.cellWidth) - 1;
               for(var j = 0; j < this.colWidths.length; j++) {
                  if(this.colWidths[j].col == col) {
                     accumWidth+=this.colWidths[j].width;
                     accumCols++;
                  }
                  if(this.colWidths[j].col == i + Math.floor(shh.rx/this.cellWidth)) {
                     width = this.colWidths[j].width;
                  }
             }
             ctx.fillStyle = 'lightgray'
             ctx.fillRect((i - accumCols) * this.cellWidth - dx + accumWidth, 0, width, this.cellHeight/2);
             ctx.fillStyle = 'rgb(200,200,200)'
             ctx.fillRect((i - accumCols) * this.cellWidth - dx + accumWidth, this.cellHeight/2, width, this.cellHeight/2);
             ctx.strokeStyle = 'darkgray';
             ctx.strokeRect((i - accumCols) * this.cellWidth - dx + accumWidth, 0, width, this.cellHeight);
             ctx.fillStyle = 'rgb(120,120,120)';
             ctx.font = '12pt FreeSans';
             ctx.textAlign = 'center';
             var col = i + Math.floor(shh.rx/this.cellWidth);
             var label = '';
             var r = Math.floor(col/26);
             for(var j = 0; j < r + 1 && col > 0; j++) {
               var p = col%26;
               if(!p)
                 p=26;
               label=String.fromCharCode(64 + p) + label;
               col=Math.floor(col/27);
             }
             ctx.fillText(label, (i - accumCols) * this.cellWidth - dx + accumWidth + width/2, 20);
           }

           ctx.fillStyle = 'lightgray';
           ctx.fillRect(0,0,this.cellWidth,this.cellHeight);
           ctx.fillStyle = 'rgb(120,120,120)';
           ctx.strokeRect(0,0,this.cellWidth,this.cellHeight);

           ctx.fillStyle = 'lightgray';
           ctx.fillRect(this.width-20,this.height-20,20,20);
           ctx.strokeStyle = 'rgb(235,235,235)';
           ctx.lineWidth = 2;
           ctx.strokeRect(this.width-20,this.height-20,20,20);
           ctx.restore();

      for(var i = 0; i < this.shapes.length; i++)
       this.shapes[i].draw();
   };

   Sheet.prototype.clear = function() {
      this.shapes = [];
   };

   Sheet.prototype.getSelectedCells = function() {
      var sc = [];
      for(var i = 0; i < this.selectedCells.length; i++) {
         var fnd = false;
         for(var j = 0; j < this.cells.length && !fnd; j++)
            if(this.cells[j].row === this.selectedCells[i].row && this.cells[j].col === this.selectedCells[i].col) {
               sc.push(this.cells[j]);
               fnd = true;
            }
      }

      return sc;
   }

   function ScrollHandle(type, x, y, width, height) {
       Shape.call(this);
       this.type = type;
       // on-screen coordinates
       this.x = x - width/2;
       this.y = y - height/2;
       // real coordinates across entire plane
       this.ry = this.y;
       this.rx = this.x;
       this.lastmx = 0;
       this.lastmy = 0;
       this.frame = 0;
       this.width = width;
       this.height = height;
       this.originalWidth = width;
       this.originalHeight = height;
       this.color = 'lightgray';
       // variable scoll speed adjusts based on real coordiantes
       this.velocity = 15;
       this.originalVelocity = this.velocity;
       this.bar = null;
   }

   ScrollHandle.prototype = Object.create(Shape.prototype);
   ScrollHandle.prototype.constructor = ScrollHandle;
   ScrollHandle.prototype.draw = function() {
     if (this.canvas.getContext) {
       var ctx = this.canvas.getContext('2d');
       ctx.save();
       ctx.fillStyle = this.color;
       var radius = 5;
       ctx.beginPath();
       ctx.moveTo(this.x+radius, this.y);
       ctx.arcTo(this.x+this.width, this.y, this.x+this.width, this.y+radius, radius);
       ctx.arcTo(this.x+this.width, this.y+this.height, this.x+this.width-radius, this.y+this.height, radius);
       ctx.arcTo(this.x, this.y+this.height, this.x, this.y+this.height-radius, radius);
       ctx.arcTo(this.x, this.y, this.x+radius, this.y, radius);
       ctx.fill();
       ctx.strokeStyle = 'rgb(235,235,235)';
       ctx.lineWidth = 2;
       ctx.stroke();
       ctx.restore();
     }
   };

   ScrollHandle.prototype.move = function (mx, my) {
       if(this.type == 'horizontal') {
          if(mx + this.width < this.bar.width) {
             this.velocity = Math.max(this.rx/100, this.originalVelocity);
             if(mx > this.lastmx) {
                this.rx += this.velocity;
                this.x = Math.max(mx, 1);
             } else if(mx < this.lastmx) {
               this.rx = Math.max(this.rx - this.velocity, 1);
               this.x = Math.max(mx, 1);
               if(this.x < 2 && this.rx > 1)
                  this.x += this.width;
               if(this.x < this.bar.width/2 && this.rx > 500) {
                  //this.velocity = this.originalVelocity;
                  this.x += this.width;
                  this.width = Math.min(this.width+this.originalWidth/4, this.originalWidth);
                  this.lastmx = mx;
                  this.frame--;
                  return;
               }
             }

             
          } else if(this.x + this.width > this.bar.width - 5) {
             this.x -= this.originalWidth;
             //this.velocity = Math.max(this.rx/100, this.originalVelocity);
             this.width = Math.max(this.width-this.originalWidth/4, this.originalWidth/4);
             this.frame++;
          }
          this.lastmx = mx;
       }

       if(this.type == 'vertical') {
          if(my + this.height < this.bar.height) {
             if(my > this.lastmy) {
                this.ry += this.velocity;
             } else if(my < this.lastmy) {
               this.ry = Math.max(this.ry - this.velocity, 1);
               if(this.ry < 500) {
                  this.velocity = this.originalVelocity;
                  this.height = Math.min(this.height+this.originalHeight/4, this.originalHeight);
                  this.lastmy = my;
               }
             }

             this.y = Math.max(my, 1);
          } else if(this.y + this.height > this.bar.height - 5) {
             this.y -= this.originalHeight;
             this.velocity = Math.max(this.ry/10, this.originalVelocity);
             this.height = Math.max(this.height-this.originalHeight/4, this.originalHeight/4);
          }
          this.lastmy = my;
       }
   };

   function ScrollBar(type, width, height, handle, screen) {
       Shape.call(this);
       this.type = type;
       this.width = width;
       this.height = height;
       this.color = 'rgb(140,140,140)';
       this.handle = handle;
       this.screen = screen;
       handle.bar = this;
   }

   ScrollBar.prototype = Object.create(Shape.prototype);
   ScrollBar.prototype.constructor = ScrollBar;
   ScrollBar.prototype.init = function(canvas) {
       Shape.prototype.init.call(this, canvas);
       if(this.type === 'vertical') {
          this.x = this.canvas.width - this.width;
          this.y = 0;
       } else if(this.type === 'horizontal') {
          this.x = 0;
          this.y = this.canvas.height - this.height;
       }
   };
   ScrollBar.prototype.draw = function() {
       var ctx = this.canvas.getContext('2d');
       ctx.save();
        ctx.fillStyle = this.color;
        if(this.type === 'vertical')
            ctx.fillRect(this.canvas.width - this.width,0,this.width,this.height);
        else if(this.type === 'horizontal')
            ctx.fillRect(0,this.canvas.height - this.height,this.width,this.height);
        ctx.restore();
   };

   ScrollBar.prototype.move = function (mx, my) {
   };

   ScrollBar.prototype.contains = function(mx, my) {
     var hit = Shape.prototype.contains.call(this, mx, my);

     if(hit) {
        if(this.type === 'vertical') {
           if(my < this.handle.y) {
              if(this.handle.ry-this.handle.velocity*100 > 0) {
                 this.handle.ry-=this.handle.velocity*100;
                 this.handle.move(this.handle.x, my);
              }
              else {
                 this.handle.ry = 0;
                 this.handle.move(this.handle.x, 0);
              }
           } else if(my > this.handle.y + this.handle.height) {
              this.handle.ry+=this.handle.velocity*100;
              this.handle.move(this.handle.x, my - this.handle.height);
           }
        }

        if(this.type === 'horizontal') {
           if(mx < this.handle.x) {
              if(this.handle.rx-this.handle.velocity*100 > 0) {
                 this.handle.rx-=this.handle.velocity*100;
                 this.handle.move(mx, this.handle.y);
              } else {
                 this.handle.rx = 0;
                 this.handle.move(9, this.handle.y);
              }
           } else if(mx > this.handle.x + this.handle.width) {
              this.handle.rx+=this.handle.velocity*100;
              this.handle.move(mx - this.handle.width, this.handle.y);
           }
        }

        this.screen.draw();
     }

     return hit;
   }

   return {
      Shape: Shape,
      Sheet: Sheet,
      ScrollHandle: ScrollHandle,
      ScrollBar: ScrollBar
   }
})();
