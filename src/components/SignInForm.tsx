"use client"
import { FormEvent, useState } from "react";
import Router from "next/navigation";
import { signIn } from "next-auth/react";
export default function SignInForm({ callbackUrl, csrfToken }: { callbackUrl: string, csrfToken?: string }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        setError("");
        setLoading(true);


        try {
            const formData = new FormData(e.target as HTMLFormElement)
            const turnstileRes = formData.get('cf-turnstile-response')?.toString()
            await signIn('credentials', { email, password, callbackUrl, turnstileRes, csrfToken });
        } catch {
            setError("Failed to log in");
        }
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <input name="callbackUrl" type="hidden" defaultValue={callbackUrl} />
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">

                <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Forgot your password?
                    </a>
                </div>
            </div>
            <div className="cf-turnstile checkbox" data-theme='light' data-sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}></div>

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    {loading ? 'Loading...' : 'Sign in'}
                </button>
            </div>
        </form>
    );
}
