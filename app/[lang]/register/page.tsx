'use client';

import { use } from 'react';
import { Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Lock, Briefcase, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { simpleAuth } from '@/lib/auth-simple';

export default function RegisterPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'freelancer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const user = simpleAuth.getCurrentUser();
        if (user) {
          router.push(`/${lang}/dashboard`);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };
    checkAuth();
  }, [lang, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(lang === 'ru' ? 'Заполните все поля' : 'Barcha maydonlarni to\'ldiring');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(lang === 'ru' ? 'Пароли не совпадают' : 'Parollar mos emas');
      return;
    }

    if (formData.password.length < 6) {
      setError(lang === 'ru' ? 'Пароль должен быть не менее 6 символов' : 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);
    
    try {
      await simpleAuth.register(formData.email, formData.fullName, formData.role as 'freelancer' | 'client');
      
      alert(lang === 'ru' 
        ? 'Регистрация успешна! Теперь вы можете войти.' 
        : 'Ro\'yxatdan o\'tish muvaffaqiyatli! Endi kirishingiz mumkin.');
      
      router.push(`/${lang}/login`);
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || (lang === 'ru' ? 'Ошибка регистрации' : 'Ro\'yxatdan o\'tish xatoligi'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">UZ</span>
            </div>
            <span className="text-white font-bold text-xl">UzDev Hub</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">
            {lang === 'ru' ? 'Регистрация' : 'Ro\'yxatdan o\'tish'}
          </h1>
          <p className="text-slate-400">
            {lang === 'ru' 
              ? 'Создайте аккаунт для доступа к IT-маркетплейсу' 
              : 'IT-marketpleysga kirish uchun akkaunt yarating'}
          </p>
        </div>

        {/* Register Form */}
        <Card className="bg-dark-800 border-dark-700">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {lang === 'ru' ? 'Полное имя' : 'To\'liq ism'}
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary"
                  placeholder={lang === 'ru' ? 'Иван Иванов' : 'Ivan Ivanov'}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {lang === 'ru' ? 'Email' : 'Email'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary"
                  placeholder="example@email.com"
                  required
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {lang === 'ru' ? 'Тип аккаунта' : 'Akkaunt turi'}
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                  <option value="freelancer">
                    {lang === 'ru' ? 'Фрилансер' : 'Frilanser'}
                  </option>
                  <option value="client">
                    {lang === 'ru' ? 'Заказчик' : 'Mijoz'}
                  </option>
                </select>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {lang === 'ru' ? 'Пароль' : 'Parol'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary pr-12"
                    placeholder="•••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {lang === 'ru' ? 'Подтвердите пароль' : 'Parolni tasdiqlang'}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary pr-12"
                    placeholder="•••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading 
                  ? (lang === 'ru' ? 'Регистрация...' : 'Ro\'yxatdan o\'tilmoqda...')
                  : (lang === 'ru' ? 'Зарегистрироваться' : 'Ro\'yxatdan o\'tish')
                }
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-dark-700">
                <p className="text-slate-400">
                  {lang === 'ru' ? 'Уже есть аккаунт?' : 'Akkauntingiz bormi?'}{' '}
                  <Link 
                    href={`/${lang}/login`}
                    className="text-primary hover:underline ml-1"
                  >
                    {lang === 'ru' ? 'Войти' : 'Kirish'}
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === 'ru' ? 'На главную' : 'Bosh sahifaga'}
          </Link>
        </div>
      </div>
    </div>
  );
}
