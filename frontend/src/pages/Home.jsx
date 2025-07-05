import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { 
  AddIcon, 
  SearchIcon, 
  AtSignIcon, 
  LockIcon 
} from '@chakra-ui/icons';

const Home = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  const features = [
    {
      icon: AddIcon,
      title: 'Buy & Sell',
      description: 'Easily buy and sell items within the IIIT Hyderabad community',
    },
    {
      icon: SearchIcon,
      title: 'Search & Filter',
      description: 'Find exactly what you need with our advanced search and filtering options',
    },
    {
      icon: AtSignIcon,
      title: 'Secure Profiles',
      description: 'IIIT email verification ensures a trusted community marketplace',
    },
    {
      icon: LockIcon,
      title: 'OTP Verification',
      description: 'Secure transactions with OTP-based item handover system',
    },
  ];

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Hero Section */}
      <Container maxW="7xl" py={20}>
        <VStack spacing={8} textAlign="center">
          <Heading
            as="h1"
            size="3xl"
            color={headingColor}
            fontWeight="bold"
            lineHeight="shorter"
          >
            Buy & Sell @ IIITH
          </Heading>
          <Text
            fontSize="xl"
            color={textColor}
            maxW="2xl"
            lineHeight="tall"
          >
            The trusted marketplace for IIIT Hyderabad students. 
            Buy, sell, and trade items safely within our campus community.
          </Text>
          
          <HStack spacing={6} pt={6}>
            <Button
              as={Link}
              to="/login"
              size="lg"
              colorScheme="teal"
              px={8}
              py={6}
              fontSize="lg"
            >
              Login
            </Button>
            <Button
              as={Link}
              to="/create"
              size="lg"
              variant="outline"
              colorScheme="teal"
              px={8}
              py={6}
              fontSize="lg"
            >
              Register
            </Button>
          </HStack>
        </VStack>
      </Container>

      {/* Features Section */}
      <Container maxW="7xl" py={16}>
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" size="xl" color={headingColor}>
              Why Choose Our Platform?
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="2xl">
              Built specifically for the IIIT Hyderabad community with features 
              that ensure safe and convenient transactions.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
            {features.map((feature, index) => (
              <Card key={index} bg={cardBg} shadow="lg" borderRadius="lg">
                <CardBody>
                  <Stack spacing={4} align="center" textAlign="center">
                    <Icon
                      as={feature.icon}
                      w={12}
                      h={12}
                      color="teal.500"
                    />
                    <Heading as="h3" size="md" color={headingColor}>
                      {feature.title}
                    </Heading>
                    <Text color={textColor} fontSize="sm" lineHeight="tall">
                      {feature.description}
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Categories Preview */}
      <Container maxW="7xl" py={16}>
        <VStack spacing={8}>
          <Heading as="h2" size="xl" color={headingColor} textAlign="center">
            Popular Categories
          </Heading>
          
          <SimpleGrid columns={{ base: 2, md: 5 }} spacing={6} w="full">
            {['Clothing', 'Electronics', 'Furniture', 'Grocery', 'Other'].map((category) => (
              <Box
                key={category}
                bg={cardBg}
                p={6}
                borderRadius="lg"
                shadow="md"
                textAlign="center"
                cursor="pointer"
                transition="transform 0.2s"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              >
                <Text fontWeight="semibold" color={headingColor}>
                  {category}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Call to Action */}
      <Container maxW="4xl" py={16}>
        <Box
          bg="teal.500"
          borderRadius="xl"
          p={12}
          textAlign="center"
          color="white"
        >
          <VStack spacing={6}>
            <Heading as="h2" size="xl">
              Ready to Start Trading?
            </Heading>
            <Text fontSize="lg" maxW="md">
              Join the IIIT Hyderabad marketplace today and connect with your fellow students.
            </Text>
            <Button
              as={Link}
              to="/create"
              size="lg"
              bg="white"
              color="teal.500"
              px={8}
              py={6}
              fontSize="lg"
              _hover={{ bg: 'gray.100' }}
            >
              Get Started
            </Button>
          </VStack>
        </Box>
      </Container>

      {/* Footer */}
      <Box bg={useColorModeValue('gray.100', 'gray.800')} py={8}>
        <Container maxW="7xl">
          <Text textAlign="center" color={textColor}>
            © 2025 Buy & Sell @ IIITH. Made for the IIIT Hyderabad community.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;