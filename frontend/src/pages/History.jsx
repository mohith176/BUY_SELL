import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Spinner, Heading, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, useToast, useColorModeValue } from '@chakra-ui/react';

const History = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const cardBgColor = useColorModeValue('gray.100', 'gray.700');
  const boxBgColor = useColorModeValue('white', 'gray.800');

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');

    try {
      const [pendingResponse, boughtResponse, soldResponse] = await Promise.all([
        fetch('http://localhost:5000/api/users/orders/pending', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:5000/api/users/orders/bought', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:5000/api/users/orders/sold', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (pendingResponse.ok && boughtResponse.ok && soldResponse.ok) {
        const pendingData = await pendingResponse.json();
        const boughtData = await boughtResponse.json();
        const soldData = await soldResponse.json();

        setPendingOrders(pendingData);
        setBoughtItems(boughtData);
        setSoldItems(soldData);
      } else {
        toast({
          title: 'Error fetching history',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error fetching history',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();

    const handleRefreshPendingOrders = () => {
      fetchHistory();
    };

    window.addEventListener('refreshPendingOrders', handleRefreshPendingOrders);

    return () => {
      window.removeEventListener('refreshPendingOrders', handleRefreshPendingOrders);
    };
  }, [toast]);

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6} mt={10} maxW="800px" mx="auto" bg={boxBgColor} borderRadius="md" boxShadow="lg">
      <Heading as="h1" size="2xl" color="teal.500">History</Heading>
      <Tabs mt={6} variant="enclosed">
        <TabList>
          <Tab>Pending Orders</Tab>
          <Tab>Bought Items</Tab>
          <Tab>Sold Items</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={6} align="start">
              {pendingOrders.map(order => (
                <Box key={order._id} p={4} borderWidth="1px" borderRadius="md" w="100%" bg={cardBgColor}>
                  <Text fontSize="xl" color={textColor}>Item: {order.itemId.name}</Text>
                  <Text color={textColor}>Price: ${order.itemId.price}</Text>
                  <Text color={textColor}>Seller: {order.sellerId.firstName} {order.sellerId.lastName}</Text>
                  <Text color={textColor}>OTP: {order.otp}</Text>
                </Box>
              ))}
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={6} align="start">
              {boughtItems.map(order => (
                <Box key={order._id} p={4} borderWidth="1px" borderRadius="md" w="100%" bg={cardBgColor}>
                  <Text fontSize="xl" color={textColor}>Item: {order.itemId.name}</Text>
                  <Text color={textColor}>Price: ${order.itemId.price}</Text>
                  <Text color={textColor}>Seller: {order.sellerId.firstName} {order.sellerId.lastName}</Text>
                </Box>
              ))}
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={6} align="start">
              {soldItems.map(order => (
                <Box key={order._id} p={4} borderWidth="1px" borderRadius="md" w="100%" bg={cardBgColor}>
                  <Text fontSize="xl" color={textColor}>Item: {order.itemId.name}</Text>
                  <Text color={textColor}>Price: ${order.itemId.price}</Text>
                  <Text color={textColor}>Buyer: {order.buyerId.firstName} {order.buyerId.lastName}</Text>
                </Box>
              ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default History;