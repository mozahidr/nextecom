import Link from 'next/link';
import React, { useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import { useRouter } from 'next/router';
//import { redirect } from 'next/dist/server/api-utils';
import axios from 'axios';

export default function RegisterScreen() {

    const { data: session } = useSession();
    const router = useRouter();
    const { redirect } = router.query;

    useEffect(() => {
        if(session?.user) {
            router.push(redirect || '/');
        }
    }, [router, session, redirect]);

    const { handleSubmit, register, getValues, formState : { errors }, } = useForm();

    const submitHandler = async ({ name, lastName, mobile, email, password }) => {
        try {
            await axios.post('/api/auth/signup', {
                name, lastName, mobile, email, password,
            })
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });
            
            if(result.error) {
                toast.error(result.error);
            }
            
        } catch (error) {
            toast.error(getError(err));
        }
    }
  return (
    <Layout title="Create Account">
        <form onSubmit={handleSubmit(submitHandler)} className='mx-auto max-w-screen-md'>
            <h1 className='mb-4 text-xl'>Create Account</h1>
            <div className='mb-4'>
                <label htmlFor='name'>First Name</label>
                <input 
                    type="text"
                    id="name"
                    autoFocus
                    {...register('name', {required: 'Please enter your First Name',
                    })}
                    className="w-full"
                />
                    {errors.name && (
                        <div className='text-red-500'>{errors.name.message}</div>
                    )}
            </div>
            <div className='mb-4'>
                <label htmlFor='lastName'>Last Name</label>
                <input 
                    type="text"
                    id="lastName"
                    {...register('lastName', {required: 'Please enter your Last Name',
                    })}
                    className="w-full"
                />
                    {errors.lastName && (
                        <div className='text-red-500'>{errors.lastName.message}</div>
                    )}
            </div>
            <div className='mb-4'>
                <label htmlFor='mobile'>Mobile</label>
                <input 
                    type="text"
                    id="mobile"
                    {...register('mobile', {required: 'Please enter your Mobile Number',
                    })}
                    className="w-full"
                />
                    {errors.mobile && (
                        <div className='text-red-500'>{errors.mobile.message}</div>
                    )}
            </div>
            <div className='mb-4'>
                <label htmlFor='email'>Email</label>
                <input 
                    type="email"
                    {...register('email', {required: 'Please enter your email',
                    pattern: {
                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                        message: 'Please enter a valid email'
                    }})}
                    className="w-full" id="email" 
                />
                    {errors.email && (
                        <div className='text-red-500'>{errors.email.message}</div>
                    )}
            </div>
            <div className='mb-4'>
                <label htmlFor='password'>Password</label>
                <input
                    type="password" 
                    {...register('password', {required: 'Please enter password', 
                    minLength: { value: 8, message: 'Password should be at least 8 chars' }, })}
                    className="w-full" id="password" />
                    {errors.password && (
                        <div className='text-red-500'>{errors.password.message}</div>
                    )}
            </div>
            <div className='mb-4'>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    {...register('confirmPassword', {
                        required: 'Please enter confirm password',
                        validate: (value) => value === getValues('password'),

                    minLength: { 
                        value: 8, 
                        message: 'Password should be at least 8 chars' 
                    }, })}
                    className="w-full" />
                    {errors.confirmPassword && (
                        <div className='text-red-500'>{errors.confirmPassword.message}</div>
                    )}
                    {errors.confirmPassword && 
                     errors.confirmPassword.type === 'validate' && (
                        <div className='text-red-500'>Password do not match</div>
                     )}
            </div>
            <div className='mb-4'>
                <button className='primary-button'>Register</button>
            </div>
            <div className='mb-4'>
                Don&apos;t have an account? &nbsp;
                <Link href={`/register?redirect=${redirect || '/'}`} legacyBehavior>
                    Register
                </Link>
            </div>
        </form>
    </Layout>
  )
}
