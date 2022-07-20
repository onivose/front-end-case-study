let productsToBuy = [];
// for each products selected, add the id to this array
// send this array in the http request to submit the order when the submit order button is pressed

let orderIdToSubmit;
//this will be used to keeptrack of an order from creation to submission

//DONE (ADD REQUEST TO CHECK FOR AVAILABLE PRODUCTS BEFORE ALLOWING ORDER CREATION)
async function beginNewOrder(event){
    
    //to prevent the page from reloading
    event.preventDefault();

    // if there was a feedback message, take it off the screen 
    let feedbackMessageElem = document.getElementById("message")
        if(feedbackMessageElem != null){
            feedbackMessageElem.remove()
        }

    // Get customer id
    let customerIdInputElem = document.getElementById("customer-id-input")
    let customerId = customerIdInputElem.value

    //send first http request
    let request1 = await fetch(`${domain}/api/v1/product`, {
        method: "GET"
    })

    //get response
    let responseBody1 = await request1.json();

    //give feedback if no available products
    if(!responseBody1.success){
        let actionsContainerElem = document.getElementById("actions-container")

        //create a new div
        let feedback = document.createElement('div')

        //give it an id of message
        feedback.setAttribute("id", "message")

        //add the innerText to that div 
        feedback.innerText = responseBody1.message

        //add that div to actionsContainerElem
        actionsContainerElem.appendChild(feedback)
    } else {
        // Send second http request 
    let request = await fetch(`${domain}/api/v1/order/${customerId}`, {
        method: "POST"
    })
    //get responsebody
    let responseBody = await request.json();

    // If success = false {}
    if (!responseBody.success){
        // create <div id="message"></div> and send feedback if customer id doesnt exist (append to actions-container div)
        let actionsContainerElem = document.getElementById("actions-container")

        //create a new div
        let feedback = document.createElement('div')

        //give it an id of message
        feedback.setAttribute("id", "message")

        //add the innerText to that div 
        feedback.innerText = responseBody.message

        //add that div to actionsContainerElem
        actionsContainerElem.appendChild(feedback)

    } else { 
        //get the order details
        let order = responseBody.data

        //store the id to be used later
        orderIdToSubmit = order.orderId
        console.log("order id to be submitted is: " + orderIdToSubmit)

        // Build order container header 
        let orderDetailHeader = document.getElementById("order-detail-header")
        orderDetailHeader.innerHTML = `
                <div>Order Id: ${order.orderId}</div>
                <div>Customer: ${order.customer.firstName} ${order.customer.lastName}</div>
    `

        getAllAvailableProducts()

        // CHANGE HOW PAGE LOOKS (Show products to user)
        
        // if there was a feedback message, take it off the screen 
        let feedbackMessageElem = document.getElementById("message")
        if(feedbackMessageElem != null){
            feedbackMessageElem.remove()
        }

        // show products to user
        let ordercontainer = document.getElementById("order-detail-container")
        ordercontainer.style.display = 'block'

        // show submit btn
        let submitOrderBtnElem = document.getElementById("submit-order-btn")
        submitOrderBtnElem.style.display = "inline-block"

        // hide begin new order btn
        let newOrderBtnElem = document.getElementById("begin-new-order-btn")
        newOrderBtnElem.style.display = 'none' 
    }
    }
    
}

//DONE
function addProductToOrder(event){
    //get product id
    let addProdBtn = event.target;
    let prodId = addProdBtn.id.substring("add-prod-btn-".length);

    //add product id to list productstobuy
    productsToBuy.push(parseInt(prodId))

    //make button dissapear
    let addToOrderBtnElem = document.getElementById(addProdBtn.id)
    addToOrderBtnElem.style.display = 'none' 
}

function confirmSubmission(){

    // if there was a feedback message, take it off the screen 
    let feedbackMessageElem = document.getElementById("message")
    
    if(feedbackMessageElem != null){
        feedbackMessageElem.remove()
    }

    
    // Add feedback if no products are added to order
    let actionsContainerElem = document.getElementById("actions-container")
    if (productsToBuy.length === 0) {

        //create a new div
        let noProdsSelected = document.createElement('div')

        //give it an id of message
        noProdsSelected.setAttribute("id", "message")

        //add the innerText to that div 
        noProdsSelected.innerText = "Please select a product to purchase"

        //add that div to actionsContainerElem
        actionsContainerElem.appendChild(noProdsSelected)
    } else if (confirm("Confirm Order submission?")){
        submitOrder()
    }
}
//DONE
async function submitOrder(){
    // if there was a feedback message, take it off the screen 
    let feedbackMessageElem = document.getElementById("message")
        if(feedbackMessageElem != null){
            feedbackMessageElem.remove()
        }

    // Add feedback if no products are added to order
    let actionsContainerElem = document.getElementById("actions-container")
    if (productsToBuy.length === 0) {

        //create a new div
        let noProdsSelected = document.createElement('div')

        //give it an id of message
        noProdsSelected.setAttribute("id", "message")

        //add the innerText to that div 
        noProdsSelected.innerText = "Please select a product to purchase"

        //add that div to actionsContainerElem
        actionsContainerElem.appendChild(noProdsSelected)

    } else {
        // Send http request with orderid and products 
        let request = await fetch(`${domain}/api/v1/order/submit/${orderIdToSubmit}`, {
            method: "POST",
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify(productsToBuy)
        })

        // get response
        let responseBody = await request.json();
        console.log(responseBody)

        // give feedback of success
        //create a new div
        let feedback = document.createElement('div')

        //give it an id of message
        feedback.setAttribute("id", "message")

        feedback.style.color = "#2f9e44"

        //add the innerText to that div 
        feedback.innerText = responseBody.message

        //add that div to actionsContainerElem
        actionsContainerElem.appendChild(feedback)

        // reset the orderIdToSubmit and the productsToBuy
        orderIdToSubmit = null;
        productsToBuy = [];

        // Change how page looks (hide products and submit button from user)
        let ordercontainer = document.getElementById("order-detail-container")
        ordercontainer.style.display = 'none'

        let submitOrderBtnElem = document.getElementById("submit-order-btn")
        submitOrderBtnElem.style.display = 'none'
        
        let newOrderBtnElem = document.getElementById("begin-new-order-btn")
        newOrderBtnElem.style.display = 'inline-block' 

        // delete the product cards from container to make it ready for next order
        let productInfoContainerElem = document.getElementById("product-list-container")
        productInfoContainerElem.innerHTML = ""

    }
}

//DONE
async function getAllAvailableProducts(){
    console.log("getting all available products")
    
    //send request
    let request = await fetch(`${domain}/api/v1/product`, {
        method: "GET"
    })

    //get response
    let responseBody = await request.json();
    console.log(responseBody)

    //give feedback if no available products
    if(!responseBody.success){
        console.log("no available prods")
        //create a div
        let noProdFeedbackElem = document.createElement("div")
        //give it an id
        noProdFeedbackElem.setAttribute("id", "no-avail-prods-message")
        //set the inner text
        noProdFeedbackElem.innerText = responseBody.message
        //append it to product-list-container
        let prodListContainerElem = document.getElementById("product-list-container")
        prodListContainerElem.appendChild(noProdFeedbackElem)
    } else {
        //for each product => add it to the html page
        let products = responseBody.data
        products.forEach(product => {
        buildProductDetailCard(product)
    })

    }
}

//DONE
function goToDashboard(){
    window.location.href = `http://127.0.0.1:5502/dashboard`
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
    <button class="add-product-btn" id="add-prod-btn-${product.productId}" onclick="addProductToOrder(event)">Add To Order</button>
    `
    //add that div to productinfocardelem
    productInfoContainerElem.appendChild(newDiv)
}

// Add cancel order btn (not required for CS)
async function deleteOrder(){

}
