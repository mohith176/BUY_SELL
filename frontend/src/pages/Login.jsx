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

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("black", "white");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();


  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      // alert(result.message || "Login successful!");
      if (response.ok) {
        alert(result.message || "Login successful!");
        localStorage.setItem('token', result.token); // Store token in local storage
        navigate('/profile'); // Redirect to Profile page
      } else {
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed");
    }
    setIsSubmitting(false);
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} bg={bgColor} color={textColor} boxShadow="lg" borderRadius="md">
      <Heading mb={6} textAlign="center">
        Login
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input type="email" {...register("email", { required: "Email is required" })} />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input type="password" {...register("password", { required: "Password is required" })} />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="teal" width="full" isLoading={isSubmitting}>
            Login
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
