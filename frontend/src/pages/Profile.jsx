import { useState, useEffect } from "react";
import { 
  Box, Text, Button, Input, VStack, FormControl, FormLabel, useToast, Spinner, Heading, Container, useColorModeValue, HStack 
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatedData, setUpdatedData] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  // Background and card colors
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/get", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setUser(data);
        setUpdatedData(data);
      } catch (error) {
        toast({ title: "Error fetching user details", status: "error", duration: 3000 });
      }
      setLoading(false);
    };

    fetchUser();
  }, [toast]);

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      if (response.ok) {
        setUser(updatedData);
        setIsEditing(false);
        toast({ title: "Profile updated successfully!", status: "success", duration: 3000 });
      } else {
        toast({ title: result.message || "Update failed", status: "error", duration: 3000 });
      }
    } catch (error) {
      toast({ title: "Error updating profile", status: "error", duration: 3000 });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    toast({ title: "Logged out successfully", status: "info", duration: 2000 });
    navigate("/login"); // Redirect to Login page
  };

  if (loading) return <Spinner size="xl" mt={10} />;

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
          <Heading size="lg" mb={6} textAlign="center">Profile</Heading>
          <VStack spacing={4} align="stretch">
            
            {/* Reusable Row Component for Label + Value */}
            {[
              { label: "First Name", key: "firstName" },
              { label: "Last Name", key: "lastName" },
              { label: "Email", key: "email", readOnly: true },
              { label: "Age", key: "age" },
              { label: "Contact Number", key: "contactNumber" },
            ].map(({ label, key, readOnly }) => (
              <HStack key={key} justify="space-between">
                <FormLabel m={0} w="40%" fontWeight="bold">
                  {label}
                </FormLabel>
                {isEditing && !readOnly ? (
                  <Input name={key} value={updatedData[key] || ""} onChange={handleChange} w="60%" />
                ) : (
                  <Text w="60%" fontWeight="medium">{user[key]}</Text>
                )}
              </HStack>
            ))}

            {/* Buttons */}
            {isEditing ? (
              <Button colorScheme="green" onClick={handleSave} size="lg" w="full">
                Save
              </Button>
            ) : (
              <Button colorScheme="blue" onClick={handleEdit} size="lg" w="full">
                Edit
              </Button>
            )}

            {/* Logout Button */}
            <Button colorScheme="red" onClick={handleLogout} size="lg" w="full" mt={4}>
              Logout
            </Button>

          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
