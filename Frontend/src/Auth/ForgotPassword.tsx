import { useNavigate } from "react-router-dom";
import { forgotPassword_Mutation } from "../graphql/Mutation";
import type { ForgotPassword_Interface } from "../graphql/Client";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { CombinedGraphQLErrors } from "@apollo/client";
import { useState } from "react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgotPassword] = useMutation<ForgotPassword_Interface>(
    forgotPassword_Mutation,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword({
        variables: { email: email.trim().toLowerCase() },
      });
      const result = res.data?.ForgotPassword;

      if (result?.success) {
        toast.success(result.msg);
        setEmail("");
      } else {
        toast.error(result?.msg || "Something went wrong");
      }
    } catch (error) {
      if (CombinedGraphQLErrors.is(error)) {
        toast.error(error.errors?.[0]?.message || "Something went wrong");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1D1D1F]">Forgot Password</h2>
          <p className="mt-3 text-sm text-[#333333]">
            Enter your email and we'll send you a password reset link.
          </p>
        </div>
        <form action="" onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#222222]"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-11 w-full rounded border px-3"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded bg-[#18216B] text-sm font-medium text-white transition hover:bg-[#121957] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "SENDING..." : "SEND RESET LINK"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-5 w-full text-center text-sm text-blue-600 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </>
  );
}
