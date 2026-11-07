"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import { ButtonLock } from "~/components/admin/button-lock";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import { isSafeAdminReturnPath } from "~/lib/admin-path";

export default function AdminLogin({
  returnPath,
  sessionExpired = false,
}: {
  returnPath?: string;
  sessionExpired?: boolean;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    if (!username.trim() || !password || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };
      if (!response.ok || !result.success)
        throw new Error(
          result.error ||
            "Unable to sign in. Check your credentials and try again.",
        );
      const destination =
        returnPath &&
        isSafeAdminReturnPath(returnPath) &&
        returnPath.startsWith("/admin/")
          ? returnPath
          : "/admin";
      router.replace(destination);
      router.refresh();
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Unable to sign in. Try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-12">
      <div className="w-full max-w-[420px]">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2.5 text-2xl font-bold tracking-tight"
          aria-label="MathEncode home"
        >
          <Image
            src="/logo_color.svg"
            alt=""
            width={38}
            height={38}
            style={{ width: "auto", height: 38 }}
            unoptimized
          />
          <span className="text-admin-foreground">
            Math<span className="text-orange-600">Encode</span>
          </span>
        </Link>
        <Card className="shadow-sm">
          <CardHeader className="space-y-3 px-7 pb-5 pt-7">
            <span className="flex size-10 items-center justify-center rounded-xl border border-admin-border bg-admin-muted">
              <LockKeyhole className="size-5" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <CardDescription className="mt-2">
                Sign in to your admin workspace.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-7 pb-7">
            {sessionExpired ? (
              <p
                role="status"
                className="border-orange-200 bg-orange-50 text-orange-900 mb-5 rounded-lg border p-3 text-sm"
              >
                Your session expired. Sign in to pick up where you left off.
              </p>
            ) : null}
            <form
              onSubmit={signIn}
              className="space-y-5"
              aria-label="Admin sign in"
            >
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  autoFocus
                  disabled={submitting}
                  value={username}
                  placeholder="Enter your username"
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setError("");
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    disabled={submitting}
                    value={password}
                    placeholder="Enter your password"
                    className="pr-12"
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0.5 top-0.5 size-10"
                    onClick={() => setShowPassword((show) => !show)}
                    disabled={submitting}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
              {error ? (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              ) : null}
              <ButtonLock
                locked={!submitting && (!username.trim() || !password)}
                reason="Enter your username and password."
                className="w-full"
              >
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting || !username.trim() || !password}
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  {submitting ? "Signing in…" : "Sign in"}
                  {!submitting ? (
                    <ArrowRight className="ml-auto size-4" />
                  ) : null}
                </Button>
              </ButtonLock>
            </form>
          </CardContent>
        </Card>
        <p className="mt-5 text-center text-xs text-admin-muted-foreground">
          A private workspace for the MathEncode team.
        </p>
        <div className="mt-5 text-center">
          <Button
            asChild
            variant="link"
            className="text-admin-muted-foreground"
          >
            <Link href="/">
              <ArrowLeft className="size-4" /> Back to website
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
