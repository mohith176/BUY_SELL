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
  Input, 
  useToast, 
  useColorModeValue,
  Container,
  Card,
  CardBody,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Grid,
  GridItem,
  Icon,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { LockIcon, CheckIcon, TimeIcon } from '@chakra-ui/icons';

const DeliverItems = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otps, setOtps] = useState({});
  const [processingOrders, setProcessingOrders] = useState({});
  const toast = useToast();
  
  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/users/orders/seller', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          const errorData = await response.json();
          toast({
            title: 'Error fetching orders',
            description: errorData.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: 'Error fetching orders',
          description: 'Network error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      setLoading(false);
    };

    fetchOrders();
  }, [toast]);

  const handleOtpChange = (orderId, value) => {
    setOtps(prevOtps => ({ ...prevOtps, [orderId]: value }));
  };

  const handleCloseTransaction = async (orderId) => {
    const otp = otps[orderId];
    
    if (!otp || otp.trim() === '') {
      toast({
        title: 'OTP Required',
        description: 'Please enter the OTP before closing the transaction',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setProcessingOrders(prev => ({ ...prev, [orderId]: true }));
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/users/orders/close', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, otp })
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(orders.filter(order => order._id !== orderId));
        setOtps(prev => {
          const newOtps = { ...prev };
          delete newOtps[orderId];
          return newOtps;
        });
        toast({
          title: 'Transaction completed! ✅',
          description: 'The item has been successfully delivered',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Refresh pending orders in History page
        window.dispatchEvent(new Event('refreshPendingOrders'));
      } else {
        toast({
          title: 'Error closing transaction',
          description: data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error closing transaction',
        description: 'Network error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    
    setProcessingOrders(prev => ({ ...prev, [orderId]: false }));
  };

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" py={10}>
        <Flex justify="center" align="center" height="60vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="teal.500" thickness="4px" />
            <Text color={textColor}>Loading your orders...</Text>
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
              <Icon as={CheckIcon} w={8} h={8} color="teal.500" />
              <Heading as="h1" size="2xl" color="teal.500">
                Deliver Items
              </Heading>
            </HStack>
            <Text color={mutedTextColor} fontSize="lg">
              {orders.length} pending {orders.length === 1 ? 'delivery' : 'deliveries'}
            </Text>
          </Box>

          {/* Info Alert */}
          <Alert status="info" borderRadius="lg" variant="subtle">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm">OTP Verification Required</AlertTitle>
              <AlertDescription fontSize="sm">
                Buyers will provide you with an OTP when collecting their items. Enter the OTP to complete the transaction.
              </AlertDescription>
            </Box>
          </Alert>

          {orders.length === 0 ? (
            // Empty state
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody py={16}>
                <VStack spacing={6}>
                  <Icon as={TimeIcon} w={16} h={16} color="gray.400" />
                  <VStack spacing={2}>
                    <Heading size="lg" color={textColor}>No pending deliveries</Heading>
                    <Text color={mutedTextColor} textAlign="center">
                      You don't have any items waiting for delivery at the moment.
                      When customers place orders for your items, they'll appear here.
                    </Text>
                  </VStack>
                  <Button 
                    colorScheme="teal" 
                    size="lg"
                    onClick={() => window.location.href = '/sell'}
                  >
                    Sell More Items
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            // Orders list
            <VStack spacing={6} align="stretch">
              {orders.map((order) => (
                <Card key={order._id} bg={cardBg} shadow="md" borderRadius="lg">
                  <CardBody>
                    <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
                      {/* Order Details */}
                      <GridItem>
                        <VStack align="start" spacing={4}>
                          <HStack spacing={3}>
                            <Heading size="md" color={textColor} noOfLines={1}>
                              {order.itemId.name}
                            </Heading>
                            <Badge colorScheme="orange" variant="subtle" borderRadius="full" px={2}>
                              Pending Delivery
                            </Badge>
                          </HStack>
                          
                          <VStack align="start" spacing={2} w="full">
                            <HStack justify="space-between" w="full">
                              <Text color={mutedTextColor} fontSize="sm">Price:</Text>
                              <Text fontWeight="bold" color="teal.500" fontSize="lg">
                                ${order.itemId.price}
                              </Text>
                            </HStack>
                            
                            <HStack justify="space-between" w="full">
                              <Text color={mutedTextColor} fontSize="sm">Buyer:</Text>
                              <Text color={textColor} fontWeight="medium">
                                {order.buyerId.firstName} {order.buyerId.lastName}
                              </Text>
                            </HStack>
                            
                            <HStack justify="space-between" w="full">
                              <Text color={mutedTextColor} fontSize="sm">Order Date:</Text>
                              <Text color={textColor} fontSize="sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </Text>
                            </HStack>
                          </VStack>
                        </VStack>
                      </GridItem>

                      {/* OTP Section */}
                      <GridItem>
                        <VStack spacing={4} align="stretch">
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="bold" color={textColor}>
                              Enter OTP from Buyer
                            </FormLabel>
                            <InputGroup>
                              <InputLeftElement>
                                <Icon as={LockIcon} color="gray.400" />
                              </InputLeftElement>
                              <Input
                                placeholder="Enter 8-digit OTP"
                                value={otps[order._id] || ''}
                                onChange={(e) => handleOtpChange(order._id, e.target.value)}
                                maxLength={8}
                                focusBorderColor="teal.400"
                                bg={useColorModeValue('white', 'gray.700')}
                              />
                            </InputGroup>
                          </FormControl>
                          
                          <Button
                            colorScheme="teal"
                            size="lg"
                            w="full"
                            onClick={() => handleCloseTransaction(order._id)}
                            isLoading={processingOrders[order._id]}
                            loadingText="Processing..."
                            leftIcon={<CheckIcon />}
                            isDisabled={!otps[order._id] || otps[order._id].trim() === ''}
                          >
                            Complete Delivery
                          </Button>
                        </VStack>
                      </GridItem>
                    </Grid>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default DeliverItems;