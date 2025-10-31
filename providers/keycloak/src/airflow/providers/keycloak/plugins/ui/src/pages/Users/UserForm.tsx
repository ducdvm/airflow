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
import { useForm, Controller } from "react-hook-form";
import { FaRegSave } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

import { PasswordInput, PasswordStrengthMeter } from "src/components/ui/password-input.tsx";
import { toaster, Toaster } from "src/components/ui/toaster.tsx";
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

export const UserForm = ({ isEditMode }: UserInfoProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canChangePassword, setCanChangePassword] = useState<boolean>(false);

  const { control, handleSubmit, setValue, watch } = useForm<User>({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      password: "",
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
      const userFromState = location.state as User | undefined;
      if (userFromState) {
        Object.entries(userFromState).forEach(([key, value]) => {
          setValue(key as keyof User, value);
        });
      } else {
        console.warn("No user data found in navigation state");
        navigate("/users");
      }
    }
  }, [isEditMode, location.state, navigate, setValue]);

  const checkPasswordConfirmation = (ps1: string | undefined, ps2: string | undefined) => {
    if (!ps1 && !ps2) return false;
    if (!ps1 || !ps2 || ps1 !== ps2) {
      toaster.error({
        title: "Password mismatch",
        description: "Passwords do not match.",
        duration: 3000,
      });
      return false;
    }
    return true;
  };

  const onSubmit = async (user: User): Promise<void> => {
    const passwordFilled = (): boolean => {
      if (!isEditMode || canChangePassword) return !!user.password;
      return true;
    };

    if (
      !user.username ||
      !user.firstName ||
      !user.lastName ||
      !user.email ||
      !user.role ||
      !passwordFilled()
    ) {
      toaster.error({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        duration: 3000,
      });
      return;
    }

    const promise = new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000);
      // your logic here
    });

    toaster.promise(promise, {
      success: {
        title: "Successfully uploaded!",
        description: "Looks great",
        duration: 5000,
      },
      error: {
        title: "Upload failed",
        description: "Something's wrong with the upload",
      },
      loading: {
        title: "Uploading...",
        description: "Please wait",
      },
    });

    console.log("User info:", user);
  };

  const toggleChangePassword = () => setCanChangePassword((prev) => !prev);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack w="full" align="stretch">
        <Box borderWidth="1px" borderColor="border.disabled" borderRadius="md" p={4}>
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
                rules={{ required: true }}
                render={({ field }) => (
                  <Field.Root required>
                    <Input placeholder="Username" {...field} />
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
                rules={{ required: true }}
                render={({ field }) => (
                  <Field.Root required>
                    <Input type="email" placeholder="Email" {...field} />
                  </Field.Root>
                )}
              />
            </GridItem>

            {/* Role */}
            <GridItem colSpan={1}>
              <Field.Root>
                <Field.Label>
                  Role <Field.RequiredIndicator />
                </Field.Label>
              </Field.Root>
            </GridItem>
            <GridItem colSpan={3}>
              <Controller
                control={control}
                name="role"
                rules={{ required: true }}
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
                      The user's role for this application, associated with a list of permissions.
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
                    name="password"
                    render={({ field }) => (
                      <Field.Root required>
                        <Input
                          type="password"
                          onBlur={(e) => {
                            if (checkPasswordConfirmation(password, e.target.value))
                              field.onChange(e.target.value);
                          }}
                        />
                        <Field.HelperText>Rewrite the password for confirmation.</Field.HelperText>
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
