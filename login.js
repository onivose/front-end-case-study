
//function to allow us to login
//this function gets the form from the html document, waits for it to be submitted then does the async functionality to log in 
document.getElementById("login-form").addEventListener("submit", async function (event){ 
    
    //this is to stop the page from reloading 
    event.preventDefault();
    
    //retrieve input elements from the HTML Document
    let usernameInputElem = document.getElementById("usernameInput");
    let passwordInputElem = document.getElementById("passwordInput");

    //get values from the input elements and put it into a customer object
    let user = {
        username: usernameInputElem.value,
        password: passwordInputElem.value
    }

    //send the http request
    let response = await fetch(`${domain}/api/v1/customer/login`, {
        method: "POST",
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(user)
    })

    //retrieve the response body
    let responseBody = await response.json();

    //logic after getting http response body
    if(responseBody.success == false){
        // gives feedback to user if login unsuccessful
        let messageElem = document.getElementById("message")
        messageElem.innerText = responseBody.message

    }else{
        window.location.href = `http://127.0.0.1:5502/dashboard`
    }

})