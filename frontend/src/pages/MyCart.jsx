import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Spinner, Heading, Flex, Button, useToast, useColorModeValue } from '@chakra-ui/react';

const MyCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
    const cardBgColor = useColorModeValue('gray.100', 'gray.700');
    const boxBgColor = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/cart/get', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setCartItems(data);
            setLoading(false);
        };

        fetchCartItems();
    }, []);

    const handleRemoveItem = async (itemId) => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/cart/remove', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemId })
        });

        const data = await response.json();
        if (response.ok) {

            setCartItems(data.cartItems);
            toast({
                title: 'Item removed from cart',
                status: 'success',
                duration: 3000,
                isClosable: true,
            }

            );
            window.location.reload();

        } else {
            toast({
                title: 'Error removing item from cart',
                description: data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handlePlaceOrder = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/cart/order', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (response.ok) {
            setCartItems([]);
            const otps = data.orders.map(order => order.otp).join(', ');
            toast({
                title: 'Order placed successfully',
                description: `Your OTPs: ${otps}`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Error placing order',
                description: data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Calculate total cost directly
    const totalCost = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

    if (loading) {
        return (
            <Flex justify="center" align="center" height="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return (
        <Box p={6} mt={10} maxW="800px" mx="auto" bg={boxBgColor} borderRadius="md" boxShadow="lg">
            <Heading as="h1" size="2xl" color="teal.500">My Cart</Heading>
            <VStack spacing={6} align="start" mt={6}>
                {cartItems.map((item, index) => (
                    <Box key={`${item._id}-${index}`} p={4} borderWidth="1px" borderRadius="md" w="100%" bg={cardBgColor}>
                        <Text fontSize="xl" color={textColor}>{item.name}</Text>
                        <Text color={textColor}>Price: ${item.price} </Text>
                        <Button colorScheme="red" onClick={() => handleRemoveItem(item._id)}>Remove</Button>
                    </Box>
                ))}
            </VStack>
            <Text fontSize="2xl" mt={6} color={textColor}>Total Cost: ${totalCost.toFixed(2)}</Text>
            <Button colorScheme="teal" mt={4} onClick={handlePlaceOrder}>Final Order</Button>
        </Box>
    );
};

export default MyCart;

