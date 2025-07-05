import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Text, 
  VStack, 
  HStack,
  Spinner, 
  Heading, 
  Flex, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
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
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { TimeIcon, CheckIcon, CalendarIcon } from '@chakra-ui/icons';

const History = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

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

  // Calculate total values
  const totalPendingValue = pendingOrders.reduce((sum, order) => sum + order.itemId.price, 0);
  const totalBoughtValue = boughtItems.reduce((sum, order) => sum + order.itemId.price, 0);
  const totalSoldValue = soldItems.reduce((sum, order) => sum + order.itemId.price, 0);

  const renderOrderCard = (order, type) => (
    <Card key={order._id} bg={cardBg} shadow="md" borderRadius="lg" w="full">
      <CardBody>
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="full">
            <Heading size="md" color={textColor} noOfLines={1}>
              {order.itemId.name}
            </Heading>
            <Badge 
              colorScheme={type === 'pending' ? 'orange' : 'green'} 
              variant="subtle" 
              borderRadius="full" 
              px={2}
            >
              {type === 'pending' ? 'Pending' : 'Completed'}
            </Badge>
          </HStack>
          
          <Divider borderColor={borderColor} />
          
          <VStack align="start" spacing={2} w="full">
            <HStack justify="space-between" w="full">
              <Text color={mutedTextColor} fontSize="sm">Price:</Text>
              <Text fontWeight="bold" color="teal.500" fontSize="lg">
                ${order.itemId.price}
              </Text>
            </HStack>
            
            <HStack justify="space-between" w="full">
              <Text color={mutedTextColor} fontSize="sm">
                {type === 'sold' ? 'Buyer:' : 'Seller:'}
              </Text>
              <Text color={textColor} fontWeight="medium">
                {type === 'sold' 
                  ? `${order.buyerId.firstName} ${order.buyerId.lastName}`
                  : `${order.sellerId.firstName} ${order.sellerId.lastName}`
                }
              </Text>
            </HStack>
            
            <HStack justify="space-between" w="full">
              <Text color={mutedTextColor} fontSize="sm">Order Date:</Text>
              <Text color={textColor} fontSize="sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </HStack>
            
            {type === 'pending' && (
              <>
                <Divider borderColor={borderColor} />
                <Alert status="warning" borderRadius="md" variant="subtle" size="sm">
                  <AlertIcon />
                  <Box>
                    <AlertTitle fontSize="xs">OTP Required</AlertTitle>
                    <AlertDescription fontSize="xs">
                      Your OTP: <Text as="span" fontWeight="bold">{order.otp}</Text>
                    </AlertDescription>
                  </Box>
                </Alert>
              </>
            )}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );

  const renderEmptyState = (type, icon, title, description) => (
    <Card bg={cardBg} shadow="lg" borderRadius="xl">
      <CardBody py={16}>
        <VStack spacing={6}>
          <Icon as={icon} w={16} h={16} color="gray.400" />
          <VStack spacing={2}>
            <Heading size="lg" color={textColor}>{title}</Heading>
            <Text color={mutedTextColor} textAlign="center">
              {description}
            </Text>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" py={10}>
        <Flex justify="center" align="center" height="60vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="teal.500" thickness="4px" />
            <Text color={textColor}>Loading your history...</Text>
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
              <Icon as={CalendarIcon} w={8} h={8} color="teal.500" />
              <Heading as="h1" size="2xl" color="teal.500">
                Order History
              </Heading>
            </HStack>
            <Text color={mutedTextColor} fontSize="lg">
              Track your buying and selling activity
            </Text>
          </Box>

          {/* Statistics Cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg={cardBg} shadow="md" borderRadius="lg">
              <CardBody>
                <Stat>
                  <StatLabel color={mutedTextColor}>Pending Orders</StatLabel>
                  <StatNumber color="orange.500">{pendingOrders.length}</StatNumber>
                  <StatHelpText color={mutedTextColor}>
                    ${totalPendingValue.toFixed(2)} total value
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card bg={cardBg} shadow="md" borderRadius="lg">
              <CardBody>
                <Stat>
                  <StatLabel color={mutedTextColor}>Items Bought</StatLabel>
                  <StatNumber color="green.500">{boughtItems.length}</StatNumber>
                  <StatHelpText color={mutedTextColor}>
                    ${totalBoughtValue.toFixed(2)} total spent
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card bg={cardBg} shadow="md" borderRadius="lg">
              <CardBody>
                <Stat>
                  <StatLabel color={mutedTextColor}>Items Sold</StatLabel>
                  <StatNumber color="teal.500">{soldItems.length}</StatNumber>
                  <StatHelpText color={mutedTextColor}>
                    ${totalSoldValue.toFixed(2)} total earned
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Tabs */}
          <Card bg={cardBg} shadow="lg" borderRadius="xl">
            <CardBody>
              <Tabs variant="enclosed" colorScheme="teal">
                <TabList>
                  <Tab>
                    <HStack spacing={2}>
                      <Icon as={TimeIcon} />
                      <Text>Pending Orders ({pendingOrders.length})</Text>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack spacing={2}>
                      <Icon as={CheckIcon} />
                      <Text>Bought Items ({boughtItems.length})</Text>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack spacing={2}>
                      <Icon as={CheckIcon} />
                      <Text>Sold Items ({soldItems.length})</Text>
                    </HStack>
                  </Tab>
                </TabList>
                
                <TabPanels>
                  <TabPanel px={0}>
                    {pendingOrders.length === 0 ? (
                      renderEmptyState(
                        'pending',
                        TimeIcon,
                        'No pending orders',
                        'You don\'t have any pending orders at the moment. Items you purchase will appear here until they\'re delivered.'
                      )
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {pendingOrders.map(order => renderOrderCard(order, 'pending'))}
                      </VStack>
                    )}
                  </TabPanel>
                  
                  <TabPanel px={0}>
                    {boughtItems.length === 0 ? (
                      renderEmptyState(
                        'bought',
                        CheckIcon,
                        'No purchased items',
                        'You haven\'t bought any items yet. Start browsing to find something you like!'
                      )
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {boughtItems.map(order => renderOrderCard(order, 'bought'))}
                      </VStack>
                    )}
                  </TabPanel>
                  
                  <TabPanel px={0}>
                    {soldItems.length === 0 ? (
                      renderEmptyState(
                        'sold',
                        CheckIcon,
                        'No sold items',
                        'You haven\'t sold any items yet. List some items to start selling!'
                      )
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {soldItems.map(order => renderOrderCard(order, 'sold'))}
                      </VStack>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default History;