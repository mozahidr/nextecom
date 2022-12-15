import Link from 'next/link';
import React, {useContext } from 'react';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';

export const ProductItem = ({ product }) => {
    const { state, dispatch } = useContext(Store);
    const { query } = useRouter();
    const { slug } = query;
   // const product = data.products.find(pro => pro.slug === slug);

    const addToCartHandler = () => {
        const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;

        if(product.countInStock < quantity) {
            alert("Sorry. Product is out to Stock");
            return;
        }

        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    }
  return (
    <div className='card'>
        <Link href={`/product/${product.slug}`} legacyBehavior>
            <a>
                <img src={product.image} alt={product.name} className='rounded shadow' />
            </a>
        </Link>
        <div className='flex flex-col items-center justify-center p-5'>
            <Link href={`/product/${product.slug}`} legacyBehavior>
                <a><h2 className='text-lg'>{product.name}</h2></a>
            </Link>
            <p className='mb-2'>{product.brand}</p>
            <p>${product.price}</p>
            <button className='primary-button' type='button' onClick={addToCartHandler}>Add to Cart</button>
        </div>
    </div>
  )
}
