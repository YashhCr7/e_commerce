import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './style.css'

function Home() {
  const [allProducts, setAllProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [defaultSort, setDefaultSort] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const colors = ["bg-info", "bg-success", "bg-warning", "bg-danger"];

  let navigate = useNavigate()

  useEffect(() => {
    let localdata = JSON.parse(localStorage.getItem('items'))
    if (localdata == null) {
      localStorage.setItem('items', [])
    }
    else {
      setCartItems(localdata)
    }

    axios
      .get("http://interviewapi.ngminds.com/api/getAllProducts")
      .then((res) => {
        setAllProducts([...res.data.products]);
        setDefaultSort([...res.data.products]);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(cartItems))
    setCartCount(cartItems.length)
  }, [cartItems])


  const addToCart = (product) => {
    if (cartItems.filter((item) => item._id === product._id).length)
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  }

  const goToCart = () => {
    navigate('/cart');
  }

  const sortItems = (e) => {
    if (e.target.value === 'low') {
      setAllProducts([...allProducts.sort((a, b) => (parseInt(a.price) > parseInt(b.price)) ? 1 : ((parseInt(b.price) > parseInt(a.price)) ? -1 : 0))])
    }
    else if (e.target.value === 'high') {
      setAllProducts([...allProducts.sort((a, b) => (parseInt(a.price) < parseInt(b.price)) ? 1 : ((parseInt(b.price) < parseInt(a.price)) ? -1 : 0))])
    }
    else {
      setAllProducts([...defaultSort])
    }
  }

  //     <-- Pagination -->

  const renderProducts = (data) => {
    let fourProd = [];
        let tempProds = data;
        let i = 0;
        while (i < tempProds.length) {
          fourProd.push(tempProds.slice(i, i + 4));
          i += 4;
        }
        // console.log(fourProd)

    return (
      fourProd.length && fourProd.map((row) => (
        <>
          <div className="row">
            {row.length &&
              row.map((product, i) => (
                <div className="col-md-3" style={{ marginTop: "10px" }}>
                  <div className={colors[i % 4]}>
                    <img src={`http://interviewapi.ngminds.com/${product.image}`} width="130" height="250"></img>
                    <br></br>
                    <p>{product.name}</p>
                    <p><i className="fa fa-inr"></i>{product.price}</p>
                    <button className="btn btn-warning" onClick={() => addToCart(product)}>Add to Cart</button>
                  </div>
                </div>
              ))}
          </div>
          <hr/>
        </>
      ))
    )
  }

  const pages = []
  for(let i = 1; i<= Math.ceil(allProducts.length/itemsPerPage); i++){
    pages.push(i)
  }

  const handlePrevious = () => {
    if(currentPage==1){
      return
    }
    setCurrentPage(currentPage-1)
  }

  const handleNext = () => {
    if(currentPage==pages.length){
      return
    }
    setCurrentPage(currentPage+1)
  }

const indexOfLastitem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastitem - itemsPerPage;
const currentItems = allProducts.slice(indexOfFirstItem,indexOfLastitem)

  return (
    <>
      <div className="container">
        <h1>
          <a href="/">My Ecommerce Site</a>
          <span className="pull-right">
            <button onClick={() => goToCart()}>Cart ({cartCount})</button>
          </span>
        </h1>
        <hr></hr>
        <div className="pull-left row">
          <label for="sorting">Sort by:</label>
          <select className='ml-2' onChange={(e) => sortItems(e)}>
            <option value="default">Default</option>
            <option value="high">High to Low</option>
            <option value="low">Low to High</option>
          </select>
        </div>
        <br></br>
        <br></br>
        {renderProducts(currentItems)}
        <hr
          style={{
            color: "#909090",
            backgroundColor: "#909090",
            borderColor: "#909090",
          }}
        />
        <div className="row">
            <div className="col-sm-6">
                <ul className="pagination" style={{cursor:"pointer"}}>
                    <li className={currentPage==1? "page-item disabled":"page-item"} onClick={()=>handlePrevious()}><a className="page-link">Previous</a></li>
                    {pages?pages.map((i)=>
                      <li onClick={()=>setCurrentPage(i+1)} className={currentPage==i+1?"active":null}><a className="page-link">{i+1}</a></li>
                    ):""}
                    <li className={currentPage==pages.length? "page-item disabled":"page-item"} onClick={()=>handleNext()}><a className="page-link">Next</a></li>
                </ul>
            </div>
            <div className="col-sm-6 text-right">
                <div style={{marginTop: "25px",marginRight : "30px"}}>
                    <label for="" className="control-label">Items Per Page:</label>
                    <select onChange={(e)=>setItemsPerPage(e.target.value)}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>
        </div>
      </div>
    </>
  )

}

export default Home