import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formattedEmail = email.includes('@') ? email : `${email}@gmail.com`;

        const { error } = await login(formattedEmail, password);

        if (!error) {
            toast({
                title: t('login.success_title'),
                description: t('login.success_message'),
            });
            navigate('/projects');
        } else {
            toast({
                title: t('login.error_title'),
                description: error.message || t('login.error_message'),
                variant: "destructive",
            });
        }
        setIsSubmitting(false);
    };

    const handleForgotPassword = async () => {
        if (!email) {
            toast({
                title: t('common.error'),
                description: t('login.email_required_reset'),
                variant: "destructive",
            });
            return;
        }

        const formattedEmail = email.includes('@') ? email : `${email}@gmail.com`;

        const { error } = await supabase.auth.resetPasswordForEmail(formattedEmail, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            toast({
                title: t('common.error'),
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: t('common.success'),
                description: t('login.reset_email_sent'),
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f9f6] p-4">
            <Card className="w-full max-w-sm border-2 border-[#cfeadd] shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4">
                        <img
                            src="/logo.png"
                            alt="Logo MaDashTick"
                            className="h-24 w-auto mx-auto object-contain"
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-[#004d40]">{t('login.title')}</CardTitle>
                    <CardDescription>
                        {t('login.description')}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder={t('login.username_placeholder')}
                                    className="pl-9"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('login.password_placeholder')}
                                    className="pl-9 pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-[#004d40]"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-xs text-[#004d40] hover:underline"
                                >
                                    {t('login.forgot_password')}
                                </button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full bg-[#004d40] hover:bg-[#00332a]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t('login.connecting') : t('login.submit')}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            <div className="fixed bottom-4 text-xs text-slate-400">
                {t('login.test_credentials')}
            </div>
        </div>
    );
};

export default Login;
