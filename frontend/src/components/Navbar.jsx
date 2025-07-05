import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, HStack } from "@chakra-ui/react";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    navigate("/login"); // Redirect to login
  };

  return (
    <Box bg="gray.800" p={4} color="white">
      <HStack spacing={4} justify="center">
        <Button as={Link} to="/profile" colorScheme="teal">
          Profile
        </Button>
        <Button as={Link} to="/sell" colorScheme="teal">
          Sell Item
        </Button>
        <Button as={Link} to="/cart" colorScheme="teal">
          My Cart
        </Button>
        <Button as={Link} to="/deliver" colorScheme="teal">
          Deliver Items
        </Button>
        <Button as={Link} to="/history" colorScheme="teal">
          History
        </Button>
        <Button as={Link} to="/search" colorScheme="teal">
          Search Items
        </Button>
        <Button onClick={handleLogout} colorScheme="red">
          Logout
        </Button>
      </HStack>
    </Box>
  );
};

export default Navbar;
