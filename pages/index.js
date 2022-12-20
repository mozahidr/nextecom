import Head from 'next/head'
import { useContext } from 'react';
import { Layout } from '../components/Layout'
import { ProductItem } from '../components/ProductItem'
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    // axios is library to fetch data from backend api 
    const { data } = await axios.get(`/api/products/${product._id}`);

    if(data.countInStock < quantity) {
        toast.error('Sorry. Product is out to Stock');
        return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Product added successfully');
}

  return (
      <Layout title="Home Page"> 
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {products.map((product) => (
            <ProductItem product={product} key={product.slug} addToCartHandler={addToCartHandler} />
          ))}
        </div>
      </Layout>
  )
}

// this function run before the page is loaded
export async function getServerSideProps() {
  await db.connect();
  // .lean() we will get product infro instead of meta data from mongodb server
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}