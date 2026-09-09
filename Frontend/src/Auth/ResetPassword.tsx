import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword_Mutation } from "../graphql/Mutation";
import type { ResetPassword_Interface } from "../graphql/Client";
import { toast } from "react-toastify";
import { CombinedGraphQLErrors } from "@apollo/client";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetPassword] = useMutation<ResetPassword_Interface>(
    resetPassword_Mutation,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please enter both passwords");
      return;
    }
    if (!password || !confirmPassword) {
      toast.error("Please enter both passwords");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword({
        variables: { token, password },
      });
      const result = res.data?.ResetPassword;

      if (result?.success) {
        toast.success(result.msg);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(result?.msg || "Password reset failed");
      }
    } catch (error) {
      if (CombinedGraphQLErrors.is(error)) {
        toast.error(error.errors?.[0]?.message || "Password reset failed");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full">
        <h2 className="text-3xl font-bold text-red-600">Invalid Reset Link</h2>

        <p className="mt-3 text-sm text-gray-600">
          This password reset link is invalid or missing a token.
        </p>

        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="mt-6 text-sm text-blue-600 hover:underline"
        >
          Request a new reset link
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#1D1D1F]">Reset Password</h2>
        <p className="mt-3 text-sm text-[#333333]">
          Enter your new password below
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-[#222222]"
          >
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="h-11 w-full rounded border px-3"
            required
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-[#222222]"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="h-11 w-full rounded border px-3"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded bg-[#18216B] text-sm font-medium text-white transition hover:bg-[#121957] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "changing password..." : "change password"}
        </button>
      </form>
    </div>
  );
}
