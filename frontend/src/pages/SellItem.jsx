import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  Heading,
  useToast,
  Container,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const SellItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Theme colors
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  const categories = [
    { value: 'clothing', label: 'Clothing' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'other', label: 'Other' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (value) => {
    setFormData(prev => ({
      ...prev,
      price: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.price || !formData.description || !formData.category) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      toast({
        title: 'Error',
        description: 'Price must be greater than 0',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/items/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Item listed successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Reset form
        setFormData({
          name: '',
          price: '',
          description: '',
          category: '',
        });
        
        // Optionally navigate to search page or profile
        // navigate('/search');
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to list item',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="lg" centerContent>
        <Box
          bg={cardBg}
          color={textColor}
          p={8}
          borderRadius="lg"
          boxShadow="xl"
          w="100%"
        >
          <Heading size="lg" mb={6} textAlign="center" color="teal.500">
            Sell an Item
          </Heading>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <FormControl isRequired>
                <FormLabel fontWeight="bold">Item Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter item name"
                  focusBorderColor="teal.400"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="bold">Price ($)</FormLabel>
                <NumberInput
                  value={formData.price}
                  onChange={handlePriceChange}
                  min={0.01}
                  precision={2}
                  focusBorderColor="teal.400"
                >
                  <NumberInputField placeholder="Enter price" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="bold">Category</FormLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Select a category"
                  focusBorderColor="teal.400"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="bold">Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your item..."
                  rows={4}
                  focusBorderColor="teal.400"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                w="full"
                isLoading={isSubmitting}
                loadingText="Listing Item..."
              >
                List Item for Sale
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default SellItem;