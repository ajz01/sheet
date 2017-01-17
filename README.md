# sheet
An html canvas based control designed to provide a quick and simple way to add a spreadsheet style view of data on a web page.

The control renders the view using graphics primitives of the canvas so there is no DOM changes being applied which scales well.

The aim is not to create a general purpose grid, but to provide a view that looks very much like a spreadsheet with minimal setup and no configuration or style setting required.

The view simply renders columns labeled with letters and rows labeled with numbers just like a spreadsheet and the user can add cell records using a simple JSON object that lists the column and row address of the content.

![image](Screenshot.png?raw=true)

[Project Demo link](https://ajz01.github.io/sheet/index.html)
