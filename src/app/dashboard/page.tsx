"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

export default function Dashboard() {
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const headingColor = useColorModeValue("blue.600", "blue.300");
  const inputBgColor = useColorModeValue("gray.100", "gray.700");
  const inputColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            setShoppingList(doc.data().shoppingList || []);
          } else {
            setShoppingList([]);
          }
        });
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const addItem = () => {
    setError(false);
    if (!inputValue) {
      setError(true);
      return;
    }
    setShoppingList([...shoppingList, inputValue]);
    setInputValue("");
  };

  const deleteItem = (index: number) => {
    const newShoppingList = shoppingList.filter((_, i) => i !== index);
    setShoppingList(newShoppingList);
  };

  const saveShoppingList = async () => {
    if (auth.currentUser) {
      await setDoc(doc(db, "users", auth.currentUser.uid), { shoppingList });
      console.log("Liste gespeichert:", shoppingList);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
    }
  };

  return (
    <Box
      bg={bgColor}
      minHeight="100vh"
      backgroundImage="url('/undulate.svg')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Container maxW="container.sm" centerContent>
        <VStack spacing={6} width="100%" py={8}>
          <Flex justifyContent="space-between" width="100%">
            <Button colorScheme="blue" variant="outline" onClick={logout}>
              Abmelden
            </Button>
            <Button colorScheme="blue" onClick={saveShoppingList}>
              Speichern
            </Button>
          </Flex>
          <Image
            src="/doggo.png"
            alt="Shopping Cart Logo"
            width={192}
            height={192}
          />
          <Heading as="h1" size="xl" color={headingColor}>
            Einkaufsliste
          </Heading>
          <Flex width="100%">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              placeholder="Artikel hinzufügen"
              bg={inputBgColor}
              color={inputColor}
              isInvalid={error}
              mr={2}
            />
            <Button colorScheme="blue" onClick={addItem}>
              Hinzufügen
            </Button>
          </Flex>
          <Wrap spacing={3} justify="center" width="100%">
            {shoppingList.map((item, index) => (
              <WrapItem key={index}>
                <Button
                  p={3}
                  bg="blue.50"
                  color="blue.800"
                  borderRadius="md"
                  onClick={() => deleteItem(index)}
                  _hover={{ bg: "blue.100" }}
                  minWidth="120px"
                  height="48px"
                  whiteSpace="normal"
                  textAlign="center"
                >
                  {item}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </VStack>
      </Container>
    </Box>
  );
}
