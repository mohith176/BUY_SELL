import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Input,
  Button,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const registrationSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .matches(/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9]+\.)?iiit\.ac\.in$/, "Only IIIT emails allowed")
    .required("Email is required"),
  age: yup.number().min(18, "You must be at least 18").max(99, "Invalid age").required("Age is required"),
  contactNumber: yup.string().matches(/^\d{10}$/, "Must be 10 digits").required("Contact Number is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("black", "white");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registrationSchema) });
  
  const navigate = useNavigate();
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      // alert(result.message || "Registration successful!");
      if (response.ok) {
        alert(result.message || "Registration successful!");
        localStorage.setItem('token', result.token); // Store token in local storage
        navigate('/profile'); // Redirect to Profile page
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed");
    }
    setIsSubmitting(false);
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} bg={bgColor} color={textColor} boxShadow="lg" borderRadius="md">
      <Heading mb={6} textAlign="center">
        Register
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={errors.firstName}>
            <FormLabel>First Name</FormLabel>
            <Input type="text" {...register("firstName")} />
            <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.lastName}>
            <FormLabel>Last Name</FormLabel>
            <Input type="text" {...register("lastName")} />
            <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input type="email" {...register("email")} />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.age}>
            <FormLabel>Age</FormLabel>
            <Input type="number" {...register("age")} />
            <FormErrorMessage>{errors.age?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.contactNumber}>
            <FormLabel>Contact Number</FormLabel>
            <Input type="text" {...register("contactNumber")} />
            <FormErrorMessage>{errors.contactNumber?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input type="password" {...register("password")} />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="teal" width="full" isLoading={isSubmitting}>
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;
