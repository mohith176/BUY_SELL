import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text, Spinner, VStack, HStack, Heading, Divider, Badge, Flex, Button, useToast } from '@chakra-ui/react';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchItem = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      const response = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setItem(data);
      setLoading(false);
    };

    fetchItem();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const response = await fetch('http://localhost:5000/api/users/cart/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in Authorization header
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ itemId: id })
    });

    const data = await response.json();
    if (response.ok) {
      toast({
        title: 'Item added to cart',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error adding item to cart',
        description: data.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6} mt={10} maxW="800px" mx="auto" bg="white" borderRadius="md" boxShadow="lg">
      {item && (
        <VStack spacing={6} align="start">
          <Heading as="h1" size="2xl" color="teal.500">{item.name}</Heading>
          <Divider />
          <HStack spacing={6} align="start">
            <VStack align="start" spacing={4}>
              <Text fontSize="2xl" fontWeight="bold" color="gray.700">Price: ${item.price}</Text>
              <Badge colorScheme="teal" fontSize="lg">{item.category}</Badge>
              <Text fontSize="lg" color="gray.600">Seller: {item.sellerId.firstName} {item.sellerId.lastName}</Text>
            </VStack>
          </HStack>
          <Divider />
          <Text fontSize="md" color="gray.600">{item.description}</Text>
          <Button colorScheme="teal" onClick={handleAddToCart}>Add to Cart</Button>
        </VStack>
      )}
    </Box>
  );
};

export default ItemDetails;