import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [ isModalOpen, setIsModalOpen ] = useState(true)

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }

    const handleCloseModal = (event) => {
        event.stopPropagation();
        setIsModalOpen(false);
        store.unmarkListForDeletion();
    }

    const confirmedDeleteList = (event) => {
        store.deleteMarkedList();
        setIsModalOpen(false);
        store.unmarkListForDeletion();
    }

    let listCard = "";
    let modal = "";

    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;

        if(store.listMarkedForDeletion){
            let listTitle = store.listMarkedForDeletion[1]
            modal = 
            <Modal
                open = {true}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >   
                <Box sx = 
                    {{position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,}}
                    >
                    <Alert severity="warning">Delete Top 5 {listTitle}?</Alert>
                    <Button variant="outlined" onClick = {handleCloseModal}>Cancel</Button>
                    <Button variant="outlined" onClick = {confirmedDeleteList}>Confirm</Button>
                </Box>
            </Modal>;

        }    
    }
    return (
        <div id="top5-list-selector">
            <div id="list-selector-heading">
                {modal}
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2">Your Lists</Typography>
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
            </div>
        </div>)
}

export default HomeScreen;