import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    username: '',
    password: '',
    telegramId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(formData);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Register as a citizen</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <Label>Full Name</Label>
                <Input
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <Label>Phone Number</Label>
                <Input
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              {/* 🔥 Telegram ID with CLEAR instructions */}
              <div>
                <Label>Telegram ID</Label>

                <div className="text-xs text-gray-500 space-y-1">
                     <p>📌 How to get Telegram ID:</p>
                     <p>1️⃣ Open Telegram</p>
                     <p>2️⃣ Search: userinfobot</p>
                      <p>3️⃣ Click START</p>
                      <p>4️⃣ You will see your ID (example: 8535969610)</p>
                      <p>5️⃣ Copy that ID and paste here</p>
                </div>

                <Input
                  placeholder="Enter your Telegram ID"
                  value={formData.telegramId}
                  onChange={(e) => setFormData({ ...formData, telegramId: e.target.value })}
                  required
                />
              </div>

              {/* Username */}
              <div>
                <Label>Username</Label>
                <Input
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                {isLoading ? 'Creating...' : 'Create Account'}
              </Button>

            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Register;