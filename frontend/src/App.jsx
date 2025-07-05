import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Box, Button, HStack, IconButton, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyCart from "./pages/MyCart";
import DeliverItems from "./pages/DeliverItems";
import History from "./pages/History";
import SearchItems from "./pages/SearchItems";
import SellItem from "./pages/SellItem";
import RedirectWrapper from "./RedirectWrapper";
import ProtectedRoute from "./components/ProtectedRoute";
import ItemDetails from "./pages/ItemDetails";


const App = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <RedirectWrapper>
      <Box textAlign="center" mt={5} p={4}>
        <HStack justify="center" spacing={4} mb={6}>
        <Button as={Link} to="/">Home</Button>
          <Button as={Link} to="/login">Login</Button>
          <Button as={Link} to="/create">Register</Button>
          <IconButton icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} onClick={toggleColorMode} />
        </HStack>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Register />} />

          {/* Protected Routes with Navbar */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><MyCart /></ProtectedRoute>} />
          <Route path="/deliver" element={<ProtectedRoute><DeliverItems /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchItems /></ProtectedRoute>} />
          <Route path="/sell" element={<ProtectedRoute><SellItem /></ProtectedRoute>} />
          <Route path="/items/:id" element={<ProtectedRoute><ItemDetails /></ProtectedRoute>} />
        </Routes>
      </Box>
    </RedirectWrapper>
  );
};

export default App;
