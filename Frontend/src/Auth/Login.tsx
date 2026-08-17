import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoEyeClosed } from "react-icons/go";
import { RxEyeOpen } from "react-icons/rx";
import { useMutation } from "@apollo/client/react";
import type {
  Admin_Login_Interface,
  Get_Login_Interface,
} from "../graphql/Client";
import { adminLogin_Mutation, loginUser_Mutation } from "../graphql/Mutation";
import { toast } from "react-toastify";
import { CombinedGraphQLErrors } from "@apollo/client";

type Role = "employee" | "admin";
type LoginInput = {
  email: string;
  password: string;
};
type LoginError = {
  email: string;
  password: string;
};
export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginInput, setLoginInput] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [LogInUser] = useMutation<Get_Login_Interface>(loginUser_Mutation);
  const [AdminLogIn] = useMutation<Admin_Login_Interface>(adminLogin_Mutation);
  const [error, setError] = useState<LoginError>({
    email: "",
    password: "",
  });
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const changeRole = (newRole: Role) => {
    setRole(newRole);
    setError({
      email: "",
      password: "",
    });
  };
  const validateLogin = () => {
    const errors: LoginError = {
      email: "",
      password: "",
    };
    let isValid = true;
    if (!loginInput.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
        loginInput.email.trim(),
      )
    ) {
      errors.email = "Enter a valid email address";
      isValid = false;
    }
    if (!loginInput.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }
    setError(errors);
    if (!isValid) {
      if (errors.email) {
        emailRef.current?.focus();
      } else if (errors.password) {
        passwordRef.current?.focus();
      }
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const variables = {
        email: loginInput.email.trim().toLowerCase(),
        password: loginInput.password,
      };
      if (role === "employee") {
        const response = await LogInUser({
          variables,
        });

        if (response.data?.LogIn?.success) {
          toast(response.data.LogIn.msg, {
            position: "top-right",
            type: "success",
            theme: "colored",
          });
          navigate("/");
        } else {
          toast(response.data?.LogIn?.msg || "Login failed", {
            position: "top-right",
            type: "warning",
            theme: "colored",
          });
        }
      } else {
        const response = await AdminLogIn({
          variables,
        });
        if (response.data?.AdminLogIn?.success) {
          toast(response.data.AdminLogIn.msg, {
            position: "top-right",
            type: "success",
            theme: "colored",
          });
          navigate("/admin");
        } else {
          toast(response.data?.AdminLogIn?.msg || "Login failed", {
            position: "top-right",
            type: "warning",
            theme: "colored",
          });
        }
      }
    } catch (error: unknown) {
      if (CombinedGraphQLErrors.is(error)) {
        const graphError = error.errors?.[0];
        if (!graphError) {
          toast("Something went wrong. Please try again.", {
            position: "top-right",
            type: "error",
            theme: "colored",
          });
          return;
        }
        const message = graphError.message;
        const backendField = graphError.extensions?.field as string | undefined;
        if (!backendField) {
          toast(message, {
            position: "top-right",
            type: "error",
            theme: "colored",
          });
          return;
        }
        const fieldMap: Record<string, keyof LoginError> = {
          email: "email",
          password: "password",
        };
        const frontendField = fieldMap[backendField];
        if (!frontendField) {
          toast(message, {
            position: "top-right",
            type: "error",
            theme: "colored",
          });
          return;
        }
        setError((prev) => ({
          ...prev,
          [frontendField]: message,
        }));
        if(frontendField==="email"){
          emailRef.current?.focus();
        }else if(frontendField==="password"){
          passwordRef.current?.focus();
        }
      } else if (error instanceof Error) {
        toast(error.message, {
          position: "top-right",
          type: "error",
          theme: "colored",
        });
      } else {
        toast("Something went wrong", {
          position: "top-right",
          type: "error",
          theme: "colored",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full">
      <div className="mb-8 flex border-b border-[#D9D9D9]">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="relative flex-1 pb-3 text-sm font-medium text-[#18216B]"
        >
          Sign In
          <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#18216B]" />
        </button>
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="flex-1 pb-3 text-sm font-medium text-[#777777] transition hover:text-[#18216B]"
        >
          Create Account
        </button>
      </div>
      <div className="mb-7">
        <h2 className="text-3xl font-bold leading-tight text-[#1D1D1F]">
          {role === "admin" ? "Admin Login" : "Employee Login"}
        </h2>
        <p className="mt-3 text-sm text-[#333333]">
          {role === "admin"
            ? "Sign in to manage the organization."
            : "Sign in to access your employee account."}
        </p>
      </div>
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-[#222222]">
          Continue as
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => changeRole("employee")}
            className={`rounded border px-4 py-3 text-left ${
              role === "employee"
                ? "border-[#18216B] bg-[#F4F5FF]"
                : "border-[#D4D4D4] bg-white hover:border-[#18216B]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#222222]">
                Employee
              </span>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  role === "employee" ? "bg-[#18216B]" : "bg-[#D0D0D0]"
                }`}
              />
            </div>
            <p className="mt-1 text-xs text-[#777777]">Personal workspace</p>
          </button>
          <button
            type="button"
            onClick={() => changeRole("admin")}
            className={`rounded border px-4 py-3 text-left ${
              role === "admin"
                ? "border-[#18216B] bg-[#F4F5FF]"
                : "border-[#D4D4D4] bg-white hover:border-[#18216B]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#222222]">Admin</span>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  role === "admin" ? "bg-[#18216B]" : "bg-[#D0D0D0]"
                }`}
              />
            </div>

            <p className="mt-1 text-xs text-[#777777]">
              Organization management
            </p>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-[#222222]"
          >
            Email
          </label>

          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            value={loginInput.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={"h-11 w-full rounded border px-3"}
          />

          {error.email && (
            <p className="mt-1 text-xs text-red-500">{error.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-[#222222] "
          >
            Password
          </label>

          <div className="relative">
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={loginInput.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={"h-11 w-full rounded border px-3"}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <GoEyeClosed /> : <RxEyeOpen />}
            </button>
          </div>

          {error.password && (
            <p className="mt-1 text-xs text-red-500">{error.password}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs text-blue-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded bg-[#18216B] text-sm font-medium text-white transition hover:bg-[#121957] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </form>

      <p className="mt-4 text-center text-[16px] text-gray-500">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="text-blue-600 underline hover:text-blue-800"
        >
          Create account
        </button>
      </p>

      <p className="mt-3 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Employee Management System
      </p>
    </div>
  );
}
