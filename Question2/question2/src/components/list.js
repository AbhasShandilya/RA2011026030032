// components/TrainList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';

function TrainList() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await axios.get();
        setTrains(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trains:', error);
        setError('An error occurred while fetching train data.');
        setLoading(false);
      }
    };

    fetchTrains();
  }, []);

  const sortTrains = () => {
    return trains
      .filter(train => {
        const departureTime = new Date().getTime() + train.delayedBy * 60 * 1000;
        return departureTime > new Date().getTime() + 30 * 60 * 1000;
      })
      .sort((a, b) => {
        
        if (a.price.sleeper === b.price.sleeper) {
          
          if (a.seatsAvailable.sleeper === b.seatsAvailable.sleeper) {
            return new Date(b.departureTime.Hours, b.departureTime.Minutes) - new Date(a.departureTime.Hours, a.departureTime.Minutes);
          }
          return b.seatsAvailable.sleeper - a.seatsAvailable.sleeper;
        }
        return a.price.sleeper - b.price.sleeper;
      });
  };

  const sortedTrains = sortTrains();

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Train Schedules
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <div>
          {sortedTrains.map(train => (
            <Card key={train.trainNumber} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">{train.trainline}</Typography>
                <Typography variant="body1">Departure Time: {train.departureTime.Hours}:{train.departureTime.Minutes}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}

export default TrainList;
