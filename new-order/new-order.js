let productsToBuy = [];
// for each products selected, add the id to this array
// send this array in the http request to submit the order when the submit order button is pressed

//DONE
function beginNewOrder(event){
    event.preventDefault();

    // Get customer id
    let customerIdInputElem = document.getElementById("customer-id-input")
    console.log(customerIdInputElem.value)

    // Send http request 
    //get responsebody
    // If success = false {}
    // create <div id="message"></div> and send feedback if customer id doesnt exist (append to actions-container div)
    
    //Else {
    // Build order container header 
    
    getAllAvailableProducts()

    // CHANGE HOW PAGE LOOKS (Show products to user)
    /* let feedbackMessageElem = document.getElementById("message")
    feedbackMessageElem.style.display = 'none' 
 */
    let ordercontainer = document.getElementById("order-detail-container")
    ordercontainer.style.display = 'block'

    let submitOrderBtnElem = document.getElementById("submit-order-btn")
    submitOrderBtnElem.style.display = "inline-block"

    let newOrderBtnElem = document.getElementById("begin-new-order-btn")
    newOrderBtnElem.style.display = 'none' 

    
}

function addProductToOrder(event){
    //get product id
    let addProdBtn = event.target;
    let prodId = addProdBtn.id.substring("add-prod-btn-".length);
    console.log("adding product with id : " + prodId)

    //add product id to list productstobuy

    //send http request

    //make button dissapear
    let addToOrderBtnElem = document.getElementById(addProdBtn.id)
    addToOrderBtnElem.style.display = 'none' 

}

async function submitOrder(){

    // success green golor hex #2f9e44

    //get order id

    //get products
    
    // Send http request 

    // CHANGE HOW PAGE LOOKS (hide products from user)
    let ordercontainer = document.getElementById("order-detail-container")
    ordercontainer.style.display = 'none'

    let submitOrderBtnElem = document.getElementById("submit-order-btn")
    submitOrderBtnElem.style.display = 'none'
    
    let newOrderBtnElem = document.getElementById("begin-new-order-btn")
    newOrderBtnElem.style.display = 'inline-block' 

}

async function getAllAvailableProducts(){

}

function goToDashboard(){
    window.location.href = `http://127.0.0.1:5502/dashboard`
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
    <button class="add-product-btn" id="add-prod-btn-${product.productId}" onclick="addProductToOrder(event)">Add To Order</button>
    `
    //add that div to productinfocardelem
    productInfoContainerElem.appendChild(newDiv)
}
