import { menuArray } from './data.js'
const menuSection = document.getElementById('menu-section')
let orderArray = []
let totalPrice = 0
let personName = ''
let index = 0

document.addEventListener("click", function(e){
    if(e.target.dataset.add){
        order(e.target.dataset.add)
    }
    else if(e.target.dataset.remove){
        removeItem(e.target.dataset.remove)
    }
    else if(e.target.id === 'complete-order-btn'){
        paymentModal()
    }
    else if(e.target.id === 'pay-btn'){
        e.preventDefault()
        const payForm = document.getElementById('pay-form')
        const payFormData = new FormData(payForm)
        orderCompleted(payFormData)
    }  
})

function order(itemId){
    const targetItem = menuArray.filter(function(item){
        return item.id == itemId
    })[0]
    if(!orderArray.includes(targetItem)){
    orderArray.push(targetItem)
    }else{
        targetItem.quantity ++
    }
    render()
    document.getElementById('checkout').classList.toggle('hidden')
}

function removeItem(itemId){
    orderArray.splice(itemId, 1)
    render()
    if(orderArray.length > 0){
    document.getElementById('checkout').classList.toggle('hidden')
    }
}

function paymentModal(){
    document.getElementById('payment-modal').style.display = 'flex'
}

function orderCompleted(payFormData){
    personName = payFormData.get('person')
    const number = payFormData.get('number')
    const cvv = payFormData.get('cvv')
    if(personName && number && cvv){
    render()
    document.getElementById('thanks').style.display = 'flex'
    }
}

function render(){
    let html = ''
    let checkoutHtml = ''
    let index = -1
    orderArray.forEach(function(orderItem){
        const checkQuantity = orderItem.quantity === 1 ? '' : '* '+orderItem.quantity
        index += 1
    checkoutHtml += `
                        <div class="order-rate">
                        <h4>${orderItem.name}</h4>
                        <h5 id="quantity-${orderItem.id}"
                        class="quantity">
                          ${checkQuantity}</h5>
                        <button class="remove-btn" 
                        data-remove="${index}">
                        remove</button>
                        <h5>$${orderItem.price*orderItem.quantity}</h5>
                        </div>
                        `
     totalPrice += orderItem.price 
    })

    menuArray.forEach(function(item){
        
         
        
        html += `<div id="menu" class="menu">
                    <div class="icon item">
                        <p>${item.emoji}</p>
                    </div>
                    <div class="item">
                        <h3>${item.name}</h3>
                        <h6>${item.ingredients}</h6>
                        <h4>$${item.price}</h4>
                    </div>
                    <button class="add-btn item"
                     data-add="${item.id}">
                     +</button>
                </div>
                `
    })
    menuSection.innerHTML = html
    menuSection.innerHTML += `<div class="checkout hidden" id="checkout">
                    <h2>Your order</h2>
                    <div class="order-summary">
                        ${checkoutHtml}
                        <div class="order-rate total-price">
                        <h4>Total Price</h4>
                        <h5>$${totalPrice}</h5>
                        </div>
                        <button class="complete-order-btn" 
                        id="complete-order-btn">
                        Complete Order</button>
                    </div>
                    </div>
                    <div class="payment" id="payment-modal">
                    <h3>Enter card details</h3>
                    <form id="pay-form" method="POST">         
                    <input type="text" 
                    placeholder="Enter your name" 
                    name="person"
                    required/>
                    <input type="text" 
                    placeholder="Enter card number" 
                    name="number"
                    required/>
                    <input type="text" 
                    placeholder="Enter CVV" 
                    name="cvv"
                    required/>
                    <button class="pay-btn" type="submit" id="pay-btn">Pay</button>
                    </form>
                </div>
                <div class="thank-div" id="thanks">
                Thanks, ${personName}! Your order is on its way!</div>
                `
}
render()