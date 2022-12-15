import Head from 'next/head';
import React, { useContext } from 'react';
import Link from 'next/link';
import { Store } from '../utils/Store';

export const Layout = ({ title, children }) => {
    const { state, dispatch } = useContext(Store);
    const { cart } = state;

  return (
    <>
        <Head>
            <title>{title ? title + '- Amazona' : 'NextJs Full Stack Ecommerce App'}</title>
            <meta name="description" content="NextJs Full Stack Ecommerce App" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className='flex min-h-screen flex-col justify-between'>
            <header>
                <nav className='flex h-12 justify-between shadow-md items-center px-4'>
                    <Link href="/" legacyBehavior>
                        <a className='text-lg font-bold'>Amazona</a>
                    </Link>
                    <div>
                        <Link legacyBehavior href="/cart"><a className='p-2'>
                            Cart
                            {cart.cartItems.length > 0 && (
                                <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                                </span>
                            )}
                        </a></Link>
                        <Link legacyBehavior href="/login"><a className='p-2'>Login</a></Link>
                    </div>
                </nav>
            </header>
            <main className='container m-auto mt-4 px-4'>
                {children}
            </main>
            <footer className='flex justify-center items-center h-10 shadow-inner'>Copyright 2022 Amazona</footer>
        </div>
    </>
  )
}
