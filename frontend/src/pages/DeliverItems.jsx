// import React, { useState, useEffect } from 'react';
// import { Box, Text, VStack, Spinner, Heading, Flex, Button, Input, useToast, useColorModeValue } from '@chakra-ui/react';

// const DeliverItems = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [otps, setOtps] = useState({});
//   const toast = useToast();
//   const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
//   const cardBgColor = useColorModeValue('gray.100', 'gray.700');
//   const boxBgColor = useColorModeValue('white', 'gray.800');

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:5000/api/users/orders/seller', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setOrders(data);
//       } else {
//         const errorData = await response.json();
//         toast({
//           title: 'Error fetching orders',
//           description: errorData.message,
//           status: 'error',
//           duration: 3000,
//           isClosable: true,
//         });
//       }
//       setLoading(false);
//     };

//     fetchOrders();
//   }, [toast]);

//   const handleOtpChange = (orderId, value) => {
//     setOtps(prevOtps => ({ ...prevOtps, [orderId]: value }));
//   };

//   const handleCloseTransaction = async (orderId) => {
//     const token = localStorage.getItem('token');
//     const otp = otps[orderId];
//     const response = await fetch('http://localhost:5000/api/users/orders/close', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ orderId, otp })
//     });

//     const data = await response.json();
//     if (response.ok) {
//       setOrders(orders.filter(order => order._id !== orderId));
//       toast({
//         title: 'Transaction closed successfully',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });
//     } else {
//       toast({
//         title: 'Error closing transaction',
//         description: data.message,
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <Flex justify="center" align="center" height="100vh">
//         <Spinner size="xl" />
//       </Flex>
//     );
//   }

//   return (
//     <Box p={6} mt={10} maxW="800px" mx="auto" bg={boxBgColor} borderRadius="md" boxShadow="lg">
//       <Heading as="h1" size="2xl" color="teal.500">Deliver Items</Heading>
//       <VStack spacing={6} align="start" mt={6}>
//         {Array.isArray(orders) && orders.map(order => (
//           <Box key={order._id} p={4} borderWidth="1px" borderRadius="md" w="100%" bg={cardBgColor}>
//             <Text fontSize="xl" color={textColor}>Item: {order.itemId.name}</Text>
//             <Text color={textColor}>Price: ${order.itemId.price}</Text>
//             <Text color={textColor}>Buyer: {order.buyerId.firstName} {order.buyerId.lastName}</Text>
//             <Input
//               placeholder="Enter OTP"
//               value={otps[order._id] || ''}
//               onChange={(e) => handleOtpChange(order._id, e.target.value)}
//               mt={2}
//             />
//             <Button colorScheme="teal" mt={2} onClick={() => handleCloseTransaction(order._id)}>Close Transaction</Button>
//           </Box>
//         ))}
//       </VStack>
//     </Box>
//   );
// };

// export default DeliverItems;
import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Spinner, Heading, Flex, Button, Input, useToast, useColorModeValue } from '@chakra-ui/react';

const DeliverItems = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otps, setOtps] = useState({});
  const toast = useToast();
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const cardBgColor = useColorModeValue('gray.100', 'gray.700');
  const boxBgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
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
      setLoading(false);
    };

    fetchOrders();
  }, [toast]);

  const handleOtpChange = (orderId, value) => {
    setOtps(prevOtps => ({ ...prevOtps, [orderId]: value }));
  };

  const handleCloseTransaction = async (orderId) => {
    const token = localStorage.getItem('token');
    const otp = otps[orderId];
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
      toast({
        title: 'Transaction closed successfully',
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
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6} mt={10} maxW="800px" mx="auto" bg={boxBgColor} borderRadius="md" boxShadow="lg">
      <Heading as="h1" size="2xl" color="teal.500">Deliver Items</Heading>
      <VStack spacing={6} align="start" mt={6}>
        {Array.isArray(orders) && orders.map(order => (
          <Box key={order._id} p={4} borderWidth="1px" borderRadius="md" w="100%" bg={cardBgColor}>
            <Text fontSize="xl" color={textColor}>Item: {order.itemId.name}</Text>
            <Text color={textColor}>Price: ${order.itemId.price}</Text>
            <Text color={textColor}>Buyer: {order.buyerId.firstName} {order.buyerId.lastName}</Text>
            <Input
              placeholder="Enter OTP"
              value={otps[order._id] || ''}
              onChange={(e) => handleOtpChange(order._id, e.target.value)}
              mt={2}
            />
            <Button colorScheme="teal" mt={2} onClick={() => handleCloseTransaction(order._id)}>Close Transaction</Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default DeliverItems;