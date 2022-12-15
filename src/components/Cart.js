import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Cart() {

    const [cartItems, setCartItems] = useState([])
    const [cartCount, setCartCount] = useState()
    let amount=0;


    useEffect(() => {
        let temp = []
        temp = JSON.parse(window.localStorage.getItem('items'));
        setCartItems([...temp])
        setCartCount(temp.length)
    }, [])

    useEffect(() => {
        localStorage.setItem('items',JSON.stringify(cartItems))
        setCartCount(cartItems.length)
      }, [cartItems])  

    let navigate = useNavigate()
    const { state } = useLocation();


    const continueShopping = () => {
        navigate('/home')
    }

    const goToOrder = () => {
        if(amount>500){
            navigate('/place_order')
        }else{
            window.alert("Cart amount less than 500")
        }
    }

    const goToCart = () => {
        navigate('/cart');
    }

    const increaseQuantity = (id) => {
        setCartItems(
            cartItems.map((item) =>
              item._id === id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          );
    }

    const decreaseQuantity = (id) => {
        setCartItems(
            cartItems.map((item) =>
              item._id === id
                ? (item.quantity>1?{ ...item, quantity: item.quantity - 1 }:item)
                : item
            )
          );
    }

    const removeItem = (id) => {
        setCartItems(cartItems.filter((item) => item._id !== id)
          );
    }

    const calculateAmount = (arr) => {
        arr.map((item)=> (
            amount+=item.price*item.quantity
        ))
        return amount;
    }

    return (
        <div className="container">
            <div className="row">
                <h1>
                    <a href="/">My Ecommerce Site</a>

                    <span className="pull-right">
                        <button onClick={() => goToCart()}>Cart ({cartCount})</button>
                    </span>
                </h1>
                <hr></hr>
                <div className="col-md-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">MY CART ({cartCount})
                        </div>
                        <div className="panel-body">
                            {cartItems.length<1?<h1>Your cart is empty</h1>:null}
                                {cartItems && cartItems.map((product) =>
                                    <div className="row" key={product._id}>
                                        <div className="col-md-3"> <img src={`http://interviewapi.ngminds.com/${product.image}`} width="100px" height="200px"></img></div>
                                        <div className="col-md-3"> {product.name}
                                            <br /><i className="fa fa-inr"></i>{product.price}
                                        </div>
                                        <div className="col-md-4 d-flex"> quantity
                                            <br />
                                            <button onClick={()=>decreaseQuantity(product._id)}>-</button>
                                            <input size="5px" value={product.quantity} />
                                            <button onClick={()=>increaseQuantity(product._id)}>+</button>
                                        </div>
                                        <div className="col-md-2"> <button onClick={()=>removeItem(product._id)} className="btn btn-warning">remove</button></div>
                                    </div>
                                )}
                            <hr></hr>
                            <div className="row">
                                <div className="col-md-9">
                                    <label className="pull-right">Amount Payable
                                    </label>
                                </div>
                                <div className="col-md-3 ">
                                    {calculateAmount(cartItems)}
                                </div>
                            </div>
                        </div>
                        <div className="panel-footer">
                            <button className="btn btn-success" onClick={() => continueShopping()}>Continue Shopping</button>
                            <button className="pull-right btn btn-danger" onClick={() => goToOrder()}>Place Order</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart