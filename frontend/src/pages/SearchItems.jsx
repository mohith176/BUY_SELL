import React, { useState, useEffect } from 'react';
import { Box, Input, Checkbox, CheckboxGroup, VStack, HStack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const SearchItems = () => {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const categories = ['clothing', 'grocery', 'electronics', 'furniture', 'other'];
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [query, selectedCategories]);

  const fetchItems = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const categoryQuery = selectedCategories.join(',');
    const response = await fetch(`http://localhost:5000/api/items/search?query=${query}&categories=${categoryQuery}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in Authorization header
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setItems(data);
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

  return (
    <Box p={4}>
      <Input
        placeholder="Search for items..."
        value={query}
        onChange={handleSearchChange}
        mb={4}
      />
      <CheckboxGroup
        value={selectedCategories}
        onChange={handleCategoryChange}
      >
        <HStack spacing={4} mb={4}>
          {categories.map((category) => (
            <Checkbox key={category} value={category}>
              {category}
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
      <VStack spacing={4}>
        {items.map((item) => (
          <Box
            key={item._id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            w="100%"
            onClick={() => handleItemClick(item._id)}
            cursor="pointer"
          >
            <Text fontSize="xl">{item.name}</Text>
            <Text>Price: ${item.price}</Text>
            <Text>Category: {item.category}</Text>
            <Text>Seller: {item.sellerId.firstName} {item.sellerId.lastName}</Text>
            <Text>Description: {item.description}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default SearchItems;