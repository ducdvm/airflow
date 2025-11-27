import {
  Box,
  Button,
  createListCollection,
  Field,
  Grid,
  GridItem,
  Input,
  Portal,
  Select,
  VStack,
} from "@chakra-ui/react";
import { type Options, passwordStrength } from "check-password-strength";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaRegSave } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

import { PasswordInput, PasswordStrengthMeter } from "src/components/ui/password-input.tsx";
import { toaster, Toaster } from "src/components/ui/toaster.tsx";
import { useCreateUser, useUpdateUser } from "src/queries/users.ts";
import { User } from "src/types/user.ts";

type UserInfoProps = {
  isEditMode: boolean;
};

const strengthOptions: Options<string> = [
  { id: 1, value: "weak", minDiversity: 0, minLength: 0 },
  { id: 2, value: "medium", minDiversity: 2, minLength: 6 },
  { id: 3, value: "strong", minDiversity: 3, minLength: 8 },
  { id: 4, value: "very-strong", minDiversity: 4, minLength: 10 },
];

const roles = createListCollection({
  items: [
    { label: "Admin", value: "Admin" },
    { label: "Op", value: "Op" },
    { label: "User", value: "User" },
    { label: "Viewer", value: "Viewer" },
  ],
});

type UserFormValues = {
  userid: User["userid"];
  username: User["username"];
  firstName: User["firstName"];
  lastName: User["lastName"];
  email: User["email"];
  role: User["role"];
  password: User["password"];
  confirmPassword: string;
};

export const UserForm = ({ isEditMode }: UserInfoProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canChangePassword, setCanChangePassword] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { dirtyFields },
  } = useForm<UserFormValues>({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { createUser } = useCreateUser({
    onSuccess: (data) => {
      console.log("User created successfully:", data);
    },
  });

  const { updateUser } = useUpdateUser({
    onSuccess: (data) => {
      console.log("User updated successfully:", data);
    },
  });

  const password = watch("password");

  const strength = useMemo(() => {
    if (!password) return 0;
    const result = passwordStrength(password, strengthOptions);
    return result.id;
  }, [password]);

  useEffect(() => {
    if (isEditMode) {
      const userFromState = location.state as UserFormValues | undefined;
      if (userFromState) {
        Object.entries(userFromState).forEach(([key, value]) => {
          setValue(key as keyof UserFormValues, value);
        });
      } else {
        console.warn("No user data found in navigation state");
        navigate("/users");
      }
    }
  }, [isEditMode, location.state, navigate, setValue]);

  const onSubmit = async (user: UserFormValues): Promise<void> => {
    // edit mode
    const finalUser = {
      ...user,
      role: user.role || "Viewer", // fallback role
    };
    if (isEditMode) {
      // remove confirmPassword from changedValues
      const changedValues = (
        Object.keys(dirtyFields).filter((key) => key != "confirmPassword") as (keyof Omit<
          UserFormValues,
          "confirmPassword"
        >)[]
      ).reduce((acc, key) => {
        acc[key] = user[key];
        return acc;
      }, {} as Partial<UserFormValues>);

      const promise = updateUser(user.userid!, changedValues);

      toaster.promise(promise, {
        success: {
          title: "Successfully updated!",
          description: "User has been updated successfully.",
          duration: 2000,
        },
        error: (err: unknown) => {
          let message = "Unknown error";
          console.log(err)
          if (err instanceof Error) {
            message = err.message;
          } else if (typeof err === "string") {
            message = err;
          } else if (typeof err === "object" && err !== null) {
            message = (err as any).message ?? message;
          }

          if (message === "username") {
            message = `Username ${finalUser.username} already exists!`;
          } else {
            message = `Email ${finalUser.email} already exists!`;
          }
          return {
            title: "Upload failed",
            description: message,
          };
        },
        loading: {
          title: "Updating...",
          description: "Please wait",
        },
      });

      const result = await promise;

      if (result.errorCode) {
        return;
      }

      setTimeout(() => {
        navigate("/users");
      }, 1000);

      return;
    }

    // create mode
    const promise = createUser({
      username: finalUser.username,
      email: finalUser.email,
      first_name: finalUser.firstName,
      last_name: finalUser.lastName,
      enabled: true,
      email_verified: false,
      role: finalUser.role,
      password: finalUser.password,
    });

    toaster.promise(promise, {
      success: {
        title: "Successfully uploaded!",
        description: "User has been created successfully.",
      },
      error: (err: unknown) => {
        let message = "Unknown error";
        console.log(err)
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        } else if (typeof err === "object" && err !== null) {
          message = (err as any).message ?? message;
        }

        if (message === "username") {
          message = `Username ${finalUser.username} already exists!`;
        } else {
          message = `Email ${finalUser.email} already exists!`;
        }
        return {
          title: "Upload failed",
          description: message,
        };
      },
      loading: {
        title: "Uploading...",
        description: "Please wait",
      },
    });

    const result = await promise;

    if (result.errorCode) {
      return;
    }

    const data = result.data;

    setTimeout(() => {
      navigate("/users", {
        state: {
          newUser: data,
        },
      });
    }, 1000);
  };

  const toggleChangePassword = () => setCanChangePassword((prev) => !prev);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack w="full" align="stretch">
        <Box borderColor="border.disabled" borderRadius={10} borderWidth={2} mb={5} p={4}>
          <Grid templateColumns="repeat(4, 1fr)" gap="6">
            {/* First Name */}
            <GridItem colSpan={1}>
              <Field.Root required>
                <Field.Label>
                  First Name <Field.RequiredIndicator />
                </Field.Label>
              </Field.Root>
            </GridItem>
            <GridItem colSpan={3}>
              <Controller
                control={control}
                name="firstName"
                rules={{ required: true }}
                render={({ field }) => (
                  <Field.Root required>
                    <Input placeholder="First name" {...field} />
                  </Field.Root>
                )}
              />
            </GridItem>

            {/* Last Name */}
            <GridItem colSpan={1}>
              <Field.Root required>
                <Field.Label>
                  Last Name <Field.RequiredIndicator />
                </Field.Label>
              </Field.Root>
            </GridItem>
            <GridItem colSpan={3}>
              <Controller
                control={control}
                name="lastName"
                rules={{ required: true }}
                render={({ field }) => (
                  <Field.Root required>
                    <Input placeholder="Last name" {...field} />
                  </Field.Root>
                )}
              />
            </GridItem>

            {/* Username */}
            <GridItem colSpan={1}>
              <Field.Root required>
                <Field.Label>
                  Username <Field.RequiredIndicator />
                </Field.Label>
              </Field.Root>
            </GridItem>
            <GridItem colSpan={3}>
              <Controller
                control={control}
                name="username"
                rules={{
                  required: true,
                  minLength: { value: 3, message: "Username must be at least 3 characters" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Field.Root required invalid={!!error} disabled={isEditMode}>
                    <Input placeholder="Username" autoComplete={"new-password"} {...field} />
                    <Field.HelperText>Username cannot be changed once created</Field.HelperText>
                    {error && <Field.ErrorText>{error.message}</Field.ErrorText>}
                  </Field.Root>
                )}
              />
            </GridItem>

            {/* Email */}
            <GridItem colSpan={1}>
              <Field.Root required>
                <Field.Label>
                  Email <Field.RequiredIndicator />
                </Field.Label>
              </Field.Root>
            </GridItem>
            <GridItem colSpan={3}>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: true,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                }}
                render={({ field, fieldState }) => (
                  <Field.Root required invalid={!!fieldState.error}>
                    <Input type="email" placeholder="Email" autoComplete={"new-password"} {...field} />
                    {fieldState.error && <Field.ErrorText>{fieldState.error.message}</Field.ErrorText>}
                  </Field.Root>
                )}
              />
            </GridItem>

            {/* Role */}
            <GridItem colSpan={1}>
              <Field.Root>
                <Field.Label>Role</Field.Label>
              </Field.Root>
            </GridItem>
            <GridItem colSpan={3}>
              <Controller
                control={control}
                name="role"
                rules={{ required: false }}
                render={({ field }) => (
                  <Field.Root>
                    <Select.Root
                      collection={roles}
                      value={field.value ? [field.value] : []}
                      onValueChange={(details) => field.onChange(details.value[0])}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Select role" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.ClearTrigger />
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>

                      <Portal>
                        <Select.Positioner>
                          <Select.Content>
                            {roles.items.map((r) => (
                              <Select.Item item={r} key={r.value}>
                                {r.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                    <Field.HelperText>
                      The user's role for this application, associated with a list of permissions. If not
                      selected, role is automatically set to Viewer.
                    </Field.HelperText>
                  </Field.Root>
                )}
              />
            </GridItem>

            {/* Password Fields */}
            {isEditMode && (
              <GridItem colSpan={4}>
                <Button
                  size="sm"
                  variant={canChangePassword ? "subtle" : "solid"}
                  colorPalette={"orange"}
                  onClick={toggleChangePassword}
                >
                  Reset Password
                </Button>
              </GridItem>
            )}

            {/* password fields appear only on user creation or when an admin edits a user’s password */}
            {(!isEditMode || canChangePassword) && (
              <>
                {/* Password */}
                <GridItem colSpan={1}>
                  <Field.Root required>
                    <Field.Label>
                      Password <Field.RequiredIndicator />
                    </Field.Label>
                  </Field.Root>
                </GridItem>
                <GridItem colSpan={3}>
                  <Controller
                    control={control}
                    name="password"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Field.Root required>
                        <PasswordInput {...field} placeholder="Enter your password" />
                        <PasswordStrengthMeter value={strength} />
                        <Field.HelperText>Password for authentication.</Field.HelperText>
                      </Field.Root>
                    )}
                  />
                </GridItem>

                {/* Confirm Password */}
                <GridItem colSpan={1}>
                  <Field.Root required>
                    <Field.Label>
                      Confirm Password <Field.RequiredIndicator />
                    </Field.Label>
                  </Field.Root>
                </GridItem>
                <GridItem colSpan={3}>
                  <Controller
                    control={control}
                    name={"confirmPassword"}
                    rules={{
                      required: "Confirmation password is required",
                      validate: {
                        matchesPassword: (value) => {
                          return value === password || "Passwords do not match";
                        },
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Field.Root required invalid={!!error}>
                        <Input type="password" {...field} placeholder="Confirm password" />
                        {!error && (
                          <Field.HelperText>Rewrite the password for confirmation.</Field.HelperText>
                        )}
                        {error && <Field.ErrorText>{error.message}</Field.ErrorText>}
                      </Field.Root>
                    )}
                  />
                </GridItem>
              </>
            )}
          </Grid>
        </Box>

        <Box gap={2} display="flex">
          <Button size="sm" colorPalette="brand" type="submit">
            Save <FaRegSave />
          </Button>
          <Button size="sm" colorPalette="red" onClick={() => navigate("/users")} type="button">
            <IoMdArrowBack />
          </Button>
        </Box>
        <Toaster />
      </VStack>
    </form>
  );
};
