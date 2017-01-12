# sheet
An html canvas based grid designed to provide a simple spreadsheet style control.

The goal is to provide a minimalistic high performance component that renders a simple read only view for spreadhseet data.

This will allow for the contents of a spreadsheet to be displayed on a webpage without the overhead and setup required when using a more flexible grid.

The control renders in the canvas so there is no DOM work being done and the view displays very quickly.

The aim is not to create a general purpose grid, but to provide a view that looks very much like a spreadsheet with minimal setup and no configuration or style setting required.

The view simply renders columns labeled with letters and rows labeled with numbers and the user can add cell records using a simple JSON object that lists the column and row address of the content.

![image](Screenshot.png?raw=true)
