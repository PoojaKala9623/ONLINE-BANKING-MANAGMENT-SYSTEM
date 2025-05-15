import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, CircularProgress, Button } from '@mui/material';
import html2pdf from 'html2pdf.js';


const MyCards = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = '2525500301'; // Make dynamic if needed
    const API_URL = `http://localhost:5000/api/card/user/${userId}`;
  const info = useSelector((state) => state.userData.info);
    useEffect(() => {
        axios.get(API_URL)
            .then(response => {
                if (response.data && response.data.length > 0) {
                    setCards(response.data); // Fetch all cards, not just the first
                }
            })
            .catch(err => console.error('Error fetching card details:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleDownloadPDF = (cardId) => {
        const element = document.getElementById(`card-${cardId}`);
        const options = {
            filename: `card-${cardId}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        html2pdf().from(element).set(options).save();
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (cards.length === 0) {
        return <Typography color="error">No card details found.</Typography>;
    }

    return (
        <>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {cards.map((card, index) => {
                    const formattedCardNumber = card.card_number.replace(/(\d{4})/g, '$1 ').trim();
                    const formattedExpiry = new Date(card.expiry_date).toLocaleDateString('en-GB', {
                        month: '2-digit',
                        year: '2-digit',
                    });

                    return (
                        <Box key={card._id || index} sx={{ mb: 4, padding: 20 }} id={`card-${card._id || index}`} >

                            {card.status === "active" ? <>

                                <Card

                                    sx={{
                                        width: 400,
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        background: card.card_type === "debit" ? 'linear-gradient(135deg, #9c27b0, #e91e63)' : "linear-gradient(135deg,rgb(53, 53, 7),rgb(153, 19, 214))",
                                        color: '#fff',
                                        boxShadow: 6,
                                        fontFamily: 'monospace',
                                        position: 'relative',
                                        p: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>{card.card_type} Card</Typography>

                                        <Box
                                            sx={{
                                                width: 50,
                                                height: 35,
                                                backgroundColor: '#ffcc00',
                                                borderRadius: 1,
                                                my: 1,
                                            }}
                                        />

                                        <Typography variant="h6" sx={{ letterSpacing: 2 }}>
                                            {formattedCardNumber}
                                        </Typography>

                                        <Box display="flex" justifyContent="space-between" mt={2}>
                                            <Box>
                                                <Typography variant="caption" color="white">VALID THRU</Typography>
                                                <Typography>{formattedExpiry}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="white">TYPE</Typography>
                                                <Typography textTransform="uppercase">{card.card_type}</Typography>
                                            </Box>
                                        </Box>

                                        <Typography variant="body2" mt={4}>
                                            NAME  {info.name}
                                        </Typography>
                                    </CardContent>

                                    <Typography
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 16,
                                            fontWeight: 'bold',
                                            letterSpacing: 1,
                                        }}
                                    >
                                        BANK
                                    </Typography>
                                </Card>

                                <Button
                                    onClick={() => handleDownloadPDF(card._id || index)}
                                    variant="contained"
                                    sx={{
                                        mt: 2,
                                        backgroundColor: '#e91e63',
                                        '&:hover': {
                                            backgroundColor: '#9c27b0',
                                        }
                                    }}
                                >
                                    Download Card as PDF
                                </Button>



                            </> : <>

                            <h1>you card status is {card.status} </h1>
                            
                            </>}




                        </Box>
                    );
                })}
            </div>

        </>
    );
};

export default MyCards;
