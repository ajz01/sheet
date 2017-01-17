# sheet
An html canvas based control designed to provide a quick and simple way to add a spreadsheet style view of data on a web page.

The view is rendered using graphics primitives of the canvas so there is no DOM changes being applied which scales well.

The aim is not to create a general purpose grid, but to provide a view that looks very much like a spreadsheet with minimal setup and no configuration or style setting required.

The view displays columns labeled with letters and rows labeled with numbers and the user can add cell data using a simple JSON structure that includes a zero offset column and row ordinal address along with the content data.

![image](Screenshot.png?raw=true)

[Project demo link](https://ajz01.github.io/sheet/html/index.html)
