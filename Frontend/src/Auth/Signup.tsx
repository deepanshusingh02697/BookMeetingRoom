import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoEyeClosed } from "react-icons/go";
import { RxEyeOpen } from "react-icons/rx";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { CombinedGraphQLErrors } from "@apollo/client";
import type { SignUp_Interface } from "../graphql/Client";
import { signUpUser_Mutation } from "../graphql/Mutation";

type SignupInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
type SignupError = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupInput, setSignupInput] = useState<SignupInput>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<SignupError>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [SignupUser] = useMutation<SignUp_Interface>(signUpUser_Mutation);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignupInput((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateSignup = () => {
    const errors: SignupError = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;
    const firstName = signupInput.firstName.trim();
    const lastName = signupInput.lastName.trim();
    const email = signupInput.email.trim();
    const password = signupInput.password;
    const confirmPassword = signupInput.confirmPassword;

    if (!firstName) {
      errors.firstName = "First name is required";
      isValid = false;
    } else if (firstName.length < 2) {
      errors.firstName = "First name must be at least two characters long";
      isValid = false;
    } else if (firstName.length > 30) {
      errors.firstName = "First name cannot exceed 30 characters";
      isValid = false;
    } else if (!/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/.test(firstName)) {
      errors.firstName =
        "First name can only contain letters, spaces and hyphens (-)";
      isValid = false;
    }
    if (!lastName) {
      errors.lastName = "Last name is required";
      isValid = false;
    } else if (lastName.length < 2) {
      errors.lastName = "Last name must be at least two characters long";
      isValid = false;
    } else if (lastName.length > 30) {
      errors.lastName = "Last name cannot exceed 30 characters";
      isValid = false;
    } else if (!/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/.test(lastName)) {
      errors.lastName =
        "Last name can only contain letters, spaces and hyphens (-)";
      isValid = false;
    }
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = "Enter a valid email address";
      isValid = false;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

    if (!password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be at least 8 characters and contain uppercase, lowercase, number and special character";
      isValid = false;
    }
    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    setError(errors);
    if (!isValid) {
      if (errors.firstName) {
        firstNameRef.current?.focus();
      } else if (errors.lastName) {
        lastNameRef.current?.focus();
      } else if (errors.email) {
        emailRef.current?.focus();
      } else if (errors.password) {
        passwordRef.current?.focus();
      } else if (errors.confirmPassword) {
        confirmPasswordRef.current?.focus();
      }
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateSignup()) return;

    setLoading(true);

    try {
      const variables = {
        firstname: signupInput.firstName.trim(),
        lastname: signupInput.lastName.trim(),
        email: signupInput.email.trim().toLowerCase(),
        password: signupInput.password,
      };

      const response = await SignupUser({
        variables,
      });

      if (response.data?.SignUp?.success) {
        toast(response.data?.SignUp?.msg, {
          position: "top-right",
          type: "success",
          theme: "colored",
        });

        setSignupInput({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/login");
      } else {
        toast(response.data?.SignUp.msg || "Registration failed", {
          position: "top-right",
          type: "warning",
          theme: "colored",
        });
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
        const fieldMap: Record<string, keyof SignupError> = {
          firstname: "firstName",
          lastname: "lastName",
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
        if (frontendField === "firstName") {
          firstNameRef.current?.focus();
        } else if (frontendField === "lastName") {
          lastNameRef.current?.focus();
        } else if (frontendField === "email") {
          emailRef.current?.focus();
        } else if (frontendField === "password") {
          passwordRef.current?.focus();
        }
      } else if (error instanceof Error) {
        toast(error.message, {
          position: "top-right",
          type: "error",
        });
      } else {
        toast("Something went wrong.", {
          position: "top-right",
          type: "error",
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
          onClick={() => navigate("/login?role=employee")}
          className="flex-1 pb-3 text-sm font-medium text-[#777777] transition hover:text-[#18216B]"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="relative flex-1 pb-3 text-sm font-medium text-[#18216B]"
        >
          Create Account
          <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#18216B]" />
        </button>
      </div>

      <div className="mb-7">
        <h2 className="text-3xl font-bold leading-tight text-[#1D1D1F]">
          Employee Register
        </h2>

        <p className="mt-3 text-sm text-[#333333]">
          Create your employee account to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            ref={firstNameRef}
            name="firstName"
            type="text"
            value={signupInput.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className={"h-11 w-full rounded border px-3"}
          />
          {error.firstName && (
            <p className="mt-1 text-xs text-red-500">{error.firstName}</p>
          )}
        </div>

        <div>
          <input
            ref={lastNameRef}
            name="lastName"
            type="text"
            value={signupInput.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className={"h-11 w-full rounded border px-3"}
          />
          {error.lastName && (
            <p className="mt-1 text-xs text-red-500">{error.lastName}</p>
          )}
        </div>

        <div>
          <input
            ref={emailRef}
            name="email"
            type="email"
            value={signupInput.email}
            onChange={handleChange}
            placeholder="Email"
            className={"h-11 w-full rounded border px-3"}
          />
          {error.email && (
            <p className="mt-1 text-xs text-red-500">{error.email}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              ref={passwordRef}
              name="password"
              type={showPassword ? "text" : "password"}
              value={signupInput.password}
              onChange={handleChange}
              placeholder="Password"
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

        <div>
          <div className="relative">
            <input
              ref={confirmPasswordRef}
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={signupInput.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={"h-11 w-full rounded border px-3"}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <GoEyeClosed /> : <RxEyeOpen />}
            </button>
          </div>

          {error.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{error.confirmPassword}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 w-full rounded bg-[#18216B] text-sm font-medium text-white transition hover:bg-[#121957] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "REGISTERING..." : "REGISTER"}
        </button>
      </form>

      <p className="mt-4 text-center text-[16px] text-[#222222]">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login?role=employee")}
          className="text-blue-600 underline hover:text-blue-800"
        >
          Login
        </button>
      </p>

      <p className="mt-3 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Room Meeting Intelligence
      </p>
    </div>
  );
}
