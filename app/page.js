"use client";

import {Box, Stack, Typography, Button, Modal, TextField, InputAdornment, IconButton} from '@mui/material'
import { firestore } from './firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc} from "firebase/firestore"
import { useEffect, useState} from "react"
import Image from 'next/image';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [add, setAdd] = useState(false)
  const [pantry, setPantry] = useState({})
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [item, setItem] = useState("")
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedItemId, setSelectedItemId] = useState(null);

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  

  const style = {
    overflow: 'hidden',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    height: '30vh',
    bgcolor: '#ffeeec',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleSearch = async () => {
    try {
        const pantryList = []
        console.log('1');
        const querySnapshot = await getDocs(collection(firestore, 'pantry'));

        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          if (doc.data().item.includes(searchQuery.toLowerCase())) { // Added condition to check fieldName
          pantryList[doc.id] = doc.data().item;
        }
      });


      setPantry(pantryList);
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const fetchPantryItems = async () => {
    const pantryList = []
    try {
      const querySnapshot = await getDocs(collection(firestore, 'pantry'));

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data && data.item) {
          pantryList[doc.id] = data.item;  // Use the item field
        }
        console.log(data)
      });
      console.log(pantryList);
      setPantry(pantryList);
    } catch (error) {
      console.error("Error fetching pantry items: ", error);
    }
  };


  useEffect(() => {
    fetchPantryItems();
  }, []);

  const handleDelete = async () => {
    if(selectedItemId){
      console.log(selectedItemId)

      try{
          const docRef = doc(firestore, 'pantry', selectedItemId);
          await deleteDoc(docRef);
          console.log(`Deleted document with ID: ${selectedItemId}`);
          fetchPantryItems();

      } catch (error) {
        console.error("Error deleting item: ", error);
      }
    }
    handleEditClose();
  };

 const handleAddClick = async () => {
  setAdd(true);
  handleOpen();
 }

 const handleEditClick = async () => {
  setAdd(false);
  handleOpen();
 }

  const handleAddItem = async () => {
    if (item.trim() !== "") {
      try {
        const docRef = await addDoc(collection(firestore, "pantry"), {
          item: item.toLowerCase(),
        });

        const newItemId = docRef.id;

        setPantry(prevPantry => ({
          ...prevPantry,
          [newItemId]: item  
        }));
        setItem("");
        handleClose();
      } catch (error) {
        console.error("Error adding item: ", error);
      }
    }
  };

  const handleEditItem = async () => {
    if (item.trim() !== "") {
      try {
        const docRef = doc(firestore, 'pantry', selectedItemId);
        await updateDoc(docRef, {
          item: item
        });
        console.log(`Updated document with ID: ${selectedItemId}`);
        setItem(""); 
        handleClose(); 
        fetchPantryItems(); 
      } catch (error) {
        console.error("Error updating item: ", error);
      }}
    handleEditClose();
  };
  
  const currentHandler = add ? handleAddItem : handleEditItem;
  const placeHolder = add ? "Enter Item" : "Edit Item";

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = (id, item, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width});
    setEditOpen(true);
    setSelectedItemId(id);
    setItem(item)
    console.log(item)
  };
  const handleEditClose = () => {
    setItem("");
    setEditOpen(false)
  };

  return (
  <Box 
    width="100vw" 
    height="100vh"
    display="flex"
    justifyContent="center"
    alignItems="center"
    bgcolor="#DAD8C9"
    flexDirection={"column"}
  >
    <TextField
      label="Search Pantry Items"
      variant="outlined"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{ 
        width: '40vw',
        mb: '3vw',
        backgroundColor: 'white'
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" onClick={handleSearch}>
              <Image
                src="/search.webp" 
                alt="icon"
                width='15'
                height='15'
                style={{ width: '2vw', height: '2vw' }}
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
    <Box border = '8px solid gray' bgcolor="#fff">
      <Box 
        width="50vw"
        height="10vh"
        minHeight="150px"
        bgcolor="#a9c191"
        display="flex"
        alignItems="center"  // Centers items vertically
        justifyContent="center"  // Distributes space between item
        padding="0 1rem"
      >
        <Typography 
          variant="h2" 
          color="#FFF"
          fontWeight="500"
          sx={{ 
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
             maxWidth: "45vw",
             padding: ".5vw",
             textAlign: "center"
          }}
        >
          Skyler&#39;s Pantry
        </Typography>
        <Button 
        onClick={handleAddClick}
        sx={{ 
          borderRadius: '50px',
          width: '3vh', 
          height: '3vw', 
          backgroundImage: 'url(/plus.png)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 'none',
          ml: 8,
          backgroundColor: 'transparent', 
          '&:hover': {
            backgroundColor: '#dbead2', 
            boxShadow: 'none',
          }}}>
        </Button>
      </Box>
      <Stack 
        width="50vw"
        height="40vh"
        spacing={2}
        overflow={"auto"}
      >
        {Object.entries(pantry).map(([id, item]) => (
          <Box 
            key={id}
            display={"flex"}
            width="100%"
            minHeight="15vh" 
            justifyContent="center"
            alignItems="center"
            bgcolor= "#ffeeec"
            border = '5px solid #FFC0CB'
            sx={{
              position: 'relative',
            }}
          >
            <Typography 
            variant="h4" 
            color ='#FFF' 
            sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}
            textAlign={"center"}
            >
              {capitalizeWords(item)}
            </Typography>
            <Button
            onClick={(event) => handleEditOpen(id, item, event)}
            sx={{ 
              borderRadius: '50px',
              width: '3vh', 
              height: '3vw', 
              backgroundImage: 'url(/gear.png)', 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: 'none',
              position: 'absolute',
              right: '15px',
              backgroundColor: 'transparent', 
              '&:hover': {
                backgroundColor: '#dbead2', 
                boxShadow: 'none',
              }}}>
            </Button>
            <Modal 
              open={editOpen}
              onClose={handleEditClose}
              slotProps={{
                backdrop: {
                  style: { 
                    backgroundColor: 'rgba(0, 0, 0, 0)'  // Completely transparent
                  },
                },
              }}
            >
              <Box sx={{position: 'relative'}}>
                <Box 
                  sx={{
                    position: 'absolute',
                    top: modalPosition.top,
                    left: modalPosition.left,
                    backgroundColor: "#FFF",
                    width: '8vw',
                    textAlign: "center",
                    height:'10vh'
                    }}>
                <Button 
                  onClick={(event) => handleEditClick()}
                  sx={{
                    padding: '0px',
                    width: '100%',
                    height: "50%",
                    borderRadius: "0",
                    border: "2px solid #FFC0CB",
                    '&:hover': {
                    backgroundColor: '#FFC0CB', 
                    color: "#FFF",
                    boxShadow: 'none',
                  }}}
                  >
                  Edit
                </Button>
                <Button 
                  onClick={() => handleDelete()}
                  sx={{
                   padding: '0px',
                   width: '100%',
                   height: "50%",
                   borderRadius: "0",
                   border: "2px solid #FFC0CB",
                   '&:hover': {
                   backgroundColor: '#FFC0CB', 
                   color: "#FFF",
                   boxShadow: 'none',
                 }}}
                    >
                      Delete
                </Button>
                </Box>
              </Box>

            </Modal>
          </Box>
        ))}
      </Stack>
      <Modal
        open={open}
        onClose={null}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
        <Box
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
            }}
          >
          <Button onClick={handleClose} sx={{ minWidth: 'auto', padding: 0, color: '#696969'}}>
                <Typography variant="h6" component="span">X</Typography>
          </Button>
        </Box>
          <Typography id="modal-title" variant="h6" component="h2" color="#696969" 
          style={{ 
            textAlign: 'center',
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            {add ? 'Add a Item to the Pantry' : 'Edit Pantry Item'} 
          </Typography>
          <TextField
            id="outlined-basic"
            label={placeHolder}
            variant="outlined"
            bgcolor="#FFF"
            value={item}
            fullWidth
            onChange={(e) => setItem(e.target.value)}
            sx={{mt: 2, backgroundColor: 'white'}}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2 
            }}
          >
            <Button
            onClick={currentHandler}
              sx={{
                borderRadius: '25px',
                width: '8vw', // Adjust the width as needed
                height: '4.5vh', // Adjust the height as needed
                color: "#FFF",
                boxShadow: 'none',
                mt: 2,
                backgroundColor: '#696969',
                '&:hover': {
                  backgroundColor: '#FFF', 
                  color: '#696969',
                }
              }}
              >
              {add ? 'Add' : 'Edit'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  </Box>
  )
}
