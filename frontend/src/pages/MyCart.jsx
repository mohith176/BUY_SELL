import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Text, 
  VStack, 
  HStack,
  Spinner, 
  Heading, 
  Flex, 
  Button, 
  useToast, 
  useColorModeValue,
  Container,
  Card,
  CardBody,
  Badge,
  Divider,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Image,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { DeleteIcon, StarIcon } from '@chakra-ui/icons';

const MyCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const toast = useToast();
    
    // Theme colors
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:5000/api/users/cart/get', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setCartItems(data);
            } catch (error) {
                toast({
                    title: 'Error fetching cart items',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
            setLoading(false);
        };

        fetchCartItems();
    }, [toast]);

    const handleRemoveItem = async (itemId) => {
        const token = localStorage.getItem('token');
        try {
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
                // Update cart items locally instead of reloading
                setCartItems(prev => prev.filter(item => item._id !== itemId));
                toast({
                    title: 'Item removed from cart',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error removing item from cart',
                    description: data.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error removing item',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            toast({
                title: 'Cart is empty',
                description: 'Add some items to your cart before placing an order',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setPlacingOrder(true);
        const token = localStorage.getItem('token');
        
        try {
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
                    title: 'Order placed successfully! 🎉',
                    description: `Your OTPs: ${otps}`,
                    status: 'success',
                    duration: 5000,
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
        } catch (error) {
            toast({
                title: 'Error placing order',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
        setPlacingOrder(false);
    };

    // Calculate total cost
    const totalCost = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

    if (loading) {
        return (
            <Box bg={bgColor} minH="100vh" py={10}>
                <Flex justify="center" align="center" height="60vh">
                    <VStack spacing={4}>
                        <Spinner size="xl" color="teal.500" thickness="4px" />
                        <Text color={textColor}>Loading your cart...</Text>
                    </VStack>
                </Flex>
            </Box>
        );
    }

    return (
        <Box bg={bgColor} minH="100vh" py={10}>
            <Container maxW="6xl">
                <VStack spacing={8} align="stretch">
                    {/* Header */}
                    <Box textAlign="center">
                        <HStack justify="center" mb={2}>
                            <Text fontSize="4xl">🛒</Text>
                            <Heading as="h1" size="2xl" color="teal.500">
                                My Shopping Cart
                            </Heading>
                        </HStack>
                        <Text color={mutedTextColor} fontSize="lg">
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                        </Text>
                    </Box>

                    {cartItems.length === 0 ? (
                        // Empty cart state
                        <Card bg={cardBg} shadow="lg" borderRadius="xl">
                            <CardBody py={16}>
                                <VStack spacing={6}>
                                    <Text fontSize="6xl">🛒</Text>
                                    <VStack spacing={2}>
                                        <Heading size="lg" color={textColor}>Your cart is empty</Heading>
                                        <Text color={mutedTextColor} textAlign="center">
                                            Looks like you haven't added any items to your cart yet.
                                            Start browsing to find something you like!
                                        </Text>
                                    </VStack>
                                    <Button 
                                        colorScheme="teal" 
                                        size="lg"
                                        onClick={() => window.location.href = '/search'}
                                    >
                                        Start Shopping
                                    </Button>
                                </VStack>
                            </CardBody>
                        </Card>
                    ) : (
                        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
                            {/* Cart Items */}
                            <GridItem>
                                <VStack spacing={4} align="stretch">
                                    <Heading size="md" color={textColor}>Cart Items</Heading>
                                    {cartItems.map((item, index) => (
                                        <Card key={`${item._id}-${index}`} bg={cardBg} shadow="md" borderRadius="lg">
                                            <CardBody>
                                                <Grid templateColumns="1fr auto" gap={4} alignItems="center">
                                                    <VStack align="start" spacing={2}>
                                                        <Heading size="md" color={textColor} noOfLines={1}>
                                                            {item.name}
                                                        </Heading>
                                                        <Badge colorScheme="teal" variant="subtle" borderRadius="full" px={2}>
                                                            {item.category}
                                                        </Badge>
                                                        <Text color={mutedTextColor} fontSize="sm" noOfLines={2}>
                                                            {item.description}
                                                        </Text>
                                                        <Text fontSize="xl" fontWeight="bold" color="teal.500">
                                                            ${item.price}
                                                        </Text>
                                                    </VStack>
                                                    <Button
                                                        colorScheme="red"
                                                        variant="ghost"
                                                        size="sm"
                                                        leftIcon={<DeleteIcon />}
                                                        onClick={() => handleRemoveItem(item._id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Grid>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </VStack>
                            </GridItem>

                            {/* Order Summary */}
                            <GridItem>
                                <Card bg={cardBg} shadow="lg" borderRadius="xl" position="sticky" top="20px">
                                    <CardBody>
                                        <VStack spacing={6} align="stretch">
                                            <Heading size="md" color={textColor}>Order Summary</Heading>
                                            
                                            <VStack spacing={3} align="stretch">
                                                <HStack justify="space-between">
                                                    <Text color={mutedTextColor}>
                                                        Items ({cartItems.length})
                                                    </Text>
                                                    <Text color={textColor}>${totalCost.toFixed(2)}</Text>
                                                </HStack>
                                                
                                                <Divider borderColor={borderColor} />
                                                
                                                <HStack justify="space-between">
                                                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                                                        Total
                                                    </Text>
                                                    <Text fontSize="xl" fontWeight="bold" color="teal.500">
                                                        ${totalCost.toFixed(2)}
                                                    </Text>
                                                </HStack>
                                            </VStack>

                                            <Alert status="info" borderRadius="lg" variant="subtle">
                                                <AlertIcon />
                                                <Box>
                                                    <AlertTitle fontSize="sm">OTP Delivery!</AlertTitle>
                                                    <AlertDescription fontSize="sm">
                                                        You'll receive OTPs for each item after placing the order.
                                                    </AlertDescription>
                                                </Box>
                                            </Alert>

                                            <Button
                                                colorScheme="teal"
                                                size="lg"
                                                w="full"
                                                onClick={handlePlaceOrder}
                                                isLoading={placingOrder}
                                                loadingText="Placing Order..."
                                                isDisabled={cartItems.length === 0}
                                            >
                                                Place Order
                                            </Button>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            </GridItem>
                        </Grid>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default MyCart;