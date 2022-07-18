
window.onload =  function (){
    /////////////////////////////////////////////////////////////////////////////////
    // Figure out how to make this work with only query param
    /* let params = (new URL(document.location)).searchParams;
    
    let customerId = params.get("customerId");
    console.log("customer id is " + customerId) */
    ///////////////////////////////////////////////////////////////////////////////////

    /* let response = await fetch("http://localhost:8080/api/v1/customer", {
        method: "GET",
        headers: new Headers({'content-type': 'application/json'})
    })

    let responseBody = await response.json();
    console.log(responseBody)

    if(!responseBody.success){ // if a session was not found redirect to login
        //window.location = "../";
    } */
/* 
    customer = responseBody.data; 

    let messageElem = document.getElementById("welcomeMessage")
    messageElem.innerText = `Welcome ${customer.firstName} ${customer.lastName} !` */

    getAllOrders()

}

async function viewOrderDetails(event){

    let viewBtn = event.target;

    let orderId = viewBtn.id.substring("view-btn-".length);

    console.log("Viewing details for order with id : " + orderId)

    // get the order from the list 

    // create a div with the order details
    // add display: block; property to make it show

    let response = await fetch(`http://localhost:8080/api/v1/order/${orderId}`, {
      method: "GET"
  })
  let responseBody = await response.json();
  console.log(responseBody)
  let order = responseBody.data

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

}

async function getAllOrders(){
    console.log("getting all orders")
    //for each order, create a new row in the orders table 
    let response = await fetch("http://localhost:8080/api/v1/order", {
        method: "GET"
    })
    let responseBody = await response.json();
    console.log(responseBody)
    let orders = responseBody.data
    orders.forEach(order => {
      buildOrderTableRow(order)
    })
    console.log("------------------------------")

}

//DONE
function goToNewOrder(){
    window.location.href = `http://127.0.0.1:5502/new-order`
}

//DONE
function sortTable(){
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
}

//DONE
function buildOrderTableRow(order){
    let table = document.getElementById("orders-table")

    let rowToInsert = document.createElement('tr')
    
    let orderIdCell = document.createElement("th")
    orderIdCell.innerText = order.orderId

    let customerUsernameCell = document.createElement("td")
    customerUsernameCell.innerText = order.customer.username

    let dateSubmittedCell = document.createElement("td")
    dateSubmittedCell.innerText = new Date(order.timeSubmitted).toDateString()

    let amountCell = document.createElement("td")
    amountCell.innerText = "$" + order.total

    let detailsCell = document.createElement("td")
    detailsCell.innerHTML = `<button id="view-btn-${order.orderId}" class="btn btn-outline-primary btn-sm" onclick=viewOrderDetails(event)>View</button>`

    rowToInsert.append(orderIdCell,customerUsernameCell,dateSubmittedCell,amountCell,detailsCell)
    table.append(rowToInsert)

}

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


