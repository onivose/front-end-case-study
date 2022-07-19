
window.onload =  function (){
  getAllOrders()

  // implement sorting algorithm here maybe
  
}
// add window navigation to oder details and smooth scrolling
async function viewOrderDetails(event){
  let productInfoContainerElem = document.getElementById("product-list-container")
  productInfoContainerElem.innerHTML=""

    let viewBtn = event.target;

    let orderId = viewBtn.id.substring("view-btn-".length);

    let response = await fetch(`http://localhost:8080/api/v1/order/${orderId}`, {
      method: "GET"
  })
  let responseBody = await response.json();
  let order = responseBody.data

  // create a div with the order details
    // add display: block; property to make it show

    let ordercontainer = document.getElementById("order-detail-container")
    ordercontainer.style.display = 'block'

    let orderDetailHeader = document.getElementById("order-detail-header")
    orderDetailHeader.innerHTML = `
                <div>Order Id: ${order.orderId}</div>
                <div>Customer: ${order.customer.firstName} ${order.customer.lastName}</div>
                <div>Total: $${order.total}</div>
    `
    order.products.forEach(product => {
      buildProductDetailCard(product)
    })

    window.location.href = `#order-detail-container`

}

//DONE
async function getAllOrders(){
  
  //delete the table of previous orders first if it exists
  deleteOldTableAndFeedback()

  // Remove order details container
  let ordercontainer = document.getElementById("order-detail-container")
  ordercontainer.style.display = 'none'

  //send request for orders
  let request = await fetch("http://localhost:8080/api/v1/order", {
      method: "GET"
  })

  //get response
  let responseBody = await request.json();
  
  //check if there are no orders available
  if(!responseBody.success){
    let feedbackSectionElem = document.getElementById("table-section")
    let noOrderFeedbackDiv = document.createElement("div")
    noOrderFeedbackDiv.setAttribute("id", "request-feedback")
    noOrderFeedbackDiv.innerText = responseBody.message
    feedbackSectionElem.appendChild(noOrderFeedbackDiv)


  } else {
    let orders = responseBody.data

    // build a new table head
    buildTableHead()

    // insert a row with an order for each orders
    orders.forEach(order => {
    buildOrderTableRow(order)
    })

    // style table rows to make readable
    alternateRowColors("#f8f9fa","#e9ecef")
  }
  
}

//DONE
function goToNewOrder(){
    window.location.href = `http://127.0.0.1:5502/new-order`
}

//NOT WORKING
function sortTableNOTWORKING(){
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("orders-table");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[3];
      y = rows[i + 1].getElementsByTagName("TD")[3];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
  alternateRowColors("#f8f9fa","#e9ecef")
}

//DONE 
function buildOrderTableRow(order){

    let table = document.getElementById("orders-table")

    let rowToInsert = document.createElement('tr')
    
    let orderIdCell = document.createElement("th")
    orderIdCell.innerText = order.orderId

    let customerUsernameCell = document.createElement("td")
    customerUsernameCell.innerText = order.customer.username

    let customerIdCell = document.createElement("td")
    customerIdCell.innerText = order.customer.customerId

    let dateSubmittedCell = document.createElement("td")
    dateSubmittedCell.innerText = new Date(order.timeSubmitted).toDateString()

    let amountCell = document.createElement("td")
    amountCell.innerText = order.total

    let detailsCell = document.createElement("td")
    detailsCell.innerHTML = `<button id="view-btn-${order.orderId}" class="btn btn-outline-primary btn-sm" onclick=viewOrderDetails(event)>View</button>`

    rowToInsert.append(orderIdCell,customerUsernameCell,customerIdCell,dateSubmittedCell,amountCell,detailsCell)
    table.append(rowToInsert)
}

//DONE
function buildProductDetailCard(product){
  let productInfoContainerElem = document.getElementById("product-list-container")
  //create a new div
  let newDiv = document.createElement('div')
  //give it a class
  newDiv.classList.add('product-details-container')
  //add the innerhtml to that div 
  newDiv.innerHTML=`
  <div class="product-detail">Name : ${product.name} </div>
  <div class="product-detail">Manufacturer : ${product.manufacturer} </div>
  <div class="product-detail">Type : ${product.type} </div>
  <div class="product-detail">Price : $${product.price} </div>
  `
  //add that div to productinfocardelem
  productInfoContainerElem.appendChild(newDiv)
}

//DONE
async function filterByAmount(event){
  //this is to stop the page from reloading 
  event.preventDefault();

  // Remove order details container
  let ordercontainer = document.getElementById("order-detail-container")
  ordercontainer.style.display = 'none'

  //delete the table of previous orders first if it exists
  deleteOldTableAndFeedback()

  //get amount
  const amountFilterInputElem = document.getElementById("amount-filter-input")
  let amount = amountFilterInputElem.value

  //get filtertype
  const inequalityFilterInputElem = document.getElementById("inequality")
  let inequalityFilter = inequalityFilterInputElem.value

  //prepare the request
  let inequalityString = ""
  switch (inequalityFilter){
    case "0":
      inequalityString = "lessThan"
      break
    case "1":
      inequalityString = "greaterThan"
        break
  }

  //send request for orders
  let request = await fetch(`http://localhost:8080/api/v1/order/${inequalityString}/${amount}`, {
      method: "GET"
  })

  //get response
  let responseBody = await request.json();
  
  //check if there are no orders available
  if(!responseBody.success){
    let feedbackSectionElem = document.getElementById("table-section")
    let noOrderFeedbackDiv = document.createElement("div")
    noOrderFeedbackDiv.setAttribute("id", "request-feedback")
    noOrderFeedbackDiv.innerText = responseBody.message
    feedbackSectionElem.appendChild(noOrderFeedbackDiv)


  } else {
    let orders = responseBody.data

    // build a new table head
    buildTableHead()

    // insert a row with an order for each orders
    orders.forEach(order => {
    buildOrderTableRow(order)
    })

    // style table rows to make readable
    alternateRowColors("#f8f9fa","#e9ecef")
  }
    
}

//DONE (should add filter for order id)
async function filterById(event){
  //this is to stop the page from reloading 
  event.preventDefault();

  // Remove order details container
  let ordercontainer = document.getElementById("order-detail-container")
  ordercontainer.style.display = 'none'

  //get customer or user Id
  let idFilterInputElem = document.getElementById("id-filter-input")
  let customerOrOrderId = idFilterInputElem.value

  //delete the table of previous orders first if it exists
  deleteOldTableAndFeedback()

  //get filtertype
  const orderFilterInputElem = document.getElementById("order-or-customer-id")
  let orderFilter = orderFilterInputElem.value

  //prepare the request
  let requestString = ""
  switch (orderFilter){
    case "0":
      requestString = "/"
      break
    case "1":
      requestString = "/customer/"
        break
  }
  console.log(`http://localhost:8080/api/v1/order${requestString}${customerOrOrderId}`)
  
  //send http request
  let request = await fetch(`http://localhost:8080/api/v1/order${requestString}${customerOrOrderId}`, {
    method: "GET"
  })
  
  //get response
  let responseBody = await request.json();
  console.log(responseBody)

  if(!responseBody.success){
    let feedbackSectionElem = document.getElementById("table-section")
    let noOrderFeedbackDiv = document.createElement("div")
    noOrderFeedbackDiv.setAttribute("id", "request-feedback")
    noOrderFeedbackDiv.innerText = responseBody.message
    feedbackSectionElem.appendChild(noOrderFeedbackDiv)


  } else { 
    let orders = responseBody.data

    // build a new table head
    buildTableHead()

    if(orderFilter === "1"){
      //for each order, create a new row in the orders table 
      orders.forEach(order => {
        buildOrderTableRow(order)
      })
    } else {
      buildOrderTableRow(orders)
    }
    

  // style table rows to make readable
  alternateRowColors("#f8f9fa","#e9ecef")
  }

  
}

function alternateRowColors(firstcolor,secondcolor){
    var tableElements = document.getElementsByTagName("table") ;
    for(var j = 0; j < tableElements.length; j++){
        var table = tableElements[j] ;

        var rows = table.getElementsByTagName("tr") ;
        for(var i = 1; i <= rows.length-1; i++){
            if(i%2==0){
                rows[i].style.backgroundColor = firstcolor ;
            }
            else{
                rows[i].style.backgroundColor = secondcolor ;
            }
        }
    }
}

//DONE
function deleteOldTableAndFeedback(){
  //delete the table of previous orders first if it exists
  let oldTable = document.querySelector("table")
  if(oldTable != null){
    oldTable.remove()
  }

  let oldFeedback = document.getElementById("request-feedback")
  if(oldFeedback != null){
    oldFeedback.remove()
  }
}

//DONE
function buildTableHead(){
  //create a new table with head 
  let newTable = document.createElement("table")
  newTable.setAttribute("id", "orders-table")
  newTable.innerHTML=`
    <thead>
      <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Customer ID</th>
          <th>Date Submitted</th>
          <th>Amount</th>
          <th>Details</th>
      </tr>
    </thead>  
  `
  let tableSectionElem = document.getElementById("table-section")
  tableSectionElem.appendChild(newTable)
}

function changePlaceholder(){

  let selectedPlaceholder = document.getElementById("order-or-customer-id").value
  let placeholderToChange = document.getElementById("id-filter-input")

  if(selectedPlaceholder == "1"){
    placeholderToChange.placeholder="Customer Id"
  } else{
    placeholderToChange.placeholder="Order Id"
  }
}
