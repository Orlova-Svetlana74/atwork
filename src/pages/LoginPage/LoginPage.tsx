import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { loginSchema } from '../../schemas';
import type { LoginFormData } from '../../schemas';
import { useAuthStore } from '../../store';
import { Button, Input } from '../../components/ui'; // ← объединенный импорт
import styles from './LoginPage.module.scss';

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Здесь будет API вызов
      console.log('Login data:', data);
      
      // Моковые данные для теста
      const mockUser = { id: 1, email: data.email, name: 'User' };
      const mockToken = 'mock-token';
      
      setAuth(mockUser, mockToken);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h1>Login</h1>
        
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email')}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />
        
        <Button type="submit" isLoading={isSubmitting}>
          Sign In
        </Button>
      </form>
    </div>
  );
};