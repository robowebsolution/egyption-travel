import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-egyptian">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-pharaoh-700 mb-4">Sign In</h2>
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center">{error}</div>}
        <div>
          <label className="block mb-1 font-medium text-pharaoh-700">Email</label>
          <Input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Enter your email" />
        </div>
        <div>
          <label className="block mb-1 font-medium text-pharaoh-700">Password</label>
          <Input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Enter your password" />
        </div>
        <Button type="submit" className="w-full bg-pharaoh-600 hover:bg-pharaoh-700" loading={loading} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
};

export default Login; 