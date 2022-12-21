import React, { useState, useMemo, useContext, useEffect } from 'react';
import Select from 'react-select'
import { useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';
import { Layout } from '../components/Layout';
import countryList from 'react-select-country-list';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function ShippingScreen() {
    // geting country list
    const [optionvalue, setOptionValue] = useState('');
    const options = useMemo(() => countryList().getData(), []);

    const { handleSubmit, register, formState : { errors }, setValue, getValues } = useForm();
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const { shippingAddress } = cart;
    const router = useRouter();

    useEffect(() => {
        setValue('fullName', shippingAddress.fullName);
        setValue('address', shippingAddress.address);
        setValue('city', shippingAddress.city);
        setValue('country', shippingAddress.country);
        setValue('postalCode', shippingAddress.postalCode);
    }, [setValue, shippingAddress]);
    

    const submitHandler = ({ fullName, address, city, postalCode, country}) => {
        dispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: { fullName, address, city, postalCode, country },
        });
        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                shippingAddress: {
                    fullName, address, city, postalCode, country,
                },
            })
        );
            router.push('/payment');
    };
    // select country
    const changeHandler = (optionvalue) => {
        setOptionValue(optionvalue);
    }
  return (
    <Layout title="Shipping address">
        <CheckoutWizard activeStep={1} />
        <form className='mx-auto max-w-screen-md' onSubmit={handleSubmit(submitHandler)}>
            <h1 className='mb-4 text-xl'>Shipping Address</h1>
            <div className='mb-4'>
                <label htmlFor='fullName'>Full Name</label>
                <input id='fullName' className='w-full' autoFocus {...register('fullName', {required: 'Please enter full name',})} />
                {errors.fullName && (
                    <div className='text-red-500'>{errors.fullName.message}</div>
                )}
            </div>
            <div className='mb-4'>
                <label htmlFor='address'>Address</label>
                <input id='address' className='w-full' {...register('address', {required: 'Please enter address',
                    minLength: { value: 3, message: 'Address is more than 2 chars'} })} />
                {errors.address && (
                    <div className='text-red-500'>{errors.address.message}</div>
                )}
            </div>
            <div className='mb-4'>
                <label htmlFor='city'>City</label>
                <input id='city' className='w-full' {...register('city', {required: 'Please enter city' })} />
                {errors.city && (
                    <div className='text-red-500'>{errors.city.message}</div>
                )}
            </div>
            <div className='mb-4'>
                <label htmlFor='postalCode'>Postal Code</label>
                <input id='postalCode' className='w-full outline-0' {...register('postalCode', {required: 'Please enter Postal Code' })} />
                {errors.postalCode && (
                    <div className='text-red-500'>{errors.postalCode.message}</div>
                )}
            </div>
            <div className='mb-4'>
                <label htmlFor='postalCode'>Coutnry</label>
                <input id='country' className='w-full' {...register('country', {required: 'Please enter Country' })} />
                {/* <Select required id='country' {...register('country')} className='Select' options={options} value={optionvalue} onChange={changeHandler} /> */}
                {errors.country && (
                    <div className='text-red-500'>{errors.country.message}</div>
                )}
            </div>
            <div className='mb-4 flex justify-between'>
                <button className='primary-button'>Next</button>
            </div>
        </form>
    </Layout>
  )
}
ShippingScreen.auth = true;