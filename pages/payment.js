import React, { useContext, useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function payment() {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const { shippingAddress, paymentMethod } = cart;

    const submitHandler = (e) => {
        e.preventDefault();
        if(!selectedPaymentMethod) {
            return toast.error('Payment Method is not selected');
        }
        dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
        Cookies.set('cart',
            JSON.stringify({
            ...cart,
            paymentMethod: selectedPaymentMethod,
        }));
        router.push('/placeorder');
    };

    useEffect(() => {
        if(!shippingAddress.address) {
            return router.push('/shipping');
        }
        setSelectedPaymentMethod(paymentMethod || '');
    }, [paymentMethod, router, shippingAddress.address]);
  return (
    <Layout title="Payment Method">
        <CheckoutWizard activeStep={2} />
        <form className='mx-auto max-w-screen-md' onSubmit={submitHandler}>
            <h1>Payment Method</h1>
            {
                ['Paypal', 'Stripe', 'CashOnDelivery'].map((payment) => (
                    <div key={payment} className="mb-4">
                        <input type="radio" name='paymentMethod' className='p-2 outline-none focus:ring-0'
                            id={payment}
                            checked={selectedPaymentMethod === payment}
                            onChange={() => setSelectedPaymentMethod(payment)}    
                        />
                        <label className='p-2' htmlFor={payment}>
                            {payment}
                        </label>
                    </div>
                ))
            }
            <div className='mb-4 flex justify-between'>
                <button onClick={() => router.push('/shipping')} type="button" className='default-button'>
                    Back
                </button>
                <button className='primary-button'>Next</button>
            </div>
        </form>
    </Layout>
  )
}
