import { useSession, signOut } from 'next-auth/react';
import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Store } from '../utils/Store';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { DropdownLink } from './DropdownLink';
import Cookies from 'js-cookie';
import { FaArrowCircleUp } from 'react-icons/fa';
import { Button } from './Styles';

export const Layout = ({ title, children }) => {
    // for change the navbar background color
    const [show, handleShow] = useState(false);
    const [showmenu, handleShowmenu] = useState(false);
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        scrolled > 300 ? setVisible(true) : setVisible(false);
    }
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisible);
        return () => window.removeEventListener('scroll', toggleVisible);

    }, []);

    const transitionNavBar = () => {
        window.scrollY > 100 ? handleShow(true) : handleShow(false);
    }
    const transitionNavSec = () => {
        window.scrollY > 120 ? handleShowmenu(true) : handleShowmenu(false);
    }
    useEffect(() => {
        window.addEventListener('scroll', transitionNavBar);
        return () => window.removeEventListener('scroll', transitionNavBar);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', transitionNavSec);
        return () => window.removeEventListener('scroll', transitionNavSec);
    }, []);

    const { data: session, status } = useSession();
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const [cartItemsCount, setCartItemsCount] = useState(0);

    useEffect(() => {
        setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));

    }, [cart.cartItems]);

    // Logout handler
    const logoutClickHandler = () => {
        //Cookies.remove('cart');
        //dispatch({ type: 'CART_RESET'});
        signOut({ callbackUrl: '/login' });
    }

  return (
    <>
        <Head>
            <title>{title ? title + '- Amazona' : 'NextJs Full Stack Ecommerce App'}</title>
            <meta name="description" content="NextJs Full Stack Ecommerce App" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <ToastContainer position='bottom-center' limit={1} />
        <div className='flex min-h-screen flex-col justify-between'>
            <header>
                <nav className={`flex h-12 justify-between shadow-lg items-center px-4 ${show && "nav__black"}`}>
                    <Link href="/" legacyBehavior>
                        <a className='text-lg font-bold'>Amazona</a>
                    </Link>
                    <div>
                        <Link legacyBehavior href="/cart"><a className='p-2'>
                            Cart
                            {cartItemsCount > 0 && (
                                <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                                    {cartItemsCount}
                                </span>
                            )}
                        </a></Link>
                        {status === 'loading' ? (
                            'Loading...'
                        ) : session?.user ? (
                            <Menu as="div" className="relative inline-block">
                                <Menu.Button className="text-blue-600">
                                    {session.user.name}
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg">
                                    <Menu.Item>
                                        <DropdownLink className="dropdown-link" href="/profile">
                                            Profile
                                        </DropdownLink>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <DropdownLink className="dropdown-link" href="/order-history">
                                            Order History
                                        </DropdownLink>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <DropdownLink className="dropdown-link" href="#" onClick={logoutClickHandler}>
                                            Logout
                                        </DropdownLink>
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>
                        ) : (
                            <Link legacyBehavior href="/login">
                                <a className='p-2'>Login</a>
                            </Link>
                        )} 
                    </div>
                </nav>
            </header>
            <div className={`grid dis grid-cols-3 gap-4 my-12 justify-between text-center border-y-2 py-3 shadow-md font-semibold w-full ${showmenu && "fixedSecNav"}`}>
                <div>METRO - ORDER WITH SAME DAY BY 12PM 23RD FOR CHRISTMAS</div>
                <div>FREE EXPRESS DELIVERY OVER $100*</div>
                <div>FREE CLICK & COLLECT</div>
            </div>
            {/* free shipping */}
            {/* <div className='flex h-12 justify-between shadow-lg items-center px-4 divide-y divide-slate-200 mainMargin'>
                    Free express delivery over $50
            </div> */}
            <main className='container m-auto px-4 pt-4 mainMargin'>
                {children}
                 {/* Bubbles */}
                 <div className='eacss'>
                    <div className='bubble floating bx1'><span></span></div>
                    <div className='bubble floating bx2 m-hide'><span></span></div>
                    <div className='bubble floating bx3'><span></span></div>
                    <div className='bubble floating bx4'><span></span></div>
                    <div className='bubble floating bx5 m-hide'><span></span></div>
                    <div className='bubble floating bx6 m-hide'><span></span></div>
                    <div className='bubble floating bx7'><span></span></div>
                    <div className='bubble floating bx8 m-hide'><span></span></div>
                    <div className='bubble floating bx9 m-hide'><span></span></div>
                 </div>
            </main>
            <footer className='flex justify-center items-center h-10 shadow-inner'>Copyright 2022 Amazona</footer>
        </div>
        {/* scroll to top */}
        <Button>
            <FaArrowCircleUp onClick={scrollToTop}
                style={{display: visible ? 'inline' : 'none'}} />
        </Button>
    </>
  )
}
