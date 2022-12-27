import React, { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import axios from 'axios';
import { Layout } from '../components/Layout';

function ProfileScreen() {
    const { data: session } = useSession();
    const {
        handleSubmit,
        register,
        getValues,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        setValue('name', session.user.name);
        setValue('lastName', session.user.lastName);
        setValue('mobile', session.user.mobile);
        setValue('email', session.user.email);
        console.log(session.user);
    }, [session.user, setValue]);

    const submitHandler = async ({ name, lastName, mobile, email, password }) => {
        try {
            await axios.put('/api/auth/update', {
                name,
                lastName,
                mobile,
                email,
                password,
            });
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            toast.success("Profile updated successfully");
            if(result.error) {
                toast.error(result.error);
            }
        } catch (err) {
            toast.error(getError(err));
        }
    }
  return (
    <Layout title="Profile">
        <form 
            className='mx-auto max-w-screen-md'
            onSubmit={handleSubmit(submitHandler)}
        >
            <h1 className='mb-4 text-xl'>Update Profile</h1>
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
                <label htmlFor='    '>Last Name</label>
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
                <button className='primary-button'>Update Profile</button>
            </div>

        </form>
    </Layout>
  )
}

ProfileScreen.auth = true;
export default ProfileScreen;
