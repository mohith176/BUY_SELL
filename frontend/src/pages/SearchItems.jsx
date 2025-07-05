import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Checkbox,
  CheckboxGroup,
  VStack,
  HStack,
  Text,
  Container,
  Heading,
  Card,
  CardBody,
  Badge,
  Button,
  useColorModeValue,
  Icon,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  useToast,
  Stack,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { SearchIcon, ViewIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const SearchItems = () => {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const categories = ['clothing', 'grocery', 'electronics', 'furniture', 'other'];
  const navigate = useNavigate();
  const toast = useToast();

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchItems();
  }, [query, selectedCategories]);

  const fetchItems = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const categoryQuery = selectedCategories.join(',');
      const response = await fetch(`http://localhost:5000/api/items/search?query=${query}&categories=${categoryQuery}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        toast({
          title: 'Error fetching items',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error fetching items',
        description: 'Network error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    
    setLoading(false);
    setInitialLoad(false);
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
  };

  const handleItemClick = (id) => {
    navigate(`/items/${id}`);
  };

  const handleAddToCart = async (e, itemId) => {
    e.stopPropagation(); // Prevent item click when clicking add to cart
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/users/cart/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId })
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Item added to cart! 🛒',
          status: 'success',
          duration: 2000,
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
    } catch (error) {
      toast({
        title: 'Error adding item to cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      clothing: 'purple',
      grocery: 'green', 
      electronics: 'blue',
      furniture: 'orange',
      other: 'gray'
    };
    return colors[category] || 'gray';
  };

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <HStack justify="center" mb={2}>
              <Icon as={SearchIcon} w={8} h={8} color="teal.500" />
              <Heading as="h1" size="2xl" color="teal.500">
                Browse Items
              </Heading>
            </HStack>
            <Text color={mutedTextColor} fontSize="lg">
              Discover amazing items from the IIIT Hyderabad community
            </Text>
          </Box>

          {/* Search and Filters */}
          <Card bg={cardBg} shadow="md" borderRadius="xl">
            <CardBody>
              <VStack spacing={6} align="stretch">
                {/* Search Input */}
                <InputGroup size="lg">
                  <InputLeftElement>
                    <Icon as={SearchIcon} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search for items..."
                    value={query}
                    onChange={handleSearchChange}
                    focusBorderColor="teal.400"
                    bg={useColorModeValue('white', 'gray.700')}
                  />
                </InputGroup>

                {/* Category Filters */}
                <Box>
                  <Text fontWeight="bold" color={textColor} mb={3}>
                    Filter by Category:
                  </Text>
                  <CheckboxGroup
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                  >
                    <Wrap spacing={4}>
                      {categories.map((category) => (
                        <WrapItem key={category}>
                          <Checkbox 
                            value={category}
                            colorScheme="teal"
                            size="lg"
                          >
                            <Text textTransform="capitalize" fontWeight="medium">
                              {category}
                            </Text>
                          </Checkbox>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </CheckboxGroup>
                </Box>

                {/* Results Count */}
                {!initialLoad && (
                  <Text color={mutedTextColor} fontSize="sm">
                    {loading ? 'Searching...' : `Found ${items.length} item${items.length !== 1 ? 's' : ''}`}
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Loading State */}
          {loading && (
            <Flex justify="center" align="center" py={10}>
              <VStack spacing={4}>
                <Spinner size="xl" color="teal.500" thickness="4px" />
                <Text color={textColor}>Searching for items...</Text>
              </VStack>
            </Flex>
          )}

          {/* No Results */}
          {!loading && !initialLoad && items.length === 0 && (
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody py={16}>
                <VStack spacing={6}>
                  <Icon as={SearchIcon} w={16} h={16} color="gray.400" />
                  <VStack spacing={2}>
                    <Heading size="lg" color={textColor}>No items found</Heading>
                    <Text color={mutedTextColor} textAlign="center">
                      {query || selectedCategories.length > 0 
                        ? "Try adjusting your search terms or filters"
                        : "No items are currently available"
                      }
                    </Text>
                  </VStack>
                  {(query || selectedCategories.length > 0) && (
                    <Button
                      colorScheme="teal"
                      onClick={() => {
                        setQuery('');
                        setSelectedCategories([]);
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Items Grid */}
          {!loading && items.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {items.map((item) => (
                <Card
                  key={item._id}
                  bg={cardBg}
                  shadow="md"
                  borderRadius="lg"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'xl',
                    borderColor: 'teal.400'
                  }}
                  onClick={() => handleItemClick(item._id)}
                  position="relative"
                  overflow="hidden"
                >
                  <CardBody>
                    <VStack align="start" spacing={4} h="full">
                      {/* Item Header */}
                      <VStack align="start" spacing={2} w="full">
                        <HStack justify="space-between" w="full">
                          <Badge
                            colorScheme={getCategoryColor(item.category)}
                            variant="subtle"
                            borderRadius="full"
                            px={2}
                            fontSize="xs"
                          >
                            {item.category.toUpperCase()}
                          </Badge>
                          <Icon as={ViewIcon} color="gray.400" />
                        </HStack>
                        
                        <Heading size="md" color={textColor} noOfLines={2} lineHeight="shorter">
                          {item.name}
                        </Heading>
                      </VStack>

                      {/* Item Details */}
                      <VStack align="start" spacing={2} w="full" flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="teal.500">
                          ${item.price}
                        </Text>
                        
                        <Text color={mutedTextColor} fontSize="sm" noOfLines={3}>
                          {item.description}
                        </Text>
                        
                        <Text color={mutedTextColor} fontSize="sm">
                          Seller: <Text as="span" fontWeight="medium" color={textColor}>
                            {item.sellerId.firstName} {item.sellerId.lastName}
                          </Text>
                        </Text>
                      </VStack>

                      {/* Add to Cart Button */}
                      <Button
                        colorScheme="teal"
                        size="sm"
                        w="full"
                        onClick={(e) => handleAddToCart(e, item._id)}
                        leftIcon={<Text>🛒</Text>}
                      >
                        Add to Cart
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default SearchItems;